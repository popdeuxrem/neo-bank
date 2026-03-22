<?php

namespace App\Jobs\Banking;

use App\Models\Banking\BankProfit;
use App\Models\Banking\FdrInterestHistory;
use App\Models\Banking\FdrSubscription;
use App\Models\Banking\UserEarning;
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
 * Compounding Job for Fixed Deposit Receipts
 *
 * Processes FDR interest compounding based on plan frequency.
 * Supports: daily, weekly, monthly, quarterly, semi-annually, annually, at_maturity
 *
 * @package App\Jobs\Banking
 */
class ProcessFdrCompounding implements ShouldQueue
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
        $subscriptions = $this->getSubscriptionsToCompound();

        Log::info('FDR Compounding job started', [
            'date' => $this->compoundingDate->toDateString(),
            'subscriptions_count' => $subscriptions->count(),
        ]);

        foreach ($subscriptions as $subscription) {
            try {
                $this->compoundInterest($subscription, $ledgerService);
            } catch (InvalidArgumentException|RuntimeException $e) {
                Log::error('FDR compounding failed for subscription', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);

                continue;
            }
        }

        Log::info('FDR Compounding job completed', [
            'date' => $this->compoundingDate->toDateString(),
        ]);
    }

    /**
     * Get FDR subscriptions that need compounding.
     */
    protected function getSubscriptionsToCompound(): \Illuminate\Database\Eloquent\Collection
    {
        $query = FdrSubscription::active()
            ->where('status', 'active')
            ->whereDate('start_date', '<=', $this->compoundingDate);

        if ($this->subscriptionId) {
            return FdrSubscription::where('id', $this->subscriptionId)->get();
        }

        return $query->get()->filter(function (FdrSubscription $subscription) {
            return $this->shouldCompound($subscription);
        });
    }

    /**
     * Check if subscription should be compounded on this date.
     */
    protected function shouldCompound(FdrSubscription $subscription): bool
    {
        $frequency = $subscription->compounding_frequency ?? 'monthly';
        $lastCompounded = $subscription->last_compounded_at ?? $subscription->start_date;

        return match ($frequency) {
            'daily' => true,
            'weekly' => $this->compoundingDate->dayOfWeek === Carbon::MONDAY,
            'monthly' => $this->compoundingDate->day === 1,
            'quarterly' => $this->isQuarterStart($this->compoundingDate),
            'semi_annually' => $this->isSemiAnnualStart($this->compoundingDate),
            'annually' => $this->compoundingDate->month === 1 && $this->compoundingDate->day === 1,
            'at_maturity' => $this->compoundingDate->gte($subscription->maturity_date),
            default => false,
        };
    }

    /**
     * Check if date is quarter start.
     */
    protected function isQuarterStart(Carbon $date): bool
    {
        return in_array($date->month, [1, 4, 7, 10]) && $date->day === 1;
    }

    /**
     * Check if date is semi-annual start (Jan 1 or July 1).
     */
    protected function isSemiAnnualStart(Carbon $date): bool
    {
        return in_array($date->month, [1, 7]) && $date->day === 1;
    }

    /**
     * Compound interest for a single FDR subscription.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    protected function compoundInterest(FdrSubscription $subscription, LedgerService $ledgerService): void
    {
        $principalBefore = (int) $subscription->current_value;
        $rate = $subscription->interest_rate / 100;
        $frequency = $subscription->compounding_frequency ?? 'monthly';

        $periodRate = $this->getPeriodRate($rate, $frequency);
        $interestAmount = (int) round($principalBefore * $periodRate);

        if ($interestAmount <= 0) {
            Log::warning('Zero interest calculated for FDR', [
                'subscription_id' => $subscription->id,
            ]);

            return;
        }

        $taxAmount = 0;
        if ($subscription->plan->is_tax_applicable) {
            $taxRate = $subscription->plan->tax_rate ?? 0;
            $taxAmount = (int) round($interestAmount * ($taxRate / 100));
        }

        $netInterest = $interestAmount - $taxAmount;
        $principalAfter = $principalBefore + $netInterest;

        try {
            $transaction = $ledgerService->accrueInterest(
                $subscription->account_id,
                $netInterest,
                "FDR Interest - {$subscription->id} - {$this->compoundingDate->toDateString()}",
                [
                    'metadata' => [
                        'fdr_subscription_id' => $subscription->id,
                        'compounding_date' => $this->compoundingDate->toDateString(),
                        'interest_rate' => $subscription->interest_rate,
                    ],
                ]
            );

            $subscription->update([
                'current_value' => $principalAfter,
                'total_interest_earned' => $subscription->total_interest_earned + $netInterest,
                'last_compounded_at' => $this->compoundingDate,
                'next_compounding_at' => $this->getNextCompoundingDate($frequency),
            ]);

            FdrInterestHistory::create([
                'subscription_id' => $subscription->id,
                'transaction_id' => $transaction->id,
                'compounding_date' => $this->compoundingDate,
                'principal_before' => $principalBefore,
                'interest_amount' => $interestAmount,
                'tax_amount' => $taxAmount,
                'principal_after' => $principalAfter,
                'interest_rate' => $subscription->interest_rate,
            ]);

            if ($subscription->wallet_id) {
                $this->creditUserEarnings($subscription, $netInterest, $transaction);
            }

            $this->recordBankProfit($subscription, $interestAmount, $transaction);

            Log::info('FDR interest compounded successfully', [
                'subscription_id' => $subscription->id,
                'principal_before' => $principalBefore,
                'interest' => $interestAmount,
                'tax' => $taxAmount,
                'principal_after' => $principalAfter,
            ]);
        } catch (\Throwable $e) {
            Log::error('FDR compounding transaction failed', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Get period rate based on compounding frequency.
     */
    protected function getPeriodRate(float $annualRate, string $frequency): float
    {
        return match ($frequency) {
            'daily' => $annualRate / 365,
            'weekly' => $annualRate / 52,
            'monthly' => $annualRate / 12,
            'quarterly' => $annualRate / 4,
            'semi_annually' => $annualRate / 2,
            'annually' => $annualRate,
            default => $annualRate / 12,
        };
    }

    /**
     * Get next compounding date based on frequency.
     */
    protected function getNextCompoundingDate(string $frequency): Carbon
    {
        return match ($frequency) {
            'daily' => $this->compoundingDate->copy()->addDay(),
            'weekly' => $this->compoundingDate->copy()->addWeek(),
            'monthly' => $this->compoundingDate->copy()->addMonth(),
            'quarterly' => $this->compoundingDate->copy()->addMonths(3),
            'semi_annually' => $this->compoundingDate->copy()->addMonths(6),
            'annually' => $this->compoundingDate->copy()->addYear(),
            default => $this->compoundingDate->copy()->addMonth(),
        };
    }

    /**
     * Credit user earnings.
     */
    protected function creditUserEarnings(
        FdrSubscription $subscription,
        int $netInterest,
        Transaction $transaction
    ): void {
        UserEarning::create([
            'user_id' => $subscription->user_id,
            'wallet_id' => $subscription->wallet_id,
            'earning_type' => UserEarning::TYPE_FDR_INTEREST,
            'source_type' => UserEarning::SOURCE_FDR,
            'source_id' => $subscription->id,
            'amount' => $netInterest,
            'currency' => 'USD',
            'earning_date' => $this->compoundingDate->toDateString(),
            'status' => UserEarning::STATUS_CREDITED,
            'transaction_id' => $transaction->id,
            'description' => "FDR Interest - {$subscription->plan->name}",
        ]);

        Wallet::find($subscription->wallet_id)?->increment('balance', $netInterest);
    }

    /**
     * Record bank profit from interest spread.
     */
    protected function recordBankProfit(
        FdrSubscription $subscription,
        int $grossInterest,
        Transaction $transaction
    ): void {
        $bankShare = (int) round($grossInterest * 0.1);

        if ($bankShare > 0) {
            BankProfit::create([
                'profit_type' => BankProfit::TYPE_INTEREST_SPREAD,
                'source_type' => BankProfit::SOURCE_FDR,
                'source_id' => $subscription->id,
                'amount' => $bankShare,
                'currency' => 'USD',
                'profit_date' => $this->compoundingDate->toDateString(),
                'period' => BankProfit::PERIOD_MONTHLY,
                'description' => "FDR Interest Spread - Subscription {$subscription->id}",
                'breakdown' => [
                    'gross_interest' => $grossInterest,
                    'user_earned' => $grossInterest - $bankShare,
                    'bank_spread' => $bankShare,
                ],
                'transaction_id' => $transaction->id,
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('FDR Compounding job failed', [
            'subscription_id' => $this->subscriptionId,
            'date' => $this->compoundingDate?->toDateString(),
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
