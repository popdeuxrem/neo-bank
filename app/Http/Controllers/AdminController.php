<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Ledger\Account;
use App\Models\Ledger\AccountType;
use App\Models\Ledger\Transaction;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_accounts' => Account::count(),
            'total_transactions' => Transaction::count(),
            'total_payments' => Payment::count(),
            'total_volume' => Transaction::sum('amount'),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'failed_payments' => Payment::where('status', 'failed')->count(),
        ];

        $recentTransactions = Transaction::with(['entries.account', 'creator'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'transaction_number' => $t->transaction_number,
                'type' => $t->type,
                'amount' => $t->amount,
                'status' => $t->status,
                'created_at' => $t->created_at->toIso8601String(),
                'entries' => $t->entries->map(fn ($e) => [
                    'account' => $e->account->name,
                    'entry_type' => $e->entry_type,
                    'amount' => $e->amount,
                ]),
            ]);

        $recentAuditLogs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'user' => $log->user?->name,
                'entity_type' => $log->entity_type,
                'entity_id' => $log->entity_id,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at->toIso8601String(),
            ]);

        $accountTypes = AccountType::withCount('accounts')
            ->get()
            ->map(fn ($type) => [
                'name' => $type->name,
                'count' => $type->accounts_count,
            ]);

        return Inertia::render('admin-dashboard', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'recentAuditLogs' => $recentAuditLogs,
            'accountTypes' => $accountTypes,
        ]);
    }

    public function auditLogs(Request $request): Response
    {
        $query = AuditLog::with('user')->orderBy('created_at', 'desc');

        if ($request->has('action')) {
            $query->where('action', $request->input('action'));
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $logs = $query->paginate(50);

        return Inertia::render('admin-dashboard', [
            'auditLogs' => $logs->items(),
            'pagination' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    public function users(Request $request): Response
    {
        $users = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin-dashboard', [
            'users' => $users->items(),
            'roles' => Role::all()->pluck('name'),
        ]);
    }
}
