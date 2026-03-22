<?php

namespace App\Models\Banking;

use App\Models\Ledger\Account;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_code',
        'account_name',
        'account_type',
        'category',
        'opening_balance',
        'current_balance',
        'currency',
        'ledger_account_id',
        'description',
        'is_active',
    ];

    protected $casts = [
        'opening_balance' => 'integer',
        'current_balance' => 'integer',
        'is_active' => 'boolean',
    ];

    public const TYPE_ASSET = 'asset';

    public const TYPE_LIABILITY = 'liability';

    public const TYPE_EQUITY = 'equity';

    public const TYPE_REVENUE = 'revenue';

    public const TYPE_EXPENSE = 'expense';

    public const CATEGORY_CASH = 'cash';

    public const CATEGORY_RESERVE = 'reserve';

    public const CATEGORY_RECEIVABLE = 'receivable';

    public const CATEGORY_PAYABLE = 'payable';

    public const CATEGORY_EQUITY = 'equity';

    public const CATEGORY_INCOME = 'income';

    public const CATEGORY_EXPENSE = 'expense';

    public function ledgerAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'ledger_account_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('account_type', $type);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeAsset($query)
    {
        return $query->where('account_type', self::TYPE_ASSET);
    }

    public function scopeLiability($query)
    {
        return $query->where('account_type', self::TYPE_LIABILITY);
    }

    public function scopeEquity($query)
    {
        return $query->where('account_type', self::TYPE_EQUITY);
    }

    public function scopeRevenue($query)
    {
        return $query->where('account_type', self::TYPE_REVENUE);
    }

    public function scopeExpense($query)
    {
        return $query->where('account_type', self::TYPE_EXPENSE);
    }

    public function isAsset(): bool
    {
        return $this->account_type === self::TYPE_ASSET;
    }

    public function isLiability(): bool
    {
        return $this->account_type === self::TYPE_LIABILITY;
    }

    public function isEquity(): bool
    {
        return $this->account_type === self::TYPE_EQUITY;
    }

    public function isRevenue(): bool
    {
        return $this->account_type === self::TYPE_REVENUE;
    }

    public function isExpense(): bool
    {
        return $this->account_type === self::TYPE_EXPENSE;
    }

    public function getBalanceFormatted(): string
    {
        return number_format($this->current_balance / 100, 2) . ' ' . $this->currency;
    }

    public function credit(int $amount): void
    {
        $this->increment('current_balance', $amount);
    }

    public function debit(int $amount): bool
    {
        if ($this->current_balance < $amount) {
            return false;
        }

        $this->decrement('current_balance', $amount);

        return true;
    }

    public function updateBalance(int $newBalance): void
    {
        $this->update(['current_balance' => $newBalance]);
    }

    public function getBalanceChange(): int
    {
        return $this->current_balance - $this->opening_balance;
    }

    public function getBalanceChangePercentage(): float
    {
        if ($this->opening_balance == 0) {
            return 0;
        }

        return round(($this->getBalanceChange() / $this->opening_balance) * 100, 2);
    }

    public static function getOrCreate(string $code, array $attributes = []): self
    {
        return self::firstOrCreate(
            ['account_code' => $code],
            array_merge([
                'account_name' => $attributes['account_name'] ?? $code,
                'account_type' => $attributes['account_type'] ?? self::TYPE_ASSET,
                'category' => $attributes['category'] ?? self::CATEGORY_CASH,
                'opening_balance' => 0,
                'current_balance' => 0,
                'currency' => 'USD',
                'is_active' => true,
            ], $attributes)
        );
    }

    public static function getTotalByType(string $type): int
    {
        return (int) self::where('account_type', $type)->sum('current_balance');
    }

    public static function getNetWorth(): int
    {
        $assets = self::getTotalByType(self::TYPE_ASSET);
        $liabilities = self::getTotalByType(self::TYPE_LIABILITY);

        return $assets - $liabilities;
    }
}
