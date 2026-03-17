<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminIpWhitelist
{
    public function handle(Request $request, Closure $next)
    {
        $allowedIps = config('admin.allowed_ips', []);

        if (empty($allowedIps)) {
            return $next($request);
        }

        if (! in_array($request->ip(), $allowedIps)) {
            abort(404);
        }

        return $next($request);
    }
}
