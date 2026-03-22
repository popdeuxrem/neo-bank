<?php

namespace App\Services\Payment\Gateways;

use App\Contracts\Payment\GatewayResult;
use App\Contracts\Payment\GatewayTransactionException;
use App\Contracts\Payment\PaymentGatewayInterface;
use App\Contracts\Payment\WebhookResult;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Manual/Custom Payment Gateway Implementation
 *
 * Handles manual payment processing (bank transfers, cash deposits, etc.).
 * Supports: deposits requiring manual verification, pending approvals
 *
 * @package App\Services\Payment\Gateways
 */
class ManualGateway implements PaymentGatewayInterface
{
    public const METHOD_BANK_TRANSFER = 'bank_transfer';
    public const METHOD_CASH_DEPOSIT = 'cash_deposit';
    public const METHOD Cheque = 'cheque';
    public const METHOD_OTHER = 'other';

    protected const SUPPORTED_METHODS = [
        self::METHOD_BANK_TRANSFER,
        self::METHOD_CASH_DEPOSIT,
        self::METHOD Cheque,
        self::METHOD_OTHER,
    ];

    public function __construct(
        protected array $config
    ) {}

    /**
     * Get gateway identifier.
     */
    public function getGatewayId(): string
    {
        return 'manual';
    }

    /**
     * Get gateway display name.
     */
    public function getGatewayName(): string
    {
        return 'Manual Payment';
    }

    /**
     * Check if gateway is enabled.
     */
    public function isEnabled(): bool
    {
        return ($this->config['enabled'] ?? true) === true;
    }

