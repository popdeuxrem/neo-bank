<?php

namespace App\Models\Ledger;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Account extends Model
{
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Account $account) {
            if (empty($account->uuid)) {
                $account->uuid = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'uuid',
        'user_id',
        'account_type_id',
        'parent_id',
        'account_number',
        'name',
        'description',
        'is_active',
        'is_system',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_system' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function accountType(): BelongsTo
    {
        return $this->belongsTo(AccountType::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    public function balance(): HasOne
    {
        return $this->hasOne(AccountBalance::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(TransactionEntry::class, 'account_id');
    }

    public function getDebitEntries(): HasMany
    {
        return $this->entries()->where('entry_type', 'debit');
    }

    public function getCreditEntries(): HasMany
    {
        return $this->entries()->where('entry_type', 'credit');
    }

    public function isAsset(): bool
    {
        return $this->accountType?->slug === 'asset';
    }

    public function isLiability(): bool
    {
        return $this->accountType?->slug === 'liability';
    }

    public function isDebitNormal(): bool
    {
        return $this->accountType?->isDebitNormal() ?? true;
    }

    public function getCurrentBalance(): int
    {
        return $this->balance?->balance ?? 0;
    }

    public function getAvailableBalance(): int
    {
        return $this->balance?->available_balance ?? 0;
    }
}
