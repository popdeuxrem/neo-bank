<?php

namespace App\Models\Banking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WalletType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category',
        'allows_interest',
        'interest_rate',
        'is_active',
        'is_system',
    ];

    protected $casts = [
        'allows_interest' => 'boolean',
        'interest_rate' => 'decimal:2',
        'is_active' => 'boolean',
        'is_system' => 'boolean',
    ];

    public const CATEGORY_USER = 'user';

    public const CATEGORY_SYSTEM = 'system';

    public const CATEGORY_RESERVE = 'reserve';

    public const CATEGORY_PROFIT = 'profit';

    public function wallets(): HasMany
    {
        return $this->hasMany(Wallet::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeUser($query)
    {
        return $query->where('category', self::CATEGORY_USER);
    }

    public function scopeSystem($query)
    {
        return $query->where('category', self::CATEGORY_SYSTEM);
    }

    public function isUser(): bool
    {
        return $this->category === self::CATEGORY_USER;
    }

    public function isSystem(): bool
    {
        return $this->category === self::CATEGORY_SYSTEM;
    }

    public function allowsInterest(): bool
    {
        return $this->allows_interest;
    }
}
