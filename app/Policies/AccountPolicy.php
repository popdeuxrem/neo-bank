<?php

namespace App\Policies;

use App\Models\Ledger\Account;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AccountPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff') || $user->hasRole('customer');
    }

    public function view(User $user, Account $account): bool
    {
        if ($user->hasRole('admin') || $user->hasRole('staff')) {
            return true;
        }

        return $account->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff');
    }

    public function update(User $user, Account $account): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff');
    }

    public function delete(User $user, Account $account): bool
    {
        return $user->hasRole('admin');
    }

    public function freeze(User $user, Account $account): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff');
    }
}
