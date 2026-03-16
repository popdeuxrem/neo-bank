<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CheckPasscode
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user || ! $user->passcode_enabled) {
            return $next($request);
        }

        $passcode = $request->input('passcode')
            ?? $request->header('X-Passcode');

        if (! $passcode) {
            return response()->json([
                'error' => 'Passcode required for this action.',
            ], 422);
        }

        if (! Hash::check($passcode, $user->passcode)) {
            $user->increment('passcode_failed_attempts');

            if ($user->passcode_failed_attempts >= 5) {
                $user->update(['passcode_locked_until' => now()->addMinutes(15)]);

                return response()->json([
                    'error' => 'Too many failed attempts. Locked for 15 minutes.',
                ], 423);
            }

            return response()->json([
                'error' => 'Incorrect passcode.',
            ], 422);
        }

        $user->update(['passcode_failed_attempts' => 0]);

        return $next($request);
    }
}
