<?php

namespace App\Models\IAM;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PasscodeAudit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'ip_address',
        'user_agent',
        'failed_attempts',
        'locked_until',
        'metadata',
    ];

    protected $casts = [
        'failed_attempts' => 'integer',
        'locked_until' => 'datetime',
        'metadata' => 'array',
    ];

    public const ACTION_SET = 'set';

    public const ACTION_CHANGED = 'changed';

    public const ACTION_RESET = 'reset';

    public const ACTION_FAILED_ATTEMPT = 'failed_attempt';

    public const ACTION_LOCKED = 'locked';

    public const ACTION_UNLOCKED = 'unlocked';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOfAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeFailedAttempts($query)
    {
        return $query->where('action', self::ACTION_FAILED_ATTEMPT);
    }

    public function isFailedAttempt(): bool
    {
        return $this->action === self::ACTION_FAILED_ATTEMPT;
    }

    public function isLock(): bool
    {
        return $this->action === self::ACTION_LOCKED;
    }

    public function isUnlock(): bool
    {
        return $this->action === self::ACTION_UNLOCKED;
    }

    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until > now();
    }

    public static function log(
        int $userId,
        string $action,
        array $data = []
    ): self {
        return self::create([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => $data['ip_address'] ?? request()->ip(),
            'user_agent' => $data['user_agent'] ?? request()->userAgent(),
            'failed_attempts' => $data['failed_attempts'] ?? 0,
            'locked_until' => $data['locked_until'] ?? null,
            'metadata' => $data['metadata'] ?? null,
        ]);
    }
}
