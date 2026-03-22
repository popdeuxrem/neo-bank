<?php

namespace App\Services\Banking;

use App\Models\AuditLog;
use App\Models\Banking\Wallet;
use App\Models\Banking\Withdrawal;
use App\Models\Banking\WithdrawalMethod;
use App\Models\User;
use App\Services\Payment\GatewayManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Withdrawal Service
 *
 * Handles all withdrawal operations: automatic and manual.
 * Supports multiple payout methods with fee calculation.
 *
 * @package App\Services\Banking
 */
class WithdrawalService
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_ON_HOLD = 'on_hold';

    public function __construct(
        protected GatewayManager $gatewayManager
    ) {}

    /**
     * Create a new withdrawal request.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function createWithdrawal(
        User $user,
        array $data
    ): Withdrawal {
        $this->validateWithdrawalData($user, $data);

        $method = WithdrawalMethod::findOrFail($data['method_id']);
        $gatewayId = $method->gateway;

        if (!$this->gatewayManager->hasGateway($gatewayId)) {
            throw new InvalidArgumentException("Gateway [{$gatewayId}] is not available");
        }

        $wallet = $user->wallet;

        if (!$wallet) {
            throw new RuntimeException('User wallet not found');
        }

        $fees = $this->gatewayManager->calculateFees(
            $data['amount'],
            $data['currency'] ?? 'USD'
        )[$gatewayId] ?? ['total' => 0];

        $totalDeduction = $data['amount'] * 100 + $fees['total'];

        if ($wallet->balance * 100 < $totalDeduction) {
            throw new InvalidArgumentException('Insufficient balance');
        }

        $withdrawal = DB::transaction(function () use ($user, $method, $data, $fees, $gatewayId, $wallet) {
            $withdrawal = Withdrawal::create([
                'user_id' => $user->id,
                'method_id' => $method->id,
                'wallet_id' => $wallet->id,
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'USD',
                'fee' => $fees['total'] / 100,
                'status' => self::STATUS_PENDING,
                'reference' => $this->generateReference(),
                'notes' => $data['notes'] ?? null,
            ]);

            $wallet->decrement('balance', $data['amount'] + ($fees['total'] / 100));

            $gatewayData = [
                'user_id' => $user->id,
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'USD',
                'withdrawal_id' => $withdrawal->id,
                'reference' => $withdrawal->reference,
                'description' => "Withdrawal via {$method->name}",
            ];

            if ($gatewayId === 'crypto') {
                $gatewayData['coin'] = $data['coin'] ?? 'BTC';
                $gatewayData['to_address'] = $data['to_address'];
            }

            if ($gatewayId === 'manual') {
                $gatewayData['method'] = $data['manual_method'] ?? 'bank_transfer';
                $gatewayData['bank_details'] = $data['bank_details'];
            }

            $result = $this->gatewayManager->processWithdrawal($gatewayId, $gatewayData);

            $metadata = [
                'gateway' => $gatewayId,
                'gateway_result' => $result->data ?? null,
                'fees' => $fees,
            ];

            if ($result->isCompleted()) {
                $withdrawal->update([
                    'status' => self::STATUS_COMPLETED,
                    'metadata' => $metadata,
                ]);

                $this->logWithdrawalComplete($withdrawal);
            } elseif ($result->isFailed()) {
                $wallet->increment('balance', $data['amount'] + ($fees['total'] / 100));

                $withdrawal->update([
                    'status' => self::STATUS_FAILED,
                    'notes' => $result->errorMessage ?? 'Payout failed',
                    'metadata' => $metadata,
                ]);
            } else {
                $withdrawal->update([
                    'status' => self::STATUS_PROCESSING,
                    'metadata' => $metadata,
                ]);
            }

            return $withdrawal;
        });

        Log::info('Withdrawal created', [
            'withdrawal_id' => $withdrawal->id,
            'user_id' => $user->id,
            'amount' => $data['amount'],
            'gateway' => $gatewayId,
        ]);

        return $withdrawal;
    }

    /**
     * Process webhook callback for withdrawal.
     *
     * @throws RuntimeException
     */
    public function handleWebhook(
        string $gatewayId,
        array $payload,
        ?string $signature = null
    ): Withdrawal {
        $result = $this->gatewayManager->handleWebhook($gatewayId, $payload, $signature);

        if (!$result->success) {
            throw new RuntimeException($result->errorMessage ?? 'Webhook processing failed');
        }

        $withdrawal = $this->findWithdrawalByTransaction($result->transactionId);

        if (!$withdrawal) {
            throw new RuntimeException('Withdrawal not found for transaction');
        }

        $metadata = $withdrawal->metadata ?? [];
        $metadata['webhook_data'] = $result->data;
        $metadata['last_webhook_at'] = now()->toIso8601String();

        $withdrawal->update(['metadata' => $metadata]);

        if ($result->isCompleted()) {
            $this->completeWithdrawal($withdrawal);
        } elseif ($result->isFailed()) {
            $this->failWithdrawal($withdrawal, $result->errorMessage ?? 'Payout failed');
        }

        return $withdrawal;
    }

    /**
     * Approve a pending withdrawal (for manual gateway).
     *
     * @throws InvalidArgumentException
     */
    public function approveWithdrawal(Withdrawal $withdrawal, User $approvedBy): Withdrawal
    {
        if ($withdrawal->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending withdrawals can be approved');
        }

        $metadata = $withdrawal->metadata ?? [];
        $gatewayId = $metadata['gateway'] ?? null;

        if ($gatewayId === 'manual') {
            $withdrawal->update([
                'status' => self::STATUS_COMPLETED,
            ]);
        } else {
            $result = $this->gatewayManager->verifyTransaction(
                $gatewayId,
                $withdrawal->reference
            );

            if ($result->isCompleted()) {
                $this->completeWithdrawal($withdrawal);
            } elseif ($result->isFailed()) {
                $this->failWithdrawal($withdrawal, $result->errorMessage ?? 'Verification failed');
            } else {
                $withdrawal->update(['status' => self::STATUS_PROCESSING]);
            }
        }

        $metadata = $withdrawal->metadata ?? [];
        $metadata['approved_by'] = $approvedBy->id;
        $metadata['approved_at'] = now()->toIso8601String();

        $withdrawal->update(['metadata' => $metadata]);

        AuditLog::log(
            'withdrawal.approved',
            $approvedBy,
            Withdrawal::class,
            $withdrawal->id,
            $withdrawal->user,
            ['amount' => $withdrawal->amount]
        );

        return $withdrawal;
    }

    /**
     * Reject a pending withdrawal.
     *
     * @throws InvalidArgumentException
     */
    public function rejectWithdrawal(
        Withdrawal $withdrawal,
        User $rejectedBy,
        string $reason
    ): Withdrawal {
        if (!in_array($withdrawal->status, [self::STATUS_PENDING, self::STATUS_ON_HOLD])) {
            throw new InvalidArgumentException('Only pending or on-hold withdrawals can be rejected');
        }

        return DB::transaction(function () use ($withdrawal, $rejectedBy, $reason) {
            $wallet = $withdrawal->wallet;

            if ($wallet) {
                $refundAmount = $withdrawal->amount + ($withdrawal->fee ?? 0);
                $wallet->increment('balance', $refundAmount);
            }

            $metadata = $withdrawal->metadata ?? [];
            $metadata['rejected_by'] = $rejectedBy->id;
            $metadata['rejected_at'] = now()->toIso8601String();
            $metadata['rejection_reason'] = $reason;

            $withdrawal->update([
                'status' => self::STATUS_CANCELLED,
                'notes' => $reason,
                'metadata' => $metadata,
            ]);

            AuditLog::log(
                'withdrawal.rejected',
                $rejectedBy,
                Withdrawal::class,
                $withdrawal->id,
                $withdrawal->user,
                [
                    'amount' => $withdrawal->amount,
                    'reason' => $reason,
                ]
            );

            return $withdrawal;
        });
    }

    /**
     * Cancel a withdrawal request (by user).
     *
     * @throws InvalidArgumentException
     */
    public function cancelWithdrawal(Withdrawal $withdrawal, ?string $reason = null): Withdrawal
    {
        if ($withdrawal->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending withdrawals can be cancelled');
        }

        return DB::transaction(function () use ($withdrawal, $reason) {
            $wallet = $withdrawal->wallet;

            if ($wallet) {
                $refundAmount = $withdrawal->amount + ($withdrawal->fee ?? 0);
                $wallet->increment('balance', $refundAmount);
            }

            $withdrawal->update([
                'status' => self::STATUS_CANCELLED,
                'notes' => $reason ?? 'Cancelled by user',
            ]);

            AuditLog::log(
                'withdrawal.cancelled',
                $withdrawal->user,
                Withdrawal::class,
                $withdrawal->id,
                $withdrawal->user,
                ['amount' => $withdrawal->amount]
            );

            return $withdrawal;
        });
    }

    /**
     * Put withdrawal on hold for review.
     *
     * @throws InvalidArgumentException
     */
    public function holdWithdrawal(Withdrawal $withdrawal, User $heldBy, string $reason): Withdrawal
    {
        if ($withdrawal->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending withdrawals can be put on hold');
        }

        $metadata = $withdrawal->metadata ?? [];
        $metadata['held_by'] = $heldBy->id;
        $metadata['held_at'] = now()->toIso8601String();
        $metadata['hold_reason'] = $reason;

        $withdrawal->update([
            'status' => self::STATUS_ON_HOLD,
            'metadata' => $metadata,
        ]);

        AuditLog::log(
            'withdrawal.on_hold',
            $heldBy,
            Withdrawal::class,
            $withdrawal->id,
            $withdrawal->user,
            [
                'amount' => $withdrawal->amount,
                'reason' => $reason,
            ]
        );

        return $withdrawal;
    }

    /**
     * Complete a withdrawal.
     */
    protected function completeWithdrawal(Withdrawal $withdrawal): void
    {
        $withdrawal->update(['status' => self::STATUS_COMPLETED]);

        AuditLog::log(
            'withdrawal.completed',
            null,
            Withdrawal::class,
            $withdrawal->id,
            $withdrawal->user,
            ['amount' => $withdrawal->amount]
        );

        Log::info('Withdrawal completed', [
            'withdrawal_id' => $withdrawal->id,
            'user_id' => $withdrawal->user_id,
            'amount' => $withdrawal->amount,
        ]);
    }

    /**
     * Mark withdrawal as failed and refund.
     */
    protected function failWithdrawal(Withdrawal $withdrawal, string $reason): void
    {
        DB::transaction(function () use ($withdrawal, $reason) {
            $wallet = $withdrawal->wallet;

            if ($wallet) {
                $refundAmount = $withdrawal->amount + ($withdrawal->fee ?? 0);
                $wallet->increment('balance', $refundAmount);
            }

            $metadata = $withdrawal->metadata ?? [];
            $metadata['failure_reason'] = $reason;
            $metadata['refunded_at'] = now()->toIso8601String();

            $withdrawal->update([
                'status' => self::STATUS_FAILED,
                'notes' => $reason,
                'metadata' => $metadata,
            ]);

            AuditLog::log(
                'withdrawal.failed',
                null,
                Withdrawal::class,
                $withdrawal->id,
                $withdrawal->user,
                [
                    'amount' => $withdrawal->amount,
                    'reason' => $reason,
                ]
            );
        });
    }

    /**
     * Log successful withdrawal completion.
     */
    protected function logWithdrawalComplete(Withdrawal $withdrawal): void
    {
        Log::info('Withdrawal completed via gateway', [
            'withdrawal_id' => $withdrawal->id,
            'user_id' => $withdrawal->user_id,
            'amount' => $withdrawal->amount,
        ]);
    }

    /**
     * Find withdrawal by gateway transaction reference.
     */
    protected function findWithdrawalByTransaction(string $transactionId): ?Withdrawal
    {
        return Withdrawal::where('reference', $transactionId)
            ->orWhereHas('metadata', function ($query) use ($transactionId) {
                $query->where('gateway_result->id', $transactionId);
            })
            ->first();
    }

    /**
     * Generate unique withdrawal reference.
     */
    protected function generateReference(): string
    {
        return 'WTH-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -8));
    }

    /**
     * Validate withdrawal data.
     *
     * @throws InvalidArgumentException
     */
    protected function validateWithdrawalData(User $user, array $data): void
    {
        $required = ['method_id', 'amount'];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }

        if ($data['amount'] <= 0) {
            throw new InvalidArgumentException('Amount must be greater than zero');
        }

        $method = WithdrawalMethod::find($data['method_id']);

        if (!$method) {
            throw new InvalidArgumentException('Invalid withdrawal method');
        }

        if (!$method->is_active) {
            throw new InvalidArgumentException('Withdrawal method is not active');
        }

        if ($method->min_amount && $data['amount'] < $method->min_amount) {
            throw new InvalidArgumentException("Minimum withdrawal amount is {$method->min_amount}");
        }

        if ($method->max_amount && $data['amount'] > $method->max_amount) {
            throw new InvalidArgumentException("Maximum withdrawal amount is {$method->max_amount}");
        }

        $wallet = $user->wallet;
        
        if (!$wallet) {
            throw new InvalidArgumentException('User wallet not found');
        }

        $dailyLimit = $method->daily_limit ?? 0;
        if ($dailyLimit > 0) {
            $todayWithdrawals = Withdrawal::where('user_id', $user->id)
                ->where('method_id', $method->id)
                ->whereDate('created_at', today())
                ->where('status', '!=', self::STATUS_FAILED)
                ->sum('amount');

            if ($todayWithdrawals + $data['amount'] > $dailyLimit) {
                throw new InvalidArgumentException("Daily limit exceeded for this method");
            }
        }
    }

    /**
     * Get available withdrawal methods.
     */
    public function getAvailableMethods(): array
    {
        return WithdrawalMethod::active()
            ->where('is_withdrawal', true)
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'gateway' => $method->gateway,
                    'limits' => [
                        'min' => $method->min_amount,
                        'max' => $method->max_amount,
                        'daily' => $method->daily_limit,
                    ],
                    'fees' => [
                        'fixed' => $method->fixed_fee,
                        'percent' => $method->percent_fee,
                    ],
                ];
            })
            ->toArray();
    }

    /**
     * Calculate total fees for withdrawal.
     */
    public function calculateTotalFees(float $amount, int $methodId): array
    {
        $method = WithdrawalMethod::findOrFail($methodId);
        $gatewayId = $method->gateway;

        $fees = $this->gatewayManager->calculateFees($amount)[$gatewayId] ?? ['total' => 0];

        return [
            'amount' => $amount,
            'gateway_fee' => $fees['gateway_fee'] / 100,
            'our_fee' => $fees['our_fee'] / 100,
            'total_fee' => $fees['total'] / 100,
            'total_deduction' => $amount + ($fees['total'] / 100),
        ];
    }
}
