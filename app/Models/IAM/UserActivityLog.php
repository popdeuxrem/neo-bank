<?php

namespace App\Models\IAM;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserActivityLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'activity_type',
        'ip_address',
        'user_agent',
        'country',
        'city',
        'latitude',
        'longitude',
        'metadata',
        'session_id',
        'created_at',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public const TYPE_LOGIN = 'login';

    public const TYPE_LOGOUT = 'logout';

    public const TYPE_PASSWORD_CHANGE = 'password_change';

    public const TYPE_EMAIL_CHANGE = 'email_change';

    public const TYPE_PHONE_CHANGE = 'phone_change';

    public const TYPE_KYC_SUBMIT = 'kyc_submit';

    public const TYPE_KYC_APPROVED = 'kyc_approved';

    public const TYPE_KYC_REJECTED = 'kyc_rejected';

    public const TYPE_2FA_ENABLED = '2fa_enabled';

    public const TYPE_2FA_DISABLED = '2fa_disabled';

    public const TYPE_PASSCODE_SET = 'passcode_set';

    public const TYPE_PASSCODE_CHANGED = 'passcode_changed';

    public const TYPE_PROFILE_UPDATE = 'profile_update';

    public const TYPE_DEVICE_ADDED = 'device_added';

    public const TYPE_SUSPICIOUS_ACTIVITY = 'suspicious_activity';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('activity_type', $type);
    }

    public function scopeFromIp($query, string $ip)
    {
        return $query->where('ip_address', $ip);
    }

    public function scopeRecent($query, int $hours = 24)
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }

    public function scopeBetweenDates($query, string $from, string $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }

    public function isLogin(): bool
    {
        return $this->activity_type === self::TYPE_LOGIN;
    }

    public function isLogout(): bool
    {
        return $this->activity_type === self::TYPE_LOGOUT;
    }

    public function isPasswordChange(): bool
    {
        return $this->activity_type === self::TYPE_PASSWORD_CHANGE;
    }

    public function isSuspicious(): bool
    {
        return $this->activity_type === self::TYPE_SUSPICIOUS_ACTIVITY;
    }

    public function getLocationString(): ?string
    {
        if ($this->city && $this->country) {
            return "{$this->city}, {$this->country}";
        }

        return $this->country ?? $this->city ?? null;
    }

    public function getCoordinates(): ?array
    {
        if ($this->latitude && $this->longitude) {
            return [
                'lat' => (float) $this->latitude,
                'lng' => (float) $this->longitude,
            ];
        }

        return null;
    }

    public static function log(
        int $userId,
        string $activityType,
        array $data = []
    ): self {
        return self::create([
            'user_id' => $userId,
            'activity_type' => $activityType,
            'ip_address' => $data['ip_address'] ?? request()->ip(),
            'user_agent' => $data['user_agent'] ?? request()->userAgent(),
            'country' => $data['country'] ?? null,
            'city' => $data['city'] ?? null,
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'metadata' => $data['metadata'] ?? null,
            'session_id' => $data['session_id'] ?? session()->getId(),
            'created_at' => now(),
        ]);
    }
}
