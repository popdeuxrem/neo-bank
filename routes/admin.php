<?php

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\CmsController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HealthController;
use App\Http\Controllers\Admin\IdentityDocumentController;
use App\Http\Controllers\Admin\OversightController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SupportController;
use App\Http\Controllers\Admin\SystemSettingsController;
use App\Http\Controllers\Admin\ThemeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$prefix = config('admin.prefix', 'secure-admin');

Route::prefix($prefix)
    ->name('secure-admin.')
    ->middleware(['web', 'admin.ip'])
    ->group(function () {

        Route::middleware('guest')->group(function () {
            Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
            Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
        });

        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout')->middleware('auth');

        Route::middleware(['auth', 'admin', 'admin.ip'])->group(function () {

            Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

            Route::prefix('customers')->name('customers.')->group(function () {
                Route::get('/', [CustomerController::class, 'index'])->name('index');
                Route::get('/{user}', [CustomerController::class, 'show'])->name('show');
                Route::post('/{user}/block', [CustomerController::class, 'block'])->name('block');
                Route::post('/{user}/unblock', [CustomerController::class, 'unblock'])->name('unblock');
                Route::post('/{user}/balance', [CustomerController::class, 'adjustBalance'])->name('balance');
                Route::post('/{user}/login-as', [CustomerController::class, 'loginAs'])->name('login-as');
                Route::post('/email-all', [CustomerController::class, 'emailAll'])->name('email-all');
                Route::get('/email', [CustomerController::class, 'emailForm'])->name('email');
            });

            Route::post('/stop-impersonating', [CustomerController::class, 'stopImpersonating'])->name('stop-impersonating');

            Route::prefix('kyc')->name('kyc.')->group(function () {
                Route::get('/', [IdentityDocumentController::class, 'index'])->name('index');
                Route::get('/{document}', [IdentityDocumentController::class, 'show'])->name('show');
                Route::post('/{document}/approve', [IdentityDocumentController::class, 'approve'])->name('approve');
                Route::post('/{document}/reject', [IdentityDocumentController::class, 'reject'])->name('reject');
                Route::get('/settings', [IdentityDocumentController::class, 'settings'])->name('settings');
                Route::post('/settings', [IdentityDocumentController::class, 'updateSettings'])->name('settings.update');
            });

            Route::prefix('support')->name('support.')->group(function () {
                Route::get('/', [SupportController::class, 'index'])->name('index');
                Route::get('/{ticket}', [SupportController::class, 'show'])->name('show');
                Route::post('/{ticket}/reply', [SupportController::class, 'reply'])->name('reply');
                Route::post('/{ticket}/close', [SupportController::class, 'close'])->name('close');
            });

            Route::prefix('oversight')->name('oversight.')->group(function () {
                Route::get('/kyc', [OversightController::class, 'kycIndex'])->name('kyc');
                Route::get('/fraud', [OversightController::class, 'fraudIndex'])->name('fraud');
            });

            Route::prefix('settings')->name('settings.')->group(function () {
                Route::get('/general', [SettingsController::class, 'general'])->name('general');
                Route::post('/general', [SettingsController::class, 'updateGeneral']);
                Route::get('/system', [SettingsController::class, 'system'])->name('system');
                Route::post('/system', [SettingsController::class, 'updateSystem']);
                Route::get('/admin-url', [SettingsController::class, 'adminUrl'])->name('admin-url');
                Route::post('/admin-url', [SettingsController::class, 'updateAdminUrl'])->name('admin-url.update');
                Route::get('/security', [SettingsController::class, 'security'])->name('security');
                Route::post('/security', [SettingsController::class, 'updateSecurity']);
            });

            Route::prefix('system')->name('system.')->group(function () {
                Route::get('/info', [HealthController::class, 'info'])->name('info');
                Route::post('/cache/clear', [HealthController::class, 'clearCache'])->name('cache.clear');
                Route::post('/queue/restart', [HealthController::class, 'restartQueue'])->name('queue.restart');
            });

            Route::get('/audit-logs', [DashboardController::class, 'auditLogs'])->name('audit-logs');

            Route::prefix('themes')->name('themes.')->group(function () {
                Route::get('/', [ThemeController::class, 'index'])->name('index');
                Route::get('/settings', [ThemeController::class, 'settings'])->name('settings');
                Route::get('/colors', [ThemeController::class, 'colors'])->name('colors');
                Route::get('/landing', [ThemeController::class, 'landing'])->name('landing');
                Route::post('/colors', [ThemeController::class, 'updateColors'])->name('colors.update');
                Route::post('/{id}/activate', [ThemeController::class, 'activateTheme'])->name('activate');
            });

            Route::prefix('pages')->name('pages.')->group(function () {
                Route::get('/', [CmsController::class, 'pages'])->name('index');
                Route::get('/create', [CmsController::class, 'createPage'])->name('create');
                Route::get('/{id}/edit', [CmsController::class, 'editPage'])->name('edit');
                Route::get('/navigation', [CmsController::class, 'navigation'])->name('navigation');
                Route::get('/footer', [CmsController::class, 'footer'])->name('footer');
            });

            Route::prefix('settings')->name('settings.')->group(function () {
                Route::get('/seo', [SystemSettingsController::class, 'seo'])->name('seo');
                Route::post('/seo', [SystemSettingsController::class, 'updateSeo'])->name('seo.update');
                Route::get('/analytics', [SystemSettingsController::class, 'analytics'])->name('analytics');
                Route::get('/recaptcha', [SystemSettingsController::class, 'recaptcha'])->name('recaptcha');
                Route::get('/gdpr', [SystemSettingsController::class, 'gdpr'])->name('gdpr');
                Route::get('/maintenance', [SystemSettingsController::class, 'maintenance'])->name('maintenance');
                Route::post('/maintenance', [SystemSettingsController::class, 'updateMaintenance'])->name('maintenance.update');
                Route::get('/inactive-users', [SystemSettingsController::class, 'inactiveUsers'])->name('inactive-users');
                Route::get('/customization', [SystemSettingsController::class, 'customCss'])->name('customization');
                Route::post('/customization', [SystemSettingsController::class, 'updateCustomCss'])->name('customization.update');
                Route::get('/language', [SystemSettingsController::class, 'languages'])->name('language');
                Route::get('/translations/{locale?}', [SystemSettingsController::class, 'translations'])->name('translations');
            });

            Route::prefix('landing')->name('landing.')->group(function () {
                Route::get('/hero', fn () => Inertia::render('admin/landing/hero'))->name('hero');
                Route::get('/features', fn () => Inertia::render('admin/landing/features'))->name('features');
                Route::get('/pricing', fn () => Inertia::render('admin/landing/pricing'))->name('pricing');
                Route::get('/stats', fn () => Inertia::render('admin/landing/stats'))->name('stats');
                Route::get('/testimonials', fn () => Inertia::render('admin/landing/testimonials'))->name('testimonials');
            });

            Route::prefix('integrations')->name('integrations.')->group(function () {
                Route::get('/analytics', [SystemSettingsController::class, 'analytics'])->name('analytics');
                Route::get('/recaptcha', [SystemSettingsController::class, 'recaptcha'])->name('recaptcha');
                Route::get('/tawk', fn () => Inertia::render('admin/integrations/tawk'))->name('tawk');
                Route::get('/messenger', fn () => Inertia::render('admin/integrations/messenger'))->name('messenger');
            });
        });
    });
