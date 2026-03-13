<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    public function landing()
    {
        return Inertia::render('Landing');
    }

    public function privacy()
    {
        return Inertia::render('legal/PrivacyPolicy');
    }

    public function terms()
    {
        return Inertia::render('legal/TermsOfService');
    }

    public function riskDisclosures()
    {
        return Inertia::render('legal/RiskDisclosures');
    }

    public function notFound()
    {
        return Inertia::render('Error', [
            'status' => 404,
            'message' => 'Page not found',
        ]);
    }
}
