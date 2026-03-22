<?php

declare(strict_types=1);

namespace App\Jobs\Banking;

use App\Models\Banking\DpsInstallment;
use App\Models\Banking\DpsSubscription;
use App\Models\Banking\UserEarning;
use App\Models\Banking\BankProfit;
use App\Models\Banking\Wallet;
use App\Models\Ledger\Transaction;
use App\Services\Ledger\LedgerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Compounding Job for Deposit Pension Scheme (DPS)
 *
 * Processes DPS installments and interest calculations.
 * Runs monthly to calculate interest on accumulated deposits.
 *
 * @package App\Jobs\Banking
 */
class ProcessDpsCompounding implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 300;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly ?int $subscriptionId = null,
        public readonly ?Carbon $compoundingDate = null
    ) {
        $this->compoundingDate = $compoundingDate ?? Carbon::today();
    }

    /**
     * Execute the job.
     */
    public function handle(LedgerService $ledgerService): void
    {
        $subscriptions = $this->getSubscriptionsToProcess();

        Log::info('DPS Compounding job started', [
            'date' => $this->compoundingDate->toDateString(),
            'subscriptions_count' => $subscriptions->count(),
        ]);

        $processed = 0;
        $failed = 0;

        foreach ($subscriptions as $subscription) {
            try {
                $this->processInstallment($subscription, $ledgerService);
                $processed++;
            } catch (InvalidArgumentException|RuntimeException $e) {
                $failed++;
                Log::error('DPS installment processing failed for subscription', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);

                continue;
            }
        }

        Log::info('DPS Compounding job completed', [
            'date' => $this->compoundingDate->toDateString(),
            'processed' => $processed,
            'failed' => $failed,
        ]);
    }

    /**
     * Get DPS subscriptions that need processing.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, DpsSubscription>
     */
    protected function getSubscriptionsToProcess(): \Illuminate\Database\Eloquent\Collection
    {
        $query = DpsSubscription::where('status', 'active')
            ->whereDate('start_date', '<=', $this->compoundingDate);

        if ($this->subscriptionId !== null) {
            return DpsSubscription::where('id', $this->subscriptionId)->get();
        }

        return $query->get()->filter(function (DpsSubscription $subscription) {
            return $this->shouldProcess($subscription);
        });
    }

    /**
     * Check if subscription should be processed on this date.
     */
    protected function shouldProcess(DpsSubscription $subscription): bool
    {
        if ($subscription->status !== 'active') {
            return false;
        }

        $maturityDate = Carbon::parse($subscription->maturity_date);
        if ($this->compoundingDate->gt($maturityDate)) {
            return false;
        }

        return $this->compoundingDate->day === 1;
    }

    /**
     * Process installment for a single DPS subscription.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    protected function processInstallment(DpsSubscription $subscription, LedgerService $ledgerService): void
    {
        $pendingInstallment = $subscription->installments()
            ->where('status', 'pending')
            ->orderBy('installment_number')
            ->first();

        if (!$pendingInstallment) {
            $this->processMaturity($subscription, $ledgerService);
            return;
        }

        $this->processMonthlyInstallment($subscription, $pendingInstallment, $ledgerService);
    }

    /**
     * Process monthly installment payment.
     *
     * @throws RuntimeException
     */
    protected function processMonthlyInstallment(
        DpsSubscription $subscription,
        DpsInstallment $installment,
        LedgerService $ledgerService
    ): void {
        $user = $subscription->user;
        $wallet = $user?->wallet;

        if (!$wallet) {
            throw new RuntimeException('User wallet not found');
        }

        $installmentAmount = (float) $installment->amount;

        if ($wallet->balance < $installmentAmount) {
            Log::warning('DPS installment skipped - insufficient funds', [
                'subscription_id' => $subscription->id,
                'user_id' => $user->id,
                'required' => $installmentAmount,
                'available' => $wallet->balance,
            ]);

            return;
        }

        DB::transaction(function () use ($subscription, $installment, $wallet, $installmentAmount) {
            $wallet->decrement('balance', $installmentAmount);

            $subscription->increment('total_deposited', $installmentAmount);

            $interest = $this->calculateInterest($subscription);
            if ($interest > 0) {
                $subscription->increment('interest_earned', $interest);
            }

            $installment->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $this->updateNextInstallment($subscription);
        });

        $this->recordUserEarnings($subscription, $interest ?? 0);

        Log::info('DPS installment processed', [
            'subscription_id' => $subscription->id,
            'installment_number' => $installment->installment_number,
            'amount' => $installmentAmount,
            'interest' => $interest ?? 0,
        ]);
    }

    /**
     * Calculate interest for accumulated deposits.
     */
    protected function calculateInterest(DpsSubscription $subscription): int
    {
        $totalDeposited = (float) $subscription->total_deposited;
        $rate = $subscription->plan->interest_rate / 100 / 12;

        $interest = $totalDeposited * $rate;

        return (int) round($interest * 100);
    }

    /**
     * Process maturity for subscription.
     *
     * @throws RuntimeException
     */
    protected function processMaturity(DpsSubscription $subscription, LedgerService $ledgerService): void
    {
        $totalAmount = (float) $subscription->total_deposited + (float) $subscription->interest_earned;
        $user = $subscription->user;
        $wallet = $user?->wallet;

        if (!$wallet) {
            throw new RuntimeException('User wallet not found');
        }

        DB::transaction(function () use ($subscription, $wallet, $totalAmount) {
            $wallet->increment('balance', $totalAmount);

            $subscription->update([
                'status' => 'matured',
            ]);
        });

        $this->recordMaturityProfit($subscription);

        Log::info('DPS matured', [
            'subscription_id' => $subscription->id,
            'total_amount' => $totalAmount,
        ]);
    }

    /**
     * Update next installment in schedule.
     */
    protected function updateNextInstallment(DpsSubscription $subscription): void
    {
        $remainingPending = $subscription->installments()
            ->where('status', 'pending')
            ->count();

        if ($remainingPending === 0) {
            $subscription->update(['status' => 'matured']);
        }
    }

    /**
     * Record user earnings from interest.
     */
    protected function recordUserEarnings(DpsSubscription $subscription, int $interestCents): void
    {
        if ($interestCents <= 0) {
            return;
        }

        $user = $subscription->user;
        $wallet = $user?->wallet;

        if (!$wallet) {
            return;
        }

        DB::transaction(function () use ($subscription, $interestCents, $wallet) {
            $wallet->increment('balance', $interestCents / 100);

            UserEarning::create([
                'user_id' => $subscription->user_id,
                'wallet_id' => $wallet->id,
                'earning_type' => UserEarning::TYPE_DPS_INTEREST,
                'source_type' => UserEarning::SOURCE_DPS,
                'source_id' => $subscription->id,
                'amount' => $interestCents,
                'currency' => 'USD',
                'earning_date' => $this->compoundingDate->toDateString(),
                'status' => UserEarning::STATUS_CREDITED,
                'description' => "DPS Interest - {$subscription->plan->name}",
            ]);
        });
    }

    /**
     * Record bank profit from DPS interest spread.
     */
    protected function recordMaturityProfit(DpsSubscription $subscription): void
    {
        $interest = (float) $subscription->interest_earned;

        if ($interest <= 0) {
            return;
        }

        $bankShare = (int) round($interest * 0.1 * 100);

        if ($bankShare > 0) {
            BankProfit::create([
                'profit_type' => BankProfit::TYPE_INTEREST_SPREAD,
                'source_type' => BankProfit::SOURCE_DPS,
                'source_id' => $subscription->id,
                'amount' => $bankShare,
                'currency' => 'USD',
                'profit_date' => $this->compoundingDate->toDateString(),
                'period' => BankProfit::PERIOD_MONTHLY,
                'description' => "DPS Interest Spread - Subscription {$subscription->id}",
                'breakdown' => [
                    'total_interest' => $interest,
                    'user_earned' => $interest - ($bankShare / 100),
                    'bank_spread' => $bankShare / 100,
                ],
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('DPS Compounding job failed', [
            'subscription_id' => $this->subscriptionId,
            'date' => $this->compoundingDate?->toDateString(),
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }

    /**
     * Calculate projected returns for a subscription.
     */
    public static function calculateProjectedReturns(DpsSubscription $subscription): array
    {
        $monthsRemaining = Carbon::parse($subscription->start_date)
            ->diffInMonths(Carbon::parse($subscription->maturity_date));

        $monthlyAmount = (float) $subscription->monthly_amount;
        $rate = $subscription->plan->interest_rate / 100;

        $totalDeposited = $monthlyAmount * $monthsRemaining;
        $totalInterest = $monthlyAmount * $rate * $monthsRemaining * ($monthsRemaining + 1) / 24;
        $maturityAmount = $totalDeposited + $totalInterest;

        return [
            'months_remaining' => $monthsRemaining,
            'monthly_amount' => $monthlyAmount,
            'total_deposited_remaining' => $totalDeposited,
            'projected_interest' => round($totalInterest, 2),
            'projected_maturity_value' => round($maturityAmount, 2),
        ];
    }
}
