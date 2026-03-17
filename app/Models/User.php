<?php

namespace App\Models;

use App\Models\Banking\BillPayment;
use App\Models\Banking\Deposit;
use App\Models\Banking\DpsSubscription;
use App\Models\Banking\FdrSubscription;
use App\Models\Banking\Loan;
use App\Models\Banking\MoneyRequest;
use App\Models\Banking\ScheduledPayment;
use App\Models\Banking\VirtualCard;
use App\Models\Banking\Wallet;
use App\Models\Banking\WireTransfer;
use App\Models\Banking\Withdrawal;
use App\Models\Ledger\Account;
use App\Models\Ledger\TransactionEntry;
use App\Models\Rewards\RewardTransaction;
use App\Models\Rewards\UserBadge;
use App\Models\Rewards\UserPortfolio;
use App\Models\Rewards\UserReward;
use App\Models\Support\SupportTicket;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_PENDING_KYC = 'pending_kyc';

    public const STATUS_SUSPENDED = 'suspended';

    public const STATUS_BANNED = 'banned';

    public const STATUS_CLOSED = 'closed';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'country',
        'date_of_birth',
        'address',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'nationality',
        'gender',
        'occupation',
        'employer',
        'monthly_income',
        'avatar',
        'google_id',
        'account_status',
        'kyc_status',
        'email_verified_at',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'passcode',
        'passcode_enabled',
        'referral_code',
        'referred_by_id',
        'onboarding_completed_at',
        'onboarding_last_step',
        'last_login_at',
        'last_login_ip',
        'preferred_language',
        'preferred_currency',
        'theme_preference',
        'notification_sound_enabled',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'passcode',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'onboarding_completed_at' => 'datetime',
        'last_login_at' => 'datetime',
        'passcode_enabled' => 'boolean',
        'notification_sound_enabled' => 'boolean',
        'two_factor_recovery_codes' => 'array',
    ];

    public function isActive(): bool
    {
        return $this->account_status === self::STATUS_ACTIVE;
    }

    public function needsKyc(): bool
    {
        return $this->account_status === self::STATUS_PENDING_KYC;
    }

    public function hasCompletedOnboarding(): bool
    {
        return ! is_null($this->onboarding_completed_at);
    }

    public function isKycVerified(): bool
    {
        return $this->account_status === self::STATUS_ACTIVE;
    }

    public function ledgerAccounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function wallets(): HasMany
    {
        return $this->hasMany(Wallet::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(TransactionEntry::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function scheduledPayments(): HasMany
    {
        return $this->hasMany(ScheduledPayment::class);
    }

    public function wireTransfers(): HasMany
    {
        return $this->hasMany(WireTransfer::class);
    }

    public function dpsSubscriptions(): HasMany
    {
        return $this->hasMany(DpsSubscription::class);
    }

    public function fdrSubscriptions(): HasMany
    {
        return $this->hasMany(FdrSubscription::class);
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    public function virtualCards(): HasMany
    {
        return $this->hasMany(VirtualCard::class);
    }

    public function billPayments(): HasMany
    {
        return $this->hasMany(BillPayment::class);
    }

    public function moneyRequests(): HasMany
    {
        return $this->hasMany(MoneyRequest::class);
    }

    public function portfolio(): HasOne
    {
        return $this->hasOne(UserPortfolio::class);
    }

    public function badges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }

    public function rewards(): HasOne
    {
        return $this->hasOne(UserReward::class);
    }

    public function rewardTransactions(): HasMany
    {
        return $this->hasMany(RewardTransaction::class);
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by_id');
    }

    public function referredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by_id');
    }

    public function referralCommissions(): HasMany
    {
        return $this->hasMany(ReferralCommission::class, 'referrer_id');
    }

    public function savedRecipients(): HasMany
    {
        return $this->hasMany(SavedRecipient::class);
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function kycDocuments(): HasMany
    {
        return $this->hasMany(IdentityDocument::class);
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class);
    }

    public function statements(): HasMany
    {
        return $this->hasMany(AccountStatement::class);
    }

    public function deposits(): HasMany
    {
        return $this->hasMany(Deposit::class);
    }

    public function withdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function loginHistory(): HasMany
    {
        return $this->hasMany(AccountStatement::class);
    }

    public function getTotalBalance(): float
    {
        return $this->ledgerAccounts->sum('balance')
            + ($this->wallet?->balance ?? 0);
    }

    public function getAvailableBalance(): float
    {
        return $this->ledgerAccounts
            ->where('status', 'active')
            ->where('frozen', false)
            ->sum('balance');
    }

    public function getMonthlyIncome(int $days = 30): float
    {
        return TransactionEntry::where('user_id', $this->id)
            ->where('type', 'credit')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays($days))
            ->sum('amount');
    }

    public function getMonthlyExpenses(int $days = 30): float
    {
        return TransactionEntry::where('user_id', $this->id)
            ->where('type', 'debit')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays($days))
            ->sum('amount');
    }

    public function getMonthlyNet(int $days = 30): float
    {
        return $this->getMonthlyIncome($days) - $this->getMonthlyExpenses($days);
    }

    public function getSavingsRate(int $days = 30): float
    {
        $income = $this->getMonthlyIncome($days);
        if ($income == 0) {
            return 0;
        }

        return round(($this->getMonthlyNet($days) / $income) * 100, 1);
    }

    public function getSpendingByCategory(int $days = 30): array
    {
        return TransactionEntry::where('user_id', $this->id)
            ->where('type', 'debit')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays($days))
            ->selectRaw('category, sum(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->toArray();
    }

    public function getTransactionCount(int $days = 30): int
    {
        return TransactionEntry::where('user_id', $this->id)
            ->where('created_at', '>=', now()->subDays($days))
            ->count();
    }

    public function getTotalSent(int $days = 30): float
    {
        return Payment::where('user_id', $this->id)
            ->where('created_at', '>=', now()->subDays($days))
            ->where('status', 'completed')
            ->sum('amount');
    }

    public function getTotalReceived(int $days = 30): float
    {
        return TransactionEntry::where('user_id', $this->id)
            ->where('type', 'credit')
            ->where('created_at', '>=', now()->subDays($days))
            ->where('status', 'completed')
            ->sum('amount');
    }

    public function getGlobalRank(): int
    {
        return User::where('id', '!=', $this->id)
            ->count() + 1;
    }

    public function getMaskedEmailAttribute(): string
    {
        if (! $this->email) {
            return '';
        }
        [$local, $domain] = explode('@', $this->email);

        return substr($local, 0, 2).str_repeat('*', strlen($local) - 2).'@'.$domain;
    }
}
