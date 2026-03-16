<?php

namespace App\Http\Controllers;

use App\Models\Banking\Loan;
use App\Models\Banking\LoanPlan;
use App\Services\LoanService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function __construct(private LoanService $loanService) {}

    public function index()
    {
        return Inertia::render('loans/index', [
            'plans' => LoanPlan::active()->get()->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'interestRate' => $p->interest_rate,
                'minAmount' => $p->min_amount,
                'maxAmount' => $p->max_amount,
                'durationOptions' => $p->duration_options,
                'processingFee' => $p->processing_fee,
                'description' => $p->description,
                'example' => $this->loanService->calculateEmi($p->min_amount, $p->interest_rate, 12),
            ]),
        ]);
    }

    public function apply(Request $request)
    {
        return Inertia::render('loans/apply', [
            'plans' => LoanPlan::active()->get(),
            'user' => $request->user()->only(['name', 'email']),
            'accounts' => $request->user()->ledgerAccounts()
                ->where('status', 'active')
                ->get(),
            'eligibility' => $this->loanService->checkEligibility($request->user()),
        ]);
    }

    public function submitApplication(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:loan_plans,id',
            'amount' => 'required|numeric|min:100',
            'duration_months' => 'required|integer|min:1|max:360',
            'purpose' => 'required|string|max:500',
            'account_id' => 'required|exists:ledger_accounts,id',
            'employment_type' => 'required|string',
            'monthly_income' => 'required|numeric|min:0',
        ]);

        $loan = $this->loanService->apply($request->user(), $validated);

        return redirect()->route('loans.show', $loan)
            ->with('success', 'Loan application submitted successfully.');
    }

    public function mine(Request $request)
    {
        return Inertia::render('loans/mine', [
            'loans' => $request->user()->loans()
                ->with('plan')
                ->latest()
                ->paginate(10)
                ->map(fn ($l) => [
                    'id' => $l->id,
                    'planName' => $l->plan->name,
                    'amount' => $l->amount,
                    'emiAmount' => $l->emi_amount,
                    'totalPaid' => $l->total_paid,
                    'remainingBalance' => $l->getRemainingBalance(),
                    'status' => $l->status,
                ]),
        ]);
    }

    public function emiSchedule(Request $request)
    {
        return Inertia::render('loans/emi', [
            'loans' => $request->user()->loans()
                ->active()
                ->with(['plan', 'emiSchedule'])
                ->get()
                ->map(fn ($l) => [
                    'id' => $l->id,
                    'planName' => $l->plan->name,
                    'amount' => $l->amount,
                    'emiAmount' => $l->emi_amount,
                    'nextEmi' => $l->getNextEmi(),
                    'overdueEmis' => $l->getOverdueEmis(),
                    'paidEmis' => $l->emiSchedule()->where('status', 'paid')->count(),
                ]),
        ]);
    }

    public function calculator()
    {
        return Inertia::render('loans/calculator', [
            'plans' => LoanPlan::active()->get(),
        ]);
    }

    public function payEmi(Request $request, Loan $loan)
    {
        $validated = $request->validate([
            'emi_id' => 'required|exists:loan_emis,id',
            'account_id' => 'required|exists:ledger_accounts,id',
        ]);

        $emi = $loan->emiSchedule()->findOrFail($validated['emi_id']);

        $loan->increment('total_paid', $emi->emi_amount);
        $emi->update(['status' => 'paid', 'paid_at' => now()]);

        return back()->with('success', 'EMI payment successful.');
    }

    public function show(Request $request, Loan $loan)
    {
        return Inertia::render('loans/show', [
            'loan' => $loan->load(['plan', 'emiSchedule']),
            'schedule' => $this->loanService->getAmortizationSchedule($loan),
            'stats' => [
                'totalPaid' => $loan->getTotalPaid(),
                'remainingBalance' => $loan->getRemainingBalance(),
                'completionPercentage' => $loan->getCompletionPercentage(),
            ],
        ]);
    }
}
