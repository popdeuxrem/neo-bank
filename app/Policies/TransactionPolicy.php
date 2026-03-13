<?php

namespace App\Policies;

use App\Models\Ledger\Transaction;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransactionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff') || $user->hasRole('customer');
    }

    public function view(User $user, Transaction $transaction): bool
    {
        if ($user->hasRole('admin') || $user->hasRole('staff')) {
            return true;
        }

        return $transaction->created_by === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff') || $user->hasRole('customer');
    }

    public function reverse(User $user, Transaction $transaction): bool
    {
        return $user->hasRole('admin');
    }

    public function flag(User $user, Transaction $transaction): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff');
    }
}
