<?php

namespace App\Http\Controllers\Ledger;

use App\Http\Controllers\Controller;
use App\Models\Ledger\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(): Response
    {
        $accounts = Account::with(['accountType', 'balance'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('accounts', [
            'accounts' => $accounts->map(fn ($account) => [
                'id' => $account->id,
                'uuid' => $account->uuid,
                'account_number' => $account->account_number,
                'name' => $account->name,
                'type' => $account->accountType?->name,
                'balance' => $account->getCurrentBalance(),
                'available_balance' => $account->getAvailableBalance(),
                'is_system' => $account->is_system,
            ]),
        ]);
    }

    public function show(Account $account): JsonResponse
    {
        $account->load(['accountType', 'balance', 'entries.transaction']);

        return response()->json([
            'id' => $account->id,
            'uuid' => $account->uuid,
            'account_number' => $account->account_number,
            'name' => $account->name,
            'description' => $account->description,
            'type' => $account->accountType?->name,
            'balance' => $account->getCurrentBalance(),
            'available_balance' => $account->getAvailableBalance(),
            'is_active' => $account->is_active,
            'is_system' => $account->is_system,
            'created_at' => $account->created_at->toIso8601String(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'account_type_id' => 'required|exists:account_types,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'parent_id' => 'nullable|exists:accounts,id',
        ]);

        $validated['account_number'] = $this->generateAccountNumber();
        $validated['created_by'] = $request->user()?->id;

        $account = Account::create($validated);

        return response()->json($account, 201);
    }

    public function update(Request $request, Account $account): JsonResponse
    {
        if ($account->is_system) {
            return response()->json(['error' => 'Cannot modify system accounts'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'sometimes|boolean',
        ]);

        $validated['updated_by'] = $request->user()?->id;
        $account->update($validated);

        return response()->json($account);
    }

    public function destroy(Account $account): JsonResponse
    {
        if ($account->is_system) {
            return response()->json(['error' => 'Cannot delete system accounts'], 403);
        }

        if ($account->getCurrentBalance() !== 0) {
            return response()->json(['error' => 'Cannot delete account with non-zero balance'], 400);
        }

        $account->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }

    protected function generateAccountNumber(): string
    {
        $lastAccount = Account::orderBy('id', 'desc')->first();
        $nextNumber = $lastAccount ? $lastAccount->id + 1 : 1;

        return str_pad((string) $nextNumber, 8, '0', STR_PAD_LEFT);
    }
}
