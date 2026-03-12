<?php

namespace App\Models\Ledger;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountBalance extends Model
{
    protected $fillable = [
        'account_id',
        'balance',
        'available_balance',
        'as_of_date',
    ];

    protected $casts = [
        'balance' => 'integer',
        'available_balance' => 'integer',
        'as_of_date' => 'datetime',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function updateBalance(int $amount): void
    {
        $this->balance += $amount;
        $this->available_balance += $amount;
        $this->as_of_date = now();
        $this->save();
    }
}
