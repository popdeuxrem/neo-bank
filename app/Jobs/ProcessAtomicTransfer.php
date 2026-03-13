<?php

namespace App\Jobs;

use App\Events\Ledger\TransactionCompleted;
use App\Models\Ledger\Account;
use App\Models\Ledger\AccountBalance;
use App\Models\Ledger\Transaction;
use App\Models\Ledger\TransactionEntry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessAtomicTransfer implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public int $timeout = 120;

    public function __construct(
        public int $fromAccountId,
        public int $toAccountId,
        public int $amount,
        public string $type,
        public ?string $description = null,
        public ?int $userId = null,
        public ?array $metadata = null
    ) {}

    public function handle(): void
    {
        $fromAccount = Account::findOrFail($this->fromAccountId);
        $toAccount = Account::findOrFail($this->toAccountId);

        if (! $fromAccount->is_active || ! $toAccount->is_active) {
            throw new \InvalidArgumentException('Both accounts must be active');
        }

        $transaction = DB::transaction(function () use ($fromAccount, $toAccount) {
            $transaction = Transaction::create([
                'transaction_number' => Transaction::generateTransactionNumber(),
                'type' => $this->type,
                'description' => $this->description,
                'amount' => $this->amount,
                'currency' => 'USD',
                'created_by' => $this->userId,
                'status' => Transaction::STATUS_PENDING,
                'metadata' => $this->metadata,
            ]);

            TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $fromAccount->id,
                'entry_type' => TransactionEntry::TYPE_DEBIT,
                'amount' => $this->amount,
                'memo' => 'Transfer out',
            ]);

            TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $toAccount->id,
                'entry_type' => TransactionEntry::TYPE_CREDIT,
                'amount' => $this->amount,
                'memo' => 'Transfer in',
            ]);

            $debitBalance = AccountBalance::firstOrCreate(
                ['account_id' => $fromAccount->id],
                ['balance' => 0, 'available_balance' => 0]
            );
            $debitBalance->balance -= $this->amount;
            $debitBalance->available_balance -= $this->amount;
            $debitBalance->as_of_date = now();
            $debitBalance->save();

            $creditBalance = AccountBalance::firstOrCreate(
                ['account_id' => $toAccount->id],
                ['balance' => 0, 'available_balance' => 0]
            );
            $creditBalance->balance += $this->amount;
            $creditBalance->available_balance += $this->amount;
            $creditBalance->as_of_date = now();
            $creditBalance->save();

            $transaction->markAsCompleted();

            event(new TransactionCompleted($transaction));

            return $transaction;
        });

        Log::info('Atomic transfer completed', [
            'transaction_id' => $transaction->id,
            'transaction_number' => $transaction->transaction_number,
            'from_account' => $this->fromAccountId,
            'to_account' => $this->toAccountId,
            'amount' => $this->amount,
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Atomic transfer job failed', [
            'from_account' => $this->fromAccountId,
            'to_account' => $this->toAccountId,
            'amount' => $this->amount,
            'error' => $exception->getMessage(),
        ]);
    }
}
