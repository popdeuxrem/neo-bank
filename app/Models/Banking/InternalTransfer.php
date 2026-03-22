<?php

namespace App\Models\Banking;

use App\Models\Ledger\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class InternalTransfer extends Model
{
    use HasFactory;

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (InternalTransfer $transfer) {
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
        'sender_user_id',
        'sender_wallet_id',
        'recipient_user_id',
        'recipient_wallet_id',
        'amount',
        'currency',
        'fee',
        'description',
        'status',
        'transaction_id',
        'completed_at',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'integer',
        'fee' => 'integer',
        'completed_at' => 'datetime',
        'metadata' => 'array',
    ];

    public const STATUS_PENDING = 'pending';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REVERSED = 'reversed';

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }

    public function senderWallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'sender_wallet_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    public function recipientWallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'recipient_wallet_id');
    }

    public function ledgerTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    public function scopeForSender($query, int $userId)
    {
        return $query->where('sender_user_id', $userId);
    }

    public function scopeForRecipient($query, int $userId)
    {
        return $query->where('recipient_user_id', $userId);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('sender_user_id', $userId)
                ->orWhere('recipient_user_id', $userId);
        });
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    public function markAsProcessing(): void
    {
        $this->update(['status' => self::STATUS_PROCESSING]);
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

    public function markAsReversed(): void
    {
        $this->update(['status' => self::STATUS_REVERSED]);
    }

    public function getTotalAmount(): int
    {
        return $this->amount + $this->fee;
    }

    public function getTotalAmountFormatted(): string
    {
        return number_format($this->getTotalAmount() / 100, 2) . ' ' . $this->currency;
    }

    public static function generateReferenceNumber(): string
    {
        $prefix = 'INT';
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(8));

        return "{$prefix}-{$date}-{$random}";
    }
}
