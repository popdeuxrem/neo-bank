<?php

namespace App\Services;

use App\Models\DpsInstallment;
use App\Models\DpsPlan;
use App\Models\DpsSubscription;
use App\Models\User;
use Illuminate\Support\Carbon;

class DpsService
{
    public function calculate(
        DpsPlan $plan,
        float $monthlyAmount,
        int $months
    ): array {
        $totalDeposited = $monthlyAmount * $months;
        $rate = $plan->interest_rate / 100;
        $interest = $monthlyAmount * $rate * $months * ($months + 1) / 24;
        $maturityAmount = $totalDeposited + $interest;

        return [
            'monthlyAmount' => $monthlyAmount,
            'months' => $months,
            'totalDeposited' => round($totalDeposited, 2),
            'totalInterest' => round($interest, 2),
            'maturityAmount' => round($maturityAmount, 2),
            'effectiveYield' => $totalDeposited > 0 ? round(($interest / $totalDeposited) * 100, 2) : 0,
            'maturityDate' => Carbon::now()->addMonths($months)->format('M d, Y'),
        ];
    }

    public function subscribe(
        User $user,
        DpsPlan $plan,
        array $data
    ): DpsSubscription {
        $subscription = DpsSubscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'account_id' => $data['account_id'],
            'monthly_amount' => $data['monthly_amount'],
            'start_date' => $data['start_date'],
            'maturity_date' => Carbon::parse($data['start_date'])->addMonths($plan->duration_months),
            'total_deposited' => 0,
            'interest_earned' => 0,
            'status' => 'active',
        ]);

        $this->createInstallments($subscription, $plan);

        return $subscription;
    }

    protected function createInstallments(DpsSubscription $subscription, DpsPlan $plan): void
    {
        $date = Carbon::parse($subscription->start_date);

        for ($i = 1; $i <= $plan->duration_months; $i++) {
            DpsInstallment::create([
                'subscription_id' => $subscription->id,
                'installment_number' => $i,
                'due_date' => $date->format('Y-m-d'),
                'amount' => $subscription->monthly_amount,
                'status' => 'pending',
            ]);
            $date->addMonth();
        }
    }

    public function getPaymentSchedule(DpsSubscription $dps): array
    {
        $schedule = [];
        $date = Carbon::parse($dps->start_date);

        for ($i = 1; $i <= $dps->plan->duration_months; $i++) {
            $schedule[] = [
                'installment' => $i,
                'due_date' => $date->format('Y-m-d'),
                'amount' => $dps->monthly_amount,
                'status' => $dps->installments->where('installment_number', $i)->first()?->status ?? 'upcoming',
            ];
            $date->addMonth();
        }

        return $schedule;
    }

    public function payInstallment(User $user, DpsSubscription $dps): void
    {
        $nextInstallment = $dps->installments()
            ->where('status', 'pending')
            ->orderBy('installment_number')
            ->first();

        if (! $nextInstallment) {
            return;
        }

        $nextInstallment->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $dps->increment('total_deposited', $dps->monthly_amount);

        $interestRate = $dps->plan->interest_rate / 100 / 12;
        $interest = $dps->total_deposited * $interestRate;
        $dps->increment('interest_earned', $interest);

        $allPaid = $dps->installments()->where('status', 'pending')->doesntExist();
        if ($allPaid) {
            $dps->update(['status' => 'matured']);
        }
    }

    public function close(User $user, DpsSubscription $dps): void
    {
        $dps->update(['status' => 'closed']);
    }
}
