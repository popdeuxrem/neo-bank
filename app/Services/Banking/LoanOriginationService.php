<?php

namespace App\Services\Banking;

use App\Models\Banking\BankProfit;
use App\Models\Banking\Loan;
use App\Models\Banking\LoanApplication;
use App\Models\Banking\LoanCollateral;
use App\Models\Banking\LoanEmi;
use App\Models\Banking\LoanGuarantor;
use App\Models\Banking\LoanPlan;
use App\Models\Banking\UserEarning;
use App\Models\Banking\Wallet;
use App\Models\User;
use App\Services\Ledger\LedgerService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Enhanced Loan Origination Service
 *
 * Handles complete loan lifecycle: application, approval, disbursement,
 * EMI processing, and repayment tracking.
 *
 * @package App\Services\Banking
 */
class LoanOriginationService
{
    public function __construct(
        protected LedgerService $ledgerService
    ) {}

    /**
     * Submit a loan application.
     *
     * @throws InvalidArgumentException
     */
    public function submitApplication(User $user, array $data): LoanApplication
    {
        $this->validateApplicationData($data);

        $plan = LoanPlan::findOrFail($data['plan_id']);

        $creditScore = $this->calculateCreditScore($user);
        $eligibility = $this->checkEligibility($user, $plan, $data);

        if (!$eligibility['eligible']) {
            throw new InvalidArgumentException(
                'User not eligible: ' . implode(', ', $eligibility['reasons'])
            );
        }

        $emiData = $this->calculateEmi(
            (float) $data['requested_amount'],
            (float) ($data['interest_rate'] ?? $plan->interest_rate),
            (int) $data['requested_duration_months']
        );

        $application = DB::transaction(function () use ($user, $plan, $data, $creditScore, $emiData) {
            $application = LoanApplication::create([
                'application_number' => $this->generateApplicationNumber(),
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'requested_amount' => $data['requested_amount'],
                'requested_duration_months' => $data['requested_duration_months'],
                'offered_interest_rate' => $data['interest_rate'] ?? $plan->interest_rate,
                'offered_amount' => $data['requested_amount'],
                'offered_duration_months' => $data['requested_duration_months'],
                'offered_emi' => $emiData['emi'],
                'purpose' => $data['purpose'],
                'employment_type' => $data['employment_type'],
                'monthly_income' => $data['monthly_income'],
                'existing_emi_obligations' => $data['existing_emi_obligations'] ?? 0,
                'employer_details' => $data['employer_details'] ?? null,
                'bank_details' => $data['bank_details'] ?? null,
                'documents' => $data['documents'] ?? null,
                'guarantor_details' => $data['guarantors'] ?? null,
                'status' => LoanApplication::STATUS_SUBMITTED,
                'credit_score' => $creditScore,
            ]);

            if (!empty($data['guarantors'])) {
                $this->createGuarantors($application, $data['guarantors']);
            }

            if (!empty($data['collateral'])) {
                $this->createCollateral($application, $data['collateral']);
            }

            Log::info('Loan application submitted', [
                'application_id' => $application->id,
                'user_id' => $user->id,
                'amount' => $data['requested_amount'],
            ]);

            return $application;
        });

        return $application;
    }

