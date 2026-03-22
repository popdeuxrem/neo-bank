<?php

namespace App\Services;

use App\Models\Banking\BankProfit;
use App\Models\Banking\DpsInstallment;
use App\Models\Banking\DpsPlan;
use App\Models\Banking\DpsSubscription;
use App\Models\User;
use App\Services\Banking\BankProfitService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

/**
 * DPS (Deposit Pension Scheme) Service
 *
 * Handles DPS subscriptions, installment tracking, and maturity calculations.
 */
class DpsService
{
    public function __construct(
        protected ?BankProfitService $bankProfitService = null
    ) {}

    /**
     * Calculate DPS maturity amount.
     *
     * @throws InvalidArgumentException
     */
    public function calculate(DpsPlan $plan, float $monthlyAmount, int $months): array
    {
        if ($monthlyAmount <= 0) {
            throw new InvalidArgumentException('Monthly amount must be greater than 0');
        }

        if ($months <= 0) {
            throw new InvalidArgumentException('Duration must be greater than 0');
        }

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

    /**
     * Subscribe to a DPS plan.
     *
     * @throws InvalidArgumentException
     */
    public function subscribe(User $user, DpsPlan $plan, array $data): DpsSubscription
    {
        $this->validateSubscriptionData($user, $plan, $data);

        $subscription = DpsSubscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'account_id' => $data['account_id'],
            'monthly_amount' => $data['monthly_amount'],
            'start_date' => $data['start_date'],
            'maturity_date' => Carbon::parse($data['start_date'])->addMonths($plan->duration_months)->toDateString(),
            'total_deposited' => 0,
            'interest_earned' => 0,
            'status' => 'active',
        ]);

        $this->createInstallments($subscription, $plan);

