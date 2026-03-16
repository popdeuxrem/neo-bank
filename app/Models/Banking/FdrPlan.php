<?php

namespace App\Models\Banking;

use App\Models\Ledger\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FdrPlan extends Model
{
    protected $fillable = [
        'name',
        'interest_rate',
        'min_amount',
        'max_amount',
        'duration_options',
        'compounding_frequency',
        'early_withdrawal_penalty',
        'description',
        'status',
    ];

    protected $casts = [
        'interest_rate' => 'decimal:2',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
        'early_withdrawal_penalty' => 'decimal:2',
        'duration_options' => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(FdrSubscription::class, 'plan_id');
    }
}

class FdrSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'account_id',
        'principal',
        'interest_rate',
        'duration_months',
        'compounding_frequency',
        'start_date',
        'maturity_date',
        'current_value',
        'interest_earned',
        'status',
    ];

    protected $casts = [
        'principal' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'current_value' => 'decimal:2',
        'interest_earned' => 'decimal:2',
        'start_date' => 'date',
        'maturity_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(FdrPlan::class, 'plan_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function calculateCurrentValue(): float
    {
        $months = now()->diffInMonths($this->start_date);
        $rate = $this->interest_rate / 100 / 12;

        return $this->principal * pow(1 + $rate, $months);
    }
}
