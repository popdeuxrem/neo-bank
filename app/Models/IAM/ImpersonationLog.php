<?php

namespace App\Models\IAM;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImpersonationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'impersonator_id',
        'impersonated_user_id',
        'ip_address',
        'user_agent',
        'started_at',
        'ended_at',
        'reason',
        'actions_taken',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'actions_taken' => 'array',
    ];

    public const STATUS_ACTIVE = 'active';

    public const STATUS_ENDED = 'ended';

    public function impersonator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'impersonator_id');
    }

    public function impersonatedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'impersonated_user_id');
    }

    public function isActive(): bool
    {
        return $this->ended_at === null;
    }

    public function endSession(?array $actions = null): void
    {
        $this->update([
            'ended_at' => now(),
            'actions_taken' => $actions ?? $this->actions_taken,
        ]);
    }

    public function getDurationInSeconds(): ?int
    {
        if (!$this->ended_at) {
            return null;
        }

        return $this->started_at->diffInSeconds($this->ended_at);
    }

    public function scopeActive($query)
    {
        return $query->whereNull('ended_at');
    }

    public function scopeEnded($query)
    {
        return $query->whereNotNull('ended_at');
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('impersonator_id', $userId)
                ->orWhere('impersonated_user_id', $userId);
        });
    }
}
