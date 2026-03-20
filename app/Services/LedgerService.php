<?php

namespace App\Services;

use App\Models\Ledger\Account;
use App\Models\Ledger\AccountBalance;
use App\Models\Ledger\Transaction;
use App\Models\Ledger\TransactionEntry;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LedgerService
{
    public function __construct(
        protected ?User $user = null
    ) {}

    /**
     * Transfer funds between accounts with full double-entry accounting.
     * Uses pessimistic locking and atomic updates to prevent race conditions.
     */
    public function transfer(
        Account $from,
        Account $to,
        float $amount,
        string $description,
        ?User $createdBy = null
    ): Transaction {
        $amountInCents = (int) ($amount * 100);

        if ($amountInCents <= 0) {
            throw new \InvalidArgumentException('Transfer amount must be positive');
        }

        if (! $from->is_active || ! $to->is_active) {
            throw new \InvalidArgumentException('Both accounts must be active');
        }

        // Prevent deadlock: always lock accounts in consistent order (by ID)
        [$firstAccountId, $secondAccountId] = $from->id < $to->id 
            ? [$from->id, $to->id] 
            : [$to->id, $from->id];

        return DB::transaction(function () use ($firstAccountId, $secondAccountId, $from, $to, $amountInCents, $description, $createdBy) {
            // Lock accounts in consistent order to prevent deadlocks
            $lockedAccounts = Account::whereIn('id', [$firstAccountId, $secondAccountId])
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $fromAccount = $lockedAccounts[$from->id];
            $toAccount = $lockedAccounts[$to->id];

            // Check available balance
            $availableBalance = $fromAccount->getAvailableBalance();

            if ($availableBalance < $amountInCents) {
                throw new \RuntimeException('Insufficient funds');
            }

            // Lock balance rows for update
            $balances = AccountBalance::whereIn('account_id', [$from->id, $to->id])
                ->lockForUpdate()
                ->get()
                ->keyBy('account_id');

            $fromBalance = $balances[$from->id];
            $toBalance = $balances[$to->id];

            // Create transaction with atomic balance updates
            $transaction = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => Transaction::TYPE_TRANSFER,
                'description' => $description,
                'amount' => $amountInCents, // Store as positive, entries determine debit/credit
                'currency' => 'USD',
                'created_by' => $createdBy?->id ?? $this->user?->id,
                'status' => Transaction::STATUS_COMPLETED,
                'posted_at' => now(),
            ]);

            // Create double-entry records (debit and credit)
            $debitEntry = TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $from->id,
                'entry_type' => TransactionEntry::TYPE_DEBIT,
                'amount' => $amountInCents,
                'memo' => 'Transfer out',
            ]);

            $creditEntry = TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $to->id,
                'entry_type' => TransactionEntry::TYPE_CREDIT,
                'amount' => $amountInCents,
                'memo' => 'Transfer in',
            ]);

            // Atomic balance updates using raw SQL to ensure both columns update together
            AccountBalance::where('account_id', $from->id)->update([
                'balance' => DB::raw("balance - {$amountInCents}"),
                'available_balance' => DB::raw("available_balance - {$amountInCents}"),
            ]);

            AccountBalance::where('account_id', $to->id)->update([
                'balance' => DB::raw("balance + {$amountInCents}"),
                'available_balance' => DB::raw("available_balance + {$amountInCents}"),
            ]);

            return $transaction;
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
