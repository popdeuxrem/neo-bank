<?php

namespace App\Http\Controllers;

use App\Models\Banking\DpsPlan;
use App\Models\Banking\DpsSubscription;
use App\Services\DpsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DpsController extends Controller
{
    public function __construct(private DpsService $dpsService) {}

    public function index(Request $request)
    {
        return Inertia::render('dps/index', [
            'plans' => DpsPlan::active()->get()->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'interestRate' => $p->interest_rate,
                'minAmount' => $p->min_amount,
                'maxAmount' => $p->max_amount,
                'durationMonths' => $p->duration_months,
                'description' => $p->description,
                'calculator' => $this->dpsService->calculate($p, 1000, $p->duration_months),
            ]),
            'mySubscriptions' => $request->user()->dpsSubscriptions()
                ->active()
                ->with('plan')
                ->get()
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'planName' => $s->plan->name,
                    'monthlyAmount' => $s->monthly_amount,
                    'totalDeposited' => $s->total_deposited,
                    'interestEarned' => $s->interest_earned,
                    'maturityDate' => $s->maturity_date->toISOString(),
                    'status' => $s->status,
                ]),
        ]);
    }

    public function mine(Request $request)
    {
        return Inertia::render('dps/mine', [
            'subscriptions' => $request->user()->dpsSubscriptions()
                ->with('plan')
                ->latest()
                ->paginate(10)
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'planName' => $s->plan->name,
                    'monthlyAmount' => $s->monthly_amount,
                    'totalDeposited' => $s->total_deposited,
                    'interestEarned' => $s->interest_earned,
                    'maturityDate' => $s->maturity_date->toISOString(),
                    'status' => $s->status,
                ]),
        ]);
    }

    public function calculator()
    {
        return Inertia::render('dps/calculator', [
            'plans' => DpsPlan::active()->get(),
        ]);
    }

    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:dps_plans,id',
            'account_id' => 'required|exists:ledger_accounts,id',
            'monthly_amount' => 'required|numeric|min:0',
            'start_date' => 'required|date|after_or_equal:today',
        ]);

        $plan = DpsPlan::findOrFail($validated['plan_id']);

        if ($validated['monthly_amount'] < $plan->min_amount ||
            $validated['monthly_amount'] > $plan->max_amount) {
            return back()->withErrors([
                'monthly_amount' => "Amount must be between {$plan->min_amount} and {$plan->max_amount}",
            ]);
        }

        $subscription = $this->dpsService->subscribe(
            $request->user(), $plan, $validated
        );

        return redirect()->route('dps.show', $subscription)
            ->with('success', 'DPS subscription created successfully.');
    }

    public function show(Request $request, DpsSubscription $dps)
    {
        return Inertia::render('dps/show', [
            'subscription' => $dps->load(['plan', 'installments']),
            'schedule' => $this->dpsService->getPaymentSchedule($dps),
            'projectedReturn' => $this->dpsService->calculate(
                $dps->plan,
                $dps->monthly_amount,
                $dps->plan->duration_months
            ),
        ]);
    }

    public function payInstallment(Request $request, DpsSubscription $dps)
    {
        $dps->increment('total_deposited', $dps->monthly_amount);

        $dps->installments()
            ->where('status', 'pending')
            ->first()
            ->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

        return back()->with('success', 'Installment paid successfully.');
    }

    public function close(Request $request, DpsSubscription $dps)
    {
        $dps->update(['status' => 'closed']);

        return redirect()->route('dps.mine')
            ->with('success', 'DPS closed. Maturity amount credited to account.');
    }
}
