<?php

declare(strict_types=1);

namespace App\Services\Banking;

use App\Models\Banking\SwiftTransfer;
use App\Models\Banking\Wallet;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * SWIFT Transfer Service
 *
 * Handles international SWIFT (MT103) transfers.
 * Supports multi-currency, exchange rates, compliance screening, and tracking.
 *
 * @package App\Services\Banking
 */
class SwiftTransferService
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_REVERSED = 'reversed';
    public const STATUS_ON_HOLD = 'on_hold';

    public const SWIFT_STATUS_INITIATED = 'initiated';
    public const SWIFT_STATUS_SENT_TO_BANK = 'sent_to_bank';
    public const SWIFT_STATUS_PROCESSING = 'processing';
    public const SWIFT_STATUS_CREDITED = 'credited';
    public const SWIFT_STATUSPAID = 'paid';
    public const SWIFT_STATUS_REJECTED = 'rejected';

    protected const MIN_AMOUNT = 100.0;
    protected const MAX_AMOUNT = 1000000.0;

    protected const BASE_FEE = 45.00;
    protected const PERCENT_FEE = 0.15;
    protected const CORRESPONDENT_FEE = 25.00;

    protected const SANCTIONED_COUNTRIES = [
        'KP', 'IR', 'SY', 'CU', 'RU', 'BY', 'MM', 'VE', 'ZW', 'AF', 'IQ', 'LB', 'LY', 'SO', 'SD',
    ];

    protected const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD'];

    protected const EXCHANGE_RATE_PROVIDER = 'exchangerate-api.com';

    /**
     * Create a new SWIFT transfer.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function createTransfer(User $user, array $data): SwiftTransfer
    {
        $this->validateTransferData($data);

        $amount = (float) $data['amount'];
        $fromCurrency = strtoupper($data['currency'] ?? 'USD');
        $toCurrency = strtoupper($data['recipient_currency'] ?? $fromCurrency);

        $this->performSanctionsScreening($user, $data);

        $wallet = $user->wallet;
        if (!$wallet) {
            throw new RuntimeException('User wallet not found');
        }

        $exchangeRate = $this->calculateExchangeRate($fromCurrency, $toCurrency);
        $fee = $this->calculateFee($amount, $toCurrency, $data);
        $totalDeduction = $amount + $fee;

        if ($wallet->balance < $totalDeduction) {
            throw new InsufficientFundsException(
                'Insufficient funds. Available: ' . $wallet->balance . ', Required: ' . $totalDeduction
            );
        }

        return DB::transaction(function () use ($user, $data, $amount, $fee, $wallet, $fromCurrency, $toCurrency, $exchangeRate) {
            $wallet->decrement('balance', $totalDeduction);

            $transfer = SwiftTransfer::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'recipient_name' => $data['recipient_name'],
                'recipient_address' => $data['recipient_address'] ?? null,
                'recipient_country' => $data['recipient_country'],
                'recipient_email' => $data['recipient_email'] ?? null,
                'recipient_phone' => $data['recipient_phone'] ?? null,
                'bank_name' => $data['bank_name'],
                'bank_address' => $data['bank_address'] ?? null,
                'bank_country' => $data['bank_country'],
                'swift_bic' => strtoupper($data['swift_bic']),
                'iban' => $data['iban'] ?? null,
                'account_number' => $data['account_number'] ?? null,
                'intermediary_bank' => $data['intermediary_bank'] ?? null,
                'intermediary_swift' => $data['intermediary_swift'] ?? null,
                'amount' => (int) round($amount * 100),
                'currency' => $fromCurrency,
                'fee' => (int) round($fee * 100),
                'exchange_rate' => $exchangeRate,
                'purpose' => $data['purpose'],
                'purpose_details' => $data['purpose_details'] ?? null,
                'status' => self::STATUS_PENDING,
                'swift_status' => self::SWIFT_STATUS_INITIATED,
                'compliance_checks' => [
                    'sanctions_checked' => true,
                    'aml_checked' => true,
                ],
            ]);

            Log::info('SWIFT transfer created', [
                'transfer_id' => $transfer->id,
                'user_id' => $user->id,
                'amount' => $amount,
                'currency' => $fromCurrency,
                'recipient_country' => $data['recipient_country'],
            ]);

            return $transfer;
        });
    }

    /**
     * Submit transfer to SWIFT network.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function submitTransfer(SwiftTransfer $transfer): void
    {
        if ($transfer->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending transfers can be submitted');
        }

        $mt103Message = $this->generateMT103($transfer);

        DB::transaction(function () use ($transfer, $mt103Message) {
            $transfer->update([
                'status' => self::STATUS_SUBMITTED,
                'swift_status' => self::SWIFT_STATUS_SENT_TO_BANK,
                'metadata' => array_merge($transfer->metadata ?? [], [
                    'mt103_message' => $mt103Message,
                    'submitted_at' => now()->toIso8601String(),
                ]),
            ]);

            Log::info('SWIFT transfer submitted', [
                'transfer_id' => $transfer->id,
                'reference_number' => $transfer->reference_number,
            ]);
        });
    }

    /**
     * Update SWIFT status from provider callback.
     */
    public function updateSwiftStatus(SwiftTransfer $transfer, string $status, ?array $trackingInfo = null): void
    {
        $swiftStatusMap = [
            'processing' => self::SWIFT_STATUS_PROCESSING,
            'credited' => self::SWIFT_STATUS_CREDITED,
            'paid' => self::SWIFT_STATUSPAID,
            'rejected' => self::SWIFT_STATUS_REJECTED,
            'failed' => self::SWIFT_STATUS_REJECTED,
        ];

        $mappedStatus = $swiftStatusMap[$status] ?? self::SWIFT_STATUS_PROCESSING;

        $transfer->updateSwiftStatus($mappedStatus, $trackingInfo);

        if ($mappedStatus === self::SWIFT_STATUSPAID) {
            $this->completeTransfer($transfer);
        } elseif ($mappedStatus === self::SWIFT_STATUS_REJECTED) {
            $this->failTransfer($transfer, $trackingInfo['reason'] ?? 'Transfer rejected by correspondent bank');
        }

        Log::info('SWIFT status updated', [
            'transfer_id' => $transfer->id,
            'status' => $mappedStatus,
        ]);
    }

    /**
     * Mark transfer as processing.
     */
    public function markAsProcessing(SwiftTransfer $transfer): void
    {
        $transfer->update([
            'status' => self::STATUS_PROCESSING,
        ]);
    }

    /**
     * Complete the transfer.
     */
    public function completeTransfer(SwiftTransfer $transfer): void
    {
        $transfer->update([
            'status' => self::STATUS_COMPLETED,
        ]);

        Log::info('SWIFT transfer completed', [
            'transfer_id' => $transfer->id,
            'reference_number' => $transfer->reference_number,
        ]);
    }

    /**
     * Fail the transfer and refund.
     */
    public function failTransfer(SwiftTransfer $transfer, string $reason): void
    {
        DB::transaction(function () use ($transfer, $reason) {
            $user = $transfer->user;
            $refundAmount = $transfer->amount / 100 + $transfer->fee / 100;

            $wallet = $user?->wallet;
            if ($wallet) {
                $wallet->increment('balance', $refundAmount);
            }

            $transfer->update([
                'status' => self::STATUS_FAILED,
                'swift_status' => self::SWIFT_STATUS_REJECTED,
                'metadata' => array_merge($transfer->metadata ?? [], [
                    'failure_reason' => $reason,
                    'refunded_at' => now()->toIso8601String(),
                ]),
            ]);

            Log::info('SWIFT transfer failed', [
                'transfer_id' => $transfer->id,
                'reason' => $reason,
            ]);
        });
    }

    /**
     * Cancel a pending transfer.
     *
     * @throws InvalidArgumentException
     */
    public function cancelTransfer(SwiftTransfer $transfer, ?string $reason = null): void
    {
        if (!in_array($transfer->status, [self::STATUS_PENDING, self::STATUS_ON_HOLD])) {
            throw new InvalidArgumentException('Only pending or on-hold transfers can be cancelled');
        }

        DB::transaction(function () use ($transfer, $reason) {
            $user = $transfer->user;
            $refundAmount = $transfer->amount / 100 + $transfer->fee / 100;

            $wallet = $user?->wallet;
            if ($wallet) {
                $wallet->increment('balance', $refundAmount);
            }

            $transfer->update([
                'status' => self::STATUS_FAILED,
                'metadata' => array_merge($transfer->metadata ?? [], [
                    'cancelled_at' => now()->toIso8601String(),
                    'cancellation_reason' => $reason,
                ]),
            ]);

            Log::info('SWIFT transfer cancelled', [
                'transfer_id' => $transfer->id,
            ]);
        });
    }

    /**
     * Put transfer on hold for compliance review.
     *
     * @throws InvalidArgumentException
     */
    public function holdTransfer(SwiftTransfer $transfer, string $reason): void
    {
        if ($transfer->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending transfers can be put on hold');
        }

        $transfer->update([
            'status' => self::STATUS_ON_HOLD,
            'metadata' => array_merge($transfer->metadata ?? [], [
                'hold_reason' => $reason,
                'held_at' => now()->toIso8601String(),
            ]),
        ]);

        Log::info('SWIFT transfer put on hold', [
            'transfer_id' => $transfer->id,
            'reason' => $reason,
        ]);
    }

    /**
     * Get tracking information.
     */
    public function getTrackingInfo(SwiftTransfer $transfer): array
    {
        return [
            'reference_number' => $transfer->reference_number,
            'status' => $transfer->status,
            'swift_status' => $transfer->swift_status,
            'amount' => $transfer->amount / 100,
            'currency' => $transfer->currency,
            'recipient' => $transfer->recipient_name,
            'recipient_bank' => $transfer->bank_name,
            'swift_bic' => $transfer->swift_bic,
            'created_at' => $transfer->created_at,
            'submitted_at' => $transfer->submitted_at,
            'processed_at' => $transfer->processed_at,
            'completed_at' => $transfer->completed_at,
            'tracking_info' => $transfer->tracking_info,
        ];
    }

    /**
     * Calculate exchange rate.
     *
     * @throws RuntimeException
     */
    public function calculateExchangeRate(string $fromCurrency, string $toCurrency): float
    {
        if ($fromCurrency === $toCurrency) {
            return 1.0;
        }

        $cachedRate = cache()->get("exchange_rate_{$fromCurrency}_{$toCurrency}");

        if ($cachedRate !== null) {
            return $cachedRate;
        }

        try {
            $response = Http::get('https://api.exchangerate-api.com/v4/latest/' . $fromCurrency);

            if ($response->successful()) {
                $data = $response->json();
                $rate = $data['rates'][$toCurrency] ?? throw new RuntimeException(
                    "Exchange rate not available for {$fromCurrency} to {$toCurrency}"
                );

                cache()->put("exchange_rate_{$fromCurrency}_{$toCurrency}", $rate, now()->addHours(1));

                return $rate;
            }
        } catch (\Throwable $e) {
            Log::warning('Failed to fetch exchange rate', [
                'from' => $fromCurrency,
                'to' => $toCurrency,
                'error' => $e->getMessage(),
            ]);
        }

        throw new RuntimeException('Unable to calculate exchange rate. Please try again later.');
    }

    /**
     * Calculate transfer fee.
     */
    public function calculateFee(float $amount, string $currency, array $data = []): float
    {
        $baseFee = self::BASE_FEE;
        $percentFee = $amount * (self::PERCENT_FEE / 100);
        $correspondentFee = !empty($data['intermediary_bank']) ? self::CORRESPONDENT_FEE : 0;

        $urgentFee = ($data['is_urgent'] ?? false) ? 50.0 : 0.0;

        return round($baseFee + $percentFee + $correspondentFee + $urgentFee, 2);
    }

    /**
     * Validate transfer data.
     *
     * @throws InvalidArgumentException
     */
    protected function validateTransferData(array $data): void
    {
        $required = [
            'recipient_name',
            'recipient_country',
            'bank_name',
            'bank_country',
            'swift_bic',
            'amount',
            'purpose',
        ];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }

        if ($data['amount'] < self::MIN_AMOUNT) {
            throw new InvalidArgumentException(
                'Minimum transfer amount is ' . self::MIN_AMOUNT
            );
        }

        if ($data['amount'] > self::MAX_AMOUNT) {
            throw new InvalidArgumentException(
                'Maximum transfer amount is ' . self::MAX_AMOUNT
            );
        }

        $currency = strtoupper($data['currency'] ?? 'USD');
        if (!in_array($currency, self::SUPPORTED_CURRENCIES)) {
            throw new InvalidArgumentException(
                'Currency not supported. Supported: ' . implode(', ', self::SUPPORTED_CURRENCIES)
            );
        }

        $this->validateSwiftBic($data['swift_bic']);

        if (!empty($data['iban'])) {
            $this->validateIban($data['iban']);
        }
    }

    /**
     * Validate SWIFT/BIC code.
     *
     * @throws InvalidArgumentException
     */
    protected function validateSwiftBic(string $bic): void
    {
        $bic = strtoupper($bic);

        if (strlen($bic) !== 8 && strlen($bic) !== 11) {
            throw new InvalidArgumentException('SWIFT/BIC code must be 8 or 11 characters');
        }

        if (!preg_match('/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/', $bic)) {
            throw new InvalidArgumentException('Invalid SWIFT/BIC code format');
        }
    }

    /**
     * Validate IBAN.
     *
     * @throws InvalidArgumentException
     */
    protected function validateIban(string $iban): void
    {
        $iban = strtoupper(str_replace(' ', '', $iban));

        if (strlen($iban) < 15 || strlen($iban) > 34) {
            throw new InvalidArgumentException('Invalid IBAN length');
        }

        if (!preg_match('/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/', $iban)) {
            throw new InvalidArgumentException('Invalid IBAN format');
        }
    }

    /**
     * Perform sanctions screening.
     *
     * @throws ComplianceException
     */
    protected function performSanctionsScreening(User $user, array $data): void
    {
        $recipientCountry = strtoupper($data['recipient_country'] ?? '');
        $bankCountry = strtoupper($data['bank_country'] ?? '');

        if (in_array($recipientCountry, self::SANCTIONED_COUNTRIES)) {
            throw new ComplianceException(
                'Transfers to this destination are not allowed due to sanctions regulations'
            );
        }

        if (in_array($bankCountry, self::SANCTIONED_COUNTRIES)) {
            throw new ComplianceException(
                'Transfers via this bank are not allowed due to sanctions regulations'
            );
        }

        if (($data['amount'] ?? 0) > 50000) {
            Log::warning('Large SWIFT transfer requires enhanced due diligence', [
                'user_id' => $user->id,
                'amount' => $data['amount'],
            ]);
        }
    }

    /**
     * Generate MT103 message.
     */
    protected function generateMT103(SwiftTransfer $transfer): string
    {
        $message = [
            '{1:F01' . $transfer->swift_bic . 'ABCDUS33XXX}',
            '{2:I103' . strtoupper($transfer->swift_bic) . 'N}',
            ':20:' . $transfer->reference_number,
            ':23B:' . ($transfer->currency === 'USD' ? 'CRED' : 'CREST'),
            ':32A:' . now()->format('ymd') . $transfer->currency . str_pad((string) $transfer->amount, 16, '0', STR_PAD_LEFT),
            ':33B:' . $transfer->currency . str_pad((string) $transfer->amount, 16, '0', STR_PAD_LEFT),
            ':50K:/' . ($transfer->user->account_number ?? $transfer->user_id),
            $transfer->user->name,
            ':52A:/' . config('app.swift_code', 'ABCDUS33'),
            ':53A:/' . config('app.correspondent_bank', 'CHASUS33'),
            ':57A:/' . $transfer->swift_bic,
            ':59:/' . ($transfer->iban ?? $transfer->account_number),
            $transfer->recipient_name,
            ':70:' . ($transfer->purpose_details ?? $transfer->purpose),
            ':71A:' . 'OUR',
            '-}',
        ];

        return implode("\n", $message);
    }

    /**
     * Get transfer by ID.
     */
    public function getTransfer(int $transferId): ?SwiftTransfer
    {
        return SwiftTransfer::find($transferId);
    }

    /**
     * Get transfers for user.
     */
    public function getUserTransfers(User $user, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = SwiftTransfer::where('user_id', $user->id);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['currency'])) {
            $query->where('currency', $filters['currency']);
        }

        return $query->orderByDesc('created_at')->get();
    }

    /**
     * Get supported currencies.
     */
    public function getSupportedCurrencies(): array
    {
        return self::SUPPORTED_CURRENCIES;
    }
}
