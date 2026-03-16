<?php

namespace App\Http\Controllers;

use App\Models\Banking\Wallet;
use App\Models\Deposit;
use App\Models\DepositMethod;
use App\Models\Withdrawal;
use App\Models\WithdrawalMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $wallet = $user->wallet ?? Wallet::create([
            'user_id' => $user->id,
            'balance' => 0,
            'currency' => 'USD',
            'status' => 'active',
        ]);

        return Inertia::render('wallet/index', [
            'wallet' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'currency' => $wallet->currency,
                'status' => $wallet->status,
            ],
            'transactions' => $user->transactions()
                ->latest()
                ->limit(20)
                ->get()
                ->map(fn ($t) => [
                    'id' => $t->id,
                    'type' => $t->type,
                    'amount' => $t->amount,
                    'currency' => $t->currency,
                    'description' => $t->description,
                    'status' => $t->status,
                    'createdAt' => $t->created_at->toISOString(),
                ]),
            'currencies' => [
                ['code' => 'USD', 'balance' => $wallet->balance, 'symbol' => '$'],
            ],
        ]);
    }

    public function deposit(Request $request): Response
    {
        return Inertia::render('wallet/deposit', [
            'methods' => DepositMethod::active()->get()->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'type' => $m->type,
                'currencies' => $m->currencies,
                'minAmount' => $m->min_amount,
                'maxAmount' => $m->max_amount,
                'fee' => $m->fee_structure,
                'processingTime' => $m->processing_time,
                'instructions' => $m->instructions,
            ]),
            'recentDeposits' => $request->user()->deposits()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn ($d) => [
                    'id' => $d->id,
                    'amount' => $d->amount,
                    'currency' => $d->currency,
                    'status' => $d->status,
                    'createdAt' => $d->created_at->toISOString(),
                ]),
        ]);
    }

    public function processDeposit(Request $request)
    {
        $validated = $request->validate([
            'method_id' => 'required|exists:deposit_methods,id',
            'amount' => 'required|numeric|min:1',
            'currency' => 'required|string|size:3',
        ]);

        $method = DepositMethod::findOrFail($validated['method_id']);

        $validated['fee'] = $this->calculateFee($validated['amount'], $method);

        $deposit = Deposit::create([
            'user_id' => $request->user()->id,
            'method_id' => $validated['method_id'],
            'amount' => $validated['amount'],
            'currency' => $validated['currency'],
            'fee' => $validated['fee'],
            'status' => $method->type === 'automatic' ? 'processing' : 'pending',
            'reference' => 'DEP-'.strtoupper(uniqid()),
        ]);

        return back()->with('success', 'Deposit initiated successfully.');
    }

    public function withdraw(Request $request): Response
    {
        $user = $request->user();
        $wallet = $user->wallet ?? Wallet::create([
            'user_id' => $user->id,
            'balance' => 0,
            'currency' => 'USD',
            'status' => 'active',
        ]);

        return Inertia::render('wallet/withdraw', [
            'methods' => WithdrawalMethod::active()->get()->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'type' => $m->type,
                'currencies' => $m->currencies,
                'minAmount' => $m->min_amount,
                'maxAmount' => $m->max_amount,
                'fee' => $m->fee_structure,
                'processingTime' => $m->processing_time,
            ]),
            'wallet' => [
                'balance' => $wallet->balance,
                'currency' => $wallet->currency,
            ],
            'recentWithdrawals' => $request->user()->withdrawals()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn ($w) => [
                    'id' => $w->id,
                    'amount' => $w->amount,
                    'currency' => $w->currency,
                    'status' => $w->status,
                    'createdAt' => $w->created_at->toISOString(),
                ]),
        ]);
    }

    public function processWithdrawal(Request $request)
    {
        $validated = $request->validate([
            'method_id' => 'required|exists:withdrawal_methods,id',
            'amount' => 'required|numeric|min:1',
            'currency' => 'required|string|size:3',
            'account_details' => 'required|array',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        if (! $wallet || $wallet->balance < $validated['amount']) {
            return back()->withErrors(['amount' => 'Insufficient balance.']);
        }

        $method = WithdrawalMethod::findOrFail($validated['method_id']);
        $fee = $this->calculateFee($validated['amount'], $method);
        $netAmount = $validated['amount'] - $fee;

        $wallet->decrement('balance', $validated['amount']);

        $withdrawal = Withdrawal::create([
            'user_id' => $user->id,
            'method_id' => $validated['method_id'],
            'amount' => $validated['amount'],
            'currency' => $validated['currency'],
            'fee' => $fee,
            'net_amount' => $netAmount,
            'account_details' => $validated['account_details'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Withdrawal request submitted.');
    }

    private function calculateFee(float $amount, $method): float
    {
        $feeStructure = $method->fee_structure ?? ['type' => 'flat', 'value' => 0];

        if ($feeStructure['type'] ?? 'flat' === 'percentage') {
            return $amount * ($feeStructure['value'] / 100);
        }

        return $feeStructure['value'] ?? 0;
    }
}
