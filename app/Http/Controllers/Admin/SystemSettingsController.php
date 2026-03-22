<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemSettingsController extends Controller
{
    public function seo()
    {
        return Inertia::render('admin/settings/seo', [
            'seo' => [
                'site_title' => config('app.name', 'Magnetiq'),
                'site_description' => 'Enterprise Banking Platform',
                'site_keywords' => 'banking, finance, payments',
                'og_image' => '/images/og-default.jpg',
                'twitter_card' => 'summary_large_image',
            ],
        ]);
    }

    public function analytics()
    {
        return Inertia::render('admin/settings/analytics', [
            'analytics' => [
                'google_analytics_id' => '',
                'google_tag_manager_id' => '',
                'facebook_pixel_id' => '',
                'enabled' => false,
            ],
        ]);
    }

    public function recaptcha()
    {
        return Inertia::render('admin/settings/recaptcha', [
            'recaptcha' => [
                'site_key' => '',
                'secret_key' => '',
                'enabled' => false,
                'threshold' => 0.5,
            ],
        ]);
    }

    public function gdpr()
    {
        return Inertia::render('admin/settings/gdpr', [
            'gdpr' => [
                'cookie_consent_enabled' => true,
                'privacy_policy_url' => '/privacy',
                'terms_url' => '/terms',
                'data_retention_days' => 365,
                'allow_data_export' => true,
                'allow_data_deletion' => true,
            ],
        ]);
    }

    public function maintenance()
    {
        return Inertia::render('admin/settings/maintenance', [
            'maintenance' => [
                'enabled' => false,
                'allowed_ips' => [],
                'message' => 'Site is under maintenance',
                'secret_code' => '',
            ],
        ]);
    }

    public function inactiveUsers()
    {
        return Inertia::render('admin/settings/inactive-users', [
            'settings' => [
                'enabled' => false,
                'inactive_days' => 90,
                'notify_before' => 7,
                'action' => 'suspend',
            ],
        ]);
    }

    public function customCss()
    {
        return Inertia::render('admin/settings/custom-css', [
            'css' => [
                'header' => '',
                'footer' => '',
                'enabled' => false,
            ],
        ]);
    }

    public function languages()
    {
        return Inertia::render('admin/settings/languages', [
            'languages' => [
                [
                    'code' => 'en',
                    'name' => 'English',
                    'native' => 'English',
                    'direction' => 'ltr',
                    'is_default' => true,
                    'enabled' => true,
                ],
            ],
        ]);
    }

    public function translations($locale = null)
    {
        return Inertia::render('admin/settings/translations', [
            'locale' => $locale ?? 'en',
            'translations' => [],
        ]);
    }

    public function updateSeo(Request $request)
    {
        $request->validate([
            'site_title' => 'required|string|max:255',
            'site_description' => 'nullable|string|max:500',
        ]);

        return response()->json(['message' => 'SEO settings updated']);
    }

    public function updateMaintenance(Request $request)
    {
        $request->validate([
            'enabled' => 'boolean',
            'message' => 'required_if:enabled,true|string',
            'allowed_ips' => 'array',
        ]);

        return response()->json(['message' => 'Maintenance mode updated']);
    }

    public function updateCustomCss(Request $request)
    {
        $request->validate([
            'header' => 'nullable|string',
            'footer' => 'nullable|string',
            'enabled' => 'boolean',
        ]);

        return response()->json(['message' => 'Custom CSS updated']);
    }
}
