<?php

namespace App\Models\Rewards;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Badge extends Model
{
    protected $fillable = [
        'name',
        'description',
        'icon',
        'criteria',
    ];

    protected $casts = [
        'criteria' => 'array',
    ];

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class, 'badge_id');
    }
}

class UserBadge extends Model
{
    protected $fillable = [
        'user_id',
        'badge_id',
        'earned_at',
    ];

    protected $casts = [
        'earned_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function badge(): BelongsTo
    {
        return $this->belongsTo(Badge::class, 'badge_id');
    }
}

class UserPortfolio extends Model
{
    protected $fillable = [
        'user_id',
        'tier',
        'total_volume',
        'join_points',
    ];

    protected $casts = [
        'total_volume' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getNextTier(): ?string
    {
        $tiers = ['basic' => 'silver', 'silver' => 'gold', 'gold' => 'platinum'];

        return $tiers[$this->tier] ?? null;
    }

    public function getProgressToNextTier(): float
    {
        $thresholds = [
            'basic' => ['min' => 0, 'max' => 10000],
            'silver' => ['min' => 10000, 'max' => 50000],
            'gold' => ['min' => 50000, 'max' => 100000],
        ];

        if (! isset($thresholds[$this->tier])) {
            return 100;
        }

        $threshold = $thresholds[$this->tier];

        return min(100, (($this->total_volume - $threshold['min']) / ($threshold['max'] - $threshold['min'])) * 100);
    }
}

class UserReward extends Model
{
    protected $fillable = [
        'user_id',
        'balance',
        'lifetime_earned',
        'lifetime_redeemed',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(RewardTransaction::class, 'user_id', 'user_id');
    }
}

class RewardTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'points',
        'type',
        'reason',
        'reference_amount',
        'cash_value',
    ];

    protected $casts = [
        'points' => 'integer',
        'reference_amount' => 'decimal:2',
        'cash_value' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

class RewardSetting extends Model
{
    protected $fillable = [
        'type',
        'points',
        'calculation_type',
        'per_amount_unit',
        'percentage',
        'enabled',
    ];

    protected $casts = [
        'points' => 'integer',
        'per_amount_unit' => 'integer',
        'percentage' => 'decimal:2',
        'enabled' => 'boolean',
    ];
}
