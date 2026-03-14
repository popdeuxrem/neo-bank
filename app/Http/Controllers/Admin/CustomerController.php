<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->orderBy('created_at', 'desc');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('account_status', $request->status);
        }

        if ($request->has('kyc') && $request->kyc !== 'all') {
            $query->where('kyc_status', $request->kyc);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->paginate(20)->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'country' => $user->country ?? 'US',
                'country_flag' => '🇺🇸',
                'kyc_status' => $user->kyc_status ?? 'not_submitted',
                'account_status' => $user->account_status ?? 'active',
                'balance' => $user->wallet?->balance ?? 0,
                'currency' => 'USD',
                'joined_at' => $user->created_at->toIso8601String(),
                'avatar' => $user->avatar,
            ];
        });

        $stats = [
            'total' => User::count(),
            'active' => User::where('account_status', 'active')->count(),
            'inactive' => User::where('account_status', 'inactive')->count(),
            'kyc_pending' => User::where('kyc_status', 'pending')->count(),
        ];

        return Inertia::render('admin/customers/index', [
            'customers' => $customers->items(),
            'stats' => $stats,
            'filters' => [
                'status' => $request->status ?? 'all',
                'kyc' => $request->kyc ?? 'all',
                'country' => $request->country ?? 'all',
                'search' => $request->search ?? '',
                'page' => $customers->currentPage(),
            ],
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('admin/customers/show', [
            'customer' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'country' => $user->country ?? 'US',
                'country_flag' => '🇺🇸',
                'kyc_status' => $user->kyc_status ?? 'not_submitted',
                'account_status' => $user->account_status ?? 'active',
                'balance' => $user->wallet?->balance ?? 0,
                'currency' => 'USD',
                'joined_at' => $user->created_at->toIso8601String(),
                'avatar' => $user->avatar,
                'transactions' => [],
                'accounts' => [],
            ],
        ]);
    }

    public function email(Request $request)
    {
        return Inertia::render('admin/customers/email');
    }

    public function loginAs(User $user)
    {
        session(['admin_user_id' => auth()->id()]);
        auth()->login($user);

        return redirect()->route('dashboard')
            ->with('impersonating', true);
    }

    public function stopImpersonating()
    {
        $adminId = session('admin_user_id');
        session()->forget('admin_user_id');

        if ($adminId) {
            auth()->loginUsingId($adminId);

            return redirect()->route('admin.dashboard');
        }

        return redirect('/');
    }
}
