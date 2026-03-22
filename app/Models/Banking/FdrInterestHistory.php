<?php

namespace App\Models\Banking;

use App\Models\Ledger\Transaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FdrInterestHistory extends Model
{
    use HasFactory;

    protected $table = 'fdr_interest_history';

    protected $fillable = [
        'subscription_id',
        'transaction_id',
        'compounding_date',
        'principal_before',
        'interest_amount',
        'tax_amount',
        'principal_after',
        'interest_rate',
    ];

    protected $casts = [
        'compounding_date' => 'date',
        'principal_before' => 'integer',
        'interest_amount' => 'integer',
        'tax_amount' => 'integer',
        'principal_after' => 'integer',
        'interest_rate' => 'decimal:2',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(FdrSubscription::class, 'subscription_id');
    }

    public function ledgerTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function scopeForSubscription($query, int $subscriptionId)
    {
        return $query->where('subscription_id', $subscriptionId);
    }

    public function scopeBetweenDates($query, string $from, string $to)
    {
        return $query->whereBetween('compounding_date', [$from, $to]);
    }

    public function getNetInterest(): int
    {
        return $this->interest_amount - $this->tax_amount;
    }

    public function getInterestFormatted(): string
    {
        return number_format($this->interest_amount / 100, 2);
    }

    public function getPrincipalBeforeFormatted(): string
    {
        return number_format($this->principal_before / 100, 2);
    }

    public function getPrincipalAfterFormatted(): string
    {
        return number_format($this->principal_after / 100, 2);
    }
}
