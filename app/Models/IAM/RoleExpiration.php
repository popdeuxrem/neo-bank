<?php

namespace App\Models\IAM;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Role;

class RoleExpiration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'role_id',
        'expires_at',
        'granted_by',
        'reason',
        'is_active',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function grantedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'granted_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    public function scopeValid($query)
    {
        return $query->where('is_active', true)
            ->where('expires_at', '>', now());
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function isExpired(): bool
    {
        return $this->expires_at <= now();
    }

    public function isValid(): bool
    {
        return $this->is_active && !$this->isExpired();
    }

    public function revoke(): void
    {
        $this->update(['is_active' => false]);

        // Remove role from user
        if ($this->user->hasRole($this->role->name)) {
            $this->user->removeRole($this->role);
        }
    }

    public function extend(\Carbon\Carbon $newExpiry, ?string $reason = null): void
    {
        $this->update([
            'expires_at' => $newExpiry,
            'reason' => $reason ?? $this->reason,
        ]);
    }

    public function getRemainingDays(): int
    {
        return now()->diffInDays($this->expires_at, false);
    }

    public static function grant(
        int $userId,
        int $roleId,
        \Carbon\Carbon $expiresAt,
        int $grantedBy,
        ?string $reason = null
    ): self {
        // Revoke any existing expiration for this role
        self::where('user_id', $userId)
            ->where('role_id', $roleId)
            ->update(['is_active' => false]);

        return self::create([
            'user_id' => $userId,
            'role_id' => $roleId,
            'expires_at' => $expiresAt,
            'granted_by' => $grantedBy,
            'reason' => $reason,
            'is_active' => true,
        ]);
    }

    public static function processExpirations(): int
    {
        $expired = self::valid()->expired()->get();
        $count = 0;

        foreach ($expired as $expiration) {
            $expiration->revoke();
            $count++;
        }

        return $count;
    }
}
