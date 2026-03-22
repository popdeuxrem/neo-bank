<?php

namespace App\Services\Ledger;

use App\Models\Ledger\Account;
use App\Models\Ledger\AccountBalance;
use App\Models\Ledger\Transaction;
use App\Models\Ledger\TransactionEntry;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;
use Throwable;

/**
 * Atomic Ledger Service
 * 
 * Ensures atomic double-entry bookkeeping operations.
 * All operations are wrapped in database transactions to maintain ACID compliance.
 * 
 * @package App\Services\Ledger
 */
class LedgerService
{
    /**
     * Create a new double-entry transaction with atomic guarantees.
     *
     * @param string $type Transaction type (deposit, withdrawal, transfer, etc.)
     * @param string $description Human-readable description
     * @param array $entries Array of entry arrays ['account_id' => int, 'entry_type' => 'debit|credit', 'amount' => int, 'memo' => string?]
     * @param array $options Additional options: currency, metadata, created_by, post_immediately
     * @return Transaction The created transaction
     * @throws RuntimeException If transaction cannot be created
     * @throws InvalidArgumentException If entries don't balance
     */
    public function createTransaction(
        string $type,
        string $description,
        array $entries,
        array $options = []
    ): Transaction {
        // Validate entries balance before starting transaction
        $this->validateEntriesBalance($entries);

        return DB::transaction(function () use ($type, $description, $entries, $options) {
            // Create the transaction record
            $transaction = Transaction::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'transaction_number' => $options['transaction_number'] ?? Transaction::generateTransactionNumber(),
                'type' => $type,
                'description' => $description,
                'amount' => $this->calculateTransactionAmount($entries),
                'currency' => $options['currency'] ?? 'USD',
                'created_by' => $options['created_by'] ?? null,
                'status' => Transaction::STATUS_PENDING,
                'metadata' => $options['metadata'] ?? null,
                'posted_at' => null,
            ]);

            // Create transaction entries
            foreach ($entries as $entry) {
                TransactionEntry::create([
                    'transaction_id' => $transaction->id,
                    'account_id' => $entry['account_id'],
                    'entry_type' => $entry['entry_type'],
                    'amount' => $entry['amount'],
                    'memo' => $entry['memo'] ?? null,
                    'metadata' => $entry['metadata'] ?? null,
                ]);
            }

            // Post immediately if requested
            if ($options['post_immediately'] ?? true) {
                $this->postTransaction($transaction);
            }

            return $transaction->fresh(['entries']);
        });
    }

    /**
     * Post a pending transaction to accounts.
     * Updates account balances atomically.
     *
     * @param Transaction $transaction
     * @return Transaction
     * @throws RuntimeException If posting fails
     */
    public function postTransaction(Transaction $transaction): Transaction
    {
        if ($transaction->status !== Transaction::STATUS_PENDING) {
            throw new RuntimeException("Transaction {$transaction->id} is not in pending status");
        }

        return DB::transaction(function () use ($transaction) {
            // Lock entries for update to prevent race conditions
            $entries = TransactionEntry::where('transaction_id', $transaction->id)
                ->lockForUpdate()
                ->get();

            if ($entries->isEmpty()) {
                throw new RuntimeException("Transaction {$transaction->id} has no entries");
            }

            // Update account balances
            foreach ($entries as $entry) {
                $this->updateAccountBalance($entry->account_id, $entry->entry_type, $entry->amount);
            }

            // Mark transaction as completed
            $transaction->markAsCompleted();

            Log::info("Transaction posted", [
                'transaction_id' => $transaction->id,
                'transaction_number' => $transaction->transaction_number,
            ]);

            return $transaction->fresh(['entries']);
        });
    }

    /**
     * Reverse a posted transaction.
     * Creates a reversing entry to maintain audit trail.
     *
     * @param Transaction $transaction
     * @param string $reason Reason for reversal
     * @param int|null $reversedBy User ID who performed reversal
     * @return Transaction The reversing transaction
     * @throws RuntimeException If reversal fails
     */
    public function reverseTransaction(
        Transaction $transaction,
        string $reason,
        ?int $reversedBy = null
    ): Transaction {
        if ($transaction->status !== Transaction::STATUS_COMPLETED) {
            throw new RuntimeException("Only completed transactions can be reversed");
        }

        return DB::transaction(function () use ($transaction, $reason, $reversedBy) {
            // Create reversal transaction
            $reversalEntries = $transaction->entries->map(function ($entry) {
                return [
                    'account_id' => $entry->account_id,
                    'entry_type' => $entry->entry_type === TransactionEntry::TYPE_DEBIT 
                        ? TransactionEntry::TYPE_CREDIT 
                        : TransactionEntry::TYPE_DEBIT,
                    'amount' => $entry->amount,
                    'memo' => "Reversal of entry {$entry->id}",
                ];
            })->toArray();

            $reversalTransaction = $this->createTransaction(
                Transaction::TYPE_REVERSAL,
                "Reversal of {$transaction->transaction_number}: {$reason}",
                $reversalEntries,
                [
                    'created_by' => $reversedBy,
                    'metadata' => [
                        'original_transaction_id' => $transaction->id,
                        'original_transaction_number' => $transaction->transaction_number,
                        'reversal_reason' => $reason,
                    ],
                ]
            );

            // Mark original as reversed
            $transaction->markAsReversed();

            Log::info("Transaction reversed", [
                'original_transaction_id' => $transaction->id,
                'reversal_transaction_id' => $reversalTransaction->id,
                'reason' => $reason,
            ]);

            return $reversalTransaction;
        });
    }

    /**
     * Transfer funds between two accounts.
     * Convenience method for simple transfers.
     *
     * @param int $fromAccountId Source account ID
     * @param int $toAccountId Destination account ID
     * @param int $amount Amount in cents
     * @param string $description Transaction description
     * @param array $options Additional options
     * @return Transaction
     */
    public function transfer(
        int $fromAccountId,
        int $toAccountId,
        int $amount,
        string $description,
        array $options = []
    ): Transaction {
        $entries = [
            [
                'account_id' => $fromAccountId,
                'entry_type' => TransactionEntry::TYPE_CREDIT,
                'amount' => $amount,
                'memo' => $options['from_memo'] ?? 'Transfer out',
            ],
            [
                'account_id' => $toAccountId,
                'entry_type' => TransactionEntry::TYPE_DEBIT,
                'amount' => $amount,
                'memo' => $options['to_memo'] ?? 'Transfer in',
            ],
        ];

        return $this->createTransaction(
            Transaction::TYPE_TRANSFER,
            $description,
            $entries,
            $options
        );
    }

    /**
     * Record a deposit transaction.
     *
     * @param int $accountId Account to deposit to
     * @param int $amount Amount in cents
     * @param string $description Transaction description
     * @param array $options Additional options
     * @return Transaction
     */
    public function deposit(
        int $accountId,
        int $amount,
        string $description,
        array $options = []
    ): Transaction {
        // For deposits, we need a source account (usually a cash/bank account)
        $sourceAccountId = $options['source_account_id'] ?? $this->getDefaultCashAccount();

        $entries = [
            [
                'account_id' => $sourceAccountId,
                'entry_type' => TransactionEntry::TYPE_CREDIT,
                'amount' => $amount,
                'memo' => $options['source_memo'] ?? 'Deposit source',
            ],
            [
                'account_id' => $accountId,
                'entry_type' => TransactionEntry::TYPE_DEBIT,
                'amount' => $amount,
                'memo' => $options['destination_memo'] ?? 'Deposit received',
            ],
        ];

        return $this->createTransaction(
            Transaction::TYPE_DEPOSIT,
            $description,
            $entries,
            $options
        );
    }

    /**
     * Record a withdrawal transaction.
     *
     * @param int $accountId Account to withdraw from
     * @param int $amount Amount in cents
     * @param string $description Transaction description
     * @param array $options Additional options
     * @return Transaction
     * @throws RuntimeException If insufficient funds
     */
    public function withdraw(
        int $accountId,
        int $amount,
        string $description,
        array $options = []
    ): Transaction {
        // Check sufficient funds
        $account = Account::findOrFail($accountId);
        $balance = $account->getCurrentBalance();
        
        if ($balance < $amount && !($options['allow_overdraft'] ?? false)) {
            throw new RuntimeException(
                "Insufficient funds in account {$accountId}. Available: {$balance}, Requested: {$amount}"
            );
        }

        $destinationAccountId = $options['destination_account_id'] ?? $this->getDefaultCashAccount();

        $entries = [
            [
                'account_id' => $accountId,
                'entry_type' => TransactionEntry::TYPE_CREDIT,
                'amount' => $amount,
                'memo' => $options['source_memo'] ?? 'Withdrawal',
            ],
            [
                'account_id' => $destinationAccountId,
                'entry_type' => TransactionEntry::TYPE_DEBIT,
                'amount' => $amount,
                'memo' => $options['destination_memo'] ?? 'Withdrawal destination',
            ],
        ];

        return $this->createTransaction(
            Transaction::TYPE_WITHDRAWAL,
            $description,
            $entries,
            $options
        );
    }

    /**
     * Record a fee transaction.
     *
     * @param int $fromAccountId Account to charge fee from
     * @param int $amount Fee amount in cents
     * @param string $feeType Type of fee
     * @param string $description Fee description
     * @param array $options Additional options
     * @return Transaction
     */
    public function chargeFee(
        int $fromAccountId,
        int $amount,
        string $feeType,
        string $description,
        array $options = []
    ): Transaction {
        $feeAccountId = $options['fee_account_id'] ?? $this->getDefaultFeeAccount();

        $entries = [
            [
                'account_id' => $fromAccountId,
                'entry_type' => TransactionEntry::TYPE_CREDIT,
                'amount' => $amount,
                'memo' => $options['payer_memo'] ?? "Fee: {$feeType}",
            ],
            [
                'account_id' => $feeAccountId,
                'entry_type' => TransactionEntry::TYPE_DEBIT,
                'amount' => $amount,
                'memo' => $options['fee_memo'] ?? "Fee received: {$feeType}",
            ],
        ];

        return $this->createTransaction(
            Transaction::TYPE_FEE,
            $description,
            $entries,
            array_merge($options, [
                'metadata' => array_merge($options['metadata'] ?? [], [
                    'fee_type' => $feeType,
                ]),
            ])
        );
    }

    /**
     * Record interest accrual.
     *
     * @param int $toAccountId Account to credit interest to
     * @param int $amount Interest amount in cents
     * @param string $description Interest description
     * @param array $options Additional options
     * @return Transaction
     */
    public function accrueInterest(
        int $toAccountId,
        int $amount,
        string $description,
        array $options = []
    ): Transaction {
        $interestExpenseAccountId = $options['expense_account_id'] ?? $this->getDefaultInterestExpenseAccount();

        $entries = [
            [
                'account_id' => $interestExpenseAccountId,
                'entry_type' => TransactionEntry::TYPE_CREDIT,
                'amount' => $amount,
                'memo' => $options['expense_memo'] ?? 'Interest expense',
            ],
            [
                'account_id' => $toAccountId,
                'entry_type' => TransactionEntry::TYPE_DEBIT,
                'amount' => $amount,
                'memo' => $options['income_memo'] ?? 'Interest earned',
            ],
        ];

        return $this->createTransaction(
            Transaction::TYPE_INTEREST,
            $description,
            $entries,
            $options
        );
    }

    /**
     * Bulk process multiple transactions atomically.
     *
     * @param array $transactions Array of transaction definitions
     * @return Collection Created transactions
     * @throws RuntimeException If any transaction fails
     */
    public function bulkProcess(array $transactions): Collection
    {
        return DB::transaction(function () use ($transactions) {
            $created = collect();

            foreach ($transactions as $tx) {
                $transaction = $this->createTransaction(
                    $tx['type'],
                    $tx['description'],
                    $tx['entries'],
                    $tx['options'] ?? []
                );
                $created->push($transaction);
            }

            return $created;
        });
    }

    /**
     * Validate that entries balance (debits = credits).
     *
     * @param array $entries
     * @throws InvalidArgumentException If entries don't balance
     */
    protected function validateEntriesBalance(array $entries): void
    {
        $debitTotal = 0;
        $creditTotal = 0;

        foreach ($entries as $entry) {
            if (!isset($entry['account_id'], $entry['entry_type'], $entry['amount'])) {
                throw new InvalidArgumentException('Each entry must have account_id, entry_type, and amount');
            }

            if (!in_array($entry['entry_type'], [TransactionEntry::TYPE_DEBIT, TransactionEntry::TYPE_CREDIT], true)) {
                throw new InvalidArgumentException("Invalid entry type: {$entry['entry_type']}");
            }

            if ($entry['amount'] <= 0) {
                throw new InvalidArgumentException('Amount must be positive');
            }

            if ($entry['entry_type'] === TransactionEntry::TYPE_DEBIT) {
                $debitTotal += $entry['amount'];
            } else {
                $creditTotal += $entry['amount'];
            }
        }

        if ($debitTotal !== $creditTotal) {
            throw new InvalidArgumentException(
                "Entries do not balance. Debits: {$debitTotal}, Credits: {$creditTotal}"
            );
        }
    }

    /**
     * Calculate total transaction amount from entries.
     *
     * @param array $entries
     * @return int
     */
    protected function calculateTransactionAmount(array $entries): int
    {
        $total = 0;
        foreach ($entries as $entry) {
            $total += $entry['amount'];
        }
        return $total / 2; // Each side (debit/credit) sums to total
    }

    /**
     * Update account balance based on entry type.
     *
     * @param int $accountId
     * @param string $entryType
     * @param int $amount
     * @return void
     */
    protected function updateAccountBalance(int $accountId, string $entryType, int $amount): void
    {
        $balance = AccountBalance::lockForUpdate()
            ->where('account_id', $accountId)
            ->first();

        if (!$balance) {
            // Create balance record if it doesn't exist
            $balance = AccountBalance::create([
                'account_id' => $accountId,
                'balance' => 0,
                'available_balance' => 0,
                'as_of_date' => now(),
            ]);
        }

        $account = Account::findOrFail($accountId);
        $isDebitNormal = $account->isDebitNormal();

        // Calculate balance change based on account type and entry type
        if ($isDebitNormal) {
            // Asset/Expense accounts: debit increases, credit decreases
            $change = ($entryType === TransactionEntry::TYPE_DEBIT) ? $amount : -$amount;
        } else {
            // Liability/Equity/Revenue accounts: credit increases, debit decreases
            $change = ($entryType === TransactionEntry::TYPE_CREDIT) ? $amount : -$amount;
        }

        $newBalance = $balance->balance + $change;

        $balance->update([
            'balance' => $newBalance,
            'available_balance' => $newBalance, // Adjust if holds are implemented
            'as_of_date' => now(),
        ]);
    }

    /**
     * Get default cash account ID.
     *
     * @return int
     * @throws RuntimeException If no cash account exists
     */
    protected function getDefaultCashAccount(): int
    {
        $account = Account::where('account_number', 'CASH-001')
            ->orWhere('is_system', true)
            ->where('name', 'like', '%Cash%')
            ->first();

        if (!$account) {
            throw new RuntimeException('No default cash account configured');
        }

        return $account->id;
    }

    /**
     * Get default fee revenue account ID.
     *
     * @return int
     * @throws RuntimeException If no fee account exists
     */
    protected function getDefaultFeeAccount(): int
    {
        $account = Account::where('account_number', 'FEE-001')
            ->orWhere('is_system', true)
            ->where('name', 'like', '%Fee%')
            ->first();

        if (!$account) {
            throw new RuntimeException('No default fee account configured');
        }

        return $account->id;
    }

    /**
     * Get default interest expense account ID.
     *
     * @return int
     * @throws RuntimeException If no interest expense account exists
     */
    protected function getDefaultInterestExpenseAccount(): int
    {
        $account = Account::where('account_number', 'INT-EXP-001')
            ->orWhere('is_system', true)
            ->where('name', 'like', '%Interest Expense%')
            ->first();

        if (!$account) {
            throw new RuntimeException('No default interest expense account configured');
        }

        return $account->id;
    }

    /**
     * Verify ledger integrity - total debits should equal total credits.
     *
     * @return array Summary of integrity check
     */
    public function verifyIntegrity(): array
    {
        $debits = TransactionEntry::where('entry_type', TransactionEntry::TYPE_DEBIT)->sum('amount');
        $credits = TransactionEntry::where('entry_type', TransactionEntry::TYPE_CREDIT)->sum('amount');

        $accountBalances = AccountBalance::sum('balance');

        return [
            'debit_total' => (int) $debits,
            'credit_total' => (int) $credits,
            'difference' => (int) ($debits - $credits),
            'is_balanced' => $debits === $credits,
            'account_balance_sum' => (int) $accountBalances,
        ];
    }

    /**
     * Get account statement with running balance.
     *
     * @param int $accountId
     * @param string $fromDate
     * @param string $toDate
     * @return Collection
     */
    public function getAccountStatement(int $accountId, string $fromDate, string $toDate): Collection
    {
        $entries = TransactionEntry::with('transaction')
            ->whereHas('transaction', function ($q) use ($fromDate, $toDate) {
                $q->where('status', Transaction::STATUS_COMPLETED)
                    ->whereBetween('posted_at', [$fromDate, $toDate]);
            })
            ->where('account_id', $accountId)
            ->orderBy('created_at')
            ->get();

        $runningBalance = 0;
        $account = Account::findOrFail($accountId);
        $isDebitNormal = $account->isDebitNormal();

        return $entries->map(function ($entry) use (&$runningBalance, $isDebitNormal) {
            $amount = $entry->amount;
            
            if ($isDebitNormal) {
                $change = $entry->isDebit() ? $amount : -$amount;
            } else {
                $change = $entry->isCredit() ? $amount : -$amount;
            }
            
            $runningBalance += $change;

            return [
                'date' => $entry->transaction->posted_at,
                'transaction_number' => $entry->transaction->transaction_number,
                'description' => $entry->transaction->description,
                'debit' => $entry->isDebit() ? $amount : 0,
                'credit' => $entry->isCredit() ? $amount : 0,
                'balance' => $runningBalance,
                'memo' => $entry->memo,
            ];
        });
    }
}
