<?php

namespace App\Services\Payment\Gateways;

use App\Contracts\Payment\GatewayResult;
use App\Contracts\Payment\GatewayTransactionException;
use App\Contracts\Payment\PaymentGatewayInterface;
use App\Contracts\Payment\WebhookResult;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Crypto Wallet Gateway Implementation
 *
 * Handles cryptocurrency payments (BTC, ETH, USDT, etc.).
 * Supports: deposits via wallet addresses, withdrawals to external addresses
 *
 * @package App\Services\Payment\Gateways
 */
class CryptoGateway implements PaymentGatewayInterface
{
    protected const SUPPORTED_COINS = ['BTC', 'ETH', 'USDT', 'USDC', 'TRX'];
    protected const CONFIRMATION_THRESHOLDS = [
        'BTC' => 3,
        'ETH' => 12,
        'USDT' => 15,
        'USDC' => 15,
        'TRX' => 19,
    ];

    public function __construct(
        protected array $config
    ) {}

    /**
     * Get gateway identifier.
     */
    public function getGatewayId(): string
    {
        return 'crypto';
    }

    /**
     * Get gateway display name.
     */
    public function getGatewayName(): string
    {
        return 'Cryptocurrency';
    }

    /**
     * Check if gateway is enabled and configured.
     */
    public function isEnabled(): bool
    {
        return ($this->config['enabled'] ?? false) === true
            && !empty($this->config['webhook_url']);
    }

