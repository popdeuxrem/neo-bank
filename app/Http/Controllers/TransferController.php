<?php

namespace App\Http\Controllers;

use App\Events\Ledger\TransactionCompleted;
use App\Models\Ledger\Account;
use App\Services\LedgerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransferController extends Controller
{
    public function __construct(
        protected LedgerService $ledgerService
    ) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string',
        ]);

        $fromAccount = Account::findOrFail($validated['from_account_id']);
        $toAccount = Account::findOrFail($validated['to_account_id']);

        if ($fromAccount->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You do not own the source account.',
            ], 403);
        }

        $transaction = $this->ledgerService->transfer(
            $fromAccount,
            $toAccount,
            (float) $validated['amount'],
            $validated['description'],
            $request->user()
        );

        event(new TransactionCompleted($transaction));

        return response()->json([
            'message' => 'Transfer completed successfully.',
            'data' => [
                'id' => $transaction->id,
                'transaction_number' => $transaction->transaction_number,
                'amount' => $transaction->amount,
                'description' => $transaction->description,
                'status' => $transaction->status,
                'posted_at' => $transaction->posted_at?->toIso8601String(),
            ],
        ]);
    }
}
