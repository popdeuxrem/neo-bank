<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'completed' => ! is_null($user->onboarding_completed_at),
            'lastStep' => $user->onboarding_last_step ?? 0,
            'startedAt' => $user->onboarding_started_at?->toIso8601String(),
        ]);
    }

    public function complete(Request $request): JsonResponse
    {
        $request->user()->update([
            'onboarding_completed_at' => now(),
            'onboarding_last_step' => 12,
        ]);

        return response()->json(['success' => true]);
    }

    public function updateStep(Request $request): JsonResponse
    {
        $request->validate([
            'step' => 'required|integer|min:0|max:12',
        ]);

        $user = $request->user();

        $user->update([
            'onboarding_last_step' => $request->step,
            'onboarding_started_at' => $user->onboarding_started_at ?? now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function skip(Request $request): JsonResponse
    {
        $request->user()->update([
            'onboarding_completed_at' => now(),
            'onboarding_last_step' => -1,
        ]);

        return response()->json(['success' => true]);
    }

    public function reset(Request $request): JsonResponse
    {
        $request->user()->update([
            'onboarding_completed_at' => null,
            'onboarding_started_at' => null,
            'onboarding_last_step' => 0,
        ]);

        return response()->json(['success' => true]);
    }
}