    /**
     * Process a crypto deposit (generate deposit address).
     */
    public function processDeposit(array $data): GatewayResult
    {
        $this->validateDepositData($data);

        try {
            $coin = strtoupper($data['coin']);
            
            if (!in_array($coin, self::SUPPORTED_COINS, true)) {
                return GatewayResult::failure(
                    errorCode: 'unsupported_coin',
                    errorMessage: "Unsupported cryptocurrency: {$coin}"
                );
            }

            $depositAddress = $this->generateDepositAddress($coin, $data['user_id']);

            return GatewayResult::success(
                transactionId: $depositAddress['id'],
                status: 'pending',
                message: 'Deposit address generated',
                data: [
                    'address' => $depositAddress['address'],
                    'coin' => $coin,
                    'network' => $depositAddress['network'] ?? $coin,
                    'qr_code' => $depositAddress['qr_code'] ?? null,
                    'tag' => $depositAddress['tag'] ?? null,
                ]
            );
        } catch (\Throwable $e) {
            Log::error('Crypto deposit address generation failed', [
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
     * Process a crypto withdrawal.
     */
    public function processWithdrawal(array $data): GatewayResult
    {
        $this->validateWithdrawalData($data);

        try {
            $coin = strtoupper($data['coin']);
            $amount = (float) $data['amount'];
            $toAddress = $data['to_address'];

            if (!in_array($coin, self::SUPPORTED_COINS, true)) {
                return GatewayResult::failure(
                    errorCode: 'unsupported_coin',
                    errorMessage: "Unsupported cryptocurrency: {$coin}"
                );
            }

            $networkFee = $this->getNetworkFee($coin);
            $amountCents = $this->cryptoToCents($amount, $coin);
            $feeCents = $this->cryptoToCents($networkFee, $coin);

            if ($amountCents <= $feeCents) {
                return GatewayResult::failure(
                    errorCode: 'insufficient_amount',
                    errorMessage: 'Amount must be greater than network fee'
                );
            }

            $withdrawal = $this->initiateWithdrawal([
                'coin' => $coin,
                'to_address' => $toAddress,
                'amount' => $amount,
                'user_id' => $data['user_id'],
                'reference' => $data['reference'],
            ]);

            return GatewayResult::success(
                transactionId: $withdrawal['id'],
                status: 'pending',
                message: 'Withdrawal initiated',
                data: [
                    'coin' => $coin,
                    'to_address' => $toAddress,
                    'amount' => $amount,
                    'network_fee' => $networkFee,
                    'confirmations_required' => self::CONFIRMATION_THRESHOLDS[$coin] ?? 6,
                ]
            );
        } catch (\Throwable $e) {
            Log::error('Crypto withdrawal failed', [
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
            $response = $this->queryTransaction($transactionId);

            $status = match ($response['status'] ?? 'unknown') {
                'confirmed', 'completed' => 'completed',
                'failed', 'rejected' => 'failed',
                default => 'pending',
            };

            return GatewayResult::success(
                transactionId: $transactionId,
                status: $status,
                message: "Transaction status: {$status}",
                data: [
                    'confirmations' => $response['confirmations'] ?? 0,
                    'required_confirmations' => self::CONFIRMATION_THRESHOLDS[$response['coin'] ?? 'BTC'] ?? 6,
                    'amount' => $response['amount'] ?? null,
                    'from_address' => $response['from_address'] ?? null,
                    'to_address' => $response['to_address'] ?? null,
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
     * Handle webhook from crypto provider.
     */
    public function handleWebhook(array $payload): WebhookResult
    {
        $eventType = $payload['type'] ?? 'unknown';
        $data = $payload['data'] ?? [];

        $transactionId = $data['id'] ?? $data['txid'] ?? null;
        $status = $data['status'] ?? 'unknown';

        $mappedStatus = match ($status) {
            'confirmed', 'completed' => 'completed',
            'failed', 'rejected' => 'failed',
            'processing', 'pending' => 'pending',
            default => 'pending',
        };

        return WebhookResult::success(
            eventType: $eventType,
            transactionId: $transactionId,
            status: $mappedStatus,
            data: $data
        );
    }

    /**
     * Calculate transaction fees.
     */
    public function calculateFees(float $amount, string $currency = 'USD'): array
    {
        $amountCents = (int) round($amount * 100);
        
        $networkFee = $this->estimateNetworkFee($currency);
        
        $ourFee = (int) round($amountCents * 0.005);

        return [
            'gateway_fee' => $networkFee,
            'our_fee' => $ourFee,
            'total' => $networkFee + $ourFee,
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
            return false;
        }
    }

    /**
     * Get supported cryptocurrencies.
     */
    public function getSupportedCoins(): array
    {
        return self::SUPPORTED_COINS;
    }

    /**
     * Get current exchange rate.
     */
    public function getExchangeRate(string $coin, string $fiat = 'USD'): float
    {
        try {
            $response = Http::get("https://api.coingecko.com/api/v3/simple/price", [
                'ids' => $this->getCoinGeckoId($coin),
                'vs_currencies' => strtolower($fiat),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data[$this->getCoinGeckoId($coin)][strtolower($fiat)] ?? 0;
            }
        } catch (\Throwable $e) {
            Log::error('Failed to fetch exchange rate', [
                'coin' => $coin,
                'error' => $e->getMessage(),
            ]);
        }

        return 0;
    }

    /**
     * Get confirmation threshold for coin.
     */
    public function getConfirmationThreshold(string $coin): int
    {
        return self::CONFIRMATION_THRESHOLDS[strtoupper($coin)] ?? 6;
    }

    /**
     * Generate deposit address.
     */
    protected function generateDepositAddress(string $coin, int $userId): array
    {
        $addressData = [
            'id' => Str::uuid()->toString(),
            'address' => $this->config['base_address'] . Str::random(20),
            'coin' => $coin,
            'network' => $this->getNetworkForCoin($coin),
            'tag' => in_array($coin, ['USDT', 'USDC']) ? Str::random(32) : null,
        ];

        Log::info('Crypto deposit address generated', [
            'coin' => $coin,
            'user_id' => $userId,
            'address' => $addressData['address'],
        ]);

        return $addressData;
    }

    /**
     * Initiate withdrawal.
     */
    protected function initiateWithdrawal(array $data): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'status' => 'pending',
            'coin' => $data['coin'],
            'to_address' => $data['to_address'],
            'amount' => $data['amount'],
        ];
    }

    /**
     * Query transaction status.
     */
    protected function queryTransaction(string $transactionId): array
    {
        return [
            'id' => $transactionId,
            'status' => 'pending',
            'confirmations' => 0,
        ];
    }

    /**
     * Get network fee estimate.
     */
    protected function getNetworkFee(string $coin): float
    {
        return match ($coin) {
            'BTC' => 0.0001,
            'ETH' => 0.002,
            'USDT' => 1,
            'USDC' => 1,
            'TRX' => 1,
            default => 0.0001,
        };
    }

    /**
     * Estimate network fee in cents.
     */
    protected function estimateNetworkFee(string $currency): int
    {
        return match ($currency) {
            'BTC' => 500,
            'ETH' => 1000,
            default => 100,
        };
    }

    /**
     * Convert crypto to cents.
     */
    protected function cryptoToCents(float $amount, string $coin): int
    {
        $rate = $this->getExchangeRate($coin);
        return (int) round($amount * $rate * 100);
    }

    /**
     * Get network for coin.
     */
    protected function getNetworkForCoin(string $coin): string
    {
        return match ($coin) {
            'BTC' => 'Bitcoin',
            'ETH' => 'Ethereum',
            'USDT', 'USDC' => 'TRC20',
            'TRX' => 'TRC20',
            default => 'Unknown',
        };
    }

    /**
     * Get CoinGecko ID for coin.
     */
    protected function getCoinGeckoId(string $coin): string
    {
        return match ($coin) {
            'BTC' => 'bitcoin',
            'ETH' => 'ethereum',
            'USDT' => 'tether',
            'USDC' => 'usd-coin',
            'TRX' => 'tron',
            default => strtolower($coin),
        };
    }

    /**
     * Validate deposit data.
     */
    protected function validateDepositData(array $data): void
    {
        if (empty($data['coin'])) {
            throw new \InvalidArgumentException('Coin is required');
        }

        if (empty($data['user_id'])) {
            throw new \InvalidArgumentException('User ID is required');
        }
    }

    /**
     * Validate withdrawal data.
     */
    protected function validateWithdrawalData(array $data): void
    {
        $required = ['coin', 'amount', 'to_address', 'user_id'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new \InvalidArgumentException("Missing required field: {$field}");
            }
        }

        if ($data['amount'] <= 0) {
            throw new \InvalidArgumentException('Amount must be greater than 0');
        }
    }
}
