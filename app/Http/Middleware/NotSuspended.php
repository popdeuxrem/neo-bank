<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotSuspended
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->account_status === 'suspended') {
            Auth::logout();

            return redirect()->route('login')
                ->withErrors(['email' => 'Your account has been suspended. Contact support.']);
        }

        if ($user && $user->account_status === 'banned') {
            Auth::logout();

            return redirect()->route('login')
                ->withErrors(['email' => 'Your account has been permanently banned.']);
        }

        return $next($request);
    }
}
