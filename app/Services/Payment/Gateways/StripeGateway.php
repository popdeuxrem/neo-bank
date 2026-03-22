<?php

namespace App\Services\Payment\Gateways;

use App\Contracts\Payment\GatewayResult;
use App\Contracts\Payment\GatewayTransactionException;
use App\Contracts\Payment\PaymentGatewayInterface;
use App\Contracts\Payment\WebhookResult;
use App\Models\Banking\Deposit;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Stripe Payment Gateway Implementation
 *
 * Handles credit card payments via Stripe API.
 * Supports: deposits, withdrawals, refunds, webhooks
 *
 * @package App\Services\Payment\Gateways
 */
class StripeGateway implements PaymentGatewayInterface
{
    protected const BASE_URL = 'https://api.stripe.com/v1';

    public function __construct(
        protected array $config
    ) {}

    /**
     * Get gateway identifier.
     */
    public function getGatewayId(): string
    {
        return 'stripe';
    }

    /**
     * Get gateway display name.
     */
    public function getGatewayName(): string
    {
        return 'Stripe';
    }

    /**
     * Check if gateway is enabled and configured.
     */
    public function isEnabled(): bool
    {
        return !empty($this->config['api_key']) && ($this->config['enabled'] ?? true);
    }

    /**
     * Process a deposit/payment.
     *
     * @throws GatewayTransactionException
     */
    public function processDeposit(array $data): GatewayResult
    {
        $this->validateDepositData($data);

        try {
            $amount = (int) round($data['amount'] * 100);
            $currency = strtoupper($data['currency'] ?? 'USD');

            $payload = [
                'amount' => $amount,
                'currency' => $currency,
                'description' => $data['description'] ?? 'Deposit',
                'metadata' => [
                    'user_id' => $data['user_id'],
                    'deposit_id' => $data['deposit_id'] ?? null,
                    'internal_reference' => $data['reference'],
                ],
            ];

            if (!empty($data['payment_method'])) {
                $payload['payment_method'] = $data['payment_method'];
                $payload['confirm'] = 'true';
                $payload['return_url'] = $data['return_url'] ?? null;
            } elseif (!empty($data['customer'])) {
                $payload['customer'] = $data['customer'];
            }

            $response = $this->makeRequest('POST', '/payment_intents', $payload);

            $status = $this->mapStripeStatus($response['status'] ?? 'pending');

            if (in_array($status, ['succeeded', 'pending', 'processing'])) {
                return GatewayResult::success(
                    transactionId: $response['id'],
                    status: $status,
                    message: $response['status'] ?? 'Payment initiated',
                    data: [
                        'client_secret' => $response['client_secret'] ?? null,
                        'next_action' => $response['next_action'] ?? null,
                    ]
                );
            }

            return GatewayResult::failure(
                errorCode: $response['error']['code'] ?? 'payment_failed',
                errorMessage: $response['error']['message'] ?? 'Payment failed',
                transactionId: $response['id'] ?? null
            );
        } catch (\Throwable $e) {
            Log::error('Stripe deposit failed', [
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
     * Process a withdrawal/payout.
     *
     * @throws GatewayTransactionException
     */
    public function processWithdrawal(array $data): GatewayResult
    {
        $this->validateWithdrawalData($data);

        try {
            $amount = (int) round($data['amount'] * 100);
            $currency = strtoupper($data['currency'] ?? 'USD');

            $payload = [
                'amount' => $amount,
                'currency' => $currency,
                'description' => $data['description'] ?? 'Withdrawal',
                'metadata' => [
                    'user_id' => $data['user_id'],
                    'withdrawal_id' => $data['withdrawal_id'] ?? null,
                    'internal_reference' => $data['reference'],
                ],
            ];

            if (!empty($data['destination'])) {
                $payload['destination'] = $data['destination'];
            }

            $response = $this->makeRequest('POST', '/transfers', $payload);

            return GatewayResult::success(
                transactionId: $response['id'],
                status: $response['status'] === 'paid' ? 'completed' : 'pending',
                message: 'Payout initiated',
                data: [
                    'destination' => $response['destination'] ?? null,
                    'arrival_date' => $response['arrival_date'] ?? null,
                ]
            );
        } catch (\Throwable $e) {
            Log::error('Stripe withdrawal failed', [
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
            $response = $this->makeRequest('GET', "/payment_intents/{$transactionId}");

            $status = $this->mapStripeStatus($response['status'] ?? 'unknown');

            return GatewayResult::success(
                transactionId: $response['id'],
                status: $status,
                message: "Payment status: {$status}",
                data: [
                    'amount' => ($response['amount'] ?? 0) / 100,
                    'currency' => strtoupper($response['currency'] ?? 'usd'),
                    'status' => $response['status'],
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
     * Handle webhook from Stripe.
     */
    public function handleWebhook(array $payload): WebhookResult
    {
        $eventType = $payload['type'] ?? 'unknown';
        $data = $payload['data']['object'] ?? [];

        $transactionId = $data['id'] ?? null;

        $status = match ($eventType) {
            'payment_intent.succeeded', 'charge.succeeded' => 'completed',
            'payment_intent.payment_failed', 'charge.failed' => 'failed',
            'payment_intent.processing', 'charge.processing' => 'processing',
            'payment_intent.canceled' => 'cancelled',
            default => 'pending',
        };

        return WebhookResult::success(
            eventType: $eventType,
            transactionId: $transactionId,
            status: $status,
            data: $data
        );
    }

    /**
     * Calculate transaction fees.
     */
    public function calculateFees(float $amount, string $currency = 'USD'): array
    {
        $amountCents = (int) round($amount * 100);

        $stripeFee = (int) round($amountCents * 0.029 + 30);
        $ourFee = (int) round($amountCents * 0.01);

        return [
            'gateway_fee' => $stripeFee,
            'our_fee' => $ourFee,
            'total' => $stripeFee + $ourFee,
        ];
    }

    /**
     * Validate webhook signature.
     */
    public function validateWebhookSignature(string $payload, string $signature): bool
    {
        $webhookSecret = $this->config['webhook_secret'] ?? '';

        if (empty($webhookSecret)) {
            return false;
        }

        try {
            $computedSignature = hash_hmac(
                'sha256',
                $payload,
                $webhookSecret
            );

            return hash_equals($computedSignature, $signature);
        } catch (\Throwable $e) {
            Log::error('Webhook signature validation failed', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Make HTTP request to Stripe API.
     */
    protected function makeRequest(string $method, string $endpoint, ?array $data = null): array
    {
        $url = self::BASE_URL . $endpoint;
        $auth = base64_encode($this->config['api_key'] . ':');

        $response = Http::withHeaders([
            'Authorization' => "Basic {$auth}",
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])->{$method}($url, $data);

        if ($response->failed()) {
            throw new GatewayTransactionException(
                $this->getGatewayId(),
                $response->json('error.message') ?? 'API request failed',
                null,
                $response->json('error.code')
            );
        }

        return $response->json();
    }

    /**
     * Map Stripe status to our status.
     */
    protected function mapStripeStatus(string $stripeStatus): string
    {
        return match ($stripeStatus) {
            'succeeded', 'paid' => 'completed',
            'requires_payment_method', 'requires_confirmation', 'requires_action' => 'pending',
            'processing' => 'processing',
            'canceled' => 'cancelled',
            default => 'failed',
        };
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
    }

    /**
     * Validate withdrawal data.
     */
    protected function validateWithdrawalData(array $data): void
    {
        $required = ['amount', 'user_id', 'destination'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new \InvalidArgumentException("Missing required field: {$field}");
            }
        }

        if ($data['amount'] <= 0) {
            throw new \InvalidArgumentException('Amount must be greater than 0');
        }
    }

    /**
     * Create a Stripe customer.
     */
    public function createCustomer(array $data): array
    {
        $response = $this->makeRequest('POST', '/customers', [
            'email' => $data['email'],
            'name' => $data['name'] ?? null,
            'phone' => $data['phone'] ?? null,
            'metadata' => [
                'user_id' => $data['user_id'],
            ],
        ]);

        return $response;
    }

    /**
     * Attach payment method to customer.
     */
    public function attachPaymentMethod(string $paymentMethodId, string $customerId): array
    {
        return $this->makeRequest('POST', "/payment_methods/{$paymentMethodId}/attach", [
            'customer' => $customerId,
        ]);
    }
}
