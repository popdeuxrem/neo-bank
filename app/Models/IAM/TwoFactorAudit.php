<?php

namespace App\Models\IAM;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TwoFactorAudit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'method',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public const ACTION_ENABLED = 'enabled';

    public const ACTION_DISABLED = 'disabled';

    public const ACTION_VERIFIED = 'verified';

    public const ACTION_FAILED = 'failed';

    public const ACTION_BACKUP_USED = 'backup_used';

    public const ACTION_REGENERATED = 'regenerated';

    public const METHOD_TOTP = 'totp';

    public const METHOD_SMS = 'sms';

    public const METHOD_EMAIL = 'email';

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

    public function scopeByMethod($query, string $method)
    {
        return $query->where('method', $method);
    }

    public function isEnabled(): bool
    {
        return $this->action === self::ACTION_ENABLED;
    }

    public function isVerified(): bool
    {
        return $this->action === self::ACTION_VERIFIED;
    }

    public function isFailed(): bool
    {
        return $this->action === self::ACTION_FAILED;
    }

    public function isBackupUsed(): bool
    {
        return $this->action === self::ACTION_BACKUP_USED;
    }

    public static function log(
        int $userId,
        string $action,
        ?string $method = null,
        array $data = []
    ): self {
        return self::create([
            'user_id' => $userId,
            'action' => $action,
            'method' => $method,
            'ip_address' => $data['ip_address'] ?? request()->ip(),
            'user_agent' => $data['user_agent'] ?? request()->userAgent(),
            'metadata' => $data['metadata'] ?? null,
        ]);
    }
}
