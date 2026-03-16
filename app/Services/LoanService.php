<?php

namespace App\Services;

use App\Models\Banking\Loan;
use App\Models\Banking\LoanEmi;
use App\Models\Banking\LoanPlan;
use App\Models\User;
use Illuminate\Support\Carbon;

class LoanService
{
    public function calculateEmi(
        float $principal,
        float $annualRate,
        int $months
    ): array {
        $monthlyRate = $annualRate / 12 / 100;

        if ($monthlyRate == 0) {
            $emi = $principal / $months;
        } else {
            $emi = $principal * $monthlyRate
                * pow(1 + $monthlyRate, $months)
                / (pow(1 + $monthlyRate, $months) - 1);
        }

        $totalPayment = $emi * $months;
        $totalInterest = $totalPayment - $principal;

        return [
            'emi' => round($emi, 2),
            'totalPayment' => round($totalPayment, 2),
            'totalInterest' => round($totalInterest, 2),
            'effectiveApr' => round($annualRate, 2),
            'months' => $months,
        ];
    }

    public function getAmortizationSchedule(Loan $loan): array
    {
        $schedule = [];
        $balance = $loan->amount;
        $monthlyRate = $loan->interest_rate / 12 / 100;
        $emi = $loan->emi_amount;

        for ($i = 1; $i <= $loan->duration_months; $i++) {
            $interest = $balance * $monthlyRate;
            $principal = $emi - $interest;
            $balance = max(0, $balance - $principal);

            $schedule[] = [
                'month' => $i,
                'emi' => round($emi, 2),
                'principal' => round($principal, 2),
                'interest' => round($interest, 2),
                'balance' => round($balance, 2),
                'status' => $this->getEmiStatus($loan, $i),
            ];
        }

        return $schedule;
    }

    protected function getEmiStatus(Loan $loan, int $month): string
    {
        $emi = $loan->emiSchedule->where('month', $month)->first();

        return $emi?->status ?? 'upcoming';
    }

    public function checkEligibility(User $user): array
    {
        return [
            'eligible' => $user->kyc_status === 'verified'
                && $user->account_status === 'active',
            'maxAmount' => $this->calculateMaxLoanAmount($user),
            'reasons' => $this->getEligibilityReasons($user),
        ];
    }

    protected function calculateMaxLoanAmount(User $user): float
    {
        $portfolio = $user->portfolio;

        return match ($portfolio?->tier ?? 'basic') {
            'business' => 100000.00,
            'pro' => 50000.00,
            default => 25000.00,
        };
    }

    protected function getEligibilityReasons(User $user): array
    {
        $reasons = [];

        if ($user->kyc_status !== 'verified') {
            $reasons[] = 'KYC verification required';
        }

        if ($user->account_status !== 'active') {
            $reasons[] = 'Account must be active';
        }

        return $reasons;
    }

    public function apply(User $user, array $data): Loan
    {
        $plan = LoanPlan::findOrFail($data['plan_id']);

        $emiData = $this->calculateEmi(
            $data['amount'],
            $plan->interest_rate,
            $data['duration_months']
        );

        $loan = Loan::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'account_id' => $data['account_id'],
            'amount' => $data['amount'],
            'interest_rate' => $plan->interest_rate,
            'duration_months' => $data['duration_months'],
            'emi_amount' => $emiData['emi'],
            'total_payable' => $emiData['totalPayment'],
            'purpose' => $data['purpose'],
            'employment_type' => $data['employment_type'],
            'monthly_income' => $data['monthly_income'],
            'status' => 'pending',
        ]);

        $this->createEmiSchedule($loan);

        return $loan;
    }

    protected function createEmiSchedule(Loan $loan): void
    {
        $date = Carbon::now()->addMonth();

        for ($i = 1; $i <= $loan->duration_months; $i++) {
            LoanEmi::create([
                'loan_id' => $loan->id,
                'month' => $i,
                'due_date' => $date->format('Y-m-d'),
                'emi_amount' => $loan->emi_amount,
                'principal_amount' => 0,
                'interest_amount' => 0,
                'status' => 'pending',
            ]);
            $date->addMonth();
        }

        $this->updateEmiPrincipalInterest($loan);
    }

    protected function updateEmiPrincipalInterest(Loan $loan): void
    {
        $schedule = $this->getAmortizationSchedule($loan);

        foreach ($schedule as $entry) {
            LoanEmi::where('loan_id', $loan->id)
                ->where('month', $entry['month'])
                ->update([
                    'principal_amount' => $entry['principal'],
                    'interest_amount' => $entry['interest'],
                ]);
        }
    }

    public function payEmi(User $user, Loan $loan, array $data): void
    {
        $emi = LoanEmi::findOrFail($data['emi_id']);

        $emi->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $loan->increment('total_paid', $loan->emi_amount);

        $allPaid = $loan->emiSchedule()->where('status', 'pending')->doesntExist();
        if ($allPaid) {
            $loan->update(['status' => 'completed', 'disbursed_at' => now()]);
        }
    }
}
