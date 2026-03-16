<?php

namespace App\Http\Controllers;

use App\Models\Banking\Budget;
use App\Models\Banking\ScheduledPayment;
use App\Models\Ledger\TransactionEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load([
            'ledgerAccounts',
            'wallet',
            'portfolio',
            'rewards',
        ]);

        return Inertia::render('dashboard', [
            'totalBalance' => $user->getTotalBalance(),
            'availableBalance' => $user->getAvailableBalance(),
            'pendingBalance' => 0,

            'accounts' => $user->ledgerAccounts->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'number' => $a->account_number,
                'balance' => $a->balance,
                'currency' => $a->currency,
                'type' => $a->type,
                'status' => $a->status,
                'sparkline' => [],
            ]),

            'recentTransactions' => TransactionEntry::where('user_id', $user->id)
                ->with(['ledgerAccount'])
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn ($t) => [
                    'id' => $t->id,
                    'type' => $t->type,
                    'amount' => $t->amount,
                    'currency' => $t->currency,
                    'description' => $t->description,
                    'category' => $t->category,
                    'status' => $t->status,
                    'createdAt' => $t->created_at->toISOString(),
                    'relativeTime' => $t->created_at->diffForHumans(),
                ]),

            'balanceHistory' => $this->getDailyBalances($user, 30),
            'incomeHistory' => $this->getMonthlyIncome($user, 30),
            'expenseHistory' => $this->getMonthlyExpenses($user, 30),

            'spendingByCategory' => $user->getSpendingByCategory(30),

            'monthlyStats' => [
                'income' => $user->getMonthlyIncome(),
                'expenses' => $user->getMonthlyExpenses(),
                'net' => $user->getMonthlyNet(),
                'savingsRate' => $user->getSavingsRate(),
            ],

            'scheduledPayments' => ScheduledPayment::where('user_id', $user->id)
                ->upcoming()
                ->limit(5)
                ->get(),

            'budgets' => Budget::where('user_id', $user->id)
                ->get()
                ->map(fn ($b) => [
                    ...$b->toArray(),
                    'spent' => $b->getSpentAmount(),
                    'percentage' => $b->getSpentPercentage(),
                ]),

            'portfolio' => [
                'tier' => $user->portfolio?->tier ?? 'basic',
                'points' => $user->rewards?->balance ?? 0,
                'rank' => $user->getGlobalRank(),
                'badges' => [],
            ],

            'stats' => [
                'transactionsThisMonth' => $user->getTransactionCount(30),
                'totalSent' => $user->getTotalSent(30),
                'totalReceived' => $user->getTotalReceived(30),
            ],

            'kyc' => [
                'status' => $user->account_status,
                'completedSteps' => [],
            ],

            'unreadNotifications' => [],
            'notificationCount' => 0,

            'onboarding' => [
                'completed' => ! is_null($user->onboarding_completed_at),
                'lastStep' => $user->onboarding_last_step ?? 0,
            ],
        ]);
    }

    private function getDailyBalances(User $user, int $days): array
    {
        return collect(range(0, $days - 1))
            ->map(fn ($i) => [
                'date' => now()->subDays($i)->format('Y-m-d'),
                'balance' => $user->getTotalBalance(),
            ])
            ->reverse()
            ->values()
            ->toArray();
    }

    private function getMonthlyIncome(User $user, int $days): array
    {
        return [
            ['month' => 'Jan', 'amount' => $user->getMonthlyIncome($days)],
            ['month' => 'Feb', 'amount' => 0],
            ['month' => 'Mar', 'amount' => 0],
        ];
    }

    private function getMonthlyExpenses(User $user, int $days): array
    {
        return [
            ['month' => 'Jan', 'amount' => $user->getMonthlyExpenses($days)],
            ['month' => 'Feb', 'amount' => 0],
            ['month' => 'Mar', 'amount' => 0],
        ];
    }
}
