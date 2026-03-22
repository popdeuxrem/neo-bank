<?php

namespace App\Models\Banking;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_number',
        'user_id',
        'plan_id',
        'requested_amount',
        'requested_duration_months',
        'offered_interest_rate',
        'offered_amount',
        'offered_duration_months',
        'offered_emi',
        'purpose',
        'employment_type',
        'monthly_income',
        'existing_emi_obligations',
        'employer_details',
        'bank_details',
        'documents',
        'guarantor_details',
        'status',
        'credit_score',
        'review_notes',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'requested_amount' => 'integer',
        'requested_duration_months' => 'integer',
        'offered_interest_rate' => 'decimal:2',
        'offered_amount' => 'integer',
        'offered_duration_months' => 'integer',
        'offered_emi' => 'integer',
        'monthly_income' => 'integer',
        'existing_emi_obligations' => 'integer',
        'employer_details' => 'array',
        'bank_details' => 'array',
        'documents' => 'array',
        'guarantor_details' => 'array',
        'credit_score' => 'integer',
        'reviewed_at' => 'datetime',
    ];

    public const STATUS_SUBMITTED = 'submitted';

    public const STATUS_UNDER_REVIEW = 'under_review';

    public const STATUS_DOCUMENTS_PENDING = 'documents_pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const EMPLOYMENT_SALARIED = 'salaried';

    public const EMPLOYMENT_SELF_EMPLOYED = 'self_employed';

    public const EMPLOYMENT_BUSINESS = 'business';

    public const EMPLOYMENT_UNEMPLOYED = 'unemployed';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(LoanPlan::class, 'plan_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', self::STATUS_SUBMITTED);
    }

    public function scopeUnderReview($query)
    {
        return $query->where('status', self::STATUS_UNDER_REVIEW);
    }

    public function scopePendingDocuments($query)
    {
        return $query->where('status', self::STATUS_DOCUMENTS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function isSubmitted(): bool
    {
        return $this->status === self::STATUS_SUBMITTED;
    }

    public function isUnderReview(): bool
    {
        return $this->status === self::STATUS_UNDER_REVIEW;
    }

    public function isPendingDocuments(): bool
    {
        return $this->status === self::STATUS_DOCUMENTS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function markAsUnderReview(): void
    {
        $this->update(['status' => self::STATUS_UNDER_REVIEW]);
    }

    public function markAsPendingDocuments(): void
    {
        $this->update(['status' => self::STATUS_DOCUMENTS_PENDING]);
    }

    public function approve(User $reviewer, array $offerDetails): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'offered_amount' => $offerDetails['amount'] ?? $this->requested_amount,
            'offered_interest_rate' => $offerDetails['interest_rate'] ?? $this->plan->interest_rate,
            'offered_duration_months' => $offerDetails['duration_months'] ?? $this->requested_duration_months,
            'offered_emi' => $offerDetails['emi'] ?? null,
        ]);
    }

    public function reject(User $reviewer, string $reason): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    public function getDebtToIncomeRatio(): float
    {
        if ($this->monthly_income == 0) {
            return 0;
        }

        $proposedEmi = $this->offered_emi ?? 0;
        $existingEmi = $this->existing_emi_obligations ?? 0;
        $totalObligations = $proposedEmi + $existingEmi;

        return round(($totalObligations / $this->monthly_income) * 100, 2);
    }

    public function getEmploymentTypeLabel(): string
    {
        return match ($this->employment_type) {
            self::EMPLOYMENT_SALARIED => 'Salaried',
            self::EMPLOYMENT_SELF_EMPLOYED => 'Self Employed',
            self::EMPLOYMENT_BUSINESS => 'Business Owner',
            self::EMPLOYMENT_UNEMPLOYED => 'Unemployed',
            default => 'Unknown',
        };
    }
}
