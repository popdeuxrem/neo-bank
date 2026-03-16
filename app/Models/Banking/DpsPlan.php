<?php

namespace App\Models\Banking;

use App\Models\Ledger\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DpsPlan extends Model
{
    protected $fillable = [
        'name',
        'interest_rate',
        'min_amount',
        'max_amount',
        'duration_months',
        'description',
        'status',
    ];

    protected $casts = [
        'interest_rate' => 'decimal:2',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(DpsSubscription::class, 'plan_id');
    }
}

class DpsSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'account_id',
        'monthly_amount',
        'start_date',
        'maturity_date',
        'total_deposited',
        'interest_earned',
        'status',
    ];

    protected $casts = [
        'monthly_amount' => 'decimal:2',
        'total_deposited' => 'decimal:2',
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
        return $this->belongsTo(DpsPlan::class, 'plan_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function installments(): HasMany
    {
        return $this->hasMany(DpsInstallment::class, 'subscription_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getProjectedReturn(): float
    {
        $months = $this->plan->duration_months;
        $rate = $this->plan->interest_rate / 100;
        $totalDeposited = $this->monthly_amount * $months;
        $interest = $this->monthly_amount * $rate * $months * ($months + 1) / 24;

        return $totalDeposited + $interest;
    }
}

class DpsInstallment extends Model
{
    protected $fillable = [
        'subscription_id',
        'installment_number',
        'due_date',
        'amount',
        'paid_at',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(DpsSubscription::class, 'subscription_id');
    }
}
