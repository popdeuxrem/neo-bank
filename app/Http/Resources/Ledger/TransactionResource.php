<?php

namespace App\Http\Resources\Ledger;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'transaction_number' => $this->transaction_number,
            'type' => $this->type,
            'description' => $this->description,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'status' => $this->status,
            'metadata' => $this->metadata,
            'posted_at' => $this->posted_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'entries' => $this->whenLoaded('entries', fn () => TransactionEntryResource::collection($this->entries)
            ),
            'creator' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
                'email' => $this->creator->email,
            ]),
        ];
    }
}
