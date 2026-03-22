<?php

namespace App\Contracts\Banking;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface TransferServiceInterface
{
    public function internalTransfer(User $fromUser, User $toUser, float $amount, string $reference): array;

    public function wireTransfer(User $user, array $data): array;

    public function swiftTransfer(User $user, array $data): array;

    public function getTransferHistory(User $user, array $filters = []): LengthAwarePaginator;

    public function validateTransfer(User $user, float $amount, string $type): array;
}
