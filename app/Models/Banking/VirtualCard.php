<?php

namespace App\Models\Banking;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VirtualCard extends Model
{
    protected $fillable = [
        'user_id',
        'card_number_encrypted',
        'last_four',
        'cardholder_name',
        'expiry_month',
        'expiry_year',
        'cvv_encrypted',
        'network',
        'type',
        'status',
        'frozen',
        'daily_limit',
        'monthly_limit',
        'merchant_controls',
        'balance',
        'currency',
    ];

    protected $casts = [
        'frozen' => 'boolean',
        'daily_limit' => 'decimal:2',
        'monthly_limit' => 'decimal:2',
        'balance' => 'decimal:2',
        'merchant_controls' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function freeze(): void
    {
        $this->update(['frozen' => true]);
    }

    public function unfreeze(): void
    {
        $this->update(['frozen' => false]);
    }

    public function getMaskedNumber(): string
    {
        return '**** **** **** '.$this->last_four;
    }
}
