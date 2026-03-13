<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request, string $accountId): JsonResponse
    {
        $query = Transaction::where('account_id', $accountId);

        if ($request->has('startDate')) {
            $query->where('date', '>=', $request->input('startDate'));
        }

        if ($request->has('endDate')) {
            $query->where('date', '<=', $request->input('endDate'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $transactions = $query->orderBy('date', 'desc')->paginate(20);

        return response()->json([
            'data' => TransactionResource::collection($transactions),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        $this->authorize('view', $transaction);

        return response()->json([
            'data' => new TransactionResource($transaction->load('account')),
        ]);
    }

    public function getStats(Request $request, string $accountId): JsonResponse
    {
        $query = Transaction::where('account_id', $accountId)
            ->where('status', 'completed');

        $startDate = $request->input('startDate', now()->subDays(30));
        $endDate = $request->input('endDate', now());

        $query->whereBetween('date', [$startDate, $endDate]);

        $income = (clone $query)->where('type', 'credit')->sum('amount');
        $expenses = (clone $query)->whereIn('type', ['debit', 'payment'])
            ->sum('amount');
        $transfers = (clone $query)->where('type', 'transfer')->sum('amount');

        $pending = Transaction::where('account_id', $accountId)
            ->where('status', 'pending')
            ->sum('amount');

        return response()->json([
            'data' => [
                'income' => abs($income),
                'expenses' => abs($expenses),
                'transfers' => abs($transfers),
                'pending' => abs($pending),
                'net' => $income - abs($expenses),
            ],
        ]);
    }

    public function getByCategory(Request $request, string $accountId): JsonResponse
    {
        $startDate = $request->input('startDate', now()->subDays(30));
        $endDate = $request->input('endDate', now());

        $byCategory = Transaction::where('account_id', $accountId)
            ->where('status', 'completed')
            ->whereIn('type', ['debit', 'payment'])
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('category')
            ->selectRaw('category, SUM(ABS(amount)) as total')
            ->get();

        return response()->json([
            'data' => $byCategory,
        ]);
    }

    public function search(Request $request, string $accountId): JsonResponse
    {
        $query = $request->input('q', '');

        $transactions = Transaction::where('account_id', $accountId)
            ->where(function ($q) use ($query) {
                $q->where('description', 'like', "%{$query}%")
                    ->orWhere('merchant', 'like', "%{$query}%")
                    ->orWhere('category', 'like', "%{$query}%");
            })
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'data' => TransactionResource::collection($transactions),
        ]);
    }
}
