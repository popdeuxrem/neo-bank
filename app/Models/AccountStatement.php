<?php

namespace App\Models;

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
        return 0;
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

class AccountStatement extends Model
{
    protected $fillable = [
        'user_id',
        'account_id',
        'period_start',
        'period_end',
        'file_path',
        'format',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

class LoginHistory extends Model
{
    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'location',
        'success',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

class ScheduledNotification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'channels',
        'message',
        'scheduled_at',
        'sent_at',
    ];

    protected $casts = [
        'channels' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
