<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function general(): Response
    {
        $settings = [
            'site_name' => 'Magnetiq',
            'site_tagline' => 'Your trusted Neo-Bank',
            'contact_email' => 'support@magnetiq.com',
            'contact_phone' => '+1 (555) 123-4567',
            'contact_address' => '123 Finance Street, New York, NY 10001',
            'timezone' => 'America/New_York',
            'currency' => 'USD',
            'currency_symbol' => '$',
            'date_format' => 'Y-m-d',
        ];

        return Inertia::render('admin/settings/general', [
            'settings' => $settings,
        ]);
    }

    public function updateGeneral(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function system(): Response
    {
        $settings = [
            'user_registration' => true,
            'require_kyc' => true,
            'require_email_verification' => true,
            'enable_2fa' => false,
            'maintenance_mode' => false,
            'referral_system' => true,
            'support_tickets' => true,
            'api_access' => true,
        ];

        return Inertia::render('admin/settings/system', [
            'settings' => $settings,
        ]);
    }

    public function updateSystem(Request $request): JsonResponse
    {
        return response()->json(['message' => 'System settings updated']);
    }

    public function notifications(): Response
    {
        return Inertia::render('admin/settings/notifications');
    }

    public function paymentGateways(): Response
    {
        return Inertia::render('admin/settings/payment-gateways');
    }

    public function kyc(): Response
    {
        return Inertia::render('admin/settings/kyc');
    }

    public function plans(): Response
    {
        return Inertia::render('admin/settings/plans');
    }

    public function seo(): Response
    {
        return Inertia::render('admin/settings/seo');
    }

    public function updateSeo(Request $request): JsonResponse
    {
        return response()->json(['message' => 'SEO settings updated']);
    }

    public function security(): Response
    {
        return Inertia::render('admin/settings/security');
    }

    public function updateSecurity(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Security settings updated']);
    }

    public function adminUrl(): Response
    {
        return Inertia::render('admin/settings/admin-url', [
            'currentPrefix' => config('admin.prefix'),
        ]);
    }

    public function updateAdminUrl(Request $request)
    {
        $validated = $request->validate([
            'prefix' => [
                'required',
                'string',
                'min:4',
                'max:30',
                'regex:/^[a-z0-9\-]+$/',
                'not_in:api,login,logout,register,dashboard,app,assets,public,storage',
            ],
            'current_prefix_confirm' => [
                'required',
                function ($attr, $value, $fail) {
                    if ($value !== config('admin.prefix')) {
                        $fail('Confirmation does not match current prefix.');
                    }
                },
            ],
        ]);

        $this->updateEnvValue('ADMIN_URL_PREFIX', $validated['prefix']);

        Artisan::call('config:clear');
        Artisan::call('route:clear');

        $newAdminUrl = url($validated['prefix']);

        return Inertia::location($newAdminUrl.'/settings/admin-url');
    }

    private function updateEnvValue(string $key, string $value): void
    {
        $path = base_path('.env');
        $content = file_get_contents($path);

        if (str_contains($content, "{$key}=")) {
            $content = preg_replace(
                "/^{$key}=.*/m",
                "{$key}={$value}",
                $content
            );
        } else {
            $content .= "\n{$key}={$value}";
        }

        file_put_contents($path, $content);
    }
}
