<?php

namespace App\Models\IAM;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInactivityStatus extends Model
{
    use HasFactory;

    protected $table = 'user_inactivity_status';

    protected $fillable = [
        'user_id',
        'last_activity_at',
        'warning_sent_at',
        'deactivated_at',
        'deletion_scheduled_at',
        'status',
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'warning_sent_at' => 'datetime',
        'deactivated_at' => 'datetime',
        'deletion_scheduled_at' => 'datetime',
    ];

    public const STATUS_ACTIVE = 'active';

    public const STATUS_WARNED = 'warned';

    public const STATUS_DEACTIVATED = 'deactivated';

    public const STATUS_PENDING_DELETION = 'pending_deletion';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeWarned($query)
    {
        return $query->where('status', self::STATUS_WARNED);
    }

    public function scopeDeactivated($query)
    {
        return $query->where('status', self::STATUS_DEACTIVATED);
    }

    public function scopePendingDeletion($query)
    {
        return $query->where('status', self::STATUS_PENDING_DELETION);
    }

    public function scopeInactiveSince($query, \Carbon\Carbon $date)
    {
        return $query->where('last_activity_at', '<=', $date);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isWarned(): bool
    {
        return $this->status === self::STATUS_WARNED;
    }

    public function isDeactivated(): bool
    {
        return $this->status === self::STATUS_DEACTIVATED;
    }

    public function isPendingDeletion(): bool
    {
        return $this->status === self::STATUS_PENDING_DELETION;
    }

    public function markAsWarned(): void
    {
        $this->update([
            'status' => self::STATUS_WARNED,
            'warning_sent_at' => now(),
        ]);
    }

    public function markAsDeactivated(): void
    {
        $this->update([
            'status' => self::STATUS_DEACTIVATED,
            'deactivated_at' => now(),
        ]);

        // Deactivate user
        $this->user->update(['account_status' => User::STATUS_SUSPENDED]);
    }

    public function markAsPendingDeletion(): void
    {
        $settings = InactiveUserSetting::getCurrent();

        $this->update([
            'status' => self::STATUS_PENDING_DELETION,
            'deletion_scheduled_at' => now()->addDays($settings->deletion_days - $settings->deactivation_days),
        ]);
    }

    public function reactivate(): void
    {
        $this->update([
            'status' => self::STATUS_ACTIVE,
            'last_activity_at' => now(),
            'warning_sent_at' => null,
            'deactivated_at' => null,
            'deletion_scheduled_at' => null,
        ]);

        // Reactivate user
        $this->user->update(['account_status' => User::STATUS_ACTIVE]);
    }

    public function updateActivity(): void
    {
        $this->update([
            'last_activity_at' => now(),
            'status' => self::STATUS_ACTIVE,
            'warning_sent_at' => null,
            'deactivated_at' => null,
            'deletion_scheduled_at' => null,
        ]);
    }

    public function getDaysInactive(): int
    {
        return $this->last_activity_at->diffInDays(now());
    }
}
