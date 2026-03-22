<?php

namespace App\Services\Payment;

use App\Contracts\Payment\GatewayResult;
use App\Contracts\Payment\GatewayTransactionException;
use App\Contracts\Payment\PaymentGatewayInterface;
use App\Services\Payment\Gateways\CryptoGateway;
use App\Services\Payment\Gateways\ManualGateway;
use App\Services\Payment\Gateways\StripeGateway;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

/**
 * Payment Gateway Manager
 *
 * Manages all payment gateway implementations and provides
 * a unified interface for payment operations.
 *
 * @package App\Services\Payment
 */
class GatewayManager
{
    protected const CACHE_KEY = 'payment_gateways';
    protected const CACHE_TTL = 3600;

    /**
     * @var array<string, PaymentGatewayInterface>
     */
    protected array $gateways = [];

    /**
     * @var array<string, array>
     */
    protected array $config;

    public function __construct()
    {
        $this->config = config('payment.gateways', []);
        $this->initializeGateways();
    }

    /**
     * Initialize all configured gateways.
     */
    protected function initializeGateways(): void
    {
        $this->gateways['stripe'] = new StripeGateway(
            $this->config['stripe'] ?? []
        );

        $this->gateways['crypto'] = new CryptoGateway(
            $this->config['crypto'] ?? []
        );

        $this->gateways['manual'] = new ManualGateway(
            $this->config['manual'] ?? []
        );

        Log::info('Payment gateways initialized', [
            'gateways' => array_keys($this->gateways),
        ]);
    }

    /**
     * Get a gateway by ID.
     *
     * @throws InvalidArgumentException
     */
    public function gateway(string $gatewayId): PaymentGatewayInterface
    {
        $gatewayId = strtolower($gatewayId);

        if (!isset($this->gateways[$gatewayId])) {
            throw new InvalidArgumentException("Gateway [{$gatewayId}] is not registered");
        }

        $gateway = $this->gateways[$gatewayId];

        if (!$gateway->isEnabled()) {
            throw new InvalidArgumentException("Gateway [{$gatewayId}] is not enabled");
        }

        return $gateway;
    }

    /**
     * Check if a gateway exists and is enabled.
     */
    public function hasGateway(string $gatewayId): bool
    {
        $gatewayId = strtolower($gatewayId);

        return isset($this->gateways[$gatewayId])
            && $this->gateways[$gatewayId]->isEnabled();
    }

    /**
     * Get all enabled gateways.
     *
     * @return array<string, PaymentGatewayInterface>
     */
    public function getEnabledGateways(): array
    {
        return array_filter(
            $this->gateways,
            fn (PaymentGatewayInterface $gateway) => $gateway->isEnabled()
        );
    }

    /**
     * Get gateway options for display.
     *
     * @return array<int, array{name: string, id: string, type: string}>
     */
    public function getGatewayOptions(): array
    {
        $options = [];

        foreach ($this->getEnabledGateways() as $id => $gateway) {
            $options[] = [
                'id' => $id,
                'name' => $gateway->getGatewayName(),
                'type' => $this->getGatewayType($id),
            ];
        }

        return $options;
    }

    /**
     * Process deposit through specified gateway.
     */
    public function processDeposit(
        string $gatewayId,
        array $data
    ): GatewayResult {
        $gateway = $this->gateway($gatewayId);

        $fees = $gateway->calculateFees($data['amount'], $data['currency'] ?? 'USD');
        $data['fees'] = $fees;

        $result = $gateway->processDeposit($data);

        Log::info('Deposit processed', [
            'gateway' => $gatewayId,
            'success' => $result->success,
            'amount' => $data['amount'],
            'transaction_id' => $result->transactionId,
        ]);

        return $result;
    }

    /**
     * Process withdrawal through specified gateway.
     */
    public function processWithdrawal(
        string $gatewayId,
        array $data
    ): GatewayResult {
        $gateway = $this->gateway($gatewayId);

        $fees = $gateway->calculateFees($data['amount'], $data['currency'] ?? 'USD');
        $data['fees'] = $fees;

        $result = $gateway->processWithdrawal($data);

        Log::info('Withdrawal processed', [
            'gateway' => $gatewayId,
            'success' => $result->success,
            'amount' => $data['amount'],
            'transaction_id' => $result->transactionId,
        ]);

        return $result;
    }

    /**
     * Verify transaction status.
     */
    public function verifyTransaction(
        string $gatewayId,
        string $transactionId
    ): GatewayResult {
        $gateway = $this->gateway($gatewayId);

        return $gateway->verifyTransaction($transactionId);
    }

    /**
     * Handle webhook from gateway.
     */
    public function handleWebhook(
        string $gatewayId,
        array $payload,
        ?string $signature = null
    ): \App\Contracts\Payment\WebhookResult {
        $gateway = $this->gateway($gatewayId);

        if ($signature !== null && !$gateway->validateWebhookSignature(
            json_encode($payload),
            $signature
        )) {
            Log::warning('Invalid webhook signature', [
                'gateway' => $gatewayId,
            ]);

            return \App\Contracts\Payment\WebhookResult::failure('Invalid signature');
        }

        return $gateway->handleWebhook($payload);
    }

    /**
     * Calculate fees across all gateways.
     *
     * @return array<string, array{gateway_fee: int, our_fee: int, total: int}>
     */
    public function calculateFees(float $amount, string $currency = 'USD'): array
    {
        $fees = [];

        foreach ($this->getEnabledGateways() as $id => $gateway) {
            $fees[$id] = $gateway->calculateFees($amount, $currency);
        }

        return $fees;
    }

    /**
     * Get best gateway for amount.
     */
    public function getBestGateway(
        float $amount,
        string $type = 'deposit'
    ): string {
        $gateways = $this->getEnabledGateways();

        if (empty($gateways)) {
            throw new InvalidArgumentException('No enabled gateways available');
        }

        $bestGateway = null;
        $lowestFee = PHP_INT_MAX;

        foreach ($gateways as $id => $gateway) {
            $fees = $gateway->calculateFees($amount);
            
            if ($fees['total'] < $lowestFee) {
                $lowestFee = $fees['total'];
                $bestGateway = $id;
            }
        }

        return $bestGateway ?? array_key_first($gateways);
    }

    /**
     * Get gateway type.
     */
    protected function getGatewayType(string $gatewayId): string
    {
        return match ($gatewayId) {
            'stripe' => 'card',
            'crypto' => 'crypto',
            'manual' => 'manual',
            default => 'unknown',
        };
    }

    /**
     * Magic method to call gateway methods directly.
     */
    public function __call(string $method, array $args): mixed
    {
        $gatewayId = $args[0] ?? null;
        
        if ($gatewayId === null) {
            throw new InvalidArgumentException('Gateway ID is required');
        }

        array_shift($args);

        $gateway = $this->gateway($gatewayId);

        if (!method_exists($gateway, $method)) {
            throw new InvalidArgumentException(
                "Method [{$method}] does not exist on gateway [{$gatewayId}]"
            );
        }

        return $gateway->{$method}(...$args);
    }

    /**
     * Get cached gateway config.
     */
    public function getCachedConfig(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return $this->config;
        });
    }

    /**
     * Clear gateway cache.
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
