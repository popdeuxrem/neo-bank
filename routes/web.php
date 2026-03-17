<?php

use App\Http\Controllers\AccountStatementController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\HealthController;
use App\Http\Controllers\Admin\IdentityDocumentController;
use App\Http\Controllers\Admin\OversightController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SupportController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\Ledger\AccountController;
use App\Http\Controllers\Ledger\LedgerController;
use App\Http\Controllers\Ledger\TransactionController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TransferController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [PageController::class, 'landing'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/{type}', [PageController::class, 'legalPage'])
    ->where('type', 'privacy|terms|risk-disclosures')
    ->name('legal.page');

Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');

/*
|--------------------------------------------------------------------------
| Google OAuth Routes
|--------------------------------------------------------------------------
*/
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');

/*
|--------------------------------------------------------------------------
| KYC Pending Route
|--------------------------------------------------------------------------
*/
Route::get('/kyc-pending', [PageController::class, 'kycPending'])
    ->middleware('auth')
    ->name('kyc.pending');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'not.suspended'])->group(function () {
    // User-facing pages (clean URLs)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::inertia('accounts', 'accounts')->name('accounts');
    Route::inertia('transactions', 'transactions')->name('transactions');
    Route::inertia('ledger', 'ledger')->name('ledger');
    Route::inertia('payments', 'payments')->name('payments');
    Route::inertia('cards', 'Dashboard/Cards')->name('cards');

    // Additional user routes per specification
    Route::inertia('wallet', 'wallet')->name('wallet.index');
    Route::inertia('wallet/deposit', 'wallet/deposit')->name('wallet.deposit');
    Route::inertia('wallet/withdraw', 'wallet/withdraw')->name('wallet.withdraw');

    Route::inertia('payments/local', 'payments/local')->name('payments.local');
    Route::inertia('payments/international', 'payments/international')->name('payments.international');
    Route::inertia('payments/history', 'payments/history')->name('payments.history');
    Route::inertia('payments/scheduled', 'payments/scheduled')->name('payments.scheduled');

    Route::inertia('transfers', 'transfers')->name('transfers.index');

    Route::inertia('wire/new', 'wire/new')->name('wire.create');
    Route::inertia('wire/swift', 'wire/swift')->name('wire.swift');
    Route::inertia('wire/history', 'wire/history')->name('wire.history');

    Route::inertia('bills', 'bills')->name('bills.index');
    Route::inertia('bills/saved', 'bills/saved')->name('bills.saved');
    Route::inertia('bills/history', 'bills/history')->name('bills.history');

    Route::inertia('requests/new', 'requests/new')->name('requests.create');
    Route::inertia('requests/incoming', 'requests/incoming')->name('requests.incoming');
    Route::inertia('requests/outgoing', 'requests/outgoing')->name('requests.outgoing');

    Route::inertia('dps', 'dps/index')->name('dps.index');
    Route::inertia('dps/mine', 'dps/mine')->name('dps.mine');
    Route::inertia('dps/calculator', 'dps/calculator')->name('dps.calculator');

    Route::inertia('fdr', 'fdr/index')->name('fdr.index');
    Route::inertia('fdr/mine', 'fdr/mine')->name('fdr.mine');
    Route::inertia('fdr/calculator', 'fdr/calculator')->name('fdr.calculator');

    Route::inertia('loans', 'loans/index')->name('loans.index');
    Route::inertia('loans/apply', 'loans/apply')->name('loans.apply');
    Route::inertia('loans/mine', 'loans/mine')->name('loans.mine');
    Route::inertia('loans/emi', 'loans/emi')->name('loans.emi');
    Route::inertia('loans/calculator', 'loans/calculator')->name('loans.calculator');

    Route::inertia('cards/new', 'cards/new')->name('cards.create');
    Route::inertia('cards/transactions', 'cards/transactions')->name('cards.transactions');
    Route::inertia('cards/controls', 'cards/controls')->name('cards.controls');

    Route::inertia('portfolio', 'portfolio/index')->name('portfolio.index');
    Route::inertia('portfolio/badges', 'portfolio/badges')->name('portfolio.badges');
    Route::inertia('portfolio/rankings', 'portfolio/rankings')->name('portfolio.rankings');
    Route::inertia('portfolio/earnings', 'portfolio/earnings')->name('portfolio.earnings');

    Route::inertia('rewards', 'rewards/index')->name('rewards.index');
    Route::inertia('rewards/earn', 'rewards/earn')->name('rewards.earn');
    Route::inertia('rewards/redeem', 'rewards/redeem')->name('rewards.redeem');
    Route::inertia('rewards/history', 'rewards/history')->name('rewards.history');

    Route::inertia('referrals', 'referrals/index')->name('referrals.index');
    Route::inertia('referrals/network', 'referrals/network')->name('referrals.network');
    Route::inertia('referrals/commissions', 'referrals/commissions')->name('referrals.commissions');
    Route::inertia('referrals/leaderboard', 'referrals/leaderboard')->name('referrals.leaderboard');

    Route::inertia('analytics', 'analytics/index')->name('analytics.index');
    Route::inertia('analytics/spending', 'analytics/spending')->name('analytics.spending');
    Route::inertia('analytics/income', 'analytics/income')->name('analytics.income');
    Route::inertia('analytics/budgets', 'analytics/budgets')->name('analytics.budgets');
    Route::inertia('analytics/net-worth', 'analytics/net-worth')->name('analytics.net-worth');

    Route::inertia('support', 'support/index')->name('support.index');
    Route::inertia('support/tickets', 'support/tickets')->name('support.tickets');
    Route::inertia('support/new', 'support/new')->name('support.create');

    // Card management
    Route::prefix('api/cards')->group(function () {
        Route::get('/', [CardController::class, 'index']);
        Route::post('/{card}/toggle-freeze', [CardController::class, 'toggleFreeze']);
        Route::post('/{card}/reveal', [CardController::class, 'revealSensitiveData']);
        Route::post('/{card}/update-pin', [CardController::class, 'updatePin']);
        Route::post('/{card}/cancel', [CardController::class, 'cancel']);
    });
    Route::get('/api/cards/reveal/{token}', [CardController::class, 'revealWithToken']);

    // Ledger chart
    Route::get('ledger/chart', [LedgerController::class, 'chartOfAccounts'])->name('ledger.chart');

    /*
    |--------------------------------------------------------------------------
    | Protected API Routes (throttled, logical grouping)
    |--------------------------------------------------------------------------
    */
    // Statements API
    Route::prefix('api/statements')->group(function () {
        Route::get('/', [AccountStatementController::class, 'index']);
        Route::post('/', [AccountStatementController::class, 'store']);
        Route::get('/{statement}/download', [AccountStatementController::class, 'download']);
    });

    // Ledger API
    Route::prefix('api/ledger')->group(function () {
        Route::apiResource('accounts', AccountController::class);
        Route::apiResource('transactions', TransactionController::class);
        Route::post('transactions/{transaction}/reverse', [TransactionController::class, 'reverse']);
        Route::post('transactions/{transaction}/flag', [TransactionController::class, 'flag']);
    });

    // Payments API
    Route::prefix('api/payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::get('/{payment}', [PaymentController::class, 'show']);
    });

    // Transfer API
    Route::post('/api/transfer', [TransferController::class, 'store'])->name('transfer.store');

    // Onboarding API
    Route::prefix('api/onboarding')->group(function () {
        Route::get('/status', [OnboardingController::class, 'status']);
        Route::post('/complete', [OnboardingController::class, 'complete']);
        Route::post('/step', [OnboardingController::class, 'updateStep']);
        Route::post('/skip', [OnboardingController::class, 'skip']);
        Route::post('/reset', [OnboardingController::class, 'reset']);
    });

    // External API v1 (throttled)
    Route::prefix('api/v1')->middleware('throttle:60,1')->group(function () {
        Route::get('/accounts', [ApiController::class, 'accounts']);
        Route::get('/accounts/{account}', [ApiController::class, 'showAccount']);
        Route::get('/transactions', [ApiController::class, 'transactions']);
        Route::get('/transactions/{transaction}', [ApiController::class, 'showTransaction']);
        Route::get('/payments', [ApiController::class, 'payments']);
        Route::get('/payments/{payment}', [ApiController::class, 'showPayment']);
        Route::get('/stats', [ApiController::class, 'stats']);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes (role-protected)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        // Admin dashboard with telemetry
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Customers
        Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
        Route::get('/customers/email', [CustomerController::class, 'email'])->name('customers.email');
        Route::get('/customers/{user}', [CustomerController::class, 'show'])->name('customers.show');

        // Admin oversight
        Route::prefix('oversight')->group(function () {
            Route::get('/', [OversightController::class, 'index'])->name('oversight');
            Route::get('/kyc', [OversightController::class, 'kycIndex'])->name('oversight.kyc');
            Route::get('/fraud', [OversightController::class, 'fraudIndex'])->name('oversight.fraud');
            Route::get('/documents/{document}', [IdentityDocumentController::class, 'show']);
            Route::patch('/documents/{document}/status', [IdentityDocumentController::class, 'updateStatus']);
            Route::post('/kyc/{document}/approve', [OversightController::class, 'approveKYC']);
            Route::post('/kyc/{document}/reject', [OversightController::class, 'rejectKYC']);
            Route::post('/fraud/{transaction}/resolve', [OversightController::class, 'resolveFraud']);
            Route::post('/user/{user}/block', [OversightController::class, 'blockUser']);
            Route::get('/updates', [OversightController::class, 'updates']);
        });

        // Users
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::get('/users/{user}', [AdminController::class, 'showUser'])->name('users.show');
        Route::post('/users/{user}/block', [AdminController::class, 'blockUser'])->name('users.block');
        Route::post('/users/{user}/unblock', [AdminController::class, 'unblockUser'])->name('users.unblock');
        Route::post('/users/{user}/notes', [AdminController::class, 'addNote'])->name('users.notes');

        // Reports
        Route::get('/reports/transactions', [AdminController::class, 'transactionReport'])->name('reports.transactions');
        Route::get('/reports/logins', [AdminController::class, 'loginReport'])->name('reports.logins');

        // Support
        Route::get('/support', [SupportController::class, 'index'])->name('support.index');
        Route::get('/support/{ticket}', [SupportController::class, 'show'])->name('support.show');
        Route::post('/support/{ticket}/reply', [SupportController::class, 'reply'])->name('support.reply');
        Route::post('/support/{ticket}/close', [SupportController::class, 'close'])->name('support.close');

        // Settings
        Route::get('/settings/general', [SettingsController::class, 'general'])->name('settings.general');
        Route::post('/settings/general', [SettingsController::class, 'updateGeneral']);
        Route::get('/settings/system', [SettingsController::class, 'system'])->name('settings.system');
        Route::post('/settings/system', [SettingsController::class, 'updateSystem']);
        Route::get('/settings/notifications', [SettingsController::class, 'notifications'])->name('settings.notifications');
        Route::get('/settings/payment-gateways', [SettingsController::class, 'paymentGateways'])->name('settings.gateways');
        Route::get('/settings/kyc', [SettingsController::class, 'kyc'])->name('settings.kyc');
        Route::get('/settings/plans', [SettingsController::class, 'plans'])->name('settings.plans');
        Route::get('/settings/seo', [SettingsController::class, 'seo'])->name('settings.seo');

        // KYC
        Route::get('/kyc', [OversightController::class, 'kycIndex'])->name('kyc.index');

        // Stop impersonating
        Route::post('/stop-impersonating', [CustomerController::class, 'stopImpersonating'])->name('stop-impersonating');

        // Profits
        Route::get('/profits/overview', [AdminController::class, 'profitOverview'])->name('profits.overview');
        Route::get('/profits/fees', [AdminController::class, 'profitFees'])->name('profits.fees');

        // Transfers
        Route::get('/transfers', [AdminController::class, 'transfers'])->name('transfers.index');
        Route::get('/transfers/manual', [AdminController::class, 'manualTransfer'])->name('transfers.manual');
        Route::get('/transfers/settings', [AdminController::class, 'transferSettings'])->name('transfers.settings');

        // Wire Transfers
        Route::get('/wire', [AdminController::class, 'wireTransfers'])->name('wire.index');
        Route::get('/wire/settings', [AdminController::class, 'wireSettings'])->name('wire.settings');

        // Deposits
        Route::get('/deposits', [AdminController::class, 'deposits'])->name('deposits.index');
        Route::get('/deposits/pending', [AdminController::class, 'pendingDeposits'])->name('deposits.pending');
        Route::get('/deposits/methods', [AdminController::class, 'depositMethods'])->name('deposits.methods');

        // Withdrawals
        Route::get('/withdrawals', [AdminController::class, 'withdrawals'])->name('withdrawals.index');
        Route::get('/withdrawals/pending', [AdminController::class, 'pendingWithdrawals'])->name('withdrawals.pending');
        Route::get('/withdrawals/methods', [AdminController::class, 'withdrawalMethods'])->name('withdrawals.methods');

        // DPS
        Route::get('/dps/plans', [AdminController::class, 'dpsPlans'])->name('dps.plans');
        Route::get('/dps/subscriptions', [AdminController::class, 'dpsSubscriptions'])->name('dps.subscriptions');

        // FDR
        Route::get('/fdr/plans', [AdminController::class, 'fdrPlans'])->name('fdr.plans');
        Route::get('/fdr/subscriptions', [AdminController::class, 'fdrSubscriptions'])->name('fdr.subscriptions');
        Route::get('/fdr/compounding', [AdminController::class, 'fdrCompounding'])->name('fdr.compounding');

        // Loans
        Route::get('/loans/plans', [AdminController::class, 'loanPlans'])->name('loans.plans');
        Route::get('/loans/applications', [AdminController::class, 'loanApplications'])->name('loans.applications');
        Route::get('/loans/active', [AdminController::class, 'activeLoans'])->name('loans.active');
        Route::get('/loans/overdue', [AdminController::class, 'overdueLoans'])->name('loans.overdue');

        // Bills
        Route::get('/bills/transactions', [AdminController::class, 'billTransactions'])->name('bills.transactions');
        Route::get('/bills/providers', [AdminController::class, 'billProviders'])->name('bills.providers');
        Route::get('/bills/categories', [AdminController::class, 'billCategories'])->name('bills.categories');

        // Portfolio
        Route::get('/portfolio/tiers', [AdminController::class, 'portfolioTiers'])->name('portfolio.tiers');
        Route::get('/portfolio/badges', [AdminController::class, 'portfolioBadges'])->name('portfolio.badges');

        // Rewards
        Route::get('/rewards/settings', [AdminController::class, 'rewardsSettings'])->name('rewards.settings');
        Route::get('/rewards/transactions', [AdminController::class, 'rewardTransactions'])->name('rewards.transactions');
        Route::get('/rewards/redeem', [AdminController::class, 'redeemRequests'])->name('rewards.redeem');

        // Referrals
        Route::get('/referrals/settings', [AdminController::class, 'referralSettings'])->name('referrals.settings');
        Route::get('/referrals/tree', [AdminController::class, 'referralTree'])->name('referrals.tree');
        Route::get('/referrals/commissions', [AdminController::class, 'referralCommissions'])->name('referrals.commissions');

        // Gateways
        Route::get('/gateways', [AdminController::class, 'gateways'])->name('gateways.index');
        Route::get('/gateways/logs', [AdminController::class, 'gatewayLogs'])->name('gateways.logs');

        // Currencies
        Route::get('/currencies/fiat', [AdminController::class, 'fiatCurrencies'])->name('currencies.fiat');
        Route::get('/currencies/crypto', [AdminController::class, 'cryptoCurrencies'])->name('currencies.crypto');
        Route::get('/currencies/rates', [AdminController::class, 'exchangeRates'])->name('currencies.rates');

        // Landing
        Route::get('/landing/hero', [AdminController::class, 'landingHero'])->name('landing.hero');
        Route::get('/landing/features', [AdminController::class, 'landingFeatures'])->name('landing.features');
        Route::get('/landing/pricing', [AdminController::class, 'landingPricing'])->name('landing.pricing');
        Route::get('/landing/testimonials', [AdminController::class, 'landingTestimonials'])->name('landing.testimonials');

        // Pages
        Route::get('/pages', [AdminController::class, 'pages'])->name('pages.index');
        Route::get('/pages/navigation', [AdminController::class, 'navigation'])->name('pages.navigation');
        Route::get('/pages/footer', [AdminController::class, 'footer'])->name('pages.footer');

        // Themes
        Route::get('/themes', [AdminController::class, 'themes'])->name('themes.index');
        Route::get('/themes/settings', [AdminController::class, 'themeSettings'])->name('themes.settings');

        // Marketing
        Route::get('/marketing/newsletter', [AdminController::class, 'newsletter'])->name('marketing.newsletter');

        // Notifications
        Route::get('/notifications/send', [AdminController::class, 'sendNotification'])->name('notifications.send');
        Route::get('/notifications/history', [AdminController::class, 'notificationHistory'])->name('notifications.history');
        Route::get('/notifications/templates', [AdminController::class, 'notificationTemplates'])->name('notifications.templates');

        // Staff
        Route::get('/staff', [AdminController::class, 'staff'])->name('staff.index');
        Route::get('/staff/create', [AdminController::class, 'createStaff'])->name('staff.create');

        // Roles
        Route::get('/roles', [AdminController::class, 'roles'])->name('roles.index');
        Route::get('/roles/permissions', [AdminController::class, 'permissions'])->name('roles.permissions');

        // KYC
        Route::get('/kyc/approved', [AdminController::class, 'kycApproved'])->name('kyc.approved');
        Route::get('/kyc/rejected', [AdminController::class, 'kycRejected'])->name('kyc.rejected');
        Route::get('/kyc/settings', [AdminController::class, 'kycSettings'])->name('kyc.settings');

        // System
        Route::get('/system/info', [HealthController::class, 'info'])->name('system.info');
        Route::post('/system/cache/clear', [HealthController::class, 'clearCache'])->name('system.cache.clear');
        Route::post('/system/queue/restart', [HealthController::class, 'restartQueue'])->name('system.queue.restart');
        Route::post('/system/cache/clear', [HealthController::class, 'clearCache'])->name('system.cache.clear');
        Route::post('/system/queue/restart', [HealthController::class, 'restartQueue'])->name('system.queue.restart');

        // Admin health
        Route::get('/health', [HealthController::class, 'getStats']);

        // Admin audit logs
        Route::get('/audit-logs', [AdminController::class, 'auditLogs'])->name('audit-logs');
    });
});

/*
|--------------------------------------------------------------------------
| Settings Routes
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';

/*
|--------------------------------------------------------------------------
| Fallback Route (404)
|--------------------------------------------------------------------------
*/
Route::fallback([PageController::class, 'notFound'])->name('fallback');
