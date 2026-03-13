<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IdentityDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'document_type',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'status',
        'rejection_reason',
        'reviewed_at',
        'reviewed_by',
        'extracted_data',
        'external_reference',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'reviewed_at' => 'datetime',
        'extracted_data' => 'array',
    ];

    public const STATUS_PENDING = 'pending';

    public const STATUS_SUBMITTED = 'submitted';

    public const STATUS_UNDER_REVIEW = 'under_review';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const TYPE_PASSPORT = 'passport';

    public const TYPE_DRIVERS_LICENSE = 'drivers_license';

    public const TYPE_NATIONAL_ID = 'national_id';

    public const TYPE_UTILITY_BILL = 'utility_bill';

    public const TYPE_BANK_STATEMENT = 'bank_statement';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isUnderReview(): bool
    {
        return $this->status === self::STATUS_UNDER_REVIEW;
    }

    public function markAsSubmitted(): void
    {
        $this->update(['status' => self::STATUS_SUBMITTED]);
    }

    public function markAsUnderReview(): void
    {
        $this->update(['status' => self::STATUS_UNDER_REVIEW]);
    }

    public function approve(?User $reviewer = null): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'reviewed_at' => now(),
            'reviewed_by' => $reviewer?->id,
        ]);
    }

    public function reject(string $reason, ?User $reviewer = null): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'rejection_reason' => $reason,
            'reviewed_at' => now(),
            'reviewed_by' => $reviewer?->id,
        ]);
    }

    public static function getDocumentTypes(): array
    {
        return [
            self::TYPE_PASSPORT => 'Passport',
            self::TYPE_DRIVERS_LICENSE => "Driver's License",
            self::TYPE_NATIONAL_ID => 'National ID',
            self::TYPE_UTILITY_BILL => 'Utility Bill',
            self::TYPE_BANK_STATEMENT => 'Bank Statement',
        ];
    }
}
