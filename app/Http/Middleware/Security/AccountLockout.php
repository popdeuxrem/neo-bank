<?php

namespace App\Http\Middleware\Security;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AccountLockout
{
    protected int $maxAttempts = 5;

    protected int $lockoutMinutes = 30;

    public function handle(Request $request, Closure $next): Response
    {
        $credentials = $request->only('email', 'password');

        if (empty($credentials['email']) || empty($credentials['password'])) {
            return $next($request);
        }

        $user = User::where('email', $credentials['email'])->first();

        if ($user && $this->isLockedOut($user)) {
            $lockoutEnd = $user->locked_until;

            return response()->json([
                'error' => 'Account is temporarily locked due to too many failed login attempts.',
                'locked_until' => $lockoutEnd?->toIso8601String(),
            ], 423);
        }

        $response = $next($request);

        if ($user && ! $this->isLockedOut($user)) {
            if (! $this->validateCredentials($credentials, $user)) {
                $this->recordFailedAttempt($user);

                if ($this->isLockedOut($user)) {
                    return response()->json([
                        'error' => 'Account is now locked due to too many failed login attempts.',
                    ], 423);
                }
            }
        }

        return $response;
    }

    protected function isLockedOut(User $user): bool
    {
        return $user->locked_until && $user->locked_until->isFuture();
    }

    protected function validateCredentials(array $credentials, User $user): bool
    {
        return Hash::check($credentials['password'], $user->password);
    }

    protected function recordFailedAttempt(User $user): void
    {
        $failedAttempts = ($user->failed_login_attempts ?? 0) + 1;

        $user->update([
            'failed_login_attempts' => $failedAttempts,
            'locked_until' => $failedAttempts >= $this->maxAttempts
                ? now()->addMinutes($this->lockoutMinutes)
                : null,
        ]);
    }
}
