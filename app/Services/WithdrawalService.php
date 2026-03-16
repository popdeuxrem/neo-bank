<?php

namespace App\Services;

use App\Models\User;
use App\Models\Withdrawal;
use App\Models\WithdrawalMethod;

class WithdrawalService
{
    public function initiate(User $user, array $data): Withdrawal
    {
        $method = WithdrawalMethod::findOrFail($data['method_id']);

        $fee = $this->calculateFee($data['amount'], $method);
        $netAmount = $data['amount'] - $fee;

        $user->wallet->decrement('balance', $data['amount']);

        return Withdrawal::create([
            'user_id' => $user->id,
            'method_id' => $data['method_id'],
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'USD',
            'fee' => $fee,
            'net_amount' => $netAmount,
            'account_details' => $data['account_details'],
            'status' => 'pending',
        ]);
    }

    protected function calculateFee(float $amount, WithdrawalMethod $method): float
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

    public function approve(Withdrawal $withdrawal): void
    {
        $withdrawal->update(['status' => 'completed']);
    }

    public function reject(Withdrawal $withdrawal, string $reason): void
    {
        $withdrawal->update([
            'status' => 'rejected',
            'failure_reason' => $reason,
        ]);

        $withdrawal->user->wallet->increment('balance', $withdrawal->amount);
    }

    public function cancel(Withdrawal $withdrawal): void
    {
        if ($withdrawal->status !== 'pending') {
            throw new \Exception('Only pending withdrawals can be cancelled.');
        }

        $withdrawal->update(['status' => 'cancelled']);

        $withdrawal->user->wallet->increment('balance', $withdrawal->amount);
    }

    public function process(Withdrawal $withdrawal): void
    {
        $this->approve($withdrawal);
    }
}
