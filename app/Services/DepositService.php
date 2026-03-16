<?php

namespace App\Services;

use App\Models\Deposit;
use App\Models\DepositMethod;
use App\Models\User;
use Illuminate\Support\Str;

class DepositService
{
    public function initiate(User $user, array $data): Deposit
    {
        $method = DepositMethod::findOrFail($data['method_id']);

        $fee = $this->calculateFee($data['amount'], $method);

        $status = match ($method->type) {
            'automatic' => 'processing',
            'crypto' => 'pending',
            default => 'pending',
        };

        return Deposit::create([
            'user_id' => $user->id,
            'method_id' => $data['method_id'],
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'USD',
            'fee' => $fee,
            'status' => $status,
            'reference' => 'DEP-'.strtoupper(Str::random(10)),
            'proof_path' => $data['proof'] ?? null,
            'notes' => $data['reference'] ?? null,
        ]);
    }

    protected function calculateFee(float $amount, DepositMethod $method): float
    {
        $feeStructure = $method->fee_structure ?? ['type' => 'flat', 'value' => 0];

        if (! is_array($feeStructure)) {
            return 0;
        }

        return match ($feeStructure['type'] ?? 'flat') {
            'percentage' => $amount * (($feeStructure['value'] ?? 0) / 100),
            'flat' => $feeStructure['value'] ?? 0,
            'tiered' => $this->calculateTieredFee($amount, $feeStructure),
            default => 0,
        };
    }

    protected function calculateTieredFee(float $amount, array $feeStructure): float
    {
        $tiers = $feeStructure['tiers'] ?? [];

        foreach ($tiers as $tier) {
            if ($amount >= ($tier['min'] ?? 0) && $amount <= ($tier['max'] ?? PHP_FLOAT_MAX)) {
                return match ($tier['type'] ?? 'flat') {
                    'percentage' => $amount * ($tier['value'] ?? 0) / 100,
                    'flat' => $tier['value'] ?? 0,
                    default => 0,
                };
            }
        }

        return 0;
    }

    public function approve(Deposit $deposit): void
    {
        $deposit->update(['status' => 'completed']);

        $netAmount = $deposit->amount - $deposit->fee;

        $deposit->user->wallet->increment('balance', $netAmount);
    }

    public function reject(Deposit $deposit, string $reason): void
    {
        $deposit->update([
            'status' => 'rejected',
            'notes' => $reason,
        ]);
    }

    public function processAutoDeposit(Deposit $deposit): void
    {
        $this->approve($deposit);
    }
}
