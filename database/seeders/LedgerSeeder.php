<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Ledger\Account;
use App\Models\Ledger\AccountBalance;
use App\Models\Ledger\AccountType;
use App\Models\Ledger\Transaction;
use App\Models\Ledger\TransactionEntry;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LedgerSeeder extends Seeder
{
    /** @var array<string, AccountType> */
    private array $accountTypes = [];

    /** @var array<int, Account> */
    private array $systemAccounts = [];

    /** @var array<int, Account> */
    private array $userAccounts = [];

    /** @var array<int, User> */
    private array $users = [];

    public function run(): void
    {
        DB::transaction(function () {
            $this->seedAccountTypes();
            $this->seedSystemAccounts();
            $this->seedUserAccounts();
            $this->seedTransactions();
            $this->seedPayments();
            $this->seedAuditLogs();
        });
    }

    private function seedAccountTypes(): void
    {
        $types = [
            'asset' => [
                'name' => 'Asset',
                'nature' => 'debit',
                'description' => 'Assets (debit normal)',
            ],
            'liability' => [
                'name' => 'Liability',
                'nature' => 'credit',
                'description' => 'Liabilities (credit normal)',
            ],
            'equity' => [
                'name' => 'Equity',
                'nature' => 'credit',
                'description' => 'Owner equity (credit normal)',
            ],
            'revenue' => [
                'name' => 'Revenue',
                'nature' => 'credit',
                'description' => 'Revenue accounts (credit normal)',
            ],
            'expense' => [
                'name' => 'Expense',
                'nature' => 'debit',
                'description' => 'Expense accounts (debit normal)',
            ],
        ];

        foreach ($types as $slug => $attributes) {
            $this->accountTypes[$slug] = AccountType::firstOrCreate(
                ['slug' => $slug],
                $attributes
            );
        }

        $this->command->info('Seeded 5 account types.');
    }

    private function seedSystemAccounts(): void
    {
        $cashAccount = Account::firstOrCreate(
            ['account_number' => '99999999'],
            [
                'account_type_id' => $this->accountTypes['asset']->id,
                'name' => 'Cash Account',
                'is_system' => true,
                'is_active' => true,
            ]
        );

        AccountBalance::firstOrCreate(
            ['account_id' => $cashAccount->id],
            ['balance' => 0, 'available_balance' => 0]
        );

        $feeIncomeAccount = Account::firstOrCreate(
            ['account_number' => '40000001'],
            [
                'account_type_id' => $this->accountTypes['revenue']->id,
                'name' => 'Fee Income',
                'is_system' => true,
                'is_active' => true,
            ]
        );

        AccountBalance::firstOrCreate(
            ['account_id' => $feeIncomeAccount->id],
            ['balance' => 0, 'available_balance' => 0]
        );

        $this->systemAccounts = [
            'cash' => $cashAccount,
            'fee_income' => $feeIncomeAccount,
        ];

        $this->command->info('Seeded 2 system accounts.');
    }

    private function seedUserAccounts(): void
    {
        $this->users = User::all()->values()->all();
        $accountCount = 0;

        foreach ($this->users as $index => $user) {
            $checkingNumber = '10000'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT);

            $checkingAccount = Account::firstOrCreate(
                ['account_number' => $checkingNumber],
                [
                    'user_id' => $user->id,
                    'account_type_id' => $this->accountTypes['asset']->id,
                    'name' => 'Checking Account',
                    'is_active' => true,
                ]
            );

            $checkingBalance = fake()->numberBetween(50000, 500000);

            AccountBalance::firstOrCreate(
                ['account_id' => $checkingAccount->id],
                [
                    'balance' => $checkingBalance,
                    'available_balance' => $checkingBalance,
                    'as_of_date' => now(),
                ]
            );

            $this->userAccounts[] = $checkingAccount;
            $accountCount++;

            if ($index < 3) {
                $savingsNumber = '20000'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT);

                $savingsAccount = Account::firstOrCreate(
                    ['account_number' => $savingsNumber],
                    [
                        'user_id' => $user->id,
                        'account_type_id' => $this->accountTypes['asset']->id,
                        'name' => 'Savings Account',
                        'is_active' => true,
                    ]
                );

                $savingsBalance = fake()->numberBetween(100000, 1000000);

                AccountBalance::firstOrCreate(
                    ['account_id' => $savingsAccount->id],
                    [
                        'balance' => $savingsBalance,
                        'available_balance' => $savingsBalance,
                        'as_of_date' => now(),
                    ]
                );

                $this->userAccounts[] = $savingsAccount;
                $accountCount++;
            }
        }

        $this->command->info("Seeded {$accountCount} user accounts.");
    }

    private function seedTransactions(): void
    {
        if (empty($this->userAccounts) || empty($this->users)) {
            $this->command->warn('No user accounts or users found. Skipping transactions.');

            return;
        }

        $transactionTypes = ['deposit', 'withdrawal', 'transfer', 'payment'];
        $statuses = ['completed', 'completed', 'completed', 'pending', 'failed'];
        $cashAccount = $this->systemAccounts['cash'];
        $transactionCount = 0;

        foreach (range(1, 50) as $i) {
            $user = $this->users[array_rand($this->users)];
            $account = $this->userAccounts[array_rand($this->userAccounts)];
            $type = $transactionTypes[array_rand($transactionTypes)];
            $amount = fake()->numberBetween(1000, 50000);
            $status = $statuses[array_rand($statuses)];

            $transaction = Transaction::create([
                'transaction_number' => 'TXN-'.str()->upper(str()->random(8)),
                'type' => $type,
                'description' => ucfirst($type).' transaction',
                'amount' => $amount,
                'currency' => 'USD',
                'created_by' => $user->id,
                'status' => $status,
                'posted_at' => $status === 'completed' ? now() : null,
            ]);

            // Debit entry
            $isWithdrawal = $type === 'withdrawal';

            TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $isWithdrawal ? $cashAccount->id : $account->id,
                'entry_type' => 'debit',
                'amount' => $amount,
                'memo' => $isWithdrawal ? 'Cash disbursement' : ucfirst($type).' received',
            ]);

            // Credit entry
            TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $isWithdrawal ? $account->id : $cashAccount->id,
                'entry_type' => 'credit',
                'amount' => $amount,
                'memo' => $isWithdrawal ? 'Account withdrawal' : 'Cash settlement',
            ]);

            // Update balances for completed transactions
            if ($status === 'completed') {
                $balance = AccountBalance::firstOrCreate(
                    ['account_id' => $account->id],
                    ['balance' => 0, 'available_balance' => 0]
                );

                if (in_array($type, ['deposit', 'transfer', 'payment'])) {
                    $balance->balance += $amount;
                    $balance->available_balance += $amount;
                } else {
                    $balance->balance -= $amount;
                    $balance->available_balance -= $amount;
                }

                $balance->as_of_date = now();
                $balance->save();
            }

            $transactionCount++;
        }

        $this->command->info("Seeded {$transactionCount} transactions with double-entry pairs.");
    }

    private function seedPayments(): void
    {
        if (count($this->userAccounts) < 2 || empty($this->users)) {
            $this->command->warn('Not enough accounts or users for payments. Skipping.');

            return;
        }

        $types = ['internal', 'external', 'ach'];
        $statuses = ['completed', 'completed', 'completed', 'pending', 'failed'];
        $paymentCount = 0;

        foreach (range(1, 20) as $i) {
            $sender = $this->userAccounts[array_rand($this->userAccounts)];
            $receiver = $this->userAccounts[array_rand($this->userAccounts)];

            while ($sender->id === $receiver->id) {
                $receiver = $this->userAccounts[array_rand($this->userAccounts)];
            }

            $user = $this->users[array_rand($this->users)];
            $status = $statuses[array_rand($statuses)];

            Payment::create([
                'reference' => 'PAY-'.str()->upper(str()->random(10)),
                'sender_account_id' => $sender->id,
                'receiver_account_id' => $receiver->id,
                'user_id' => $user->id,
                'amount' => fake()->numberBetween(5000, 100000),
                'currency' => 'USD',
                'type' => $types[array_rand($types)],
                'status' => $status,
                'description' => 'Payment transfer',
                'processed_at' => $status === 'completed' ? now() : null,
            ]);

            $paymentCount++;
        }

        $this->command->info("Seeded {$paymentCount} payments.");
    }

    private function seedAuditLogs(): void
    {
        if (empty($this->users)) {
            $this->command->warn('No users found. Skipping audit logs.');

            return;
        }

        // Check if audit_logs table has our expected schema
        if (!\Schema::hasColumn('audit_logs', 'action')) {
            $this->command->warn('Audit logs table does not have expected schema. Skipping.');

            return;
        }

        $actions = [
            'user.login',
            'user.logout',
            'transaction.create',
            'transaction.update',
            'account.create',
            'payment.process',
            'settings.update',
        ];

        $entityTypes = ['User', 'Transaction', 'Account', 'Payment'];
        $logCount = 0;

        foreach (range(1, 30) as $i) {
            AuditLog::create([
                'user_id' => $this->users[array_rand($this->users)]->id,
                'action' => $actions[array_rand($actions)],
                'entity_type' => fake()->randomElement($entityTypes),
                'entity_id' => fake()->numberBetween(1, 50),
                'old_values' => null,
                'new_values' => ['seeded' => true, 'iteration' => $i],
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
            ]);

            $logCount++;
        }

        $this->command->info("Seeded {$logCount} audit log entries.");
    }
}
