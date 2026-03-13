<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'sender_account' => $this->whenLoaded('senderAccount', fn () => [
                'id' => $this->senderAccount->id,
                'account_number' => $this->senderAccount->account_number,
                'name' => $this->senderAccount->name,
            ]),
            'receiver_account' => $this->whenLoaded('receiverAccount', fn () => [
                'id' => $this->receiverAccount->id,
                'account_number' => $this->receiverAccount->account_number,
                'name' => $this->receiverAccount->name,
            ]),
            'amount' => $this->amount,
            'currency' => $this->currency,
            'type' => $this->type,
            'status' => $this->status,
            'description' => $this->description,
            'metadata' => $this->metadata,
            'processed_at' => $this->processed_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
