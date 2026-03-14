<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    public const STATUS_ACTIVE = 'active';

    public const STATUS_PENDING_KYC = 'pending_kyc';

    public const STATUS_SUSPENDED = 'suspended';

    public const STATUS_CLOSED = 'closed';

    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'account_status',
        'onboarding_completed_at',
        'onboarding_started_at',
        'onboarding_last_step',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'account_status' => 'string',
            'onboarding_completed_at' => 'datetime',
            'onboarding_started_at' => 'datetime',
            'onboarding_last_step' => 'integer',
        ];
    }

    /**
     * Check if user account is active.
     */
    public function isActive(): bool
    {
        return $this->account_status === self::STATUS_ACTIVE;
    }

    /**
     * Check if user needs KYC verification.
     */
    public function needsKyc(): bool
    {
        return $this->account_status === self::STATUS_PENDING_KYC;
    }

    /**
     * Check if user has completed onboarding.
     */
    public function hasCompletedOnboarding(): bool
    {
        return ! is_null($this->onboarding_completed_at);
    }

    /**
     * Check if user has skipped onboarding.
     */
    public function hasSkippedOnboarding(): bool
    {
        return $this->onboarding_last_step === -1;
    }

    /**
     * Check if KYC verification is complete.
     */
    public function isKycVerified(): bool
    {
        return $this->account_status === self::STATUS_ACTIVE;
    }
}
