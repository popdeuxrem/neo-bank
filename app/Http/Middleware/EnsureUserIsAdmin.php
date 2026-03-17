<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()) {
            $prefix = config('admin.prefix');

            return redirect("/{$prefix}/login");
        }

        if (! $request->user()->hasAnyRole([
            'admin', 'auditor', 'staff', 'manager',
        ])) {
            abort(403, 'Access denied.');
        }

        return $next($request);
    }
}
