<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\IdentityDocument;
use App\Models\Ledger\Account;
use App\Models\Ledger\AccountType;
use App\Models\Ledger\Transaction;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
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
        $query = User::with(['roles', 'accounts']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->input('status')) {
            $query->where('account_status', $request->input('status'));
        }

        if ($request->has('role') && $request->input('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('name', $request->input('role')));
        }

        $sortBy = $request->input('sort', 'created_at');
        $sortDir = $request->input('dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $users = $query->paginate(20);

        $users->getCollection()->transform(function ($user) {
            $user->kyc_status = IdentityDocument::where('user_id', $user->id)
                ->latest()
                ->first()?->status ?? 'none';
            $user->balance = $user->accounts->sum('balance');

            return $user;
        });

        return Inertia::render('admin/users/index', [
            'users' => $users->items(),
            'roles' => Role::all()->pluck('name'),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'role' => $request->input('role', ''),
                'sort' => $sortBy,
                'dir' => $sortDir,
            ],
        ]);
    }

    public function showUser(User $user): Response
    {
        $user->load(['roles', 'accounts', 'identityDocuments']);

        $user->kyc_status = IdentityDocument::where('user_id', $user->id)
            ->latest()
            ->first()?->status ?? 'none';

        $user->total_balance = $user->accounts->sum('balance');

        $transactions = Transaction::with(['entries.account'])
            ->where('created_by', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'transaction_number' => $t->transaction_number,
                'type' => $t->type,
                'amount' => $t->amount,
                'currency' => $t->currency ?? 'USD',
                'status' => $t->status,
                'description' => $t->description,
                'created_at' => $t->created_at->toIso8601String(),
            ]);

        $loginHistory = AuditLog::where('user_id', $user->id)
            ->where('action', 'login')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->metadata['user_agent'] ?? 'Unknown',
                'created_at' => $log->created_at->toIso8601String(),
            ]);

        $documents = IdentityDocument::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($doc) => [
                'id' => $doc->id,
                'document_type' => $doc->document_type,
                'document_type_label' => $doc->getDocumentTypeLabel(),
                'status' => $doc->status,
                'file_path' => $doc->file_path,
                'created_at' => $doc->created_at->toIso8601String(),
            ]);

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'transactions' => $transactions,
            'loginHistory' => $loginHistory,
            'documents' => $documents,
        ]);
    }

    public function blockUser(Request $request, User $user): JsonResponse
    {
        $user->update(['account_status' => User::STATUS_SUSPENDED]);

        return response()->json([
            'message' => 'User has been blocked',
            'user' => $user,
        ]);
    }

    public function unblockUser(Request $request, User $user): JsonResponse
    {
        $user->update(['account_status' => User::STATUS_ACTIVE]);

        return response()->json([
            'message' => 'User has been unblocked',
            'user' => $user,
        ]);
    }

    public function addNote(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'note' => 'required|string|max:1000',
        ]);

        $notes = $user->metadata['admin_notes'] ?? [];
        $notes[] = [
            'note' => $request->note,
            'admin_id' => auth()->id(),
            'created_at' => now()->toIso8601String(),
        ];

        $user->update(['metadata' => array_merge($user->metadata ?? [], ['admin_notes' => $notes])]);

        return response()->json([
            'message' => 'Note added successfully',
            'notes' => $notes,
        ]);
    }

    public function transactionReport(Request $request): Response
    {
        $query = Transaction::with(['creator', 'entries.account']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('transaction_number', 'like', "%{$search}%")
                    ->orWhereHas('creator', fn ($cq) => $cq->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
            });
        }

        if ($request->has('type') && $request->input('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('status') && $request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('min_amount')) {
            $query->where('amount', '>=', $request->input('min_amount'));
        }

        if ($request->has('max_amount')) {
            $query->where('amount', '<=', $request->input('max_amount'));
        }

        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }

        $sortBy = $request->input('sort', 'created_at');
        $sortDir = $request->input('dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $transactions = $query->paginate(50);

        $transactions->getCollection()->transform(function ($t) {
            $t->user_name = $t->creator?->name;
            $t->user_email = $t->creator?->email;

            return $t;
        });

        $summary = [
            'total_volume' => $query->clone()->where('status', Transaction::STATUS_COMPLETED)->sum('amount'),
            'total_count' => $query->clone()->count(),
            'avg_amount' => $query->clone()->avg('amount') ?? 0,
        ];

        return Inertia::render('admin/reports/transactions', [
            'transactions' => $transactions->items(),
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'total' => $transactions->total(),
                'per_page' => $transactions->perPage(),
            ],
            'summary' => $summary,
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', ''),
                'status' => $request->input('status', ''),
                'min_amount' => $request->input('min_amount', ''),
                'max_amount' => $request->input('max_amount', ''),
                'from_date' => $request->input('from_date', ''),
                'to_date' => $request->input('to_date', ''),
                'sort' => $sortBy,
                'dir' => $sortDir,
            ],
        ]);
    }

    public function loginReport(Request $request): Response
    {
        $query = AuditLog::with('user')
            ->where('action', 'login')
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }

        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }

        $logs = $query->paginate(50);

        return Inertia::render('admin/reports/logins', [
            'logs' => $logs->items(),
            'pagination' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'total' => $logs->total(),
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'from_date' => $request->input('from_date', ''),
                'to_date' => $request->input('to_date', ''),
            ],
        ]);
    }

    public function deposits(Request $request): Response
    {
        return Inertia::render('admin/deposits/index', [
            'deposits' => [],
            'stats' => ['total' => 0, 'pending' => 0, 'completed' => 0],
        ]);
    }

    public function pendingDeposits(Request $request): Response
    {
        return Inertia::render('admin/deposits/pending', [
            'deposits' => [],
        ]);
    }

    public function depositMethods(Request $request): Response
    {
        return Inertia::render('admin/deposits/methods', [
            'methods' => [],
        ]);
    }

    public function withdrawals(Request $request): Response
    {
        return Inertia::render('admin/withdrawals/index', [
            'withdrawals' => [],
            'stats' => ['total' => 0, 'pending' => 0, 'completed' => 0],
        ]);
    }

    public function pendingWithdrawals(Request $request): Response
    {
        return Inertia::render('admin/withdrawals/pending', [
            'withdrawals' => [],
        ]);
    }

    public function withdrawalMethods(Request $request): Response
    {
        return Inertia::render('admin/withdrawals/methods', [
            'methods' => [],
        ]);
    }

    public function dpsPlans(Request $request): Response
    {
        return Inertia::render('admin/dps/plans', [
            'plans' => [],
        ]);
    }

    public function dpsSubscriptions(Request $request): Response
    {
        return Inertia::render('admin/dps/subscriptions', [
            'subscriptions' => [],
        ]);
    }

    public function fdrPlans(Request $request): Response
    {
        return Inertia::render('admin/fdr/plans', [
            'plans' => [],
        ]);
    }

    public function fdrSubscriptions(Request $request): Response
    {
        return Inertia::render('admin/fdr/subscriptions', [
            'subscriptions' => [],
        ]);
    }

    public function fdrCompounding(Request $request): Response
    {
        return Inertia::render('admin/fdr/compounding', [
            'data' => [],
        ]);
    }

    public function loanPlans(Request $request): Response
    {
        return Inertia::render('admin/loans/plans', [
            'plans' => [],
        ]);
    }

    public function loanApplications(Request $request): Response
    {
        return Inertia::render('admin/loans/applications', [
            'applications' => [],
        ]);
    }

    public function activeLoans(Request $request): Response
    {
        return Inertia::render('admin/loans/active', [
            'loans' => [],
        ]);
    }

    public function overdueLoans(Request $request): Response
    {
        return Inertia::render('admin/loans/active', [
            'loans' => [],
            'filter' => 'overdue',
        ]);
    }

    public function wireTransfers(Request $request): Response
    {
        return Inertia::render('admin/transfers/index', [
            'transfers' => [],
        ]);
    }

    public function wireSettings(Request $request): Response
    {
        return Inertia::render('admin/transfers/index', [
            'settings' => [],
        ]);
    }

    public function transfers(Request $request): Response
    {
        return Inertia::render('admin/transfers/index', [
            'transfers' => [],
        ]);
    }

    public function manualTransfer(Request $request): Response
    {
        return Inertia::render('admin/transfers/manual', [
            'users' => [],
        ]);
    }

    public function transferSettings(Request $request): Response
    {
        return Inertia::render('admin/transfers/index', [
            'settings' => [],
        ]);
    }

    public function billTransactions(Request $request): Response
    {
        return Inertia::render('admin/bills/transactions', [
            'transactions' => [],
        ]);
    }

    public function billProviders(Request $request): Response
    {
        return Inertia::render('admin/bills/providers', [
            'providers' => [],
        ]);
    }

    public function billCategories(Request $request): Response
    {
        return Inertia::render('admin/bills/categories', [
            'categories' => [],
        ]);
    }

    public function gateways(Request $request): Response
    {
        return Inertia::render('admin/gateways/index', [
            'gateways' => [],
        ]);
    }

    public function gatewayLogs(Request $request): Response
    {
        return Inertia::render('admin/gateways/logs', [
            'logs' => [],
        ]);
    }

    public function kycApproved(Request $request): Response
    {
        return Inertia::render('admin/kyc/index', [
            'documents' => [],
            'filter' => 'approved',
        ]);
    }

    public function kycRejected(Request $request): Response
    {
        return Inertia::render('admin/kyc/index', [
            'documents' => [],
            'filter' => 'rejected',
        ]);
    }

    public function kycSettings(Request $request): Response
    {
        return Inertia::render('admin/kyc/settings', [
            'settings' => [],
        ]);
    }

    public function landingHero(Request $request): Response
    {
        return Inertia::render('admin/landing/hero', [
            'content' => [],
        ]);
    }

    public function landingFeatures(Request $request): Response
    {
        return Inertia::render('admin/landing/features', [
            'features' => [],
        ]);
    }

    public function landingPricing(Request $request): Response
    {
        return Inertia::render('admin/landing/pricing', [
            'pricing' => [],
        ]);
    }

    public function landingTestimonials(Request $request): Response
    {
        return Inertia::render('admin/landing/testimonials', [
            'testimonials' => [],
        ]);
    }

    public function pages(Request $request): Response
    {
        return Inertia::render('admin/pages/index', [
            'pages' => [],
        ]);
    }

    public function footer(Request $request): Response
    {
        return Inertia::render('admin/pages/footer', [
            'content' => [],
        ]);
    }

    public function navigation(Request $request): Response
    {
        return Inertia::render('admin/pages/navigation', [
            'items' => [],
        ]);
    }

    public function profitOverview(Request $request): Response
    {
        return Inertia::render('admin/profits/overview', [
            'stats' => [],
        ]);
    }

    public function profitFees(Request $request): Response
    {
        return Inertia::render('admin/profits/overview', [
            'fees' => [],
        ]);
    }

    public function referralSettings(Request $request): Response
    {
        return Inertia::render('admin/referrals/settings', [
            'settings' => [],
        ]);
    }

    public function referralTree(Request $request): Response
    {
        return Inertia::render('admin/referrals/tree', [
            'tree' => [],
        ]);
    }

    public function referralCommissions(Request $request): Response
    {
        return Inertia::render('admin/referrals/commissions', [
            'commissions' => [],
        ]);
    }

    public function rewardsSettings(Request $request): Response
    {
        return Inertia::render('admin/rewards/settings', [
            'settings' => [],
        ]);
    }

    public function rewardTransactions(Request $request): Response
    {
        return Inertia::render('admin/rewards/transactions', [
            'transactions' => [],
        ]);
    }

    public function redeemRequests(Request $request): Response
    {
        return Inertia::render('admin/rewards/redeem', [
            'requests' => [],
        ]);
    }

    public function portfolioTiers(Request $request): Response
    {
        return Inertia::render('admin/portfolio/tiers', [
            'tiers' => [],
        ]);
    }

    public function portfolioBadges(Request $request): Response
    {
        return Inertia::render('admin/portfolio/badges', [
            'badges' => [],
        ]);
    }

    public function staff(Request $request): Response
    {
        return Inertia::render('admin/staff/index', [
            'staff' => [],
        ]);
    }

    public function createStaff(Request $request): Response
    {
        return Inertia::render('admin/staff/create', [
            'roles' => [],
        ]);
    }

    public function roles(Request $request): Response
    {
        return Inertia::render('admin/roles/index', [
            'roles' => [],
        ]);
    }

    public function permissions(Request $request): Response
    {
        return Inertia::render('admin/roles/permissions', [
            'permissions' => [],
        ]);
    }

    public function themes(Request $request): Response
    {
        return Inertia::render('admin/themes/index', [
            'themes' => [],
        ]);
    }

    public function themeSettings(Request $request): Response
    {
        return Inertia::render('admin/themes/settings', [
            'settings' => [],
        ]);
    }

    public function notificationsSend(Request $request): Response
    {
        return Inertia::render('admin/notifications/send', [
            'users' => [],
        ]);
    }

    public function notificationHistory(Request $request): Response
    {
        return Inertia::render('admin/notifications/history', [
            'notifications' => [],
        ]);
    }

    public function notificationTemplates(Request $request): Response
    {
        return Inertia::render('admin/notifications/templates', [
            'templates' => [],
        ]);
    }

    public function newsletter(Request $request): Response
    {
        return Inertia::render('admin/marketing/newsletter', [
            'subscribers' => [],
        ]);
    }

    public function marketingNewsletter(Request $request): Response
    {
        return Inertia::render('admin/marketing/newsletter', [
            'data' => [],
        ]);
    }

    public function fiatCurrencies(Request $request): Response
    {
        return Inertia::render('admin/currencies/fiat', [
            'currencies' => [],
        ]);
    }

    public function cryptoCurrencies(Request $request): Response
    {
        return Inertia::render('admin/currencies/crypto', [
            'currencies' => [],
        ]);
    }

    public function exchangeRates(Request $request): Response
    {
        return Inertia::render('admin/currencies/rates', [
            'rates' => [],
        ]);
    }
}
