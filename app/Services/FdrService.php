<?php

namespace App\Services;

use App\Models\Banking\FdrPlan;
use App\Models\Banking\FdrSubscription;
use App\Models\User;
use Illuminate\Support\Carbon;

class FdrService
{
    public function calculate(
        FdrPlan $plan,
        float $principal,
        int $months
    ): array {
        $compoundingFrequency = $plan->compounding_frequency ?? 'monthly';

        $rate = $plan->interest_rate / 100;

        $n = match ($compoundingFrequency) {
            'daily' => 365,
            'weekly' => 52,
            'monthly' => 12,
            'quarterly' => 4,
            'annually' => 1,
            default => 12,
        };

        $t = $months / 12;

        $amount = $principal * pow(1 + $rate / $n, $n * $t);
        $interest = $amount - $principal;

        return [
            'principal' => $principal,
            'months' => $months,
            'interestRate' => $plan->interest_rate,
            'compoundingFrequency' => $compoundingFrequency,
            'totalAmount' => round($amount, 2),
            'interestEarned' => round($interest, 2),
            'effectiveRate' => round(($interest / $principal) * 100, 2),
            'maturityDate' => Carbon::now()->addMonths($months)->format('M d, Y'),
        ];
    }

    public function open(
        User $user,
        FdrPlan $plan,
        array $data
    ): FdrSubscription {
        return FdrSubscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'account_id' => $data['account_id'],
            'principal' => $data['principal'],
            'interest_rate' => $plan->interest_rate,
            'duration_months' => $data['duration_months'],
            'compounding_frequency' => $plan->compounding_frequency,
            'start_date' => $data['start_date'],
            'maturity_date' => Carbon::parse($data['start_date'])->addMonths($data['duration_months']),
            'current_value' => $data['principal'],
            'interest_earned' => 0,
            'status' => 'active',
        ]);
    }

    public function calculateEarlyWithdrawal(
        FdrSubscription $fdr,
        ?Carbon $withdrawalDate = null
    ): array {
        $date = $withdrawalDate ?? Carbon::now();
        $monthsElapsed = $date->diffInMonths($fdr->start_date);

        $penaltyRate = $fdr->plan->early_withdrawal_penalty ?? 0;
        $penalty = $fdr->interest_earned * ($penaltyRate / 100);

        $netAmount = $fdr->current_value - $penalty;

        return [
            'currentValue' => $fdr->current_value,
            'interestEarned' => $fdr->interest_earned,
            'penalty' => round($penalty, 2),
            'penaltyRate' => $penaltyRate,
            'netAmount' => round($netAmount, 2),
            'monthsElapsed' => $monthsElapsed,
            'monthsRemaining' => max(0, $fdr->duration_months - $monthsElapsed),
        ];
    }

    public function withdrawEarly(User $user, FdrSubscription $fdr): float
    {
        $calculation = $this->calculateEarlyWithdrawal($fdr);

        $fdr->update([
            'status' => 'closed',
            'current_value' => $calculation['netAmount'],
        ]);

        $user->wallet->increment('balance', $calculation['netAmount']);

        return $calculation['netAmount'];
    }

    public function mature(FdrSubscription $fdr): void
    {
        $fdr->update([
            'status' => 'matured',
        ]);

        $totalAmount = $fdr->current_value + $fdr->interest_earned;

        $fdr->user->wallet->increment('balance', $totalAmount);
    }

    public function renew(FdrSubscription $fdr, FdrPlan $newPlan): FdrSubscription
    {
        $maturedValue = $fdr->current_value + $fdr->interest_earned;

        return $this->open($fdr->user, $newPlan, [
            'account_id' => $fdr->account_id,
            'principal' => $maturedValue,
            'duration_months' => $newPlan->duration_options[0] ?? 12,
            'start_date' => Carbon::now()->format('Y-m-d'),
        ]);
    }
}
