<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReferralCommission extends Model
{
    protected $fillable = [
        'referrer_id',
        'referred_id',
        'level',
        'rate',
        'amount',
        'transaction_amount',
        'type',
        'status',
    ];

    protected $casts = [
        'rate' => 'decimal:2',
        'amount' => 'decimal:2',
        'transaction_amount' => 'decimal:2',
    ];

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referred(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_id');
    }
}

class SavedRecipient extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'account_number',
        'routing_number',
        'bank_name',
        'type',
        'country',
        'swift',
        'iban',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

class Deposit extends Model
{
    protected $fillable = [
        'user_id',
        'method_id',
        'amount',
        'currency',
        'fee',
        'status',
        'proof_path',
        'reference',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

class Withdrawal extends Model
{
    protected $fillable = [
        'user_id',
        'method_id',
        'amount',
        'currency',
        'fee',
        'net_amount',
        'account_details',
        'status',
        'failure_reason',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'account_details' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

class DepositMethod extends Model
{
    protected $fillable = [
        'name',
        'type',
        'currencies',
        'min_amount',
        'max_amount',
        'fee_structure',
        'processing_time',
        'instructions',
        'icon',
        'status',
    ];

    protected $casts = [
        'currencies' => 'array',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
        'fee_structure' => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}

class WithdrawalMethod extends Model
{
    protected $fillable = [
        'name',
        'type',
        'currencies',
        'min_amount',
        'max_amount',
        'fee_structure',
        'processing_time',
        'required_fields',
        'status',
    ];

    protected $casts = [
        'currencies' => 'array',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
        'fee_structure' => 'array',
        'required_fields' => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
