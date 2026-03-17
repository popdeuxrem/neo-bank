<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('admin/auth/login', [
            'adminPrefix' => config('admin.prefix'),
            'appName' => config('app.name'),
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $throttleKey = 'admin-login:'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return back()->withErrors([
                'email' => "Too many attempts. Try again in {$seconds}s.",
            ]);
        }

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! ($user->hasRole('admin') || $user->hasRole('auditor') || $user->hasRole('staff'))) {
            RateLimiter::hit($throttleKey, 60);

            return back()->withErrors([
                'email' => 'These credentials do not match admin records.',
            ]);
        }

        if (! Auth::attempt($validated, $request->boolean('remember'))) {
            RateLimiter::hit($throttleKey, 60);

            return back()->withErrors([
                'email' => 'Invalid credentials.',
            ]);
        }

        if ($user->account_status === 'suspended') {
            Auth::logout();

            return back()->withErrors([
                'email' => 'This admin account has been suspended.',
            ]);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        Log::info('Admin login', ['user_id' => $user->id, 'ip' => $request->ip()]);

        $adminPrefix = config('admin.prefix');

        return redirect("/{$adminPrefix}");
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        Log::info('Admin logout', ['user_id' => $user?->id]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $adminPrefix = config('admin.prefix');

        return redirect("/{$adminPrefix}/login");
    }
}
