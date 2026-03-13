<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaymentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff') || $user->hasRole('customer');
    }

    public function view(User $user, Payment $payment): bool
    {
        if ($user->hasRole('admin') || $user->hasRole('staff')) {
            return true;
        }

        return $payment->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff') || $user->hasRole('customer');
    }

    public function approve(User $user, Payment $payment): bool
    {
        return $user->hasRole('admin') || $user->hasRole('staff');
    }

    public function cancel(User $user, Payment $payment): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $payment->user_id === $user->id && $payment->status === 'pending';
    }
}
