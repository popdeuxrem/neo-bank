<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are used
| for checking if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('user.{id}', function (?User $user, int $id) {
    // Allow access if the user is authenticated and owns this channel
    return $user && $user->id === $id;
});

Broadcast::channel('transactions', function (?User $user) {
    // Public channel for transaction broadcasts - can be used for admin monitoring
    return true;
});

Broadcast::channel('admin.{id}', function (?User $user, int $id) {
    // Admin-specific channel for administrative alerts
    return $user && $user->id === $id && $user->hasRole('admin');
});

Broadcast::channel('account.{accountId}', function (?User $user, string $accountId) {
    // Channel for specific account updates
    if (! $user) {
        return false;
    }

    // Check if user owns the account
    return $user->accounts()->where('account_number', $accountId)->exists();
});
