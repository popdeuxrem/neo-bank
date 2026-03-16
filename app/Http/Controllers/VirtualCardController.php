<?php

namespace App\Http\Controllers;

use App\Models\Banking\VirtualCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VirtualCardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('cards/index', [
            'cards' => $request->user()->virtualCards()
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'lastFour' => $c->last_four,
                    'cardholderName' => $c->cardholder_name,
                    'expiryMonth' => $c->expiry_month,
                    'expiryYear' => $c->expiry_year,
                    'network' => $c->network,
                    'type' => $c->type,
                    'status' => $c->status,
                    'frozen' => $c->frozen,
                    'balance' => $c->balance,
                    'currency' => $c->currency,
                ]),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('cards/new', [
            'plans' => [
                ['id' => 'basic', 'name' => 'Basic', 'monthlyFee' => 0, 'limit' => 1000],
                ['id' => 'premium', 'name' => 'Premium', 'monthlyFee' => 4.99, 'limit' => 10000],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'network' => 'required|string|in:visa,mastercard',
        ]);

        $card = VirtualCard::create([
            'user_id' => $request->user()->id,
            'card_number_encrypted' => $this->generateCardNumber(),
            'last_four' => substr($validated['type'].'0000', -4),
            'cardholder_name' => $request->user()->name,
            'expiry_month' => str_pad(now()->month + 1, 2, '0', STR_PAD_LEFT),
            'expiry_year' => now()->year + 3,
            'cvv_encrypted' => rand(100, 999),
            'network' => $validated['network'],
            'type' => $validated['type'],
            'status' => 'active',
            'frozen' => false,
            'daily_limit' => 1000,
            'monthly_limit' => 10000,
            'balance' => 0,
            'currency' => 'USD',
        ]);

        return redirect()->route('cards.index')
            ->with('success', 'Virtual card created successfully.');
    }

    public function transactions(Request $request)
    {
        return Inertia::render('cards/transactions', [
            'transactions' => [],
        ]);
    }

    public function controls(Request $request)
    {
        return Inertia::render('cards/controls', [
            'cards' => $request->user()->virtualCards()
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'lastFour' => $c->last_four,
                    'frozen' => $c->frozen,
                    'dailyLimit' => $c->daily_limit,
                    'monthlyLimit' => $c->monthly_limit,
                    'merchantControls' => $c->merchant_controls,
                ]),
        ]);
    }

    public function show(Request $request, VirtualCard $card)
    {
        return Inertia::render('cards/show', [
            'card' => $card,
        ]);
    }

    public function freeze(Request $request, VirtualCard $card)
    {
        $card->update(['frozen' => true]);

        return back()->with('success', 'Card frozen.');
    }

    public function unfreeze(Request $request, VirtualCard $card)
    {
        $card->update(['frozen' => false]);

        return back()->with('success', 'Card unfrozen.');
    }

    public function updateLimits(Request $request, VirtualCard $card)
    {
        $validated = $request->validate([
            'daily_limit' => 'required|numeric|min:0',
            'monthly_limit' => 'required|numeric|min:0',
        ]);

        $card->update($validated);

        return back()->with('success', 'Limits updated.');
    }

    public function updateControls(Request $request, VirtualCard $card)
    {
        $validated = $request->validate([
            'merchant_controls' => 'required|array',
        ]);

        $card->update(['merchant_controls' => $validated['merchant_controls']]);

        return back()->with('success', 'Controls updated.');
    }

    public function cancel(Request $request, VirtualCard $card)
    {
        $card->update(['status' => 'cancelled']);

        return back()->with('success', 'Card cancelled.');
    }

    private function generateCardNumber(): string
    {
        return '4'.rand(100000000000, 999999999999);
    }
}
