<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ledger\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LedgerOversightController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'type', 'date_from', 'date_to']);

        $query = Transaction::with(['creator', 'entries.account']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('uuid', 'like', "%{$search}%")
                    ->orWhere('transaction_number', 'like', "%{$search}%")
                    ->orWhereHas('creator', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('type')) {
            $type = $request->input('type');
            $query->where('type', $type);
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->input('date_to').' 23:59:59');
        }

        $totalVolume = (clone $query)->get()->sum(function ($txn) {
            return abs($txn->amount);
        });

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/LedgerOversight', [
            'transactions' => $transactions->items(),
            'filters' => $filters,
            'total_volume' => $totalVolume,
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $filters = $request->only(['search', 'type', 'date_from', 'date_to']);

        $query = Transaction::with(['creator', 'entries.account']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('uuid', 'like', "%{$search}%")
                    ->orWhere('transaction_number', 'like', "%{$search}%")
                    ->orWhereHas('creator', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('type')) {
            $type = $request->input('type');
            $query->where('type', $type);
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->input('date_to').' 23:59:59');
        }

        $filename = 'ledger-transactions-'.now()->format('Y-m-d-H-i-s').'.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['ID', 'Transaction Number', 'User Email', 'Type', 'Amount', 'Currency', 'Status', 'Date']);

            $query->orderBy('created_at', 'desc')->chunk(1000, function ($transactions) use ($handle) {
                foreach ($transactions as $txn) {
                    fputcsv($handle, [
                        $txn->uuid,
                        $txn->transaction_number,
                        $txn->creator?->email ?? '',
                        $txn->type,
                        $txn->amount,
                        $txn->currency,
                        $txn->status,
                        $txn->created_at->toIso8601String(),
                    ]);
                }
            });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