    /**
     * Process a manual deposit (creates pending record).
     */
    public function processDeposit(array $data): GatewayResult
    {
        $this->validateDepositData($data);

        try {
            $method = $data['method'] ?? self::METHOD_BANK_TRANSFER;
            
            if (!in_array($method, self::SUPPORTED_METHODS, true)) {
                return GatewayResult::failure(
                    errorCode: 'invalid_method',
                    errorMessage: "Invalid payment method: {$method}"
                );
            }

            $transactionId = $this->createManualDeposit($data);

            return GatewayResult::success(
                transactionId: $transactionId,
                status: 'pending',
                message: 'Manual payment submitted for review',
                data: [
                    'method' => $method,
                    'reference' => $data['reference'] ?? null,
                    'instructions' => $this->getPaymentInstructions($method),
                    'requires_verification' => true,
                ]
            );
        } catch (\Throwable $e) {
            Log::error('Manual deposit creation failed', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            throw new GatewayTransactionException(
                $this->getGatewayId(),
                $e->getMessage()
            );
        }
    }

    /**
     * Process a manual withdrawal (requires admin approval).
     */
    public function processWithdrawal(array $data): GatewayResult
    {
        $this->validateWithdrawalData($data);

        try {
            $method = $data['method'] ?? self::METHOD_BANK_TRANSFER;
            
            if (!in_array($method, self::SUPPORTED_METHODS, true)) {
                return GatewayResult::failure(
                    errorCode: 'invalid_method',
                    errorMessage: "Invalid payout method: {$method}"
                );
            }

            $transactionId = $this->createManualWithdrawal($data);

            return GatewayResult::success(
                transactionId: $transactionId,
                status: 'pending',
                message: 'Withdrawal pending admin approval',
                data: [
                    'method' => $method,
                    'requires_approval' => true,
                    'processing_time' => $this->config['processing_time'] ?? '24-48 hours',
                ]
            );
        } catch (\Throwable $e) {
            Log::error('Manual withdrawal creation failed', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            throw new GatewayTransactionException(
                $this->getGatewayId(),
                $e->getMessage()
            );
        }
    }

    /**
     * Verify transaction status.
     */
    public function verifyTransaction(string $transactionId): GatewayResult
    {
        try {
            $status = $this->getTransactionStatus($transactionId);

            return GatewayResult::success(
                transactionId: $transactionId,
                status: $status['status'],
                message: $status['message'],
                data: [
                    'status' => $status['status'],
                    'notes' => $status['notes'] ?? null,
                    'verified_at' => $status['verified_at'] ?? null,
                ]
            );
        } catch (\Throwable $e) {
            return GatewayResult::failure(
                errorCode: 'verification_failed',
                errorMessage: $e->getMessage()
            );
        }
    }

    /**
     * Handle manual verification/approval.
     */
    public function handleWebhook(array $payload): WebhookResult
    {
        $eventType = $payload['type'] ?? 'manual_review';
        $transactionId = $payload['transaction_id'] ?? null;
        $action = $payload['action'] ?? null;

        $status = match ($action) {
            'approve', 'verified' => 'completed',
            'reject', 'declined' => 'failed',
            'pending' => 'pending',
            default => 'pending',
        };

        return WebhookResult::success(
            eventType: $eventType,
            transactionId: $transactionId,
            status: $status,
            data: $payload
        );
    }

    /**
     * Calculate transaction fees (manual has lower/zero gateway fees).
     */
    public function calculateFees(float $amount, string $currency = 'USD'): array
    {
        $amountCents = (int) round($amount * 100);
        
        $gatewayFee = 0;
        $ourFee = (int) round($amountCents * 0.005);

        return [
            'gateway_fee' => $gatewayFee,
            'our_fee' => $ourFee,
            'total' => $gatewayFee + $ourFee,
        ];
    }

    /**
     * Validate webhook signature (not applicable for manual).
     */
    public function validateWebhookSignature(string $payload, string $signature): bool
    {
        return true;
    }

    /**
     * Get supported payment methods.
     */
    public function getSupportedMethods(): array
    {
        return self::SUPPORTED_METHODS;
    }

    /**
     * Get payment instructions for a method.
     */
    public function getPaymentInstructions(string $method): array
    {
        return match ($method) {
            self::METHOD_BANK_TRANSFER => [
                'title' => 'Bank Transfer Details',
                'bank_name' => $this->config['bank_name'] ?? 'Demo Bank',
                'account_name' => $this->config['account_name'] ?? 'Neo Bank Ltd',
                'account_number' => $this->config['account_number'] ?? '1234567890',
                'routing_number' => $this->config['routing_number'] ?? '021000021',
                'swift_code' => $this->config['swift_code'] ?? 'DEMOXXX',
                'reference' => 'Use your unique deposit reference',
            ],
            self::METHOD_CASH_DEPOSIT => [
                'title' => 'Cash Deposit',
                'instructions' => 'Visit any authorized branch to make a cash deposit.',
                'branches' => $this->config['branches'] ?? ['Main Branch - 123 Street'],
            ],
            self::METHOD_OTHER => [
                'title' => 'Other Payment Method',
                'instructions' => 'Contact support for alternative payment options.',
            ],
            default => [],
        };
    }

    /**
     * Create manual deposit record.
     */
    protected function createManualDeposit(array $data): string
    {
        $transactionId = 'MAN-' . strtoupper(Str::random(12));

        Log::info('Manual deposit created', [
            'transaction_id' => $transactionId,
            'user_id' => $data['user_id'],
            'amount' => $data['amount'],
            'method' => $data['method'] ?? self::METHOD_BANK_TRANSFER,
        ]);

        return $transactionId;
    }

    /**
     * Create manual withdrawal record.
     */
    protected function createManualWithdrawal(array $data): string
    {
        $transactionId = 'MANW-' . strtoupper(Str::random(12));

        Log::info('Manual withdrawal created', [
            'transaction_id' => $transactionId,
            'user_id' => $data['user_id'],
            'amount' => $data['amount'],
            'method' => $data['method'] ?? self::METHOD_BANK_TRANSFER,
        ]);

        return $transactionId;
    }

    /**
     * Get transaction status.
     */
    protected function getTransactionStatus(string $transactionId): array
    {
        return [
            'status' => 'pending',
            'message' => 'Awaiting manual verification',
            'notes' => null,
            'verified_at' => null,
        ];
    }

    /**
     * Approve manual transaction.
     */
    public function approveTransaction(string $transactionId, int $approvedBy, ?string $notes = null): bool
    {
        Log::info('Manual transaction approved', [
            'transaction_id' => $transactionId,
            'approved_by' => $approvedBy,
            'notes' => $notes,
        ]);

        return true;
    }

    /**
     * Reject manual transaction.
     */
    public function rejectTransaction(string $transactionId, int $rejectedBy, string $reason): bool
    {
        Log::info('Manual transaction rejected', [
            'transaction_id' => $transactionId,
            'rejected_by' => $rejectedBy,
            'reason' => $reason,
        ]);

        return true;
    }

    /**
     * Validate deposit data.
     */
    protected function validateDepositData(array $data): void
    {
        $required = ['amount', 'user_id'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new \InvalidArgumentException("Missing required field: {$field}");
            }
        }

        if ($data['amount'] <= 0) {
            throw new \InvalidArgumentException('Amount must be greater than 0');
        }

        $minAmount = $this->config['min_deposit'] ?? 10;
        if ($data['amount'] < $minAmount) {
            throw new \InvalidArgumentException("Minimum deposit amount is {$minAmount}");
        }
    }

    /**
     * Validate withdrawal data.
     */
    protected function validateWithdrawalData(array $data): void
    {
        $required = ['amount', 'user_id'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new \InvalidArgumentException("Missing required field: {$field}");
            }
        }

        if ($data['amount'] <= 0) {
            throw new \InvalidArgumentException('Amount must be greater than 0');
        }

        $minAmount = $this->config['min_withdrawal'] ?? 10;
        if ($data['amount'] < $minAmount) {
            throw new \InvalidArgumentException("Minimum withdrawal amount is {$minAmount}");
        }
    }
}
