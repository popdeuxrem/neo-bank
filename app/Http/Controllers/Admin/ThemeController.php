<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/themes/index', [
            'themes' => [
                [
                    'id' => 'default',
                    'name' => 'Default Theme',
                    'is_active' => true,
                    'created_at' => now()->toDateTimeString(),
                ],
            ],
            'colors' => [
                'primary' => '#6366f1',
                'secondary' => '#8b5cf6',
                'accent' => '#06b6d4',
                'background' => '#0f172a',
                'foreground' => '#f8fafc',
            ],
        ]);
    }

    public function settings()
    {
        return Inertia::render('admin/themes/settings', [
            'settings' => [
                'theme_mode' => 'dark',
                'sidebar_style' => 'expanded',
                'header_fixed' => true,
                'animation_enabled' => true,
            ],
        ]);
    }

    public function colors()
    {
        return Inertia::render('admin/themes/colors', [
            'colors' => [
                'primary' => '#6366f1',
                'secondary' => '#8b5cf6',
                'accent' => '#06b6d4',
                'success' => '#10b981',
                'warning' => '#f59e0b',
                'danger' => '#ef4444',
                'info' => '#3b82f6',
            ],
            'presets' => [
                ['name' => 'Indigo', 'primary' => '#6366f1', 'secondary' => '#8b5cf6'],
                ['name' => 'Blue', 'primary' => '#3b82f6', 'secondary' => '#06b6d4'],
                ['name' => 'Green', 'primary' => '#10b981', 'secondary' => '#14b8a6'],
                ['name' => 'Purple', 'primary' => '#a855f7', 'secondary' => '#d946ef'],
                ['name' => 'Rose', 'primary' => '#f43f5e', 'secondary' => '#fb7185'],
            ],
        ]);
    }

    public function landing()
    {
        return Inertia::render('admin/themes/landing', [
            'landing' => [
                'hero_enabled' => true,
                'features_enabled' => true,
                'pricing_enabled' => true,
                'testimonials_enabled' => true,
                'cta_enabled' => true,
            ],
        ]);
    }

    public function updateColors(Request $request)
    {
        $request->validate([
            'colors' => 'required|array',
        ]);

        return response()->json(['message' => 'Theme colors updated successfully']);
    }

    public function activateTheme($id)
    {
        return response()->json(['message' => "Theme {$id} activated successfully"]);
    }
}
