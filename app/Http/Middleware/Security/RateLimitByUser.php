<?php

namespace App\Http\Middleware\Security;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitByUser
{
    protected int $maxAttempts = 60;

    protected int $decaySeconds = 60;

    public function handle(Request $request, Closure $next, ?string $maxAttempts = null): Response
    {
        $key = $this->resolveRequestSignature($request);

        if ($maxAttempts) {
            $this->maxAttempts = (int) $maxAttempts;
        }

        if (RateLimiter::tooManyAttempts($key, $this->maxAttempts)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'error' => 'Too many attempts. Please try again later.',
                'retry_after' => $seconds,
            ], 429);
        }

        RateLimiter::hit($key, $this->decaySeconds);

        $response = $next($request);

        return $this->addRateLimitHeaders($response, $key);
    }

    protected function resolveRequestSignature(Request $request): string
    {
        if ($user = $request->user()) {
            return 'user:'.$user->id;
        }

        return 'ip:'.$request->ip();
    }

    protected function addRateLimitHeaders(Response $response, string $key): Response
    {
        $maxAttempts = $this->maxAttempts;
        $remaining = RateLimiter::remaining($key, $maxAttempts);

        $response->headers->set('X-RateLimit-Limit', $maxAttempts);
        $response->headers->set('X-RateLimit-Remaining', $remaining);
        $response->headers->set('X-RateLimit-Reset', now()->addSeconds(RateLimiter::availableIn($key))->timestamp);

        return $response;
    }
}
