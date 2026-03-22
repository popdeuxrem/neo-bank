<?php

namespace App\Services\Banking;

use App\Models\AuditLog;
use App\Models\Banking\Deposit;
use App\Models\Banking\DepositMethod;
use App\Models\Banking\Wallet;
use App\Models\User;
use App\Services\Payment\GatewayManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Deposit Service
 *
 * Handles all deposit operations: automatic and manual.
 * Integrates with multiple payment gateways.
 *
 * @package App\Services\Banking
 */
class DepositService
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    public function __construct(
        protected GatewayManager $gatewayManager
    ) {}

    /**
     * Create a new deposit request.
     *
     * @throws InvalidArgumentException
     */
    public function createDeposit(
        User $user,
        array $data
    ): Deposit {
        $this->validateDepositData($data);

        $method = DepositMethod::findOrFail($data['method_id']);
        $gatewayId = $method->gateway;

        if (!$this->gatewayManager->hasGateway($gatewayId)) {
            throw new InvalidArgumentException("Gateway [{$gatewayId}] is not available");
        }

        $fees = $this->gatewayManager->calculateFees(
            $data['amount'],
            $data['currency'] ?? 'USD'
        )[$gatewayId] ?? ['total' => 0];

        $netAmount = $data['amount'] * 100 - $fees['total'];

        if ($netAmount <= 0) {
            throw new InvalidArgumentException('Amount after fees must be greater than zero');
        }

        $deposit = DB::transaction(function () use ($user, $method, $data, $fees, $netAmount, $gatewayId) {
            $deposit = Deposit::create([
                'user_id' => $user->id,
                'method_id' => $method->id,
                'amount' => $netAmount / 100,
                'currency' => $data['currency'] ?? 'USD',
                'fee' => $fees['total'] / 100,
                'status' => self::STATUS_PENDING,
                'reference' => $this->generateReference(),
                'notes' => $data['notes'] ?? null,
            ]);

            $gatewayData = [
                'user_id' => $user->id,
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'USD',
                'deposit_id' => $deposit->id,
                'reference' => $deposit->reference,
                'description' => "Deposit via {$method->name}",
                'return_url' => $data['return_url'] ?? null,
                'customer' => $data['customer'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
            ];

            if ($gatewayId === 'crypto') {
                $gatewayData['coin'] = $data['coin'] ?? 'BTC';
            }

            if ($gatewayId === 'manual') {
                $gatewayData['method'] = $data['manual_method'] ?? 'bank_transfer';
            }

            $result = $this->gatewayManager->processDeposit($gatewayId, $gatewayData);

            $deposit->update([
                'metadata' => [
                    'gateway' => $gatewayId,
                    'gateway_result' => $result->data ?? null,
                    'fees' => $fees,
                ],
            ]);

            if ($result->isCompleted()) {
                $this->completeDeposit($deposit);
            } elseif ($result->isFailed()) {
                $deposit->update([
                    'status' => self::STATUS_FAILED,
                    'notes' => $result->errorMessage ?? 'Payment failed',
                ]);
            }

            return $deposit;
        });

        Log::info('Deposit created', [
            'deposit_id' => $deposit->id,
            'user_id' => $user->id,
            'amount' => $data['amount'],
            'gateway' => $gatewayId,
        ]);

        return $deposit;
    }

    /**
     * Process a webhook callback for deposit.
     *
     * @throws RuntimeException
     */
    public function handleWebhook(
        string $gatewayId,
        array $payload,
        ?string $signature = null
    ): Deposit {
        $result = $this->gatewayManager->handleWebhook($gatewayId, $payload, $signature);

        if (!$result->success) {
            throw new RuntimeException($result->errorMessage ?? 'Webhook processing failed');
        }

        $deposit = $this->findDepositByTransaction($result->transactionId);

        if (!$deposit) {
            throw new RuntimeException('Deposit not found for transaction');
        }

        $this->updateDepositStatus($deposit, $result->status, $result->data);

        if ($result->isCompleted()) {
            $this->completeDeposit($deposit);
        }

        return $deposit;
    }

    /**
     * Verify and complete a pending deposit.
     *
     * @throws InvalidArgumentException
     */
    public function verifyDeposit(Deposit $deposit, User $verifiedBy): Deposit
    {
        if ($deposit->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending deposits can be verified');
        }

        return DB::transaction(function () use ($deposit, $verifiedBy) {
            $metadata = $deposit->metadata ?? [];
            $gatewayId = $metadata['gateway'] ?? null;

            if ($gatewayId && $gatewayId !== 'manual') {
                $result = $this->gatewayManager->verifyTransaction(
                    $gatewayId,
                    $deposit->reference
                );

                if (!$result->isCompleted()) {
                    throw new RuntimeException('Gateway verification failed');
                }
            }

            $this->completeDeposit($deposit, $verifiedBy);

            return $deposit;
        });
    }

    /**
     * Cancel a pending deposit.
     *
     * @throws InvalidArgumentException
     */
    public function cancelDeposit(Deposit $deposit, ?string $reason = null): Deposit
    {
        if (!in_array($deposit->status, [self::STATUS_PENDING, self::STATUS_PROCESSING])) {
            throw new InvalidArgumentException('Only pending or processing deposits can be cancelled');
        }

        $deposit->update([
            'status' => self::STATUS_CANCELLED,
            'notes' => $reason ?? 'Cancelled by user',
        ]);

        AuditLog::log(
            'deposit.cancelled',
            null,
            Deposit::class,
            $deposit->id,
            null,
            ['reason' => $reason]
        );

        return $deposit;
    }

    /**
     * Complete a deposit and credit user wallet.
     *
     * @throws RuntimeException
     */
    protected function completeDeposit(Deposit $deposit, ?User $completedBy = null): void
    {
        DB::transaction(function () use ($deposit, $completedBy) {
            $wallet = $deposit->user->wallet;

            if (!$wallet) {
                throw new RuntimeException('User wallet not found');
            }

            $wallet->increment('balance', $deposit->amount);

            $deposit->update([
                'status' => self::STATUS_COMPLETED,
            ]);

            AuditLog::log(
                'deposit.completed',
                $completedBy,
                Deposit::class,
                $deposit->id,
                $deposit->user,
                [
                    'amount' => $deposit->amount,
                    'fee' => $deposit->fee,
                    'wallet_balance_before' => $wallet->balance - $deposit->amount,
                    'wallet_balance_after' => $wallet->balance,
                ]
            );

            Log::info('Deposit completed', [
                'deposit_id' => $deposit->id,
                'user_id' => $deposit->user_id,
                'amount' => $deposit->amount,
            ]);
        });
    }

    /**
     * Update deposit status from webhook.
     */
    protected function updateDepositStatus(
        Deposit $deposit,
        string $status,
        ?array $data = null
    ): void {
        $metadata = $deposit->metadata ?? [];
        $metadata['webhook_data'] = $data;
        $metadata['last_webhook_at'] = now()->toIso8601String();

        $deposit->update([
            'metadata' => $metadata,
            'status' => match ($status) {
                'completed', 'succeeded' => self::STATUS_COMPLETED,
                'failed', 'declined' => self::STATUS_FAILED,
                'processing' => self::STATUS_PROCESSING,
                default => $deposit->status,
            },
        ]);
    }

    /**
     * Find deposit by gateway transaction reference.
     */
    protected function findDepositByTransaction(string $transactionId): ?Deposit
    {
        return Deposit::where('reference', $transactionId)
            ->orWhereHas('metadata', function ($query) use ($transactionId) {
                $query->where('gateway_result->id', $transactionId);
            })
            ->first();
    }

    /**
     * Generate unique deposit reference.
     */
    protected function generateReference(): string
    {
        return 'DEP-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -8));
    }

    /**
     * Validate deposit data.
     */
    protected function validateDepositData(array $data): void
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

        $method = DepositMethod::find($data['method_id']);
        
        if (!$method) {
            throw new InvalidArgumentException('Invalid deposit method');
        }

        if (!$method->is_active) {
            throw new InvalidArgumentException('Deposit method is not active');
        }
    }

    /**
     * Get available deposit methods.
     */
    public function getAvailableMethods(): array
    {
        return DepositMethod::active()
            ->where('is_deposit', true)
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'gateway' => $method->gateway,
                    'limits' => [
                        'min' => $method->min_amount,
                        'max' => $method->max_amount,
                    ],
                    'fees' => [
                        'fixed' => $method->fixed_fee,
                        'percent' => $method->percent_fee,
                    ],
                ];
            })
            ->toArray();
    }
}
