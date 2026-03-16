<?php

namespace App\Services;

use App\Models\ReferralCommission;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReferralService
{
    public function processCommission(User $newUser): void
    {
        $referrer = $newUser->referredBy;

        if (! $referrer) {
            return;
        }

        $levels = config('referrals.levels', [
            1 => 5.0,
            2 => 2.0,
            3 => 1.0,
        ]);

        $currentUser = $newUser;

        foreach ($levels as $level => $rate) {
            $referrer = $currentUser->referredBy;

            if (! $referrer) {
                break;
            }

            ReferralCommission::create([
                'referrer_id' => $referrer->id,
                'referred_id' => $newUser->id,
                'level' => $level,
                'rate' => $rate,
                'status' => 'pending',
            ]);

            $currentUser = $referrer;
        }
    }

    public function calculateAndPayCommission(
        User $user,
        float $transactionAmount
    ): void {
        $commissions = ReferralCommission::where('referred_id', $user->id)
            ->where('status', 'pending')
            ->with('referrer')
            ->get();

        foreach ($commissions as $commission) {
            if (! $commission->referrer) {
                continue;
            }

            $amount = $transactionAmount * ($commission->rate / 100);

            DB::transaction(function () use ($commission, $amount, $transactionAmount) {
                $commission->referrer->wallet->increment('balance', $amount);

                ReferralCommission::create([
                    'referrer_id' => $commission->referrer_id,
                    'referred_id' => $commission->referred_id,
                    'level' => $commission->level,
                    'amount' => $amount,
                    'transaction_amount' => $transactionAmount,
                    'type' => 'transaction_commission',
                    'status' => 'paid',
                ]);

                $commission->update(['status' => 'active']);
            });
        }
    }

    public function getNetworkTree(User $user, int $maxDepth = 3): array
    {
        return $this->buildTree($user, 1, $maxDepth);
    }

    protected function buildTree(
        User $user,
        int $currentDepth,
        int $maxDepth
    ): array {
        if ($currentDepth > $maxDepth) {
            return [];
        }

        return $user->referrals->map(function ($referred) use ($user, $currentDepth, $maxDepth) {
            return [
                'id' => $referred->id,
                'name' => $referred->name,
                'email' => $referred->masked_email ?? $this->maskEmail($referred->email),
                'avatar' => $referred->avatar,
                'level' => $currentDepth,
                'joinedAt' => $referred->created_at->format('M Y'),
                'status' => $referred->kyc_status ?? 'pending',
                'totalCommission' => $this->getCommissionFromUser($user->id, $referred->id),
                'children' => $currentDepth < $maxDepth
                    ? $this->buildTree($referred, $currentDepth + 1, $maxDepth)
                    : [],
            ];
        })->toArray();
    }

    protected function getCommissionFromUser(int $referrerId, int $referredId): float
    {
        return ReferralCommission::where('referrer_id', $referrerId)
            ->where('referred_id', $referredId)
            ->where('type', 'transaction_commission')
            ->sum('amount');
    }

    protected function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email);

        return substr($local, 0, 2).str_repeat('*', strlen($local) - 2).'@'.$domain;
    }

    public function getTotalEarnings(User $user): float
    {
        return ReferralCommission::where('referrer_id', $user->id)
            ->where('status', 'paid')
            ->sum('amount');
    }

    public function getPendingEarnings(User $user): float
    {
        return ReferralCommission::where('referrer_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');
    }

    public function getTotalReferrals(User $user): int
    {
        return $user->referrals()->count();
    }

    public function getReferralCountByLevel(User $user): array
    {
        $referrals = $user->referrals()->with('referredBy')->get();

        $counts = [
            1 => 0,
            2 => 0,
            3 => 0,
        ];

        foreach ($referrals as $referral) {
            $level = $this->getReferralLevel($user, $referral);
            if ($level > 0 && $level <= 3) {
                $counts[$level]++;
            }
        }

        return $counts;
    }

    protected function getReferralLevel(User $user, User $referral): int
    {
        $current = $referral;
        $level = 1;

        while ($current->referredBy) {
            if ($current->referredBy->id === $user->id) {
                return $level;
            }
            $current = $current->referredBy;
            $level++;
        }

        return 0;
    }

    public function withdraw(User $user, float $amount): void
    {
        $available = $this->getTotalEarnings($user);

        if ($amount > $available) {
            throw new \Exception('Insufficient earnings to withdraw.');
        }

        $user->wallet->increment('balance', $amount);
    }
}
