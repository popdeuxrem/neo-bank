<?php

namespace App\Models\Banking;

use Illuminate\Database\Eloquent\Model;

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
