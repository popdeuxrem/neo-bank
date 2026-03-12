<?php

namespace App\Services\Ledger;

use App\Events\Ledger\TransactionCompleted;
use App\Models\Ledger\Account;
use App\Models\Ledger\AccountBalance;
use App\Models\Ledger\Transaction;
use App\Models\Ledger\TransactionEntry;
use Illuminate\Support\Facades\DB;

class AtomicTransferService
{
    public function __construct(
        protected ?int $userId = null
    ) {}

    public function transfer(
        Account $fromAccount,
        Account $toAccount,
        int $amount,
        string $type,
        ?string $description = null,
        ?array $metadata = null
    ): Transaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Transfer amount must be positive');
        }

        if (! $fromAccount->is_active || ! $toAccount->is_active) {
            throw new \InvalidArgumentException('Both accounts must be active');
        }

        return DB::transaction(function () use ($fromAccount, $toAccount, $amount, $type, $description, $metadata) {
            $transaction = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => $type,
                'description' => $description,
                'amount' => $amount,
                'currency' => 'USD',
                'created_by' => $this->userId,
                'status' => Transaction::STATUS_PENDING,
                'metadata' => $metadata,
            ]);

            $this->createEntry($transaction, $fromAccount, TransactionEntry::TYPE_DEBIT, $amount);
            $this->createEntry($transaction, $toAccount, TransactionEntry::TYPE_CREDIT, $amount);

            if (! $transaction->isBalanced()) {
                throw new \RuntimeException('Transaction is not balanced - debits do not equal credits');
            }

            $this->updateAccountBalances($fromAccount, $toAccount, $amount);

            $transaction->markAsCompleted();

            event(new TransactionCompleted($transaction));

            return $transaction;
        });
    }

    public function deposit(
        Account $toAccount,
        int $amount,
        ?string $description = null,
        ?array $metadata = null
    ): Transaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Deposit amount must be positive');
        }

        if (! $toAccount->is_active) {
            throw new \InvalidArgumentException('Account must be active');
        }

        return DB::transaction(function () use ($toAccount, $amount, $description, $metadata) {
            $transaction = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => Transaction::TYPE_DEPOSIT,
                'description' => $description,
                'amount' => $amount,
                'currency' => 'USD',
                'created_by' => $this->userId,
                'status' => Transaction::STATUS_PENDING,
                'metadata' => $metadata,
            ]);

            $this->createEntry(
                $transaction,
                $toAccount,
                TransactionEntry::TYPE_CREDIT,
                $amount,
                'Deposit'
            );

            $this->updateSingleAccountBalance($toAccount, $amount);

            $transaction->markAsCompleted();

            event(new TransactionCompleted($transaction));

            return $transaction;
        });
    }

    public function withdrawal(
        Account $fromAccount,
        int $amount,
        ?string $description = null,
        ?array $metadata = null
    ): Transaction {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Withdrawal amount must be positive');
        }

        if (! $fromAccount->is_active) {
            throw new \InvalidArgumentException('Account must be active');
        }

        $availableBalance = $fromAccount->getAvailableBalance();
        if ($availableBalance < $amount) {
            throw new \RuntimeException('Insufficient funds');
        }

        return DB::transaction(function () use ($fromAccount, $amount, $description, $metadata) {
            $transaction = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => Transaction::TYPE_WITHDRAWAL,
                'description' => $description,
                'amount' => $amount,
                'currency' => 'USD',
                'created_by' => $this->userId,
                'status' => Transaction::STATUS_PENDING,
                'metadata' => $metadata,
            ]);

            $this->createEntry(
                $transaction,
                $fromAccount,
                TransactionEntry::TYPE_DEBIT,
                $amount,
                'Withdrawal'
            );

            $this->updateSingleAccountBalance($fromAccount, -$amount);

            $transaction->markAsCompleted();

            event(new TransactionCompleted($transaction));

            return $transaction;
        });
    }

    public function reverseTransaction(Transaction $transaction, ?string $reason = null): Transaction
    {
        if (! $transaction->isCompleted()) {
            throw new \InvalidArgumentException('Can only reverse completed transactions');
        }

        if ($transaction->isReversed()) {
            throw new \InvalidArgumentException('Transaction is already reversed');
        }

        return DB::transaction(function () use ($transaction, $reason) {
            $reversal = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => 'reversal',
                'description' => "Reversal of {$transaction->transaction_number}: {$reason}",
                'amount' => $transaction->amount,
                'currency' => $transaction->currency,
                'created_by' => $this->userId,
                'status' => Transaction::STATUS_COMPLETED,
                'metadata' => [
                    'reversed_transaction_id' => $transaction->id,
                    'reversed_transaction_uuid' => $transaction->uuid,
                    'reason' => $reason,
                ],
                'posted_at' => now(),
            ]);

            foreach ($transaction->entries as $entry) {
                $reversalEntry = $entry->replicate();
                $reversalEntry->transaction_id = $reversal->id;
                $reversalEntry->entry_type = $entry->isDebit()
                    ? TransactionEntry::TYPE_CREDIT
                    : TransactionEntry::TYPE_DEBIT;
                $reversalEntry->save();

                $balance = AccountBalance::firstOrCreate(
                    ['account_id' => $entry->account_id],
                    ['balance' => 0, 'available_balance' => 0]
                );

                if ($entry->isDebit()) {
                    $balance->balance += $entry->amount;
                    $balance->available_balance += $entry->amount;
                } else {
                    $balance->balance -= $entry->amount;
                    $balance->available_balance -= $entry->amount;
                }
                $balance->as_of_date = now();
                $balance->save();
            }

            $transaction->markAsReversed();

            return $reversal;
        });
    }

    protected function createEntry(
        Transaction $transaction,
        Account $account,
        string $type,
        int $amount,
        ?string $memo = null
    ): TransactionEntry {
        return TransactionEntry::create([
            'transaction_id' => $transaction->id,
            'account_id' => $account->id,
            'entry_type' => $type,
            'amount' => $amount,
            'memo' => $memo,
        ]);
    }

    protected function updateAccountBalances(Account $debitAccount, Account $creditAccount, int $amount): void
    {
        $debitBalance = AccountBalance::firstOrCreate(
            ['account_id' => $debitAccount->id],
            ['balance' => 0, 'available_balance' => 0]
        );
        $debitBalance->balance -= $amount;
        $debitBalance->available_balance -= $amount;
        $debitBalance->as_of_date = now();
        $debitBalance->save();

        $creditBalance = AccountBalance::firstOrCreate(
            ['account_id' => $creditAccount->id],
            ['balance' => 0, 'available_balance' => 0]
        );
        $creditBalance->balance += $amount;
        $creditBalance->available_balance += $amount;
        $creditBalance->as_of_date = now();
        $creditBalance->save();
    }

    protected function updateSingleAccountBalance(Account $account, int $amount): void
    {
        $balance = AccountBalance::firstOrCreate(
            ['account_id' => $account->id],
            ['balance' => 0, 'available_balance' => 0]
        );

        $balance->balance += $amount;
        $balance->available_balance += $amount;
        $balance->as_of_date = now();
        $balance->save();
    }
}
