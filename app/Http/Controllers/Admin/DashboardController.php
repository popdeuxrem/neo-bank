<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IdentityDocument;
use App\Models\Ledger\Transaction;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return $this->index();
    }

    public function index(): Response
    {
        $stats = [
            'totalUsers' => User::count(),
            'newUsersToday' => User::whereDate('created_at', today())->count(),
            'newUsersYesterday' => User::whereDate('created_at', today()->subDay())->count(),
            'pendingKyc' => IdentityDocument::whereIn('status', [
                IdentityDocument::STATUS_PENDING,
                IdentityDocument::STATUS_SUBMITTED,
                IdentityDocument::STATUS_UNDER_REVIEW,
            ])->count(),
            'flaggedTransactions' => Transaction::where('status', Transaction::STATUS_FLAGGED)->count(),
            'activeTickets' => 0,
            'totalTransactionVolume' => Transaction::where('status', Transaction::STATUS_COMPLETED)->sum('amount'),
            'totalTransactionCount' => Transaction::count(),
        ];

        $recentTransactions = Transaction::with(['creator', 'entries.account'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($txn) {
                return [
                    'id' => $txn->id,
                    'transaction_number' => $txn->transaction_number,
                    'type' => $txn->type,
                    'amount' => $txn->amount,
                    'currency' => $txn->currency ?? 'USD',
                    'status' => $txn->status,
                    'description' => $txn->description,
                    'created_at' => $txn->created_at->toIso8601String(),
                    'user_id' => $txn->created_by,
                    'user_name' => $txn->creator?->name,
                    'user_email' => $txn->creator?->email,
                ];
            });

        $kycQueue = IdentityDocument::with('user')
            ->whereIn('status', [
                IdentityDocument::STATUS_PENDING,
                IdentityDocument::STATUS_SUBMITTED,
                IdentityDocument::STATUS_UNDER_REVIEW,
            ])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'user_id' => $doc->user_id,
                    'user_name' => $doc->user?->name,
                    'user_email' => $doc->user?->email,
                    'document_type' => $doc->document_type,
                    'document_type_label' => $doc->getDocumentTypeLabel(),
                    'file_path' => $doc->file_path,
                    'status' => $doc->status,
                    'created_at' => $doc->created_at->toIso8601String(),
                ];
            });

        $fraudAlerts = Transaction::with('creator')
            ->where('status', Transaction::STATUS_FLAGGED)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($txn) {
                $metadata = $txn->metadata ?? [];

                return [
                    'id' => $txn->id,
                    'transaction_number' => $txn->transaction_number,
                    'type' => $txn->type,
                    'amount' => $txn->amount,
                    'currency' => $txn->currency ?? 'USD',
                    'status' => $txn->status,
                    'created_at' => $txn->created_at->toIso8601String(),
                    'user_id' => $txn->created_by,
                    'user_name' => $txn->creator?->name,
                    'fraud_score' => $metadata['fraud_score'] ?? null,
                    'fraud_reason' => $metadata['fraud_reason'] ?? 'Manual review required',
                ];
            });

        $chartData = $this->getTransactionChartData();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'kycQueue' => $kycQueue,
            'fraudAlerts' => $fraudAlerts,
            'chartData' => $chartData,
        ]);
    }

    protected function getTransactionChartData(): array
    {
        $days = 30;
        $data = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateStr = $date->format('Y-m-d');

            $volume = Transaction::whereDate('created_at', $date)
                ->where('status', Transaction::STATUS_COMPLETED)
                ->sum('amount');

            $count = Transaction::whereDate('created_at', $date)->count();

            $data[] = [
                'date' => $dateStr,
                'label' => $date->format('M d'),
                'volume' => $volume / 100,
                'count' => $count,
                'deposits' => Transaction::whereDate('created_at', $date)
                    ->where('type', Transaction::TYPE_DEPOSIT)
                    ->count(),
                'withdrawals' => Transaction::whereDate('created_at', $date)
                    ->where('type', Transaction::TYPE_WITHDRAWAL)
                    ->count(),
                'transfers' => Transaction::whereDate('created_at', $date)
                    ->where('type', Transaction::TYPE_TRANSFER)
                    ->count(),
                'payments' => Transaction::whereDate('created_at', $date)
                    ->where('type', Transaction::TYPE_PAYMENT)
                    ->count(),
            ];
        }

        return $data;
    }
}
