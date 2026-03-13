<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $telemetry = [
            'system_health' => [
                'status' => 'healthy',
                'uptime' => '99.9%',
                'response_time' => 120,
            ],
            'memory_usage' => [
                'used' => '256MB',
                'total' => '512MB',
                'percentage' => 50,
            ],
            'cpu_usage' => [
                'current' => 25,
                'average' => 30,
            ],
            'database' => [
                'connections' => 15,
                'queries_per_second' => 120,
            ],
        ];

        return Inertia::render('admin-dashboard', [
            'telemetry' => $telemetry,
        ]);
    }
}
