<?php

namespace App\Http\Controllers;

use App\Models\Rewards\Badge;
use App\Models\Rewards\UserPortfolio;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $portfolio = $user->portfolio ?? UserPortfolio::create([
            'user_id' => $user->id,
            'tier' => 'basic',
            'total_volume' => 0,
            'join_points' => 0,
        ]);

        return Inertia::render('portfolio/index', [
            'portfolio' => [
                'tier' => $portfolio->tier,
                'totalVolume' => $portfolio->total_volume,
                'joinPoints' => $portfolio->join_points,
                'progressToNextTier' => $portfolio->getProgressToNextTier(),
                'nextTier' => $portfolio->getNextTier(),
            ],
            'badges' => $user->badges()
                ->with('badge')
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn ($ub) => [
                    'id' => $ub->id,
                    'name' => $ub->badge?->name,
                    'icon' => $ub->badge?->icon,
                    'earnedAt' => $ub->earned_at->toISOString(),
                ]),
            'rank' => $user->getGlobalRank(),
        ]);
    }

    public function badges(Request $request)
    {
        return Inertia::render('portfolio/badges', [
            'badges' => $request->user()->badges()
                ->with('badge')
                ->get(),
            'availableBadges' => Badge::all(),
        ]);
    }

    public function rankings(Request $request)
    {
        return Inertia::render('portfolio/rankings', [
            'rankings' => User::select('id', 'name', 'avatar')
                ->orderByDesc('total_transaction_volume')
                ->limit(100)
                ->get()
                ->map(fn ($u, $i) => [
                    'rank' => $i + 1,
                    'id' => $u->id,
                    'name' => $u->name,
                    'avatar' => $u->avatar,
                    'volume' => $u->total_transaction_volume ?? 0,
                ]),
            'userRank' => $request->user()->getGlobalRank(),
        ]);
    }

    public function earnings(Request $request)
    {
        return Inertia::render('portfolio/earnings', [
            'earnings' => [
                'total' => $request->user()->portfolio?->total_volume ?? 0,
                'thisMonth' => 0,
                'commission' => 0,
            ],
        ]);
    }
}
