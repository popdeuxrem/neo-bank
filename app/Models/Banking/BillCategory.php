<?php

namespace App\Models\Banking;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BillCategory extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'color',
        'order',
        'status',
    ];

    public function providers(): HasMany
    {
        return $this->hasMany(BillProvider::class, 'category_id');
    }
}

class BillProvider extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'logo',
        'country',
        'api_type',
        'fee_structure',
        'status',
    ];

    protected $casts = [
        'fee_structure' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(BillCategory::class, 'category_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(BillPayment::class, 'provider_id');
    }
}

class BillPayment extends Model
{
    protected $fillable = [
        'user_id',
        'provider_id',
        'account_id',
        'bill_number',
        'amount',
        'fee',
        'status',
        'reference',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(BillProvider::class, 'provider_id');
    }
}
