<?php

namespace App\Models\Banking;

use App\Models\Ledger\Account;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduledPayment extends Model
{
    protected $fillable = [
        'user_id',
        'from_account_id',
        'recipient_name',
        'account_number',
        'routing_number',
        'amount',
        'currency',
        'memo',
        'frequency',
        'start_date',
        'end_date',
        'next_run_at',
        'last_run_at',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'next_run_at' => 'datetime',
        'last_run_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fromAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'from_account_id');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'active')
            ->where('next_run_at', '>=', now());
    }

    public function scopePast($query)
    {
        return $query->where('next_run_at', '<', now())
            ->orWhere('status', 'completed');
    }

    public function getNextOccurrence(): ?Carbon
    {
        return $this->next_run_at ? Carbon::parse($this->next_run_at) : null;
    }
}
