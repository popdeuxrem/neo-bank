<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()) {
            $prefix = config('admin.prefix', 'secure-admin');

            return redirect("/{$prefix}/login");
        }

        try {
            $hasRole = $request->user()->hasAnyRole([
                'admin', 'auditor', 'staff', 'manager',
            ]);
        } catch (\Exception $e) {
            $hasRole = false;
        }

        if (! $hasRole) {
            abort(403, 'Access denied.');
        }

        return $next($request);
    }
}
