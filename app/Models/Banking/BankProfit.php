<?php

namespace App\Models\Banking;

use App\Models\Ledger\Transaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankProfit extends Model
{
    use HasFactory;

    protected $fillable = [
        'profit_type',
        'source_type',
        'source_id',
        'amount',
        'currency',
        'profit_date',
        'period',
        'description',
        'breakdown',
        'transaction_id',
    ];

    protected $casts = [
        'amount' => 'integer',
        'profit_date' => 'date',
        'breakdown' => 'array',
    ];

    public const TYPE_INTEREST_SPREAD = 'interest_spread';

    public const TYPE_FEES = 'fees';

    public const TYPE_COMMISSIONS = 'commissions';

    public const TYPE_PENALTIES = 'penalties';

    public const TYPE_OTHER = 'other';

    public const SOURCE_LOAN = 'loan';

    public const SOURCE_FDR = 'fdr';

    public const SOURCE_DPS = 'dps';

    public const SOURCE_TRANSFER = 'transfer';

    public const SOURCE_BILL = 'bill';

    public const SOURCE_OTHER = 'other';

    public const PERIOD_DAILY = 'daily';

    public const PERIOD_WEEKLY = 'weekly';

    public const PERIOD_MONTHLY = 'monthly';

    public const PERIOD_YEARLY = 'yearly';

    public function ledgerTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('profit_type', $type);
    }

    public function scopeBySource($query, string $sourceType, ?int $sourceId = null)
    {
        $query->where('source_type', $sourceType);
        
        if ($sourceId) {
            $query->where('source_id', $sourceId);
        }

        return $query;
    }

    public function scopeByPeriod($query, string $period)
    {
        return $query->where('period', $period);
    }

    public function scopeForDate($query, string $date)
    {
        return $query->where('profit_date', $date);
    }

    public function scopeBetweenDates($query, string $from, string $to)
    {
        return $query->whereBetween('profit_date', [$from, $to]);
    }

    public function isInterestSpread(): bool
    {
        return $this->profit_type === self::TYPE_INTEREST_SPREAD;
    }

    public function isFee(): bool
    {
        return $this->profit_type === self::TYPE_FEES;
    }

    public function isCommission(): bool
    {
        return $this->profit_type === self::TYPE_COMMISSIONS;
    }

    public function getAmountFormatted(): string
    {
        return number_format($this->amount / 100, 2) . ' ' . $this->currency;
    }

    public static function record(
        string $profitType,
        string $sourceType,
        int $sourceId,
        int $amount,
        string $description,
        array $options = []
    ): self {
        return self::create([
            'profit_type' => $profitType,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'amount' => $amount,
            'currency' => $options['currency'] ?? 'USD',
            'profit_date' => $options['profit_date'] ?? now()->toDateString(),
            'period' => $options['period'] ?? null,
            'description' => $description,
            'breakdown' => $options['breakdown'] ?? null,
            'transaction_id' => $options['transaction_id'] ?? null,
        ]);
    }

    public static function getTotalForPeriod(string $from, string $to, ?string $type = null): int
    {
        $query = self::whereBetween('profit_date', [$from, $to]);

        if ($type) {
            $query->where('profit_type', $type);
        }

        return (int) $query->sum('amount');
    }

    public static function getBreakdownForPeriod(string $from, string $to): array
    {
        return self::whereBetween('profit_date', [$from, $to])
            ->selectRaw('profit_type, sum(amount) as total')
            ->groupBy('profit_type')
            ->pluck('total', 'profit_type')
            ->toArray();
    }
}
