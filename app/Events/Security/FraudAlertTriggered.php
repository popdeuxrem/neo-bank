<?php

namespace App\Events\Security;

use App\Models\Ledger\Account;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FraudAlertTriggered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Account $account,
        public int $amount,
        public string $type,
        public array $flags,
        public int $riskScore,
        public ?User $triggeredBy = null
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->account->user_id),
            new PrivateChannel('admin.alerts'),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'alert_type' => 'fraud_detection',
            'severity' => $this->riskScore >= 70 ? 'critical' : ($this->riskScore >= 40 ? 'high' : 'medium'),
            'account' => [
                'id' => $this->account->id,
                'account_number' => $this->account->account_number,
                'name' => $this->account->name,
            ],
            'transaction' => [
                'amount' => $this->amount,
                'type' => $this->type,
            ],
            'flags' => $this->flags,
            'risk_score' => $this->riskScore,
            'recommendation' => $this->riskScore >= 70 ? 'BLOCK_TRANSACTION' : 'REVIEW_REQUIRED',
            'timestamp' => now()->toIso8601String(),
            'message' => 'A suspicious transaction has been detected on your account.',
        ];
    }

    public function broadcastAs(): string
    {
        return 'fraud.alert';
    }
}
