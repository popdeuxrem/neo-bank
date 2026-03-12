<?php

namespace App\Models\Ledger;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'nature',
        'description',
    ];

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class, 'account_type_id');
    }

    public function isDebitNormal(): bool
    {
        return $this->nature === 'debit';
    }

    public function isCreditNormal(): bool
    {
        return $this->nature === 'credit';
    }
}
