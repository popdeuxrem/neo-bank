<?php

namespace App\Services\Core;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use RuntimeException;

/**
 * Currency Service
 *
 * Handles multi-currency operations including:
 * - Currency conversion rates
 * - Fiat and crypto currency support
 * - Exchange rate fetching and caching
 * - Currency formatting
 */
class CurrencyService
{
    protected const CACHE_TTL = 300;

    protected const SUPPORTED_FIAT = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'NGN'];

    protected const SUPPORTED_CRYPTO = ['BTC', 'ETH', 'USDT', 'USDC', 'TRX', 'BNB', 'SOL', 'XRP'];

    protected array $rates = [];

    protected string $baseCurrency = 'USD';

    public function __construct()
    {
        $this->baseCurrency = config('currency.base', 'USD');
    }

    /**
     * Get exchange rate between two currencies.
     *
     * @throws InvalidArgumentException
     */
    public function getRate(string $from, string $to): float
    {
        $from = strtoupper($from);
        $to = strtoupper($to);

        if ($from === $to) {
            return 1.0;
        }

        $this->loadRates($from);

        if (! isset($this->rates[$to])) {
            throw new InvalidArgumentException("Currency {$to} is not supported");
        }

        return $this->rates[$to];
    }

    /**
     * Convert amount from one currency to another.
     *
     * @throws InvalidArgumentException
     */
    public function convert(float $amount, string $from, string $to): int
    {
        if ($amount < 0) {
            throw new InvalidArgumentException('Amount must be non-negative');
        }

        $rate = $this->getRate($from, $to);

        return (int) round($amount * $rate * 100);
    }

    /**
     * Convert amount with decimal result.
     */
    public function convertDecimal(float $amount, string $from, string $to): float
    {
        return $amount * $this->getRate($from, $to);
    }

    /**
     * Get all supported currencies.
     */
    public function getSupportedCurrencies(): array
    {
        return [
            'fiat' => array_map(fn ($code) => $this->getCurrencyInfo($code), self::SUPPORTED_FIAT),
            'crypto' => array_map(fn ($code) => $this->getCurrencyInfo($code), self::SUPPORTED_CRYPTO),
        ];
    }

    /**
     * Get supported fiat currencies.
     */
    public function getFiatCurrencies(): array
    {
        return array_map(fn ($code) => $this->getCurrencyInfo($code), self::SUPPORTED_FIAT);
    }

    /**
     * Get supported crypto currencies.
     */
    public function getCryptoCurrencies(): array
    {
        return array_map(fn ($code) => $this->getCurrencyInfo($code), self::SUPPORTED_CRYPTO);
    }

    /**
     * Check if currency is supported.
     */
    public function isSupported(string $currency): bool
    {
        $currency = strtoupper($currency);

        return in_array($currency, self::SUPPORTED_FIAT, true)
            || in_array($currency, self::SUPPORTED_CRYPTO, true);
    }

    /**
     * Check if currency is fiat.
     */
    public function isFiat(string $currency): bool
    {
        return in_array(strtoupper($currency), self::SUPPORTED_FIAT, true);
    }

    /**
     * Check if currency is crypto.
     */
    public function isCrypto(string $currency): bool
    {
        return in_array(strtoupper($currency), self::SUPPORTED_CRYPTO, true);
    }

    /**
     * Get currency info.
     */
    public function getCurrencyInfo(string $currency): array
    {
        $currency = strtoupper($currency);

        $fiatInfo = [
            'USD' => ['name' => 'US Dollar', 'symbol' => '$', 'flag' => '🇺🇸'],
            'EUR' => ['name' => 'Euro', 'symbol' => '€', 'flag' => '🇪🇺'],
            'GBP' => ['name' => 'British Pound', 'symbol' => '£', 'flag' => '🇬🇧'],
            'JPY' => ['name' => 'Japanese Yen', 'symbol' => '¥', 'flag' => '🇯🇵'],
            'CAD' => ['name' => 'Canadian Dollar', 'symbol' => 'C$', 'flag' => '🇨🇦'],
            'AUD' => ['name' => 'Australian Dollar', 'symbol' => 'A$', 'flag' => '🇦🇺'],
            'CHF' => ['name' => 'Swiss Franc', 'symbol' => 'CHF', 'flag' => '🇨🇭'],
            'CNY' => ['name' => 'Chinese Yuan', 'symbol' => '¥', 'flag' => '🇨🇳'],
            'INR' => ['name' => 'Indian Rupee', 'symbol' => '₹', 'flag' => '🇮🇳'],
            'NGN' => ['name' => 'Nigerian Naira', 'symbol' => '₦', 'flag' => '🇳🇬'],
        ];

        $cryptoInfo = [
            'BTC' => ['name' => 'Bitcoin', 'symbol' => '₿', 'network' => 'Bitcoin'],
            'ETH' => ['name' => 'Ethereum', 'symbol' => 'Ξ', 'network' => 'Ethereum'],
            'USDT' => ['name' => 'Tether', 'symbol' => '₮', 'network' => 'TRC20/ERC20'],
            'USDC' => ['name' => 'USD Coin', 'symbol' => '$', 'network' => 'TRC20/ERC20'],
            'TRX' => ['name' => 'Tron', 'symbol' => '⨎', 'network' => 'TRON'],
            'BNB' => ['name' => 'Binance Coin', 'symbol' => 'BNB', 'network' => 'BNB Chain'],
            'SOL' => ['name' => 'Solana', 'symbol' => 'SOL', 'network' => 'Solana'],
            'XRP' => ['name' => 'Ripple', 'symbol' => 'XRP', 'network' => 'XRP Ledger'],
        ];

        $info = $fiatInfo[$currency] ?? $cryptoInfo[$currency] ?? [];

        return array_merge([
            'code' => $currency,
            'type' => $this->isFiat($currency) ? 'fiat' : 'crypto',
        ], $info);
    }

    /**
     * Format amount with currency symbol.
     */
    public function format(float $amount, string $currency, bool $showSymbol = true): string
    {
        $info = $this->getCurrencyInfo($currency);
        $symbol = $info['symbol'] ?? $currency;

        $formatted = number_format($amount, 2, '.', ',');

        return $showSymbol ? "{$symbol}{$formatted}" : $formatted;
    }

    /**
     * Format amount with currency code.
     */
    public function formatWithCode(float $amount, string $currency): string
    {
        return number_format($amount, 2, '.', ',').' '.strtoupper($currency);
    }

    /**
     * Parse formatted amount to integer cents.
     */
    public function parse(string $formattedAmount, string $currency): int
    {
        $cleaned = preg_replace('/[^0-9.]/', '', $formattedAmount);

        return (int) round((float) $cleaned * 100);
    }

    /**
     * Get exchange rates for base currency.
     */
    public function getRates(?string $base = null): array
    {
        $base = $base ?? $this->baseCurrency;

        $this->loadRates($base);

        return $this->rates;
    }

    /**
     * Get multiple conversion rates.
     */
    public function getMultipleRates(string $from, array $to): array
    {
        $results = [];

        foreach ($to as $currency) {
            try {
                $results[$currency] = $this->getRate($from, $currency);
            } catch (InvalidArgumentException) {
                $results[$currency] = null;
            }
        }

        return $results;
    }

    /**
     * Get user's preferred currency or default.
     */
    public function getUserCurrency(?string $preference = null): string
    {
        if ($preference && $this->isSupported($preference)) {
            return strtoupper($preference);
        }

        return $this->baseCurrency;
    }

    /**
     * Refresh exchange rates from external API.
     */
    public function refreshRates(): void
    {
        $this->rates = [];
        $this->fetchRatesFromApi($this->baseCurrency);
    }

    /**
     * Load rates for base currency.
     */
    protected function loadRates(string $base): void
    {
        if (! empty($this->rates)) {
            return;
        }

        $cacheKey = "currency_rates_{$base}";

        $this->rates = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($base) {
            return $this->fetchRatesFromApi($base);
        });
    }

    /**
     * Fetch rates from external API.
     *
     * @throws RuntimeException
     */
    protected function fetchRatesFromApi(string $base): array
    {
        try {
            $fiatRates = $this->fetchFiatRates($base);
            $cryptoRates = $this->fetchCryptoRates($base);

            return array_merge([$base => 1.0], $fiatRates, $cryptoRates);
        } catch (\Throwable $e) {
            throw new RuntimeException("Failed to fetch exchange rates: {$e->getMessage()}");
        }
    }

    /**
     * Fetch fiat exchange rates.
     */
    protected function fetchFiatRates(string $base): array
    {
        $rates = [];

        try {
            $response = Http::get('https://api.exchangerate-api.com/v4/latest/'.$base);

            if ($response->successful()) {
                $data = $response->json();

                foreach (self::SUPPORTED_FIAT as $currency) {
                    if (isset($data['rates'][$currency])) {
                        $rates[$currency] = (float) $data['rates'][$currency];
                    }
                }
            }
        } catch (\Throwable) {
            $rates = $this->getFallbackRates($base);
        }

        return $rates;
    }

    /**
     * Fetch crypto exchange rates.
     */
    protected function fetchCryptoRates(string $base): array
    {
        $rates = [];

        if ($base === 'USD' || $base === 'USDT') {
            try {
                $response = Http::get('https://api.coingecko.com/api/v3/simple/price', [
                    'ids' => 'bitcoin,ethereum,tether,usd-coin,tron,bnb,solana,ripple',
                    'vs_currencies' => 'usd',
                ]);

                if ($response->successful()) {
                    $data = $response->json();

                    $mapping = [
                        'bitcoin' => 'BTC',
                        'ethereum' => 'ETH',
                        'tether' => 'USDT',
                        'usd-coin' => 'USDC',
                        'tron' => 'TRX',
                        'bnb' => 'BNB',
                        'solana' => 'SOL',
                        'ripple' => 'XRP',
                    ];

                    foreach ($mapping as $id => $code) {
                        if (isset($data[$id]['usd'])) {
                            $rates[$code] = 1 / $data[$id]['usd'];
                        }
                    }
                }
            } catch (\Throwable) {
                // Fallback rates will be used
            }
        }

        return $rates;
    }

    /**
     * Get fallback rates if API fails.
     */
    protected function getFallbackRates(string $base): array
    {
        $fallbacks = [
            'USD' => 1.0,
            'EUR' => 0.92,
            'GBP' => 0.79,
            'JPY' => 149.50,
            'CAD' => 1.36,
            'AUD' => 1.53,
            'CHF' => 0.88,
            'CNY' => 7.24,
            'INR' => 83.12,
            'NGN' => 1550.00,
        ];

        if ($base === 'USD') {
            return $fallbacks;
        }

        $baseRate = $fallbacks[$base] ?? 1.0;

        $converted = [];
        foreach ($fallbacks as $currency => $rate) {
            $converted[$currency] = $rate / $baseRate;
        }

        return $converted;
    }
}
