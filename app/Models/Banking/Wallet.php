<?php

namespace App\Models\Banking;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'balance',
        'currency',
        'status',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function credit(float $amount, string $description = ''): void
    {
        $this->increment('balance', $amount);
    }

    public function debit(float $amount): bool
    {
        if ($this->balance < $amount) {
            return false;
        }
        $this->decrement('balance', $amount);

        return true;
    }

    public function getCurrencyBreakdown(): array
    {
        return [
            'USD' => $this->where('user_id', $this->user_id)
                ->where('currency', 'USD')
                ->first()?->balance ?? 0,
        ];
    }
}
