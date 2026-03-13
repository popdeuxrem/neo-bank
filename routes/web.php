<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\Ledger\AccountController;
use App\Http\Controllers\Ledger\LedgerController;
use App\Http\Controllers\Ledger\TransactionController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

Route::get('/privacy', function () {
    return Inertia::render('legal/PrivacyPolicy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('legal/TermsOfService');
})->name('terms');

Route::get('/risk-disclosures', function () {
    return Inertia::render('legal/RiskDisclosures');
})->name('risk-disclosures');

Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('accounts', 'accounts')->name('accounts');
    Route::inertia('transactions', 'transactions')->name('transactions');
    Route::inertia('ledger', 'ledger')->name('ledger');
    Route::inertia('payments', 'payments')->name('payments');
    Route::inertia('admin', 'admin-dashboard')->name('admin');

    Route::prefix('api/ledger')->group(function () {
        Route::apiResource('accounts', AccountController::class);
        Route::apiResource('transactions', TransactionController::class);
        Route::post('transactions/{transaction}/reverse', [TransactionController::class, 'reverse']);
        Route::post('transactions/{transaction}/flag', [TransactionController::class, 'flag']);
    });

    Route::prefix('api/payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::get('/{payment}', [PaymentController::class, 'show']);
    });

    Route::prefix('api/v1')->middleware('throttle:60,1')->group(function () {
        Route::get('/accounts', [ApiController::class, 'accounts']);
        Route::get('/accounts/{account}', [ApiController::class, 'showAccount']);
        Route::get('/transactions', [ApiController::class, 'transactions']);
        Route::get('/transactions/{transaction}', [ApiController::class, 'showTransaction']);
        Route::get('/payments', [ApiController::class, 'payments']);
        Route::get('/payments/{payment}', [ApiController::class, 'showPayment']);
        Route::get('/stats', [ApiController::class, 'stats']);
    });

    Route::get('ledger/chart', [LedgerController::class, 'chartOfAccounts'])->name('ledger.chart');

    Route::get('admin/audit-logs', [AdminController::class, 'auditLogs'])->name('admin.audit-logs');
    Route::get('admin/users', [AdminController::class, 'users'])->name('admin.users');
});

require __DIR__.'/settings.php';
