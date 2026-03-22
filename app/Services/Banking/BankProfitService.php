<?php

namespace App\Services\Banking;

use App\Models\Banking\BankProfit;
use App\Models\Banking\FdrSubscription;
use App\Models\Banking\Loan;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use InvalidArgumentException;

/**
 * Bank Profit Service
 *
 * Manages calculation and tracking of bank profits from various sources:
 * - Interest spreads (loan, FDR, DPS)
 * - Fees (processing, transaction, account)
 * - Commissions
 * - Penalties
 */
class BankProfitService
{
    /**
     * Record interest spread profit from loan.
     *
     * @throws InvalidArgumentException
     */
    public function recordLoanInterestSpread(Loan $loan, int $interestAmount): BankProfit
    {
        if ($interestAmount <= 0) {
            throw new InvalidArgumentException('Interest amount must be greater than 0');
        }

        $bankShare = $this->calculateInterestSpread($interestAmount);

        return BankProfit::record(
            profitType: BankProfit::TYPE_INTEREST_SPREAD,
            sourceType: BankProfit::SOURCE_LOAN,
            sourceId: $loan->id,
            amount: $bankShare,
            description: "Loan Interest Spread - Loan #{$loan->loan_number}",
            options: [
                'breakdown' => [
                    'gross_interest' => $interestAmount,
                    'bank_spread_percentage' => $this->getSpreadPercentage(),
                    'bank_share' => $bankShare,
                ],
                'period' => BankProfit::PERIOD_MONTHLY,
            ]
        );
    }

    /**
     * Record interest spread profit from FDR.
     */
    public function recordFdrInterestSpread(FdrSubscription $fdr, int $grossInterest): BankProfit
    {
        $bankShare = $this->calculateInterestSpread($grossInterest);

        return BankProfit::record(
            profitType: BankProfit::TYPE_INTEREST_SPREAD,
            sourceType: BankProfit::SOURCE_FDR,
            sourceId: $fdr->id,
            amount: $bankShare,
            description: "FDR Interest Spread - FDR #{$fdr->id}",
            options: [
                'breakdown' => [
                    'gross_interest' => $grossInterest,
                    'bank_spread_percentage' => $this->getSpreadPercentage(),
                    'bank_share' => $bankShare,
                ],
                'period' => BankProfit::PERIOD_MONTHLY,
            ]
        );
    }

    /**
     * Record processing fee profit from loan.
     */
    public function recordLoanProcessingFee(Loan $loan, int $feeAmount): BankProfit
    {
        return BankProfit::record(
            profitType: BankProfit::TYPE_FEES,
            sourceType: BankProfit::SOURCE_LOAN,
            sourceId: $loan->id,
            amount: $feeAmount,
            description: "Loan Processing Fee - Loan #{$loan->loan_number}",
            options: [
                'period' => BankProfit::PERIOD_MONTHLY,
            ]
        );
    }

    /**
     * Record transfer fee profit.
     */
    public function recordTransferFee(int $sourceId, int $feeAmount, string $description): BankProfit
    {
        return BankProfit::record(
            profitType: BankProfit::TYPE_FEES,
            sourceType: BankProfit::SOURCE_TRANSFER,
            sourceId: $sourceId,
            amount: $feeAmount,
            description: $description,
            options: [
                'period' => BankProfit::PERIOD_MONTHLY,
            ]
        );
    }

    /**
     * Record bill payment commission.
     */
    public function recordBillCommission(int $sourceId, int $amount, string $billerName): BankProfit
    {
        return BankProfit::record(
            profitType: BankProfit::TYPE_COMMISSIONS,
            sourceType: BankProfit::SOURCE_BILL,
            sourceId: $sourceId,
            amount: $amount,
            description: "Bill Payment Commission - {$billerName}",
            options: [
                'period' => BankProfit::PERIOD_MONTHLY,
            ]
        );
    }

    /**
     * Record penalty profit.
     */
    public function recordPenalty(int $sourceId, string $sourceType, int $amount, string $description): BankProfit
    {
        return BankProfit::record(
            profitType: BankProfit::TYPE_PENALTIES,
            sourceType: $sourceType,
            sourceId: $sourceId,
            amount: $amount,
            description: $description,
            options: [
                'period' => BankProfit::PERIOD_MONTHLY,
            ]
        );
    }

    /**
     * Get total profits for a period.
     */
    public function getTotalProfits(string $from, string $to, ?string $type = null): int
    {
        return BankProfit::getTotalForPeriod($from, $to, $type);
    }

    /**
     * Get profit breakdown by type for a period.
     */
    public function getProfitBreakdown(string $from, string $to): array
    {
        $breakdown = BankProfit::getBreakdownForPeriod($from, $to);

        return [
            'interest_spread' => $breakdown[BankProfit::TYPE_INTEREST_SPREAD] ?? 0,
            'fees' => $breakdown[BankProfit::TYPE_FEES] ?? 0,
            'commissions' => $breakdown[BankProfit::TYPE_COMMISSIONS] ?? 0,
            'penalties' => $breakdown[BankProfit::TYPE_PENALTIES] ?? 0,
            'other' => $breakdown[BankProfit::TYPE_OTHER] ?? 0,
            'total' => array_sum($breakdown),
        ];
    }

