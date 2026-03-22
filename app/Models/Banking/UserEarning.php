<?php

namespace App\Models\Banking;

use App\Models\Ledger\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserEarning extends Model
{
    use HasFactory;

    protected $table = 'user_earnings';

    protected $fillable = [
        'user_id',
        'wallet_id',
        'earning_type',
        'source_type',
        'source_id',
        'amount',
        'currency',
        'earning_date',
        'status',
        'transaction_id',
        'description',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'integer',
        'earning_date' => 'date',
        'metadata' => 'array',
    ];

    public const TYPE_FDR_INTEREST = 'fdr_interest';

    public const TYPE_DPS_INTEREST = 'dps_interest';

    public const TYPE_REFERRAL_BONUS = 'referral_bonus';

    public const TYPE_CASHBACK = 'cashback';

    public const TYPE_REWARD = 'reward';

    public const TYPE_OTHER = 'other';

    public const SOURCE_FDR = 'fdr';

    public const SOURCE_DPS = 'dps';

    public const SOURCE_REFERRAL = 'referral';

    public const SOURCE_PROMOTION = 'promotion';

    public const SOURCE_OTHER = 'other';

    public const STATUS_PENDING = 'pending';

    public const STATUS_CREDITED = 'credited';

    public const STATUS_REVERSED = 'reversed';

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

    public function scopeByType($query, string $type)
    {
        return $query->where('earning_type', $type);
    }

    public function scopeBySource($query, string $sourceType, ?int $sourceId = null)
    {
        $query->where('source_type', $sourceType);
        
        if ($sourceId) {
            $query->where('source_id', $sourceId);
        }

        return $query;
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeCredited($query)
    {
        return $query->where('status', self::STATUS_CREDITED);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeBetweenDates($query, string $from, string $to)
    {
        return $query->whereBetween('earning_date', [$from, $to]);
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isCredited(): bool
    {
        return $this->status === self::STATUS_CREDITED;
    }

    public function isReversed(): bool
    {
        return $this->status === self::STATUS_REVERSED;
    }

    public function isFdrInterest(): bool
    {
        return $this->earning_type === self::TYPE_FDR_INTEREST;
    }

    public function isDpsInterest(): bool
    {
        return $this->earning_type === self::TYPE_DPS_INTEREST;
    }

    public function isReferralBonus(): bool
    {
        return $this->earning_type === self::TYPE_REFERRAL_BONUS;
    }

    public function getAmountFormatted(): string
    {
        return number_format($this->amount / 100, 2) . ' ' . $this->currency;
    }

    public function markAsCredited(): void
    {
        $this->update(['status' => self::STATUS_CREDITED]);
    }

    public function markAsReversed(): void
    {
        $this->update(['status' => self::STATUS_REVERSED]);
    }

    public static function record(
        int $userId,
        string $earningType,
        string $sourceType,
        int $sourceId,
        int $amount,
        int $walletId,
        string $description,
        array $options = []
    ): self {
        return self::create([
            'user_id' => $userId,
            'earning_type' => $earningType,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'amount' => $amount,
            'currency' => $options['currency'] ?? 'USD',
            'earning_date' => $options['earning_date'] ?? now()->toDateString(),
            'wallet_id' => $walletId,
            'status' => $options['status'] ?? self::STATUS_PENDING,
            'transaction_id' => $options['transaction_id'] ?? null,
            'description' => $description,
            'metadata' => $options['metadata'] ?? null,
        ]);
    }

    public static function getTotalForUser(int $userId, ?string $type = null, ?string $from = null, ?string $to = null): int
    {
        $query = self::where('user_id', $userId)
            ->where('status', self::STATUS_CREDITED);

        if ($type) {
            $query->where('earning_type', $type);
        }

        if ($from && $to) {
            $query->whereBetween('earning_date', [$from, $to]);
        }

        return (int) $query->sum('amount');
    }

    public static function getBreakdownForUser(int $userId, ?string $from = null, ?string $to = null): array
    {
        $query = self::where('user_id', $userId)
            ->where('status', self::STATUS_CREDITED);

        if ($from && $to) {
            $query->whereBetween('earning_date', [$from, $to]);
        }

        return $query->selectRaw('earning_type, sum(amount) as total')
            ->groupBy('earning_type')
            ->pluck('total', 'earning_type')
            ->toArray();
    }
}
