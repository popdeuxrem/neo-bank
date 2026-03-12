<?php

namespace App\Events\Ledger;

use App\Models\Ledger\Transaction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TransactionCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Transaction $transaction
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->transaction->created_by),
            new Channel('transactions'),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'uuid' => $this->transaction->uuid,
            'transaction_number' => $this->transaction->transaction_number,
            'type' => $this->transaction->type,
            'amount' => $this->transaction->amount,
            'status' => $this->transaction->status,
            'posted_at' => $this->transaction->posted_at?->toIso8601String(),
            'created_at' => $this->transaction->created_at->toIso8601String(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'transaction.completed';
    }
}
