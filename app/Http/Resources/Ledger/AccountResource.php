<?php

namespace App\Http\Resources\Ledger;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'account_number' => $this->account_number,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->whenLoaded('accountType', fn () => [
                'id' => $this->accountType->id,
                'name' => $this->accountType->name,
                'slug' => $this->accountType->slug,
            ]),
            'balance' => $this->getCurrentBalance(),
            'available_balance' => $this->getAvailableBalance(),
            'is_active' => $this->is_active,
            'is_system' => $this->is_system,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
