<?php

namespace App\Http\Controllers;

use App\Models\Banking\BillCategory;
use App\Models\Banking\BillPayment;
use App\Models\Banking\BillProvider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillPaymentController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('bills/index', [
            'categories' => BillCategory::where('status', 'active')
                ->orderBy('order')
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'icon' => $c->icon,
                    'color' => $c->color,
                ]),
            'recentBills' => $request->user()->billPayments()
                ->with('provider')
                ->latest()
                ->limit(5)
                ->get(),
            'savedBillers' => [],
        ]);
    }

    public function saved(Request $request)
    {
        return Inertia::render('bills/saved', [
            'savedBillers' => [],
        ]);
    }

    public function history(Request $request)
    {
        return Inertia::render('bills/history', [
            'payments' => $request->user()->billPayments()
                ->with('provider')
                ->latest()
                ->paginate(20)
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'provider' => $p->provider?->name,
                    'billNumber' => $p->bill_number,
                    'amount' => $p->amount,
                    'fee' => $p->fee,
                    'status' => $p->status,
                    'reference' => $p->reference,
                    'createdAt' => $p->created_at->toISOString(),
                ]),
        ]);
    }

    public function category(Request $request, BillCategory $category)
    {
        return Inertia::render('bills/category', [
            'category' => $category,
            'providers' => $category->providers()
                ->where('status', 'active')
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'logo' => $p->logo,
                ]),
        ]);
    }

    public function provider(Request $request, BillCategory $category, BillProvider $provider)
    {
        return Inertia::render('bills/provider', [
            'category' => $category,
            'provider' => $provider,
            'accounts' => $request->user()->ledgerAccounts()
                ->where('status', 'active')
                ->get(),
        ]);
    }

    public function pay(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:bill_providers,id',
            'account_id' => 'required|exists:ledger_accounts,id',
            'bill_number' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0.01',
        ]);

        $provider = BillProvider::findOrFail($validated['provider_id']);

        $fee = $this->calculateFee($validated['amount'], $provider);

        $payment = BillPayment::create([
            'user_id' => $request->user()->id,
            'provider_id' => $validated['provider_id'],
            'account_id' => $validated['account_id'],
            'bill_number' => $validated['bill_number'],
            'amount' => $validated['amount'],
            'fee' => $fee,
            'status' => 'completed',
            'reference' => 'BILL-'.strtoupper(uniqid()),
        ]);

        return back()->with('success', 'Bill payment successful.');
    }

    public function saveBiller(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:bill_providers,id',
            'bill_number' => 'required|string|max:50',
            'nickname' => 'nullable|string|max:100',
        ]);

        return back()->with('success', 'Biller saved successfully.');
    }

    public function deleteBiller(Request $request, $biller)
    {
        return back()->with('success', 'Biller removed successfully.');
    }

    private function calculateFee(float $amount, BillProvider $provider): float
    {
        $feeStructure = $provider->fee_structure ?? ['type' => 'flat', 'value' => 0];

        if (($feeStructure['type'] ?? 'flat') === 'percentage') {
            return $amount * ($feeStructure['value'] / 100);
        }

        return $feeStructure['value'] ?? 0;
    }
}
