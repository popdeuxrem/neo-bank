<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $accounts = Account::where('user_id', $request->user()->id)->get();

        return response()->json([
            'data' => AccountResource::collection($accounts),
        ]);
    }

    public function show(Account $account): JsonResponse
    {
        $this->authorize('view', $account);

        return response()->json([
            'data' => new AccountResource($account->load('transactions')),
        ]);
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
            'data' => new AccountResource($account),
        ], 201);
    }

    public function update(Request $request, Account $account): JsonResponse
    {
        $this->authorize('update', $account);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'is_default' => 'sometimes|boolean',
        ]);

        $account->update($validated);

        return response()->json([
            'data' => new AccountResource($account),
        ]);
    }

    public function destroy(Account $account): JsonResponse
    {
        $this->authorize('delete', $account);

        $account->delete();

        return response()->json(null, 204);
    }

    public function setDefault(Request $request, Account $account): JsonResponse
    {
        $this->authorize('update', $account);

        $request->user()->accounts()->update(['is_default' => false]);
        $account->update(['is_default' => true]);

        return response()->json([
            'data' => new AccountResource($account),
        ]);
    }
}
