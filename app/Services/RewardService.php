<?php

namespace App\Services;

use App\Models\Rewards\RewardSetting;
use App\Models\Rewards\RewardTransaction;
use App\Models\Rewards\UserReward;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RewardService
{
    public function award(
        User $user,
        string $type,
        float $referenceAmount = 0
    ): int {
        $setting = RewardSetting::where('type', $type)->first();

        if (! $setting || ! $setting->enabled) {
            return 0;
        }

        $points = match ($setting->calculation_type) {
            'fixed' => $setting->points,
            'per_amount' => floor(
                $referenceAmount / $setting->per_amount_unit
            ) * $setting->points,
            'percentage' => floor(
                $referenceAmount * ($setting->percentage / 100)
            ),
            default => 0,
        };

        if ($points <= 0) {
            return 0;
        }

        return DB::transaction(function () use ($user, $type, $referenceAmount, $points) {
            RewardTransaction::create([
                'user_id' => $user->id,
                'points' => $points,
                'type' => 'earned',
                'reason' => $type,
                'reference_amount' => $referenceAmount,
            ]);

            $userReward = $user->rewards;

            if ($userReward) {
                $userReward->increment('balance', $points);
                $userReward->increment('lifetime_earned', $points);
            } else {
                UserReward::create([
                    'user_id' => $user->id,
                    'balance' => $points,
                    'lifetime_earned' => $points,
                    'lifetime_redeemed' => 0,
                ]);
            }

            return $points;
        });
    }

    public function redeem(User $user, int $points, string $method): float
    {
        $userReward = $user->rewards;

        if (! $userReward || $userReward->balance < $points) {
            throw new \Exception('Insufficient reward points.');
        }

        $cashValue = $points / config('rewards.points_per_dollar', 100);

        DB::transaction(function () use ($user, $points, $method, $cashValue, $userReward) {
            RewardTransaction::create([
                'user_id' => $user->id,
                'points' => -$points,
                'type' => 'redeemed',
                'reason' => "Redeemed for {$method}",
                'cash_value' => $cashValue,
            ]);

            $userReward->decrement('balance', $points);
            $userReward->increment('lifetime_redeemed', $points);

            if ($method === 'cash' && $user->wallet) {
                $user->wallet->increment('balance', $cashValue);
            }
        });

        return $cashValue;
    }

    public function getTransactionHistory(User $user, int $limit = 50)
    {
        return $user->rewardTransactions()
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function calculateTierBonus(User $user): int
    {
        $tier = $user->portfolio?->tier ?? 'basic';

        return match ($tier) {
            'business' => 50,
            'pro' => 25,
            default => 0,
        };
    }
}
