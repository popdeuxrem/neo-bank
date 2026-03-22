<?php

namespace App\Contracts\Payment;

use App\Models\Banking\Deposit;
use App\Models\Banking\Withdrawal;

/**
 * Payment Gateway Contract
 *
 * Defines the interface all payment gateways must implement.
 * Supported gateways: Stripe, Crypto Wallets, Manual/Custom
 *
 * @package App\Contracts\Payment
 */
interface PaymentGatewayInterface
{
    /**
     * Get the gateway identifier.
     */
    public function getGatewayId(): string;

    /**
     * Get the gateway display name.
     */
    public function getGatewayName(): string;

    /**
     * Check if gateway is enabled and configured.
     */
    public function isEnabled(): bool;

    /**
     * Process a deposit/credit transaction.
     *
     * @param array $data Payment data including amount, currency, customer info
     * @return GatewayResult
     */
    public function processDeposit(array $data): GatewayResult;

    /**
     * Process a withdrawal/debit transaction.
     *
     * @param array $data Withdrawal data including amount, currency, recipient info
     * @return GatewayResult
     */
    public function processWithdrawal(array $data): GatewayResult;

    /**
     * Verify a payment/payout status.
     *
     * @param string $transactionId External transaction ID
     * @return GatewayResult
     */
    public function verifyTransaction(string $transactionId): GatewayResult;

    /**
     * Handle webhook/callback from gateway.
     *
     * @param array $payload Webhook payload
     * @return WebhookResult
     */
    public function handleWebhook(array $payload): WebhookResult;

    /**
     * Calculate fees for a transaction.
     *
     * @param float $amount Transaction amount
     * @param string $currency Currency code
     * @return array Fee breakdown ['gateway_fee' => int, 'our_fee' => int, 'total' => int]
     */
    public function calculateFees(float $amount, string $currency = 'USD'): array;

    /**
     * Validate webhook signature.
     *
     * @param string $payload Raw payload
     * @param string $signature Provided signature
     * @return bool
     */
    public function validateWebhookSignature(string $payload, string $signature): bool;
}

/**
 * Gateway Result DTO
 */
class GatewayResult
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $transactionId,
        public readonly ?string $reference,
        public readonly ?string $status,
        public readonly ?string $message,
        public readonly ?array $data = null,
        public readonly ?string $errorCode = null,
        public readonly ?string $errorMessage = null,
    ) {}

    public static function success(
        string $transactionId,
        string $status,
        ?string $message = null,
        ?array $data = null
    ): self {
        return new self(
            success: true,
            transactionId: $transactionId,
            reference: $transactionId,
            status: $status,
            message: $message,
            data: $data,
        );
    }

    public static function failure(
        string $errorCode,
        string $errorMessage,
        ?string $transactionId = null
    ): self {
        return new self(
            success: false,
            transactionId: $transactionId,
            reference: $transactionId,
            status: 'failed',
            message: $errorMessage,
            errorCode: $errorCode,
            errorMessage: $errorMessage,
        );
    }

    public function isPending(): bool
    {
        return $this->status === 'pending' || $this->status === 'processing';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed' || $this->status === 'succeeded';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed' || $this->status === 'declined';
    }
}

/**
 * Webhook Result DTO
 */
class WebhookResult
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $eventType,
        public readonly ?string $transactionId,
        public readonly ?string $status,
        public readonly ?array $data = null,
        public readonly ?string $errorMessage = null,
    ) {}

    public static function success(
        string $eventType,
        string $transactionId,
        string $status,
        ?array $data = null
    ): self {
        return new self(
            success: true,
            eventType: $eventType,
            transactionId: $transactionId,
            status: $status,
            data: $data,
        );
    }

    public static function failure(string $errorMessage): self
    {
        return new self(
            success: false,
            eventType: null,
            transactionId: null,
            status: null,
            errorMessage: $errorMessage,
        );
    }
}

/**
 * Gateway Configuration Exception
 */
class GatewayConfigurationException extends \Exception
{
    public function __construct(string $gateway, string $message)
    {
        parent::__construct("Gateway [{$gateway}] configuration error: {$message}");
    }
}

/**
 * Gateway Transaction Exception
 */
class GatewayTransactionException extends \Exception
{
    public function __construct(
        string $gateway,
        string $message,
        ?string $transactionId = null,
        ?string $errorCode = null
    ) {
        parent::__construct("Gateway [{$gateway}] transaction error: {$message}");
        $this->transactionId = $transactionId;
        $this->errorCode = $errorCode;
    }

    public readonly ?string $transactionId;
    public readonly ?string $errorCode;
}
