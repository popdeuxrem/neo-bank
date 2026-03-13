<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt(Str::random(24)),
                    'email_verified_at' => now(),
                    'account_status' => User::STATUS_PENDING_KYC,
                ]
            );

            if (! $user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }

            Auth::login($user, remember: true);

            // Route based on account status
            $redirect = match ($user->account_status) {
                User::STATUS_PENDING_KYC => '/kyc-pending',
                User::STATUS_SUSPENDED => '/login?suspended=1',
                default => '/dashboard',
            };

            return redirect()->intended($redirect);
        } catch (\Exception $e) {
            return redirect('/login')->withErrors([
                'email' => 'Unable to sign in with Google. Please try again.',
            ]);
        }
    }
}
