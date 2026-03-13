<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
}
