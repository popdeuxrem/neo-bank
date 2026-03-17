<?php

namespace App\Http\Controllers;

use App\Models\Ledger\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        try {
            $accounts = Account::where('user_id', $request->user()->id)
                ->get()
                ->map(fn ($account) => [
                    'id' => $account->id,
                    'name' => $account->name,
                    'account_number' => $account->account_number,
                    'balance' => $account->balance,
                    'currency' => $account->currency,
                    'type' => $account->type,
                    'status' => $account->status,
                ]);

            return Inertia::render('accounts/index', [
                'accounts' => $accounts,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('accounts/index', [
                'accounts' => [],
            ]);
        }
    }

    public function show(Request $request, $account)
    {
        try {
            $account = Account::where('user_id', $request->user()->id)
                ->findOrFail($account);

            return Inertia::render('accounts/show', [
                'account' => [
                    'id' => $account->id,
                    'name' => $account->name,
                    'account_number' => $account->account_number,
                    'balance' => $account->balance,
                    'currency' => $account->currency,
                    'type' => $account->type,
                    'status' => $account->status,
                ],
            ]);
        } catch (\Exception $e) {
            return redirect()->route('accounts');
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:checking,savings,credit,investment',
            'currency' => 'required|string|size:3',
        ]);

        $account = $request->user()->accounts()->create($validated);

        return response()->json([
            'data' => [
                'id' => $account->id,
                'name' => $account->name,
                'account_number' => $account->account_number,
                'balance' => $account->balance,
                'currency' => $account->currency,
                'type' => $account->type,
                'status' => $account->status,
            ],
        ], 201);
    }

    public function update(Request $request, Account $account): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'is_default' => 'sometimes|boolean',
        ]);

        $account->update($validated);

        return response()->json([
            'data' => [
                'id' => $account->id,
                'name' => $account->name,
                'account_number' => $account->account_number,
                'balance' => $account->balance,
                'currency' => $account->currency,
                'type' => $account->type,
                'status' => $account->status,
            ],
        ]);
    }

    public function destroy(Account $account): JsonResponse
    {
        $account->delete();

        return response()->json(null, 204);
    }

    public function setDefault(Request $request, Account $account): JsonResponse
    {
        $request->user()->accounts()->update(['is_default' => false]);
        $account->update(['is_default' => true]);

        return response()->json([
            'data' => [
                'id' => $account->id,
                'name' => $account->name,
                'account_number' => $account->account_number,
                'balance' => $account->balance,
                'currency' => $account->currency,
                'type' => $account->type,
                'status' => $account->status,
            ],
        ]);
    }
}
