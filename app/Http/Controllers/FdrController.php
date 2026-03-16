<?php

namespace App\Http\Controllers;

use App\Models\Banking\FdrPlan;
use App\Models\Banking\FdrSubscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FdrController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('fdr/index', [
            'plans' => FdrPlan::active()->get()->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'interestRate' => $p->interest_rate,
                'minAmount' => $p->min_amount,
                'maxAmount' => $p->max_amount,
                'durationOptions' => $p->duration_options,
                'compoundingFrequency' => $p->compounding_frequency,
                'description' => $p->description,
            ]),
            'mySubscriptions' => $request->user()->fdrSubscriptions()
                ->active()
                ->with('plan')
                ->get(),
        ]);
    }

    public function mine(Request $request)
    {
        return Inertia::render('fdr/mine', [
            'subscriptions' => $request->user()->fdrSubscriptions()
                ->with('plan')
                ->latest()
                ->paginate(10),
        ]);
    }

    public function calculator()
    {
        return Inertia::render('fdr/calculator', [
            'plans' => FdrPlan::active()->get(),
        ]);
    }

    public function open(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:fdr_plans,id',
            'account_id' => 'required|exists:ledger_accounts,id',
            'principal' => 'required|numeric|min:0',
            'duration_months' => 'required|integer|min:1',
        ]);

        $plan = FdrPlan::findOrFail($validated['plan_id']);

        $fdr = FdrSubscription::create([
            'user_id' => $request->user()->id,
            'plan_id' => $validated['plan_id'],
            'account_id' => $validated['account_id'],
            'principal' => $validated['principal'],
            'interest_rate' => $plan->interest_rate,
            'duration_months' => $validated['duration_months'],
            'compounding_frequency' => $plan->compounding_frequency,
            'start_date' => now(),
            'maturity_date' => now()->addMonths($validated['duration_months']),
            'current_value' => $validated['principal'],
            'interest_earned' => 0,
            'status' => 'active',
        ]);

        return redirect()->route('fdr.show', $fdr)
            ->with('success', 'FDR opened successfully.');
    }

    public function show(Request $request, FdrSubscription $fdr)
    {
        return Inertia::render('fdr/show', [
            'subscription' => $fdr->load('plan'),
        ]);
    }

    public function withdrawEarly(Request $request, FdrSubscription $fdr)
    {
        $plan = $fdr->plan;
        $penalty = $fdr->principal * ($plan->early_withdrawal_penalty / 100);
        $netAmount = $fdr->current_value - $penalty;

        $fdr->update(['status' => 'closed']);

        return back()->with('success', "Early withdrawal processed. Penalty: \${$penalty}");
    }
}
