<?php

namespace App\Services;

use App\Models\Ledger\Account;
use App\Models\Ledger\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LedgerService
{
    public function __construct(
        protected ?User $user = null
    ) {}

    public function transfer(
        Account $from,
        Account $to,
        float $amount,
        string $description,
        ?User $createdBy = null
    ): Transaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Transfer amount must be positive');
        }

        if (! $from->is_active || ! $to->is_active) {
            throw new \InvalidArgumentException('Both accounts must be active');
        }

        return DB::transaction(function () use ($from, $to, $amount, $description, $createdBy) {
            $fromAccount = Account::lockForUpdate()->find($from->id);
            $toAccount = Account::lockForUpdate()->find($to->id);

            $availableBalance = $fromAccount->getAvailableBalance();
            $amountInCents = (int) ($amount * 100);

            if ($availableBalance < $amountInCents) {
                throw new \RuntimeException('Insufficient funds');
            }

            $debitTransaction = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => Transaction::TYPE_TRANSFER,
                'description' => $description,
                'amount' => -$amountInCents,
                'currency' => 'USD',
                'created_by' => $createdBy?->id ?? $this->user?->id,
                'status' => Transaction::STATUS_COMPLETED,
                'posted_at' => now(),
            ]);

            $creditTransaction = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => Transaction::TYPE_TRANSFER,
                'description' => $description,
                'amount' => $amountInCents,
                'currency' => 'USD',
                'created_by' => $createdBy?->id ?? $this->user?->id,
                'status' => Transaction::STATUS_COMPLETED,
                'posted_at' => now(),
            ]);

            $fromAccount->balance->decrement('balance', $amountInCents);
            $fromAccount->balance->decrement('available_balance', $amountInCents);

            $toAccount->balance->increment('balance', $amountInCents);
            $toAccount->balance->increment('available_balance', $amountInCents);

            return $debitTransaction;
        });
    }

    public function reverseTransaction(Transaction $original, ?string $reason = null, ?User $reversedBy = null): Transaction
    {
        if ($original->status === Transaction::STATUS_REVERSED) {
            throw new \InvalidArgumentException('Transaction is already reversed');
        }

        if ($original->status !== Transaction::STATUS_COMPLETED) {
            throw new \InvalidArgumentException('Only completed transactions can be reversed');
        }

        return DB::transaction(function () use ($original, $reason, $reversedBy) {
            $original->refresh();

            $reversalTransaction = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => Transaction::TYPE_REVERSAL,
                'description' => $reason ?? 'Reversal of transaction '.$original->transaction_number,
                'amount' => -$original->amount,
                'currency' => $original->currency,
                'created_by' => $reversedBy?->id ?? $this->user?->id,
                'status' => Transaction::STATUS_COMPLETED,
                'posted_at' => now(),
                'parent_id' => $original->id,
            ]);

            $original->update(['status' => Transaction::STATUS_REVERSED]);

            if ($original->entries()->count() > 0) {
                foreach ($original->entries as $entry) {
                    if ($entry->account && $entry->account->balance) {
                        $entry->account->balance->decrement('balance', -$entry->amount);
                        $entry->account->balance->decrement('available_balance', -$entry->amount);
                    }
                }
            }

            return $reversalTransaction;
        });
    }
}
