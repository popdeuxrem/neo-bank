<?php

namespace App\Models\Banking;

use App\Models\Ledger\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoanPlan extends Model
{
    protected $fillable = [
        'name',
        'interest_rate',
        'min_amount',
        'max_amount',
        'duration_options',
        'processing_fee',
        'late_payment_fee',
        'kyc_required',
        'collateral_required',
        'description',
        'status',
    ];

    protected $casts = [
        'interest_rate' => 'decimal:2',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
        'processing_fee' => 'decimal:2',
        'late_payment_fee' => 'decimal:2',
        'duration_options' => 'array',
        'kyc_required' => 'boolean',
        'collateral_required' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'plan_id');
    }
}

class Loan extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_DEFAULTED = 'defaulted';

    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'user_id',
        'plan_id',
        'account_id',
        'amount',
        'interest_rate',
        'duration_months',
        'emi_amount',
        'total_payable',
        'total_paid',
        'purpose',
        'employment_type',
        'monthly_income',
        'status',
        'disbursed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'emi_amount' => 'decimal:2',
        'total_payable' => 'decimal:2',
        'total_paid' => 'decimal:2',
        'monthly_income' => 'decimal:2',
        'disbursed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(LoanPlan::class, 'plan_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function emiSchedule(): HasMany
    {
        return $this->hasMany(LoanEmi::class, 'loan_id')->orderBy('month');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getRemainingBalance(): float
    {
        return $this->total_payable - $this->total_paid;
    }

    public function getCompletionPercentage(): float
    {
        if ($this->total_payable == 0) {
            return 0;
        }

        return round(($this->total_paid / $this->total_payable) * 100, 1);
    }

    public function getNextEmi(): ?LoanEmi
    {
        return $this->emiSchedule()->where('status', 'pending')
            ->orderBy('due_date')
            ->first();
    }

    public function getOverdueEmis(): int
    {
        return $this->emiSchedule()
            ->where('status', 'pending')
            ->where('due_date', '<', now())
            ->count();
    }
}

class LoanEmi extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_PAID = 'paid';

    public const STATUS_OVERDUE = 'overdue';

    public const STATUS_DEFERRED = 'deferred';

    protected $fillable = [
        'loan_id',
        'month',
        'due_date',
        'emi_amount',
        'principal_amount',
        'interest_amount',
        'late_fee',
        'paid_at',
        'status',
    ];

    protected $casts = [
        'emi_amount' => 'decimal:2',
        'principal_amount' => 'decimal:2',
        'interest_amount' => 'decimal:2',
        'late_fee' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class, 'loan_id');
    }
}
