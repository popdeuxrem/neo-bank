<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $roles = [];
        $isAdmin = false;

        try {
            if ($user) {
                $roles = $user->getRoleNames()->toArray() ?? [];
                $isAdmin = $user->hasAnyRole(['admin', 'auditor', 'staff', 'manager']) ?? false;
            }
        } catch (\Exception $e) {
            // Spatie roles not available or not configured
        }

        return [
            ...parent::share($request),
            'name' => config('app.name') ?? 'Neo-Bank',
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id ?? null,
                    'name' => $user->name ?? null,
                    'email' => $user->email ?? null,
                    'phone' => $user->phone ?? null,
                    'avatar' => $user->avatar ?? null,
                    'account_status' => $user->account_status ?? 'pending',
                    'kyc_status' => $user->kyc_status ?? 'pending',
                    'preferred_currency' => $user->preferred_currency ?? 'USD',
                    'preferred_language' => $user->preferred_language ?? 'en',
                    'theme_preference' => $user->theme_preference ?? 'dark',
                    'notification_sound_enabled' => $user->notification_sound_enabled ?? true,
                    'roles' => $roles,
                    'isAdmin' => $isAdmin,
                    'isImpersonating' => session()->has(
                        config('admin.impersonation_session_key', 'impersonating')
                    ),
                ] : null,
            ],
            'adminPrefix' => config('admin.prefix', 'secure-admin'),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'info' => session('info'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'onboarding' => [
                'completed' => $user && ! is_null($user->onboarding_completed_at),
                'lastStep' => $user?->onboarding_last_step ?? 0,
            ],
            'user' => $user ? [
                'id' => $user->id ?? null,
                'first_name' => $user->name ? explode(' ', $user->name)[0] : 'there',
                'name' => $user->name ?? null,
                'email' => $user->email ?? null,
                'avatar' => $user->avatar ?? null,
                'tier' => $user->tier ?? 'free',
                'account_status' => $user->account_status ?? 'pending',
                'kyc_verified' => ($user->account_status ?? '') === 'active',
            ] : null,
            'ziggy' => fn () => [
                'url' => config('app.url', $request->url()),
                'port' => null,
                'defaults' => [],
                'domain' => null,
                'groups' => [],
                'routes' => [],
            ],
        ];
    }
}
