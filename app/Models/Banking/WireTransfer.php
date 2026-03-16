<?php

namespace App\Models\Banking;

use App\Models\Ledger\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WireTransfer extends Model
{
    protected $fillable = [
        'user_id',
        'from_account_id',
        'recipient_name',
        'recipient_address',
        'bank_name',
        'bank_country',
        'swift_bic',
        'iban',
        'account_number',
        'amount',
        'currency',
        'fee',
        'purpose',
        'status',
        'tracking_number',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fromAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'from_account_id');
    }
}
