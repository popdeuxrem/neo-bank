<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, User $targetUser): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->id === $targetUser->id;
    }

    public function update(User $user, User $targetUser): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, User $targetUser): bool
    {
        return $user->hasRole('admin') && $user->id !== $targetUser->id;
    }

    public function assignRole(User $user, User $targetUser): bool
    {
        return $user->hasRole('admin');
    }
}
