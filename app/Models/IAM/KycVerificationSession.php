<?php

namespace App\Models\IAM;

use App\Models\IdentityDocument;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class KycVerificationSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reviewer_id',
        'status',
        'verification_type',
        'risk_score',
        'notes',
        'rejection_reason',
        'verified_data',
        'flags',
        'submitted_at',
        'reviewed_at',
    ];

    protected $casts = [
        'risk_score' => 'integer',
        'verified_data' => 'array',
        'flags' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public const STATUS_PENDING = 'pending';

    public const STATUS_IN_REVIEW = 'in_review';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_ESCALATED = 'escalated';

    public const TYPE_STANDARD = 'standard';

    public const TYPE_ENHANCED = 'enhanced';

    public const TYPE_MANUAL = 'manual';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(
            IdentityDocument::class,
            'kyc_session_documents',
            'session_id',
            'document_id'
        );
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isInReview(): bool
    {
        return $this->status === self::STATUS_IN_REVIEW;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function markAsInReview(?User $reviewer = null): void
    {
        $this->update([
            'status' => self::STATUS_IN_REVIEW,
            'reviewer_id' => $reviewer?->id ?? $this->reviewer_id,
        ]);
    }

    public function approve(User $reviewer, ?array $verifiedData = null): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'reviewer_id' => $reviewer->id,
            'reviewed_at' => now(),
            'verified_data' => $verifiedData ?? $this->verified_data,
        ]);

        // Update user KYC status
        $this->user->update([
            'kyc_status' => 'verified',
            'account_status' => User::STATUS_ACTIVE,
        ]);
    }

    public function reject(User $reviewer, string $reason, ?array $flags = null): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'reviewer_id' => $reviewer->id,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
            'flags' => $flags ?? $this->flags,
        ]);
    }

    public function escalate(User $reviewer, string $reason): void
    {
        $this->update([
            'status' => self::STATUS_ESCALATED,
            'reviewer_id' => $reviewer->id,
            'notes' => $reason,
        ]);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeInReview($query)
    {
        return $query->where('status', self::STATUS_IN_REVIEW);
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

    public function scopeHighRisk($query, int $threshold = 70)
    {
        return $query->where('risk_score', '>=', $threshold);
    }
}
