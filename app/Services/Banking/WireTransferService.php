<?php

declare(strict_types=1);

namespace App\Services\Banking;

use App\Models\Banking\WireTransfer;
use App\Models\Banking\Wallet;
use App\Models\User;
use App\Models\Ledger\Account;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Wire Transfer Service
 *
 * Handles domestic and international wire transfer operations.
 * Supports fee calculation, compliance checks, and status tracking.
 *
 * @package App\Services\Banking
 */
class WireTransferService
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_ON_HOLD = 'on_hold';

    protected const MIN_AMOUNT = 10.0;
    protected const MAX_AMOUNT = 500000.0;

    protected const DOMESTIC_FEE_FIXED = 15.00;
    protected const DOMESTIC_FEE_PERCENT = 0.1;
    protected const INTERNATIONAL_FEE_FIXED = 35.00;
    protected const INTERNATIONAL_FEE_PERCENT = 0.25;

    protected const HIGH_RISK_COUNTRIES = [
        'KP', 'IR', 'SY', 'CU', 'RU', 'BY', 'MM', 'VE', 'ZW',
    ];

    /**
     * Create a new wire transfer.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function createTransfer(User $user, array $data): WireTransfer
    {
        $this->validateTransferData($data);

        $amount = (float) $data['amount'];
        $destinationCountry = $data['bank_country'] ?? $data['recipient_country'] ?? 'US';
        $isInternational = $this->isInternationalTransfer($destinationCountry);

        $this->performComplianceChecks($user, $data, $destinationCountry);

        $wallet = $user->wallet;
        if (!$wallet) {
            throw new RuntimeException('User wallet not found');
        }

        $fee = $this->calculateFee($amount, $isInternational);
        $totalDeduction = $amount + $fee;

        if ($wallet->balance < $totalDeduction) {
            throw new InsufficientFundsException(
                'Insufficient funds. Available: ' . $wallet->balance . ', Required: ' . $totalDeduction
            );
        }

        return DB::transaction(function () use ($user, $data, $amount, $fee, $wallet, $isInternational) {
            $wallet->decrement('balance', $totalDeduction);

            $transfer = WireTransfer::create([
                'user_id' => $user->id,
                'from_account_id' => $data['from_account_id'] ?? null,
                'recipient_name' => $data['recipient_name'],
                'recipient_address' => $data['recipient_address'] ?? null,
                'bank_name' => $data['bank_name'],
                'bank_country' => $data['bank_country'] ?? 'US',
                'swift_bic' => $data['swift_bic'] ?? null,
                'account_number' => $data['account_number'],
                'amount' => $amount,
                'currency' => $data['currency'] ?? 'USD',
                'fee' => $fee,
                'purpose' => $data['purpose'],
                'status' => self::STATUS_PENDING,
                'tracking_number' => $this->generateTrackingNumber(),
            ]);

            Log::info('Wire transfer created', [
                'transfer_id' => $transfer->id,
                'user_id' => $user->id,
                'amount' => $amount,
                'is_international' => $isInternational,
            ]);

            return $transfer;
        });
    }

    /**
     * Submit transfer for processing.
     *
     * @throws InvalidArgumentException
     */
    public function submitTransfer(WireTransfer $transfer): void
    {
        if ($transfer->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending transfers can be submitted');
        }

        $transfer->update(['status' => self::STATUS_SUBMITTED]);

        Log::info('Wire transfer submitted', [
            'transfer_id' => $transfer->id,
            'tracking_number' => $transfer->tracking_number,
        ]);
    }

    /**
     * Mark transfer as processing.
     */
    public function markAsProcessing(WireTransfer $transfer): void
    {
        $transfer->update(['status' => self::STATUS_PROCESSING]);
    }

    /**
     * Complete the transfer.
     */
    public function completeTransfer(WireTransfer $transfer): void
    {
        $transfer->update(['status' => self::STATUS_COMPLETED]);

        Log::info('Wire transfer completed', [
            'transfer_id' => $transfer->id,
            'tracking_number' => $transfer->tracking_number,
        ]);
    }

    /**
     * Fail the transfer and refund.
     */
    public function failTransfer(WireTransfer $transfer, string $reason): void
    {
        DB::transaction(function () use ($transfer, $reason) {
            $user = $transfer->user;
            $refundAmount = $transfer->amount + $transfer->fee;

            $wallet = $user?->wallet;
            if ($wallet) {
                $wallet->increment('balance', $refundAmount);
            }

            $transfer->update([
                'status' => self::STATUS_FAILED,
                'metadata' => array_merge($transfer->metadata ?? [], [
                    'failure_reason' => $reason,
                    'refunded_at' => now()->toIso8601String(),
                ]),
            ]);

            Log::info('Wire transfer failed', [
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
    public function cancelTransfer(WireTransfer $transfer, ?string $reason = null): void
    {
        if (!in_array($transfer->status, [self::STATUS_PENDING, self::STATUS_ON_HOLD])) {
            throw new InvalidArgumentException('Only pending or on-hold transfers can be cancelled');
        }

        DB::transaction(function () use ($transfer, $reason) {
            $user = $transfer->user;
            $refundAmount = $transfer->amount + $transfer->fee;

            $wallet = $user?->wallet;
            if ($wallet) {
                $wallet->increment('balance', $refundAmount);
            }

            $transfer->update([
                'status' => self::STATUS_CANCELLED,
                'metadata' => array_merge($transfer->metadata ?? [], [
                    'cancelled_at' => now()->toIso8601String(),
                    'cancellation_reason' => $reason,
                ]),
            ]);

            Log::info('Wire transfer cancelled', [
                'transfer_id' => $transfer->id,
            ]);
        });
    }

    /**
     * Put transfer on hold for review.
     *
     * @throws InvalidArgumentException
     */
    public function holdTransfer(WireTransfer $transfer, string $reason): void
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

        Log::info('Wire transfer put on hold', [
            'transfer_id' => $transfer->id,
            'reason' => $reason,
        ]);
    }

    /**
     * Track transfer status.
     */
    public function trackTransfer(string $trackingNumber): array
    {
        $transfer = WireTransfer::where('tracking_number', $trackingNumber)->first();

        if (!$transfer) {
            return [
                'found' => false,
                'message' => 'Transfer not found',
            ];
        }

        return [
            'found' => true,
            'tracking_number' => $transfer->tracking_number,
            'status' => $transfer->status,
            'amount' => $transfer->amount,
            'currency' => $transfer->currency,
            'recipient_name' => $transfer->recipient_name,
            'bank_name' => $transfer->bank_name,
            'created_at' => $transfer->created_at,
            'updated_at' => $transfer->updated_at,
        ];
    }

    /**
     * Calculate transfer fee.
     */
    public function calculateFee(float $amount, bool $isInternational = false): float
    {
        if ($isInternational) {
            $fixedFee = self::INTERNATIONAL_FEE_FIXED;
            $percentFee = $amount * (self::INTERNATIONAL_FEE_PERCENT / 100);
        } else {
            $fixedFee = self::DOMESTIC_FEE_FIXED;
            $percentFee = $amount * (self::DOMESTIC_FEE_PERCENT / 100);
        }

        return round($fixedFee + $percentFee, 2);
    }

    /**
     * Validate transfer data.
     *
     * @throws InvalidArgumentException
     */
    protected function validateTransferData(array $data): void
    {
        $required = ['recipient_name', 'bank_name', 'account_number', 'amount', 'purpose'];

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

        if (!empty($data['swift_bic'])) {
            $this->validateSwiftBic($data['swift_bic']);
        }
    }

    /**
     * Validate SWIFT/BIC code format.
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
     * Check if transfer is international.
     */
    protected function isInternationalTransfer(string $countryCode): bool
    {
        return strtoupper($countryCode) !== 'US';
    }

    /**
     * Perform compliance checks.
     *
     * @throws ComplianceException
     */
    protected function performComplianceChecks(User $user, array $data, string $countryCode): void
    {
        $countryCode = strtoupper($countryCode);

        if (in_array($countryCode, self::HIGH_RISK_COUNTRIES)) {
            throw new ComplianceException(
                'Transfers to this destination are not allowed due to compliance restrictions'
            );
        }

        if (($data['amount'] ?? 0) > 10000) {
            Log::warning('Large wire transfer requires additional verification', [
                'user_id' => $user->id,
                'amount' => $data['amount'],
            ]);
        }
    }

    /**
     * Generate tracking number.
     */
    protected function generateTrackingNumber(): string
    {
        return 'WTR-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -8));
    }

    /**
     * Get transfer by ID.
     */
    public function getTransfer(int $transferId): ?WireTransfer
    {
        return WireTransfer::find($transferId);
    }

    /**
     * Get transfers for user.
     */
    public function getUserTransfers(User $user, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = WireTransfer::where('user_id', $user->id);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        return $query->orderByDesc('created_at')->get();
    }
}

/**
 * Compliance Exception
 */
class ComplianceException extends RuntimeException
{
    public function __construct(string $message)
    {
        parent::__construct($message);
    }
}
