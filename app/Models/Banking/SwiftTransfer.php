<?php

namespace App\Models\Banking;

use App\Models\Ledger\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class SwiftTransfer extends Model
{
    use HasFactory;

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (SwiftTransfer $transfer) {
            if (empty($transfer->uuid)) {
                $transfer->uuid = (string) Str::uuid();
            }
            if (empty($transfer->reference_number)) {
                $transfer->reference_number = self::generateReferenceNumber();
            }
        });
    }

    protected $fillable = [
        'uuid',
        'reference_number',
        'user_id',
        'wallet_id',
        'recipient_name',
        'recipient_address',
        'recipient_country',
        'recipient_email',
        'recipient_phone',
        'bank_name',
        'bank_address',
        'bank_country',
        'swift_bic',
        'iban',
        'account_number',
        'intermediary_bank',
        'intermediary_swift',
        'amount',
        'currency',
        'fee',
        'exchange_rate',
        'purpose',
        'purpose_details',
        'status',
        'swift_status',
        'transaction_id',
        'submitted_at',
        'processed_at',
        'completed_at',
        'tracking_info',
        'compliance_checks',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'integer',
        'fee' => 'integer',
        'exchange_rate' => 'decimal:8',
        'submitted_at' => 'datetime',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
        'tracking_info' => 'array',
        'compliance_checks' => 'array',
        'metadata' => 'array',
    ];

    public const STATUS_PENDING = 'pending';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REVERSED = 'reversed';

    public const STATUS_ON_HOLD = 'on_hold';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function ledgerTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', self::STATUS_PROCESSING);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    public function scopeOnHold($query)
    {
        return $query->where('status', self::STATUS_ON_HOLD);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isProcessing(): bool
    {
        return $this->status === self::STATUS_PROCESSING;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    public function isOnHold(): bool
    {
        return $this->status === self::STATUS_ON_HOLD;
    }

    public function markAsProcessing(): void
    {
        $this->update([
            'status' => self::STATUS_PROCESSING,
            'processed_at' => now(),
        ]);
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => self::STATUS_FAILED]);
    }

    public function markAsOnHold(): void
    {
        $this->update(['status' => self::STATUS_ON_HOLD]);
    }

    public function updateSwiftStatus(string $status, ?array $trackingInfo = null): void
    {
        $this->update([
            'swift_status' => $status,
            'tracking_info' => $trackingInfo ?? $this->tracking_info,
        ]);
    }

    public function getTotalAmount(): int
    {
        return $this->amount + $this->fee;
    }

    public function getTotalAmountFormatted(): string
    {
        return number_format($this->getTotalAmount() / 100, 2) . ' ' . $this->currency;
    }

    public function getConvertedAmount(): ?float
    {
        if (!$this->exchange_rate) {
            return null;
        }

        return $this->amount * $this->exchange_rate;
    }

    public function getRecipientBankInfo(): array
    {
        return [
            'name' => $this->bank_name,
            'address' => $this->bank_address,
            'country' => $this->bank_country,
            'swift_bic' => $this->swift_bic,
            'iban' => $this->iban,
            'account_number' => $this->account_number,
        ];
    }

    public static function generateReferenceNumber(): string
    {
        $prefix = 'SWIFT';
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(8));

        return "{$prefix}-{$date}-{$random}";
    }
}
