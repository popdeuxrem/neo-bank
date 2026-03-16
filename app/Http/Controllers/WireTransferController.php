<?php

namespace App\Http\Controllers;

use App\Models\Banking\WireTransfer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WireTransferController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('wire/new', [
            'accounts' => $request->user()->ledgerAccounts()
                ->where('status', 'active')
                ->get()
                ->map(fn ($a) => [
                    'id' => $a->id,
                    'name' => $a->name,
                    'balance' => $a->balance,
                    'currency' => $a->currency,
                ]),
            'fee' => 25.00,
            'processingTime' => '1-3 business days',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_account_id' => 'required|exists:ledger_accounts,id',
            'recipient_name' => 'required|string|max:100',
            'recipient_address' => 'nullable|string|max:255',
            'bank_name' => 'required|string|max:100',
            'bank_country' => 'required|string|size:2',
            'swift_bic' => 'required|string|size:11',
            'iban' => 'nullable|string|max:50',
            'account_number' => 'nullable|string|max:50',
            'amount' => 'required|numeric|min:100',
            'currency' => 'required|string|size:3',
            'purpose' => 'nullable|string|max:255',
        ]);

        $validated['fee'] = 25.00;
        $validated['user_id'] = $request->user()->id;
        $validated['tracking_number'] = 'WIRE-'.strtoupper(uniqid());
        $validated['status'] = 'pending';

        $wire = WireTransfer::create($validated);

        return redirect()->route('wire.show', $wire)
            ->with('success', 'Wire transfer initiated successfully.');
    }

    public function swift(Request $request)
    {
        return Inertia::render('wire/swift', [
            'accounts' => $request->user()->ledgerAccounts()
                ->where('status', 'active')
                ->get(),
        ]);
    }

    public function swiftStore(Request $request)
    {
        return $this->store($request);
    }

    public function history(Request $request)
    {
        return Inertia::render('wire/history', [
            'transfers' => $request->user()->wireTransfers()
                ->latest()
                ->paginate(20)
                ->map(fn ($w) => [
                    'id' => $w->id,
                    'recipient_name' => $w->recipient_name,
                    'bank_name' => $w->bank_name,
                    'amount' => $w->amount,
                    'currency' => $w->currency,
                    'status' => $w->status,
                    'tracking_number' => $w->tracking_number,
                    'createdAt' => $w->created_at->toISOString(),
                ]),
        ]);
    }

    public function show(Request $request, WireTransfer $wire)
    {
        $this->authorize('view', $wire);

        return Inertia::render('wire/show', [
            'transfer' => $wire,
        ]);
    }
}
