<?php

use App\Http\Controllers\AccountStatementController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HealthController;
use App\Http\Controllers\Admin\IdentityDocumentController;
use App\Http\Controllers\Admin\OversightController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\Ledger\AccountController;
use App\Http\Controllers\Ledger\LedgerController;
use App\Http\Controllers\Ledger\TransactionController;
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
Route::middleware(['auth', 'verified'])->group(function () {
    // User-facing pages (clean URLs)
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('accounts', 'accounts')->name('accounts');
    Route::inertia('transactions', 'transactions')->name('transactions');
    Route::inertia('ledger', 'ledger')->name('ledger');
    Route::inertia('payments', 'payments')->name('payments');
    Route::inertia('cards', 'Dashboard/Cards')->name('cards');

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
    Route::middleware(['admin'])->group(function () {
        // Admin dashboard with telemetry
        Route::get('/admin', [DashboardController::class, 'index'])->name('admin');

        // Admin oversight
        Route::prefix('admin/oversight')->group(function () {
            Route::get('/', [OversightController::class, 'index'])->name('admin.oversight');
            Route::get('/documents/{document}', [IdentityDocumentController::class, 'show']);
            Route::patch('/documents/{document}/status', [IdentityDocumentController::class, 'updateStatus']);
            Route::post('/kyc/{document}/approve', [OversightController::class, 'approveKYC']);
            Route::post('/kyc/{document}/reject', [OversightController::class, 'rejectKYC']);
            Route::post('/fraud/{transaction}/resolve', [OversightController::class, 'resolveFraud']);
            Route::post('/user/{user}/block', [OversightController::class, 'blockUser']);
            Route::get('/updates', [OversightController::class, 'updates']);
        });

        // Admin health
        Route::prefix('admin/health')->group(function () {
            Route::get('/', [HealthController::class, 'getStats']);
            Route::post('/restart-queue', [HealthController::class, 'restartQueue']);
        });

        // Admin audit logs & users
        Route::get('admin/audit-logs', [AdminController::class, 'auditLogs'])->name('admin.audit-logs');
        Route::get('admin/users', [AdminController::class, 'users'])->name('admin.users');
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
