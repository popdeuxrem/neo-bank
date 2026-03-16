<?php

namespace App\Http\Controllers;

use App\Models\Rewards\UserReward;
use App\Services\RewardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RewardController extends Controller
{
    public function __construct(private RewardService $rewardService) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $rewards = $user->rewards ?? UserReward::create([
            'user_id' => $user->id,
            'balance' => 0,
            'lifetime_earned' => 0,
            'lifetime_redeemed' => 0,
        ]);

        return Inertia::render('rewards/index', [
            'rewards' => [
                'balance' => $rewards->balance,
                'lifetimeEarned' => $rewards->lifetime_earned,
                'lifetimeRedeemed' => $rewards->lifetime_redeemed,
            ],
            'waysToEarn' => [
                ['action' => 'payment', 'points' => 1, 'description' => '1 point per $1 spent'],
                ['action' => 'referral', 'points' => 500, 'description' => '500 points per referral'],
                ['action' => 'survey', 'points' => 100, 'description' => 'Complete a survey'],
            ],
            'recentTransactions' => $user->rewardTransactions()
                ->latest()
                ->limit(10)
                ->get(),
        ]);
    }

    public function earn(Request $request)
    {
        return Inertia::render('rewards/earn', [
            'waysToEarn' => [
                ['id' => 'payment', 'title' => 'Earn on Payments', 'description' => 'Earn points on every payment', 'multiplier' => 1],
                ['id' => 'referral', 'title' => 'Refer Friends', 'description' => '500 points per friend', 'multiplier' => 500],
                ['id' => 'savings', 'title' => 'DPS/FDR Interest', 'description' => 'Earn 10% of interest as points', 'multiplier' => 0.1],
            ],
        ]);
    }

    public function redeem(Request $request)
    {
        return Inertia::render('rewards/redeem', [
            'balance' => $request->user()->rewards?->balance ?? 0,
            'options' => [
                ['id' => 'cash', 'title' => 'Cash Back', 'rate' => 100, 'description' => '100 points = $1'],
                ['id' => 'fee', 'title' => 'Fee Credit', 'rate' => 100, 'description' => 'Waive fees'],
                ['id' => 'gift', 'title' => 'Gift Cards', 'rate' => 80, 'description' => 'Bonus value on gift cards'],
            ],
        ]);
    }

    public function submitRedeem(Request $request)
    {
        $validated = $request->validate([
            'points' => 'required|integer|min:1',
            'method' => 'required|string',
        ]);

        $cashValue = $this->rewardService->redeem(
            $request->user(),
            $validated['points'],
            $validated['method']
        );

        return back()->with('success', "Redeemed for \${$cashValue}");
    }

    public function history(Request $request)
    {
        return Inertia::render('rewards/history', [
            'transactions' => $request->user()->rewardTransactions()
                ->latest()
                ->paginate(20),
        ]);
    }
}