    /**
     * Review and approve/reject a loan application.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function reviewApplication(
        LoanApplication $application,
        User $reviewer,
        string $decision,
        array $modifications = []
    ): LoanApplication {
        if (!$application->isSubmitted() && !$application->isUnderReview()) {
            throw new InvalidArgumentException('Application is not in reviewable state');
        }

        if (!in_array($decision, ['approve', 'reject', 'modify'])) {
            throw new InvalidArgumentException('Invalid decision: must be approve, reject, or modify');
        }

        return DB::transaction(function () use ($application, $reviewer, $decision, $modifications) {
            match ($decision) {
                'approve' => $this->approveApplication($application, $reviewer, $modifications),
                'reject' => $this->rejectApplication($application, $reviewer, $modifications['reason'] ?? 'Not specified'),
                'modify' => $this->modifyApplication($application, $modifications),
            };

            return $application->fresh();
        });
    }

    /**
     * Approve application and optionally create loan.
     */
    public function approveApplication(
        LoanApplication $application,
        User $reviewer,
        array $offerDetails = []
    ): Loan {
        $offerDetails = array_merge([
            'amount' => $application->requested_amount,
            'interest_rate' => $application->offered_interest_rate,
            'duration_months' => $application->requested_duration_months,
            'emi' => $application->offered_emi,
        ], $offerDetails);

        $application->update([
            'status' => LoanApplication::STATUS_APPROVED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'offered_amount' => $offerDetails['amount'],
            'offered_interest_rate' => $offerDetails['interest_rate'],
            'offered_duration_months' => $offerDetails['duration_months'],
            'offered_emi' => $offerDetails['emi'],
        ]);

        Log::info('Loan application approved', [
            'application_id' => $application->id,
            'offered_amount' => $offerDetails['amount'],
            'reviewed_by' => $reviewer->id,
        ]);

        return $this->createLoan($application, $offerDetails);
    }

