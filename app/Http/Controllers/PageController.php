<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    public function landing()
    {
        return Inertia::render('Landing');
    }

    public function legalPage(string $type)
    {
        return match ($type) {
            'privacy' => Inertia::render('legal/PrivacyPolicy'),
            'terms' => Inertia::render('legal/TermsOfService'),
            'risk-disclosures' => Inertia::render('legal/RiskDisclosures'),
            default => $this->notFound(),
        };
    }

    public function notFound()
    {
        return Inertia::render('Error', [
            'status' => 404,
            'message' => 'Page not found',
        ]);
    }
}
