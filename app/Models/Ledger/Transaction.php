<?php

namespace App\Models\Ledger;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Transaction extends Model
{
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Transaction $transaction) {
            if (empty($transaction->uuid)) {
                $transaction->uuid = (string) Str::uuid();
            }
        });
    }

    public const TYPE_DEPOSIT = 'deposit';

    public const TYPE_WITHDRAWAL = 'withdrawal';

    public const TYPE_TRANSFER = 'transfer';

    public const TYPE_PAYMENT = 'payment';

    public const TYPE_REFUND = 'refund';

    public const TYPE_FEE = 'fee';

    public const TYPE_INTEREST = 'interest';

    public const STATUS_PENDING = 'pending';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REVERSED = 'reversed';

    public const STATUS_FLAGGED = 'flagged';

    protected $fillable = [
        'uuid',
        'transaction_number',
        'type',
        'description',
        'amount',
        'currency',
        'created_by',
        'status',
        'metadata',
        'posted_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'metadata' => 'array',
        'posted_at' => 'datetime',
    ];

    public function entries(): HasMany
    {
        return $this->hasMany(TransactionEntry::class, 'transaction_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
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

    public function isReversed(): bool
    {
        return $this->status === self::STATUS_REVERSED;
    }

    public function isFlagged(): bool
    {
        return $this->status === self::STATUS_FLAGGED;
    }

    public function markAsCompleted(): void
    {
        $this->status = self::STATUS_COMPLETED;
        $this->posted_at = now();
        $this->save();
    }

    public function markAsFailed(): void
    {
        $this->status = self::STATUS_FAILED;
        $this->save();
    }

    public function markAsReversed(): void
    {
        $this->status = self::STATUS_REVERSED;
        $this->save();
    }

    public function markAsFlagged(): void
    {
        $this->status = self::STATUS_FLAGGED;
        $this->save();
    }

    public function getDebitTotal(): int
    {
        return $this->entries()
            ->where('entry_type', 'debit')
            ->sum('amount');
    }

    public function getCreditTotal(): int
    {
        return $this->entries()
            ->where('entry_type', 'credit')
            ->sum('amount');
    }

    public function isBalanced(): bool
    {
        return $this->getDebitTotal() === $this->getCreditTotal();
    }

    public static function generateTransactionNumber(): string
    {
        $prefix = 'TXN';
        $date = now()->format('Ymd');
        $random = str()->upper(str()->random(8));

        return "{$prefix}-{$date}-{$random}";
    }
}