    /**
     * Reject application.
     */
    public function rejectApplication(
        LoanApplication $application,
        User $reviewer,
        string $reason
    ): void {
        $application->update([
            'status' => LoanApplication::STATUS_REJECTED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);

        Log::info('Loan application rejected', [
            'application_id' => $application->id,
            'reason' => $reason,
            'reviewed_by' => $reviewer->id,
        ]);
    }

    /**
     * Modify application details.
     */
    public function modifyApplication(LoanApplication $application, array $modifications): void
    {
        $updateData = [];

        if (isset($modifications['offered_amount'])) {
            $updateData['offered_amount'] = $modifications['offered_amount'];
        }

        if (isset($modifications['offered_interest_rate'])) {
            $updateData['offered_interest_rate'] = $modifications['offered_interest_rate'];
        }

        if (isset($modifications['offered_duration_months'])) {
            $updateData['offered_duration_months'] = $modifications['offered_duration_months'];
        }

        if (isset($modifications['review_notes'])) {
            $updateData['review_notes'] = $modifications['review_notes'];
        }

        if (!empty($updateData)) {
            $application->update($updateData);
        }

        if (isset($modifications['offered_emi'])) {
            $application->update(['offered_emi' => $modifications['offered_emi']]);
        }
    }

    /**
     * Create loan from approved application.
     */
    public function createLoan(LoanApplication $application, array $overrides = []): Loan
    {
        $amount = $overrides['amount'] ?? $application->offered_amount;
        $interestRate = $overrides['interest_rate'] ?? $application->offered_interest_rate;
        $durationMonths = $overrides['duration_months'] ?? $application->offered_duration_months;

        $plan = $application->plan;
        $processingFee = $this->calculateProcessingFee($amount, $plan);

        $loan = Loan::create([
            'user_id' => $application->user_id,
            'plan_id' => $application->plan_id,
            'account_id' => $overrides['account_id'] ?? null,
            'wallet_id' => $overrides['wallet_id'] ?? null,
            'loan_number' => $this->generateLoanNumber(),
            'amount' => $amount,
            'interest_rate' => $interestRate,
            'duration_months' => $durationMonths,
            'interest_calculation_method' => $plan->interest_calculation_method ?? 'reducing_balance',
            'processing_fee' => $processingFee,
            'emi_amount' => $overrides['emi'] ?? $application->offered_emi,
            'total_payable' => ($overrides['emi'] ?? $application->offered_emi) * $durationMonths,
            'total_paid' => 0,
            'remaining_amount' => $amount,
            'purpose' => $application->purpose,
            'employment_type' => $application->employment_type,
            'monthly_income' => $application->monthly_income,
            'status' => Loan::STATUS_PENDING,
        ]);

        $this->createEmiSchedule($loan);

        $application->update([
            'status' => LoanApplication::STATUS_APPROVED,
        ]);

        Log::info('Loan created from application', [
            'loan_id' => $loan->id,
            'application_id' => $application->id,
            'amount' => $amount,
        ]);

        return $loan;
    }

    /**
     * Disburse loan to user wallet/account.
     *
     * @throws RuntimeException
     */
    public function disburseLoan(Loan $loan, User $disbursedBy): void
    {
        if ($loan->status !== Loan::STATUS_PENDING && $loan->status !== Loan::STATUS_APPROVED) {
            throw new RuntimeException('Loan is not in disbursable state');
        }

        $disbursementAmount = $loan->amount - $loan->processing_fee;

        DB::transaction(function () use ($loan, $disbursedBy, $disbursementAmount) {
            if ($loan->wallet_id) {
                $wallet = Wallet::find($loan->wallet_id);
                $wallet?->increment('balance', $disbursementAmount);
            }

            $loan->update([
                'status' => Loan::STATUS_ACTIVE,
                'disbursed_at' => now(),
                'disbursed_by' => $disbursedBy->id,
            ]);

            $this->recordBankProfit($loan, $loan->processing_fee);

            Log::info('Loan disbursed', [
                'loan_id' => $loan->id,
                'amount' => $disbursementAmount,
                'processing_fee' => $loan->processing_fee,
                'disbursed_by' => $disbursedBy->id,
            ]);
        });
    }

    /**
     * Process EMI payment.
     *
     * @throws InvalidArgumentException
     */
    public function payEmi(Loan $loan, User $user, int $emiId): LoanEmi
    {
        $emi = LoanEmi::where('loan_id', $loan->id)
            ->where('id', $emiId)
            ->firstOrFail();

        if ($emi->status === LoanEmi::STATUS_PAID) {
            throw new InvalidArgumentException('EMI already paid');
        }

        $wallet = $user->wallet;

        if (!$wallet || $wallet->balance < $emi->emi_amount) {
            throw new InvalidArgumentException('Insufficient funds for EMI payment');
        }

        return DB::transaction(function () use ($loan, $emi, $wallet) {
            $wallet->decrement('balance', $emi->emi_amount);

            $emi->update([
                'status' => LoanEmi::STATUS_PAID,
                'paid_at' => now(),
            ]);

            $loan->increment('total_paid', $emi->emi_amount);
            $loan->update([
                'remaining_amount' => $loan->remaining_amount - $emi->principal_amount,
            ]);

            $interestPaid = $emi->interest_amount;
            $this->recordInterestIncome($loan, $interestPaid);

            if ($this->isLoanFullyRepaid($loan)) {
                $loan->update(['status' => Loan::STATUS_COMPLETED]);
                $this->releaseCollateral($loan);
            }

            Log::info('EMI paid', [
                'loan_id' => $loan->id,
                'emi_id' => $emi->id,
                'amount' => $emi->emi_amount,
            ]);

            return $emi;
        });
    }

    /**
     * Calculate EMI using standard formula.
     */
    public function calculateEmi(
        float $principal,
        float $annualRate,
        int $months
    ): array {
        $monthlyRate = $annualRate / 12 / 100;

        if ($monthlyRate === 0.0) {
            $emi = $principal / $months;
        } else {
            $emi = $principal * $monthlyRate
                * pow(1 + $monthlyRate, $months)
                / (pow(1 + $monthlyRate, $months) - 1);
        }

        $totalPayment = $emi * $months;
        $totalInterest = $totalPayment - $principal;

        return [
            'emi' => (int) round($emi * 100),
            'total_payment' => (int) round($totalPayment * 100),
            'total_interest' => (int) round($totalInterest * 100),
            'effective_apr' => $annualRate,
            'months' => $months,
        ];
    }

    /**
     * Check user eligibility for a loan.
     */
    public function checkEligibility(User $user, LoanPlan $plan, array $data = []): array
    {
        $reasons = [];

        if ($user->kyc_status !== 'verified') {
            $reasons[] = 'KYC verification required';
        }

        if ($user->account_status !== 'active') {
            $reasons[] = 'Account must be active';
        }

        $requestedAmount = $data['requested_amount'] ?? 0;
        if ($requestedAmount < $plan->min_amount) {
            $reasons[] = "Minimum loan amount is {$plan->min_amount}";
        }

        if ($requestedAmount > $plan->max_amount) {
            $reasons[] = "Maximum loan amount is {$plan->max_amount}";
        }

        $requestedDuration = $data['requested_duration_months'] ?? 0;
        if ($requestedDuration < ($plan->min_duration_months ?? 1)) {
            $reasons[] = "Minimum duration is {$plan->min_duration_months} months";
        }

        if ($requestedDuration > ($plan->max_duration_months ?? 60)) {
            $reasons[] = "Maximum duration is {$plan->max_duration_months} months";
        }

        if ($plan->kyc_required && $user->kyc_status !== 'verified') {
            $reasons[] = 'KYC required for this loan type';
        }

        if ($plan->requires_guarantor && empty($data['guarantors'])) {
            $reasons[] = 'Guarantor required for this loan';
        }

        $monthlyIncome = $data['monthly_income'] ?? $user->monthly_income ?? 0;
        if ($plan->min_income_requirement && $monthlyIncome < $plan->min_income_requirement) {
            $reasons[] = "Minimum monthly income requirement: {$plan->min_income_requirement}";
        }

        $existingEmi = $data['existing_emi_obligations'] ?? 0;
        $debtToIncome = $monthlyIncome > 0 ? ($existingEmi / $monthlyIncome) * 100 : 0;
        if ($debtToIncome > 40) {
            $reasons[] = 'Debt-to-income ratio exceeds 40%';
        }

        return [
            'eligible' => empty($reasons),
            'reasons' => $reasons,
        ];
    }

    /**
     * Calculate credit score for user.
     */
    protected function calculateCreditScore(User $user): int
    {
        $score = 500;

        if ($user->kyc_status === 'verified') {
            $score += 100;
        }

        if ($user->account_status === 'active') {
            $score += 50;
        }

        $accountAge = $user->created_at->diffInMonths(now());
        $score += min($accountAge * 5, 150);

        return min($score, 850);
    }

    /**
     * Calculate processing fee.
     */
    protected function calculateProcessingFee(float $amount, LoanPlan $plan): int
    {
        $percentageFee = (int) round($amount * ($plan->processing_fee_rate / 100));
        $fixedFee = $plan->processing_fee_fixed ?? 0;

        return $percentageFee + $fixedFee;
    }

    /**
     * Create EMI schedule for loan.
     */
    protected function createEmiSchedule(Loan $loan): void
    {
        $startDate = Carbon::now()->addMonth();
        $schedule = $this->getAmortizationSchedule(
            $loan->amount,
            $loan->interest_rate,
            $loan->duration_months
        );

        foreach ($schedule as $month => $entry) {
            LoanEmi::create([
                'loan_id' => $loan->id,
                'month' => $month,
                'due_date' => $startDate->copy()->addMonths($month - 1)->toDateString(),
                'emi_amount' => $entry['emi'],
                'principal_amount' => $entry['principal'],
                'interest_amount' => $entry['interest'],
                'status' => LoanEmi::STATUS_PENDING,
            ]);
        }
    }

    /**
     * Generate amortization schedule.
     */
    protected function getAmortizationSchedule(
        float $principal,
        float $annualRate,
        int $months
    ): array {
        $schedule = [];
        $balance = $principal;
        $monthlyRate = $annualRate / 12 / 100;
        $emi = $principal * $monthlyRate * pow(1 + $monthlyRate, $months)
            / (pow(1 + $monthlyRate, $months) - 1);

        for ($month = 1; $month <= $months; $month++) {
            $interest = $balance * $monthlyRate;
            $principalPayment = $emi - $interest;
            $balance = max(0, $balance - $principalPayment);

            $schedule[$month] = [
                'emi' => (int) round($emi * 100),
                'principal' => (int) round($principalPayment * 100),
                'interest' => (int) round($interest * 100),
                'balance' => (int) round($balance * 100),
            ];
        }

        return $schedule;
    }

    /**
     * Check if loan is fully repaid.
     */
    protected function isLoanFullyRepaid(Loan $loan): bool
    {
        return $loan->emiSchedule()->where('status', LoanEmi::STATUS_PENDING)->doesntExist();
    }

    /**
     * Create guarantors for application.
     */
    protected function createGuarantors(LoanApplication $application, array $guarantors): void
    {
        foreach ($guarantors as $guarantor) {
            LoanGuarantor::create([
                'loan_id' => $application->id,
                'name' => $guarantor['name'],
                'relationship' => $guarantor['relationship'],
                'phone' => $guarantor['phone'],
                'email' => $guarantor['email'] ?? null,
                'address' => $guarantor['address'] ?? '',
                'occupation' => $guarantor['occupation'] ?? null,
                'monthly_income' => $guarantor['monthly_income'] ?? null,
            ]);
        }
    }

    /**
     * Create collateral for application.
     */
    protected function createCollateral(LoanApplication $application, array $collateral): void
    {
        LoanCollateral::create([
            'loan_id' => $application->id,
            'collateral_type' => $collateral['type'],
            'description' => $collateral['description'],
            'estimated_value' => $collateral['estimated_value'],
            'documents' => $collateral['documents'] ?? null,
            'status' => LoanCollateral::STATUS_PLEDGED,
        ]);
    }

    /**
     * Release collateral when loan is repaid.
     */
    protected function releaseCollateral(Loan $loan): void
    {
        LoanCollateral::where('loan_id', $loan->id)
            ->where('status', LoanCollateral::STATUS_PLEDGED)
            ->update([
                'status' => LoanCollateral::STATUS_RELEASED,
                'released_at' => now(),
            ]);
    }

    /**
     * Record bank profit from processing fee.
     */
    protected function recordBankProfit(Loan $loan, int $fee): void
    {
        BankProfit::create([
            'profit_type' => BankProfit::TYPE_FEES,
            'source_type' => BankProfit::SOURCE_LOAN,
            'source_id' => $loan->id,
            'amount' => $fee,
            'currency' => 'USD',
            'profit_date' => now()->toDateString(),
            'period' => BankProfit::PERIOD_MONTHLY,
            'description' => "Loan Processing Fee - {$loan->loan_number}",
        ]);
    }

    /**
     * Record interest income.
     */
    protected function recordInterestIncome(Loan $loan, int $interest): void
    {
        BankProfit::create([
            'profit_type' => BankProfit::TYPE_INTEREST_SPREAD,
            'source_type' => BankProfit::SOURCE_LOAN,
            'source_id' => $loan->id,
            'amount' => $interest,
            'currency' => 'USD',
            'profit_date' => now()->toDateString(),
            'period' => BankProfit::PERIOD_MONTHLY,
            'description' => "Loan Interest - {$loan->loan_number}",
        ]);
    }

    /**
     * Generate application number.
     */
    protected function generateApplicationNumber(): string
    {
        return 'LA-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }

    /**
     * Generate loan number.
     */
    protected function generateLoanNumber(): string
    {
        return 'LN-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }

    /**
     * Validate application data.
     */
    protected function validateApplicationData(array $data): void
    {
        $required = ['plan_id', 'requested_amount', 'requested_duration_months', 'purpose', 'employment_type'];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }
    }
}
