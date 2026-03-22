<?php

namespace App\Contracts\Banking;

use App\Models\Banking\Loan;
use App\Models\Banking\LoanApplication;
use App\Models\User;

interface LoanServiceInterface
{
    public function calculateEmi(float $principal, float $annualRate, int $months): array;

    public function getAmortizationSchedule(Loan $loan): array;

    public function checkEligibility(User $user): array;

    public function apply(User $user, array $data): Loan;

    public function payEmi(User $user, Loan $loan, array $data): void;

    public function submitApplication(User $user, array $data): LoanApplication;

    public function reviewApplication(
        LoanApplication $application,
        User $reviewer,
        string $decision,
        array $modifications = []
    ): LoanApplication;

    public function disburseLoan(Loan $loan, User $disbursedBy): void;
}