    /**
     * Get monthly profit summary.
     */
    public function getMonthlySummary(?int $year = null, ?int $month = null): array
    {
        $year = $year ?? now()->year;
        $month = $month ?? now()->month;

        $from = Carbon::createFromDate($year, $month, 1)->startOfMonth()->toDateString();
        $to = Carbon::createFromDate($year, $month, 1)->endOfMonth()->toDateString();

        return [
            'period' => Carbon::createFromDate($year, $month, 1)->format('F Y'),
            'breakdown' => $this->getProfitBreakdown($from, $to),
            'from' => $from,
            'to' => $to,
        ];
    }

    /**
     * Get yearly profit summary.
     */
    public function getYearlySummary(?int $year = null): array
    {
        $year = $year ?? now()->year;

        $from = Carbon::createFromDate($year, 1, 1)->startOfYear()->toDateString();
        $to = Carbon::createFromDate($year, 12, 31)->endOfYear()->toDateString();

        $monthlyBreakdown = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthFrom = Carbon::createFromDate($year, $month, 1)->startOfMonth()->toDateString();
            $monthTo = Carbon::createFromDate($year, $month, 1)->endOfMonth()->toDateString();

            $monthlyBreakdown[$month] = [
                'month' => Carbon::createFromDate($year, $month, 1)->format('F'),
                'total' => $this->getTotalProfits($monthFrom, $monthTo),
            ];
        }

        return [
            'year' => $year,
            'total' => $this->getTotalProfits($from, $to),
            'breakdown' => $this->getProfitBreakdown($from, $to),
            'monthly' => $monthlyBreakdown,
        ];
    }

    /**
     * Get profits by source.
     */
    public function getProfitsBySource(string $from, string $to): array
    {
        $profits = BankProfit::betweenDates($from, $to)
            ->selectRaw('source_type, sum(amount) as total')
            ->groupBy('source_type')
            ->get();

        return $profits->pluck('total', 'source_type')->toArray();
    }

    /**
     * Get recent profit transactions.
     */
    public function getRecentProfits(int $limit = 10): Collection
    {
        return BankProfit::orderBy('profit_date', 'desc')
            ->orderBy('id', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get paginated profits.
     */
    public function getProfits(
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator {
        $query = BankProfit::query()->orderBy('profit_date', 'desc');

        if (! empty($filters['type'])) {
            $query->byType($filters['type']);
        }

        if (! empty($filters['source_type'])) {
            $query->bySource($filters['source_type']);
        }

        if (! empty($filters['from_date'])) {
            $query->betweenDates($filters['from_date'], $filters['to_date'] ?? now()->toDateString());
        }

        return $query->paginate($perPage);
    }

    /**
     * Calculate net profit after operational costs.
     */
    public function calculateNetProfit(string $from, string $to): array
    {
        $grossProfit = $this->getTotalProfits($from, $to);

        $operationalCosts = $this->estimateOperationalCosts($from, $to);

        return [
            'gross_profit' => $grossProfit,
            'operational_costs' => $operationalCosts,
            'net_profit' => $grossProfit - $operationalCosts,
            'profit_margin' => $grossProfit > 0
                ? round((($grossProfit - $operationalCosts) / $grossProfit) * 100, 2)
                : 0,
        ];
    }

    /**
     * Get profit trends.
     */
    public function getProfitTrends(int $months = 6): array
    {
        $trends = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $summary = $this->getMonthlySummary($date->year, $date->month);

            $trends[] = [
                'month' => $date->format('M Y'),
                'total' => $summary['breakdown']['total'],
                'interest_spread' => $summary['breakdown']['interest_spread'],
                'fees' => $summary['breakdown']['fees'],
                'commissions' => $summary['breakdown']['commissions'],
                'penalties' => $summary['breakdown']['penalties'],
            ];
        }

        return $trends;
    }

    /**
     * Calculate interest spread (bank's share).
     */
    protected function calculateInterestSpread(int $grossInterest): int
    {
        return (int) round($grossInterest * ($this->getSpreadPercentage() / 100));
    }

    /**
     * Get the configured spread percentage.
     */
    protected function getSpreadPercentage(): float
    {
        return config('banking.profit_spread_percentage', 10.0);
    }

    /**
     * Estimate operational costs (placeholder implementation).
     */
    protected function estimateOperationalCosts(string $from, string $to): int
    {
        $grossProfit = $this->getTotalProfits($from, $to);

        $costPercentage = config('banking.operational_cost_percentage', 30.0);

        return (int) round($grossProfit * ($costPercentage / 100));
    }
}
