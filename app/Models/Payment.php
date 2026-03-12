<?php

namespace App\Models;

use App\Models\Ledger\Account;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'reference',
        'sender_account_id',
        'receiver_account_id',
        'user_id',
        'amount',
        'currency',
        'type',
        'status',
        'description',
        'metadata',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'metadata' => 'array',
        'processed_at' => 'datetime',
    ];

    public const TYPE_INTERNAL = 'internal';

    public const TYPE_EXTERNAL = 'external';

    public const TYPE_WIRE = 'wire';

    public const TYPE_ACH = 'ach';

    public const STATUS_PENDING = 'pending';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const STATUS_CANCELLED = 'cancelled';

    public function senderAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'sender_account_id');
    }

    public function receiverAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'receiver_account_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function markAsCompleted(): void
    {
        $this->status = self::STATUS_COMPLETED;
        $this->processed_at = now();
        $this->save();
    }

    public static function generateReference(): string
    {
        return 'PAY-'.str()->upper(str()->random(12));
    }
}
