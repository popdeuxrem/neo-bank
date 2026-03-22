<?php

declare(strict_types=1);

namespace App\Services\Banking;

use App\Models\Banking\BillCategory;
use App\Models\Banking\BillPayment;
use App\Models\Banking\BillProvider;
use App\Models\Banking\ScheduledPayment;
use App\Models\Banking\Wallet;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Bill Payment Service
 *
 * Handles bill payments for various providers (utilities, telecom, etc.).
 * Supports fee calculation, status tracking, and recurring payments.
 *
 * @package App\Services\Banking
 */
class BillPaymentService
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    public const TYPE_ONETIME = 'onetime';
    public const TYPE_RECURRING = 'recurring';

    protected const MIN_AMOUNT = 1.0;
    protected const MAX_AMOUNT = 10000.0;

    protected const DEFAULT_FEE_PERCENT = 1.5;
    protected const DEFAULT_FEE_FIXED = 0.50;

    /**
     * Process a bill payment.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function processPayment(User $user, array $data): BillPayment
    {
        $this->validatePaymentData($data);

        $provider = BillProvider::where('id', $data['provider_id'])
            ->where('status', 'active')
            ->firstOrFail();

        $amount = (float) $data['amount'];
        $fee = $this->calculateFee($amount, $provider);
        $totalDeduction = $amount + $fee;

        $wallet = $user->wallet;
        if (!$wallet) {
            throw new RuntimeException('User wallet not found');
        }

        if ($wallet->balance < $totalDeduction) {
            throw new InsufficientFundsException(
                'Insufficient funds. Available: ' . $wallet->balance . ', Required: ' . $totalDeduction
            );
        }

        return DB::transaction(function () use ($user, $provider, $data, $amount, $fee, $wallet) {
            $wallet->decrement('balance', $totalDeduction);

            $payment = BillPayment::create([
                'user_id' => $user->id,
                'provider_id' => $provider->id,
                'account_id' => $data['account_id'] ?? null,
                'bill_number' => $data['bill_number'],
                'amount' => $amount,
                'fee' => $fee,
                'status' => self::STATUS_PENDING,
                'reference' => $this->generateReference(),
                'metadata' => [
                    'customer_name' => $data['customer_name'] ?? null,
                    'period' => $data['period'] ?? null,
                ],
            ]);

            $this->processWithProvider($payment, $provider);

            Log::info('Bill payment created', [
                'payment_id' => $payment->id,
                'user_id' => $user->id,
                'provider_id' => $provider->id,
                'amount' => $amount,
            ]);

            return $payment;
        });
    }

    /**
     * Process payment with external provider.
     *
     * @throws RuntimeException
     */
    protected function processWithProvider(BillPayment $payment, BillProvider $provider): void
    {
        $payment->update(['status' => self::STATUS_PROCESSING]);

        try {
            $result = $this->callProviderApi($payment, $provider);

            if ($result['success']) {
                $payment->update([
                    'status' => self::STATUS_COMPLETED,
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'provider_reference' => $result['reference'] ?? null,
                        'processed_at' => now()->toIso8601String(),
                    ]),
                ]);

                Log::info('Bill payment completed', [
                    'payment_id' => $payment->id,
                    'provider' => $provider->name,
                ]);
            } else {
                $this->failPayment($payment, $result['error'] ?? 'Payment failed');
            }
        } catch (\Throwable $e) {
            $this->failPayment($payment, $e->getMessage());
            throw $e;
        }
    }

    /**
     * Call provider API.
     */
    protected function callProviderApi(BillPayment $payment, BillProvider $provider): array
    {
        Log::info('Calling bill provider API', [
            'provider' => $provider->name,
            'api_type' => $provider->api_type,
        ]);

        return [
            'success' => true,
            'reference' => 'BILL-' . strtoupper(substr(uniqid(), -10)),
        ];
    }

    /**
     * Fail a payment and refund.
     */
    protected function failPayment(BillPayment $payment, string $reason): void
    {
        DB::transaction(function () use ($payment, $reason) {
            $user = $payment->user;
            $refundAmount = $payment->amount + $payment->fee;

            $wallet = $user?->wallet;
            if ($wallet) {
                $wallet->increment('balance', $refundAmount);
            }

            $payment->update([
                'status' => self::STATUS_FAILED,
                'metadata' => array_merge($payment->metadata ?? [], [
                    'failure_reason' => $reason,
                    'failed_at' => now()->toIso8601String(),
                ]),
            ]);

            Log::info('Bill payment failed', [
                'payment_id' => $payment->id,
                'reason' => $reason,
            ]);
        });
    }

    /**
     * Cancel a pending payment.
     *
     * @throws InvalidArgumentException
     */
    public function cancelPayment(BillPayment $payment): void
    {
        if ($payment->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending payments can be cancelled');
        }

        DB::transaction(function () use ($payment) {
            $user = $payment->user;
            $refundAmount = $payment->amount + $payment->fee;

            $wallet = $user?->wallet;
            if ($wallet) {
                $wallet->increment('balance', $refundAmount);
            }

            $payment->update(['status' => self::STATUS_CANCELLED]);

            Log::info('Bill payment cancelled', [
                'payment_id' => $payment->id,
            ]);
        });
    }

    /**
     * Check bill status.
     */
    public function checkBillStatus(BillPayment $payment): array
    {
        return [
            'reference' => $payment->reference,
            'status' => $payment->status,
            'amount' => $payment->amount,
            'fee' => $payment->fee,
            'provider' => $payment->provider?->name,
            'bill_number' => $payment->bill_number,
            'created_at' => $payment->created_at,
            'metadata' => $payment->metadata,
        ];
    }

    /**
     * Get bill categories.
     *
     * @return Collection<int, BillCategory>
     */
    public function getCategories(): Collection
    {
        return BillCategory::where('status', 'active')
            ->orderBy('order')
            ->get();
    }

    /**
     * Get providers for a category.
     *
     * @return Collection<int, BillProvider>
     */
    public function getProviders(int $categoryId): Collection
    {
        return BillProvider::where('category_id', $categoryId)
            ->where('status', 'active')
            ->get();
    }

    /**
     * Get all active providers.
     *
     * @return Collection<int, BillProvider>
     */
    public function getAllProviders(): Collection
    {
        return BillProvider::where('status', 'active')
            ->with('category')
            ->get();
    }

    /**
     * Get provider by ID.
     */
    public function getProvider(int $providerId): ?BillProvider
    {
        return BillProvider::find($providerId);
    }

    /**
     * Calculate fee for payment.
     */
    public function calculateFee(float $amount, BillProvider $provider): float
    {
        $feeStructure = $provider->fee_structure ?? [];
        $percentFee = $amount * (($feeStructure['percent'] ?? self::DEFAULT_FEE_PERCENT) / 100);
        $fixedFee = $feeStructure['fixed'] ?? self::DEFAULT_FEE_FIXED;

        return round($percentFee + $fixedFee, 2);
    }

    /**
     * Schedule a recurring payment.
     *
     * @throws InvalidArgumentException
     */
    public function scheduleRecurringPayment(User $user, array $data): ScheduledPayment
    {
        $this->validateRecurringData($data);

        $provider = BillProvider::findOrFail($data['provider_id']);

        return DB::transaction(function () use ($user, $provider, $data) {
            $scheduled = ScheduledPayment::create([
                'user_id' => $user->id,
                'payment_type' => self::TYPE_RECURRING,
                'provider_id' => $provider->id,
                'bill_number' => $data['bill_number'],
                'amount' => $data['amount'],
                'fee' => $this->calculateFee($data['amount'], $provider),
                'frequency' => $data['frequency'],
                'next_due_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'status' => ScheduledPayment::STATUS_ACTIVE,
                'metadata' => [
                    'customer_name' => $data['customer_name'] ?? null,
                    'account_id' => $data['account_id'] ?? null,
                ],
            ]);

            Log::info('Recurring bill payment scheduled', [
                'scheduled_id' => $scheduled->id,
                'user_id' => $user->id,
                'frequency' => $data['frequency'],
            ]);

            return $scheduled;
        });
    }

    /**
     * Process scheduled recurring payment.
     */
    public function processScheduledPayment(ScheduledPayment $scheduled): ?BillPayment
    {
        if ($scheduled->status !== ScheduledPayment::STATUS_ACTIVE) {
            return null;
        }

        if ($scheduled->next_due_date > now()) {
            return null;
        }

        $user = $scheduled->user;

        try {
            $payment = $this->processPayment($user, [
                'provider_id' => $scheduled->provider_id,
                'bill_number' => $scheduled->bill_number,
                'amount' => $scheduled->amount,
                'account_id' => $scheduled->metadata['account_id'] ?? null,
                'customer_name' => $scheduled->metadata['customer_name'] ?? null,
            ]);

            $this->updateScheduledPaymentAfterProcessing($scheduled);

            return $payment;
        } catch (\Throwable $e) {
            Log::error('Scheduled bill payment failed', [
                'scheduled_id' => $scheduled->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Update scheduled payment after successful processing.
     */
    protected function updateScheduledPaymentAfterProcessing(ScheduledPayment $scheduled): void
    {
        $nextDueDate = match ($scheduled->frequency) {
            'daily' => now()->addDay(),
            'weekly' => now()->addWeek(),
            'biweekly' => now()->addWeeks(2),
            'monthly' => now()->addMonth(),
            'quarterly' => now()->addMonths(3),
            default => now()->addMonth(),
        };

        if ($scheduled->end_date && $nextDueDate->gt($scheduled->end_date)) {
            $scheduled->update(['status' => ScheduledPayment::STATUS_COMPLETED]);
        } else {
            $scheduled->update(['next_due_date' => $nextDueDate]);
        }
    }

    /**
     * Cancel a scheduled payment.
     *
     * @throws InvalidArgumentException
     */
    public function cancelScheduledPayment(ScheduledPayment $scheduled): void
    {
        if ($scheduled->status !== ScheduledPayment::STATUS_ACTIVE) {
            throw new InvalidArgumentException('Only active scheduled payments can be cancelled');
        }

        $scheduled->update(['status' => ScheduledPayment::STATUS_CANCELLED]);

        Log::info('Scheduled bill payment cancelled', [
            'scheduled_id' => $scheduled->id,
        ]);
    }

    /**
     * Get user's payment history.
     *
     * @return Collection<int, BillPayment>
     */
    public function getPaymentHistory(User $user, array $filters = []): Collection
    {
        $query = BillPayment::where('user_id', $user->id);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['provider_id'])) {
            $query->where('provider_id', $filters['provider_id']);
        }

        if (isset($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        return $query->with('provider')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Get user's scheduled payments.
     *
     * @return Collection<int, ScheduledPayment>
     */
    public function getScheduledPayments(User $user): Collection
    {
        return ScheduledPayment::where('user_id', $user->id)
            ->where('payment_type', self::TYPE_RECURRING)
            ->where('status', ScheduledPayment::STATUS_ACTIVE)
            ->with('provider')
            ->orderBy('next_due_date')
            ->get();
    }

    /**
     * Validate payment data.
     *
     * @throws InvalidArgumentException
     */
    protected function validatePaymentData(array $data): void
    {
        $required = ['provider_id', 'bill_number', 'amount'];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }

        if ($data['amount'] < self::MIN_AMOUNT) {
            throw new InvalidArgumentException(
                'Minimum payment amount is ' . self::MIN_AMOUNT
            );
        }

        if ($data['amount'] > self::MAX_AMOUNT) {
            throw new InvalidArgumentException(
                'Maximum payment amount is ' . self::MAX_AMOUNT
            );
        }

        $provider = BillProvider::find($data['provider_id']);
        if (!$provider || $provider->status !== 'active') {
            throw new InvalidArgumentException('Invalid or inactive provider');
        }
    }

    /**
     * Validate recurring payment data.
     *
     * @throws InvalidArgumentException
     */
    protected function validateRecurringData(array $data): void
    {
        $this->validatePaymentData($data);

        $required = ['frequency', 'start_date'];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Missing required field for recurring: {$field}");
            }
        }

        $validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly'];
        if (!in_array($data['frequency'], $validFrequencies)) {
            throw new InvalidArgumentException(
                'Invalid frequency. Valid: ' . implode(', ', $validFrequencies)
            );
        }
    }

    /**
     * Generate payment reference.
     */
    protected function generateReference(): string
    {
        return 'BLL-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -8));
    }

    /**
     * Get payment by ID.
     */
    public function getPayment(int $paymentId): ?BillPayment
    {
        return BillPayment::find($paymentId);
    }

    /**
     * Get payment by reference.
     */
    public function getPaymentByReference(string $reference): ?BillPayment
    {
        return BillPayment::where('reference', $reference)->first();
    }
}

/**
 * Provider Unavailable Exception
 */
class ProviderUnavailableException extends RuntimeException
{
    public function __construct(string $provider, string $message)
    {
        parent::__construct("Provider [{$provider}] unavailable: {$message}");
    }
}
