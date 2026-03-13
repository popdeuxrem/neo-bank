<?php

namespace App\Services\Fraud;

use App\Events\Security\FraudAlertTriggered;
use App\Models\AuditLog;
use App\Models\Ledger\Account;
use App\Models\Ledger\Transaction;
use App\Models\Payment;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

class FraudDetectionService
{
    protected array $config = [
        'large_transaction_threshold' => 1000000,
        'daily_withdrawal_limit' => 5000000,
        'max_transactions_per_hour' => 10,
        'suspicious_amount_multiplier' => 3,
    ];

    public function __construct(array $config = [])
    {
        $this->config = array_merge($this->config, $config);
    }

    public function analyzeTransaction(Account $account, int $amount, string $type): FraudResult
    {
        $checks = [
            $this->checkLargeTransaction($amount),
            $this->checkDailyLimit($account, $amount),
            $this->checkTransactionVelocity($account),
            $this->checkUnusualPattern($account, $amount),
            $this->checkNewAccountActivity($account),
        ];

        $failedChecks = array_filter($checks, fn ($check) => ! $check->isPassed());

        if (! empty($failedChecks)) {
            $this->logFraudAlert($account, $amount, $type, $failedChecks);
        }

        return new FraudResult(
            passed: empty($failedChecks),
            riskScore: $this->calculateRiskScore($checks),
            flags: array_map(fn ($c) => $c->flag, $failedChecks),
            recommendation: $this->getRecommendation($failedChecks)
        );
    }

    public function dispatchAnalysis(Account $account, int $amount, string $type, ?int $transactionId = null): void
    {
        AnalyzeTransactionForFraud::dispatch($account, $amount, $type, $transactionId)
            ->onQueue('fraud')
            ->delay(now()->addSeconds(2));
    }

    public function analyzePayment(Payment $payment): FraudResult
    {
        $senderAccount = $payment->senderAccount;

        return $this->analyzeTransaction($senderAccount, $payment->amount, $payment->type);
    }

    protected function checkLargeTransaction(int $amount): FraudCheck
    {
        $threshold = $this->config['large_transaction_threshold'];
        $isLarge = $amount >= $threshold;

        return new FraudCheck(
            name: 'large_transaction',
            passed: ! $isLarge,
            flag: $isLarge ? 'Large transaction detected' : null,
            details: "Amount: {$amount}, Threshold: {$threshold}"
        );
    }

    protected function checkDailyLimit(Account $account, int $amount): FraudCheck
    {
        $today = now()->startOfDay();
        $dailyTotal = Transaction::whereHas('entries', function ($query) use ($account) {
            $query->where('account_id', $account->id)->where('entry_type', 'debit');
        })
            ->where('created_at', '>=', $today)
            ->where('status', 'completed')
            ->sum('amount');

        $newTotal = $dailyTotal + $amount;
        $limit = $this->config['daily_withdrawal_limit'];
        $exceedsLimit = $newTotal > $limit;

        return new FraudCheck(
            name: 'daily_limit',
            passed: ! $exceedsLimit,
            flag: $exceedsLimit ? 'Daily withdrawal limit exceeded' : null,
            details: "Daily total: {$newTotal}, Limit: {$limit}"
        );
    }

    protected function checkTransactionVelocity(Account $account): FraudCheck
    {
        $oneHourAgo = now()->subHour();
        $transactionCount = Transaction::whereHas('entries', function ($query) use ($account) {
            $query->where('account_id', $account->id);
        })
            ->where('created_at', '>=', $oneHourAgo)
            ->count();

        $maxAllowed = $this->config['max_transactions_per_hour'];
        $exceedsVelocity = $transactionCount >= $maxAllowed;

        return new FraudCheck(
            name: 'velocity',
            passed: ! $exceedsVelocity,
            flag: $exceedsVelocity ? 'High transaction velocity detected' : null,
            details: "Transactions in last hour: {$transactionCount}, Max allowed: {$maxAllowed}"
        );
    }

    protected function checkUnusualPattern(Account $account, int $amount): FraudCheck
    {
        $averageTransaction = Transaction::whereHas('entries', function ($query) use ($account) {
            $query->where('account_id', $account->id);
        })
            ->where('status', 'completed')
            ->avg('amount') ?? 0;

        $multiplier = $this->config['suspicious_amount_multiplier'];
        $isUnusual = $averageTransaction > 0 && $amount >= ($averageTransaction * $multiplier);

        return new FraudCheck(
            name: 'unusual_pattern',
            passed: ! $isUnusual,
            flag: $isUnusual ? 'Unusual transaction amount pattern' : null,
            details: "Amount: {$amount}, Average: {$averageTransaction}, Multiplier: {$multiplier}"
        );
    }

    protected function checkNewAccountActivity(Account $account): FraudCheck
    {
        $isNew = $account->created_at && $account->created_at->diffInDays(now()) < 7;

        return new FraudCheck(
            name: 'new_account',
            passed: ! $isNew,
            flag: $isNew ? 'New account with activity' : null,
            details: "Account age: {$account->created_at?->diffInDays(now())} days"
        );
    }

    protected function calculateRiskScore(array $checks): int
    {
        $totalWeight = 0;
        $failedWeight = 0;

        $weights = [
            'large_transaction' => 30,
            'daily_limit' => 25,
            'velocity' => 20,
            'unusual_pattern' => 15,
            'new_account' => 10,
        ];

        foreach ($checks as $check) {
            $weight = $weights[$check->name] ?? 10;
            $totalWeight += $weight;
            if (! $check->isPassed) {
                $failedWeight += $weight;
            }
        }

        return $totalWeight > 0 ? (int) (($failedWeight / $totalWeight) * 100) : 0;
    }

    protected function getRecommendation(array $failedChecks): string
    {
        if (empty($failedChecks)) {
            return 'APPROVE';
        }

        $hasHighRisk = in_array('large_transaction', array_column($failedChecks, 'name'));

        if ($hasHighRisk) {
            return 'REVIEW_MANUALLY';
        }

        return 'REVIEW_AUTOMATED';
    }

    protected function logFraudAlert(Account $account, int $amount, string $type, array $failedChecks): void
    {
        $flags = array_column($failedChecks, 'flag');
        $flags = array_filter($flags);

        $riskScore = $this->calculateRiskScore($failedChecks);

        Log::warning('FRAUD_ALERT', [
            'account_id' => $account->id,
            'account_number' => $account->account_number,
            'amount' => $amount,
            'type' => $type,
            'flags' => implode(', ', $flags),
            'risk_score' => $riskScore,
            'timestamp' => now()->toIso8601String(),
        ]);

        Event::dispatch(new FraudAlertTriggered(
            account: $account,
            amount: $amount,
            type: $type,
            flags: $flags,
            riskScore: $riskScore
        ));

        AuditLog::log(
            'fraud.detected',
            null,
            Account::class,
            $account->id,
            null,
            [
                'amount' => $amount,
                'type' => $type,
                'flags' => implode(', ', $flags),
                'risk_score' => $riskScore,
            ]
        );
    }
}

class FraudCheck
{
    public function __construct(
        public string $name,
        public bool $passed,
        public ?string $flag,
        public string $details
    ) {}

    public function isPassed(): bool
    {
        return $this->passed;
    }
}

class FraudResult
{
    public function __construct(
        public bool $passed,
        public int $riskScore,
        public array $flags,
        public string $recommendation
    ) {}

    public function shouldFlag(): bool
    {
        return ! $this->passed || $this->riskScore > 50;
    }

    public function requiresManualReview(): bool
    {
        return $this->recommendation === 'REVIEW_MANUALLY';
    }
}
