<?php

namespace App\Models\IAM;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'os',
        'location',
        'last_activity_at',
        'expires_at',
        'is_current',
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_current' => 'boolean',
    ];

    public const DEVICE_DESKTOP = 'desktop';

    public const DEVICE_MOBILE = 'mobile';

    public const DEVICE_TABLET = 'tablet';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function isActive(): bool
    {
        return $this->expires_at > now();
    }

    public function isExpired(): bool
    {
        return $this->expires_at <= now();
    }

    public function isCurrent(): bool
    {
        return $this->is_current;
    }

    public function markAsCurrent(): void
    {
        // Unmark other sessions for this user
        self::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_current' => false]);

        $this->update(['is_current' => true]);
    }

    public function updateActivity(): void
    {
        $this->update([
            'last_activity_at' => now(),
            'expires_at' => now()->addHours(2), // Extend session
        ]);
    }

    public function terminate(): void
    {
        $this->update(['expires_at' => now()]);
    }

    public function getDeviceInfo(): array
    {
        return [
            'type' => $this->device_type,
            'browser' => $this->browser,
            'os' => $this->os,
        ];
    }

    public function getDurationInMinutes(): int
    {
        return $this->created_at->diffInMinutes(now());
    }
}
