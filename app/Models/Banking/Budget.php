<?php

namespace App\Models\Banking;

use App\Models\Ledger\TransactionEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'amount',
        'currency',
        'period',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getSpentAmount(): float
    {
        try {
            $transactions = TransactionEntry::where('user_id', $this->user_id)
                ->where('category', $this->category)
                ->where('type', 'debit')
                ->where('status', 'completed');

            if ($this->period === 'monthly') {
                $transactions->whereMonth('created_at', now()->month);
            }

            return $transactions->sum('amount') ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    public function getSpentPercentage(): float
    {
        $spent = $this->getSpentAmount();
        if ($this->amount == 0) {
            return 0;
        }

        return round(($spent / $this->amount) * 100, 1);
    }
}
