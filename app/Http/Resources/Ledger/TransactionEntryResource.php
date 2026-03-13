<?php

namespace App\Http\Resources\Ledger;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'account' => $this->whenLoaded('account', fn () => [
                'id' => $this->account->id,
                'account_number' => $this->account->account_number,
                'name' => $this->account->name,
            ]),
            'entry_type' => $this->entry_type,
            'amount' => $this->amount,
            'memo' => $this->memo,
            'metadata' => $this->metadata,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