        return $subscription;
    }

    /**
     * Create installment schedule.
     *
     * @throws RuntimeException
     */
    protected function createInstallments(DpsSubscription $subscription, DpsPlan $plan): void
    {
        try {
            $date = Carbon::parse($subscription->start_date);

            for ($i = 1; $i <= $plan->duration_months; $i++) {
                DpsInstallment::create([
                    'subscription_id' => $subscription->id,
                    'installment_number' => $i,
                    'due_date' => $date->toDateString(),
                    'amount' => $subscription->monthly_amount,
                    'status' => 'pending',
                ]);
                $date->addMonth();
            }
        } catch (\Throwable $e) {
            $subscription->delete();
            throw new RuntimeException("Failed to create installment schedule: {$e->getMessage()}");
        }
    }

    /**
     * Get payment schedule for DPS.
     */
    public function getPaymentSchedule(DpsSubscription $dps): array
    {
        $schedule = [];
        $date = Carbon::parse($dps->start_date);

        for ($i = 1; $i <= $dps->plan->duration_months; $i++) {
            $installment = $dps->installments()
                ->where('installment_number', $i)
                ->first();

            $schedule[] = [
                'installment' => $i,
                'due_date' => $date->toDateString(),
                'amount' => $dps->monthly_amount,
                'status' => $installment?->status ?? 'upcoming',
                'paid_at' => $installment?->paid_at?->toDateString(),
            ];
            $date->addMonth();
        }

        return $schedule;
    }

    /**
     * Pay next installment.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function payInstallment(User $user, DpsSubscription $dps): DpsInstallment
    {
        if ($dps->status !== 'active') {
            throw new InvalidArgumentException('DPS subscription is not active');
        }

        $nextInstallment = $dps->installments()
            ->where('status', 'pending')
            ->orderBy('installment_number')
            ->first();

        if (! $nextInstallment) {
            throw new InvalidArgumentException('No pending installments');
        }

        $wallet = $user->wallet;

        if (! $wallet || $wallet->balance < $dps->monthly_amount) {
            throw new InvalidArgumentException('Insufficient funds for installment payment');
        }

        return DB::transaction(function () use ($dps, $nextInstallment, $wallet) {
            $wallet->decrement('balance', $dps->monthly_amount);

            $nextInstallment->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $dps->increment('total_deposited', $dps->monthly_amount);

            $interestRate = $dps->plan->interest_rate / 100 / 12;
            $interest = $dps->total_deposited * $interestRate;
            $dps->increment('interest_earned', $interest);

            $pendingCount = $dps->installments()->where('status', 'pending')->count();

            if ($pendingCount === 0) {
                $this->mature($dps, $wallet);
            }

            return $nextInstallment;
        });
    }

    /**
     * Process installment payment via admin.
     */
    public function processInstallmentPayment(DpsSubscription $dps, int $installmentId): DpsInstallment
    {
        $installment = $dps->installments()
            ->where('id', $installmentId)
            ->where('status', 'pending')
            ->firstOrFail();

        $installment->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $dps->increment('total_deposited', $dps->monthly_amount);

        $interestRate = $dps->plan->interest_rate / 100 / 12;
        $interest = $dps->total_deposited * $interestRate;
        $dps->increment('interest_earned', $interest);

        $pendingCount = $dps->installments()->where('status', 'pending')->count();

        if ($pendingCount === 0) {
            $dps->update(['status' => 'matured']);
        }

        return $installment;
    }

    /**
     * Handle DPS maturity.
     *
     * @throws RuntimeException
     */
    protected function mature(DpsSubscription $dps, $wallet): void
    {
        $maturityAmount = $dps->total_deposited + $dps->interest_earned;

        $dps->update([
            'status' => 'matured',
            'matured_at' => now(),
        ]);

        if ($wallet) {
            $wallet->increment('balance', $maturityAmount);
        }

        if ($this->bankProfitService && $dps->interest_earned > 0) {
            $this->recordDpsProfit($dps, (int) round($dps->interest_earned * 100));
        }
    }

    /**
     * Close DPS early.
     *
     * @throws InvalidArgumentException
     */
    public function close(User $user, DpsSubscription $dps): array
    {
        if ($dps->status !== 'active') {
            throw new InvalidArgumentException('Can only close active DPS');
        }

        $penaltyRate = $dps->plan->early_withdrawal_penalty ?? 0;
        $penaltyAmount = $dps->interest_earned * ($penaltyRate / 100);
        $refundAmount = $dps->total_deposited - $penaltyAmount;

        DB::transaction(function () use ($dps, $user, $refundAmount) {
            $dps->update([
                'status' => 'closed',
                'closed_at' => now(),
                'refund_amount' => $refundAmount,
            ]);

            $user->wallet?->increment('balance', $refundAmount);
        });

        return [
            'totalDeposited' => $dps->total_deposited,
            'interestEarned' => $dps->interest_earned,
            'penalty' => $penaltyAmount,
            'refundAmount' => $refundAmount,
            'status' => 'closed',
        ];
    }

    /**
     * Get active DPS subscriptions for user.
     */
    public function getActiveSubscriptions(User $user): Collection
    {
        return DpsSubscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->with(['plan', 'installments'])
            ->get();
    }

    /**
     * Get matured DPS subscriptions.
     */
    public function getMaturedSubscriptions(): Collection
    {
        return DpsSubscription::where('status', 'matured')
            ->whereNull('matured_at')
            ->orWhere('matured_at', '<', now()->subDays(1))
            ->get();
    }

    /**
     * Get DPS summary for user.
     */
    public function getSummary(User $user): array
    {
        $subscriptions = DpsSubscription::where('user_id', $user->id)->get();

        return [
            'totalSubscriptions' => $subscriptions->count(),
            'activeCount' => $subscriptions->where('status', 'active')->count(),
            'maturedCount' => $subscriptions->where('status', 'matured')->count(),
            'closedCount' => $subscriptions->where('status', 'closed')->count(),
            'totalDeposited' => $subscriptions->sum('total_deposited'),
            'totalInterest' => $subscriptions->sum('interest_earned'),
        ];
    }

    /**
     * Validate subscription data.
     *
     * @throws InvalidArgumentException
     */
    protected function validateSubscriptionData(User $user, DpsPlan $plan, array $data): void
    {
        $requiredFields = ['account_id', 'monthly_amount', 'start_date'];

        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }

        $monthlyAmount = (float) $data['monthly_amount'];

        if ($monthlyAmount < $plan->min_amount) {
            throw new InvalidArgumentException("Minimum monthly amount is {$plan->min_amount}");
        }

        if ($plan->max_amount && $monthlyAmount > $plan->max_amount) {
            throw new InvalidArgumentException("Maximum monthly amount is {$plan->max_amount}");
        }

        if ($user->kyc_status !== 'verified') {
            throw new InvalidArgumentException('KYC verification required for DPS subscription');
        }
    }

    /**
     * Get next due installment.
     */
    public function getNextInstallment(DpsSubscription $dps): ?DpsInstallment
    {
        return $dps->installments()
            ->where('status', 'pending')
            ->orderBy('installment_number')
            ->first();
    }

    /**
     * Record DPS profit.
     */
    protected function recordDpsProfit(DpsSubscription $dps, int $grossInterest): void
    {
        if (! $this->bankProfitService) {
            return;
        }

        $bankShare = (int) round($grossInterest * 0.1);

        if ($bankShare > 0) {
            BankProfit::create([
                'profit_type' => BankProfit::TYPE_INTEREST_SPREAD,
                'source_type' => BankProfit::SOURCE_DPS,
                'source_id' => $dps->id,
                'amount' => $bankShare,
                'currency' => 'USD',
                'profit_date' => now()->toDateString(),
                'period' => BankProfit::PERIOD_MONTHLY,
                'description' => "DPS Interest Spread - DPS #{$dps->id}",
                'breakdown' => [
                    'gross_interest' => $grossInterest,
                    'bank_spread' => $bankShare,
                ],
            ]);
        }
    }

    /**
     * Calculate late payment interest.
     */
    public function calculateLateFee(DpsSubscription $dps): float
    {
        $nextInstallment = $this->getNextInstallment($dps);

        if (! $nextInstallment) {
            return 0;
        }

        $dueDate = Carbon::parse($nextInstallment->due_date);

        if (now()->lte($dueDate)) {
            return 0;
        }

        $lateDays = now()->diffInDays($dueDate);
        $lateFeeRate = $dps->plan->late_payment_fee ?? 0;

        return round($dps->monthly_amount * ($lateFeeRate / 100) * ($lateDays / 30), 2);
    }
}
