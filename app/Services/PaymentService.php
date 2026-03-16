<?php

namespace App\Services;

use App\Models\Banking\DpsSubscription;
use App\Models\Banking\Loan;
use App\Models\Banking\LoanPlan;
use App\Models\Payment;
use App\Models\ReferralCommission;
use App\Models\Rewards\RewardSetting;
use App\Models\Rewards\RewardTransaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function sendLocal(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            $fee = $this->calculateFee($data['amount'], 'local');

            $payment = Payment::create([
                'user_id' => $user->id,
                'from_account_id' => $data['account_id'],
                'recipient_name' => $data['recipient_name'],
                'account_number' => $data['account_number'],
                'routing_number' => $data['routing_number'] ?? null,
                'bank_name' => $data['bank_name'] ?? null,
                'amount' => $data['amount'],
                'fee' => $fee,
                'currency' => $data['currency'] ?? 'USD',
                'memo' => $data['memo'] ?? null,
                'type' => 'local',
                'status' => 'pending',
            ]);

            return $payment;
        });
    }

    public function sendInternational(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            $fee = $this->calculateFee($data['amount'], 'international');

            $payment = Payment::create([
                'user_id' => $user->id,
                'from_account_id' => $data['account_id'],
                'recipient_name' => $data['recipient_name'],
                'account_number' => $data['account_number'],
                'routing_number' => $data['routing_number'] ?? null,
                'bank_name' => $data['bank_name'] ?? null,
                'swift_bic' => $data['swift_bic'] ?? null,
                'amount' => $data['amount'],
                'fee' => $fee,
                'currency' => $data['currency'] ?? 'USD',
                'memo' => $data['memo'] ?? null,
                'type' => 'international',
                'status' => 'pending',
            ]);

            return $payment;
        });
    }

    public function getLocalFees(): array
    {
        return [
            'flat' => config('banking.local_transfer_fee_flat', 0.50),
            'percentage' => config('banking.local_transfer_fee_pct', 0.001),
            'min' => config('banking.local_transfer_fee_min', 0.25),
            'max' => config('banking.local_transfer_fee_max', 25.00),
        ];
    }

    private function calculateFee(float $amount, string $type): float
    {
        $fees = $type === 'local' ? $this->getLocalFees() : [
            'flat' => 10.00,
            'percentage' => 0.002,
            'min' => 10.00,
            'max' => 50.00,
        ];

        $calculated = max(
            $fees['flat'] + ($amount * $fees['percentage']),
            $fees['min']
        );

        return min($calculated, $fees['max']);
    }
}

class DpsService
{
    public function calculate($plan, float $monthlyAmount, int $months): array
    {
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
            'effectiveYield' => round(($interest / $totalDeposited) * 100, 2),
            'maturityDate' => now()->addMonths($months)->format('M d, Y'),
        ];
    }

    public function subscribe(User $user, $plan, array $data)
    {
        return DpsSubscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'account_id' => $data['account_id'],
            'monthly_amount' => $data['monthly_amount'],
            'start_date' => $data['start_date'],
            'maturity_date' => now()->addMonths($plan->duration_months),
            'total_deposited' => 0,
            'interest_earned' => 0,
            'status' => 'active',
        ]);
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
                'status' => $dps->installments
                    ->where('installment_number', $i)
                    ->first()?->status ?? 'upcoming',
            ];
            $date->addMonth();
        }

        return $schedule;
    }
}

class LoanService
{
    public function calculateEmi(float $principal, float $annualRate, int $months): array
    {
        $monthlyRate = $annualRate / 12 / 100;

        if ($monthlyRate == 0) {
            $emi = $principal / $months;
        } else {
            $emi = $principal * $monthlyRate * pow(1 + $monthlyRate, $months)
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

    public function getAmortizationSchedule($loan): array
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
                'status' => 'upcoming',
            ];
        }

        return $schedule;
    }

    public function checkEligibility(User $user): array
    {
        return [
            'eligible' => $user->kyc_status === 'verified' || $user->account_status === 'active',
            'maxAmount' => 50000.00,
            'reasons' => [],
        ];
    }

    public function apply(User $user, array $data): Loan
    {
        $plan = LoanPlan::findOrFail($data['plan_id']);
        $emiData = $this->calculateEmi(
            $data['amount'],
            $plan->interest_rate,
            $data['duration_months']
        );

        return Loan::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'account_id' => $data['account_id'],
            'amount' => $data['amount'],
            'interest_rate' => $plan->interest_rate,
            'duration_months' => $data['duration_months'],
            'emi_amount' => $emiData['emi'],
            'total_payable' => $emiData['totalPayment'],
            'total_paid' => 0,
            'purpose' => $data['purpose'],
            'employment_type' => $data['employment_type'],
            'monthly_income' => $data['monthly_income'],
            'status' => 'pending',
        ]);
    }
}

class RewardService
{
    public function award(User $user, string $type, float $referenceAmount = 0): int
    {
        $setting = RewardSetting::where('type', $type)->first();
        if (! $setting || ! $setting->enabled) {
            return 0;
        }

        $points = match ($setting->calculation_type) {
            'fixed' => $setting->points,
            'per_amount' => floor($referenceAmount / $setting->per_amount_unit) * $setting->points,
            'percentage' => floor($referenceAmount * $setting->percentage / 100),
            default => 0,
        };

        if ($points <= 0) {
            return 0;
        }

        RewardTransaction::create([
            'user_id' => $user->id,
            'points' => $points,
            'type' => 'earned',
            'reason' => $type,
            'reference_amount' => $referenceAmount,
        ]);

        $user->rewards()->increment('balance', $points);

        return $points;
    }

    public function redeem(User $user, int $points, string $method): float
    {
        if (! $user->rewards || $user->rewards->balance < $points) {
            throw new \Exception('Insufficient reward points.');
        }

        $cashValue = $points / config('rewards.points_per_dollar', 100);

        RewardTransaction::create([
            'user_id' => $user->id,
            'points' => -$points,
            'type' => 'redeemed',
            'reason' => "Redeemed for {$method}",
            'cash_value' => $cashValue,
        ]);

        $user->rewards()->decrement('balance', $points);

        if ($method === 'cash' && $user->wallet) {
            $user->wallet->credit($cashValue, 'Reward points redemption');
        }

        return $cashValue;
    }
}

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
                'status' => 'active',
            ]);

            $currentUser = $referrer;
        }
    }

    public function calculateAndPayCommission(User $user, float $transactionAmount): void
    {
        $commissions = ReferralCommission::where('referred_id', $user->id)
            ->where('status', 'active')
            ->with('referrer')
            ->get();

        foreach ($commissions as $commission) {
            $amount = $transactionAmount * ($commission->rate / 100);

            if ($commission->referrer->wallet) {
                $commission->referrer->wallet->credit(
                    $amount,
                    "Level {$commission->level} referral commission"
                );
            }

            ReferralCommission::create([
                'referrer_id' => $commission->referrer_id,
                'referred_id' => $user->id,
                'level' => $commission->level,
                'amount' => $amount,
                'transaction_amount' => $transactionAmount,
                'type' => 'transaction_commission',
                'status' => 'paid',
            ]);
        }
    }
}
