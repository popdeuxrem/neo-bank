<?php

namespace App\Http\Controllers;

use App\Models\Banking\MoneyRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MoneyRequestController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('requests/new', [
            'accounts' => $request->user()->ledgerAccounts()
                ->where('status', 'active')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'requestee_email' => 'nullable|email',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'required|string|size:3',
            'note' => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['expires_at'] = now()->addDays(7);
        $validated['status'] = 'pending';

        MoneyRequest::create($validated);

        return back()->with('success', 'Money request sent.');
    }

    public function incoming(Request $request)
    {
        return Inertia::render('requests/incoming', [
            'requests' => MoneyRequest::where('requestee_id', $request->user()->id)
                ->orWhere('requestee_email', $request->user()->email)
                ->with('user')
                ->latest()
                ->paginate(20)
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'from' => $r->user->name,
                    'amount' => $r->amount,
                    'currency' => $r->currency,
                    'note' => $r->note,
                    'status' => $r->status,
                    'expiresAt' => $r->expires_at->toISOString(),
                    'createdAt' => $r->created_at->toISOString(),
                ]),
        ]);
    }

    public function outgoing(Request $request)
    {
        return Inertia::render('requests/outgoing', [
            'requests' => $request->user()->moneyRequests()
                ->with('requestee')
                ->latest()
                ->paginate(20)
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'to' => $r->requestee?->name ?? $r->requestee_email,
                    'amount' => $r->amount,
                    'currency' => $r->currency,
                    'note' => $r->note,
                    'status' => $r->status,
                    'expiresAt' => $r->expires_at->toISOString(),
                    'createdAt' => $r->created_at->toISOString(),
                ]),
        ]);
    }

    public function pay(Request $request, MoneyRequest $moneyRequest)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:ledger_accounts,id',
        ]);

        $moneyRequest->update(['status' => 'paid']);

        return back()->with('success', 'Payment made.');
    }

    public function decline(Request $request, MoneyRequest $moneyRequest)
    {
        $moneyRequest->update(['status' => 'declined']);

        return back()->with('success', 'Request declined.');
    }

    public function cancel(Request $request, MoneyRequest $moneyRequest)
    {
        $moneyRequest->delete();

        return back()->with('success', 'Request cancelled.');
    }
}
