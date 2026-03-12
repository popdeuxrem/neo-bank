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
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding database...');

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $auditorRole = Role::firstOrCreate(['name' => 'auditor']);

        $accountTypes = $this->createAccountTypes();

        $this->command->info('Creating demo users...');
        $users = $this->createUsers($adminRole, $userRole, $auditorRole);

        $this->command->info('Creating accounts for users...');
        $accounts = $this->createAccountsForUsers($users, $accountTypes);

        $this->command->info('Creating transactions...');
        $this->createTransactions($accounts, $users);

        $this->command->info('Creating payments...');
        $this->createPayments($accounts, $users);

        $this->command->info('Creating audit logs...');
        $this->createAuditLogs($users);

        $this->command->info('Database seeded successfully!');
    }

    protected function createAccountTypes(): array
    {
        return [
            'asset' => AccountType::firstOrCreate(
                ['slug' => 'asset'],
                ['name' => 'Asset', 'nature' => 'debit', 'description' => 'Assets (debit normal)']
            ),
            'liability' => AccountType::firstOrCreate(
                ['slug' => 'liability'],
                ['name' => 'Liability', 'nature' => 'credit', 'description' => 'Liabilities (credit normal)']
            ),
            'equity' => AccountType::firstOrCreate(
                ['slug' => 'equity'],
                ['name' => 'Equity', 'nature' => 'credit', 'description' => 'Owner equity (credit normal)']
            ),
            'revenue' => AccountType::firstOrCreate(
                ['slug' => 'revenue'],
                ['name' => 'Revenue', 'nature' => 'credit', 'description' => 'Revenue accounts (credit normal)']
            ),
            'expense' => AccountType::firstOrCreate(
                ['slug' => 'expense'],
                ['name' => 'Expense', 'nature' => 'debit', 'description' => 'Expense accounts (debit normal)']
            ),
        ];
    }

    protected function createUsers($adminRole, $userRole, $auditorRole): array
    {
        $users = [];

        $admin = User::firstOrCreate(
            ['email' => 'admin@neobank.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole($adminRole);
        $users[] = $admin;

        $auditor = User::firstOrCreate(
            ['email' => 'auditor@neobank.com'],
            [
                'name' => 'Jane Auditor',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $auditor->assignRole($auditorRole);
        $users[] = $auditor;

        for ($i = 1; $i <= 10; $i++) {
            $user = User::firstOrCreate(
                ['email' => "user{$i}@example.com"],
                [
                    'name' => fake()->name(),
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole($userRole);
            $users[] = $user;
        }

        return $users;
    }

    protected function createAccountsForUsers(array $users, array $accountTypes): array
    {
        $accounts = [];

        foreach ($users as $index => $user) {
            $checkingAccount = Account::firstOrCreate(
                ['account_number' => '10000'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT)],
                [
                    'user_id' => $user->id,
                    'account_type_id' => $accountTypes['asset']->id,
                    'name' => 'Checking Account',
                    'is_active' => true,
                ]
            );

            AccountBalance::firstOrCreate(
                ['account_id' => $checkingAccount->id],
                [
                    'balance' => fake()->numberBetween(50000, 500000),
                    'available_balance' => fake()->numberBetween(50000, 500000),
                ]
            );

            $accounts[] = $checkingAccount;

            if ($index < 3) {
                $savingsAccount = Account::firstOrCreate(
                    ['account_number' => '20000'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT)],
                    [
                        'user_id' => $user->id,
                        'account_type_id' => $accountTypes['asset']->id,
                        'name' => 'Savings Account',
                        'is_active' => true,
                    ]
                );

                AccountBalance::firstOrCreate(
                    ['account_id' => $savingsAccount->id],
                    [
                        'balance' => fake()->numberBetween(100000, 1000000),
                        'available_balance' => fake()->numberBetween(100000, 1000000),
                    ]
                );

                $accounts[] = $savingsAccount;
            }
        }

        return $accounts;
    }

    protected function createTransactions(array $accounts, array $users): void
    {
        $transactionTypes = ['deposit', 'withdrawal', 'transfer', 'payment'];
        $statuses = ['completed', 'completed', 'completed', 'pending', 'failed'];

        $assetAccount = Account::firstOrCreate(
            ['account_number' => '99999999'],
            [
                'account_type_id' => AccountType::where('slug', 'asset')->first()->id,
                'name' => 'Cash Account',
                'is_system' => true,
                'is_active' => true,
            ]
        );

        AccountBalance::firstOrCreate(
            ['account_id' => $assetAccount->id],
            ['balance' => 0, 'available_balance' => 0]
        );

        $revenueAccount = Account::firstOrCreate(
            ['account_number' => '40000001'],
            [
                'account_type_id' => AccountType::where('slug', 'revenue')->first()->id,
                'name' => 'Fee Income',
                'is_system' => true,
                'is_active' => true,
            ]
        );

        AccountBalance::firstOrCreate(
            ['account_id' => $revenueAccount->id],
            ['balance' => 0, 'available_balance' => 0]
        );

        foreach (range(1, 50) as $i) {
            $user = $users[array_rand($users)];
            $account = $accounts[array_rand($accounts)];
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

            TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $account->id,
                'entry_type' => $type === 'withdrawal' ? 'debit' : 'credit',
                'amount' => $amount,
                'memo' => 'Main account entry',
            ]);

            $contraAccount = in_array($type, ['deposit', 'transfer', 'payment']) ? $assetAccount : $assetAccount;

            TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $contraAccount->id,
                'entry_type' => $type === 'withdrawal' ? 'credit' : 'debit',
                'amount' => $amount,
                'memo' => 'Contra entry',
            ]);

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
        }
    }

    protected function createPayments(array $accounts, array $users): void
    {
        $types = ['internal', 'external', 'ach'];
        $statuses = ['completed', 'completed', 'pending', 'failed'];

        foreach (range(1, 20) as $i) {
            $sender = $accounts[array_rand($accounts)];
            $receiver = $accounts[array_rand($accounts)];

            while ($sender->id === $receiver->id) {
                $receiver = $accounts[array_rand($accounts)];
            }

            $user = $users[array_rand($users)];
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
        }
    }

    protected function createAuditLogs(array $users): void
    {
        $actions = ['user.login', 'user.logout', 'transaction.create', 'transaction.update', 'account.create', 'payment.process', 'settings.update'];

        foreach (range(1, 30) as $i) {
            AuditLog::create([
                'user_id' => $users[array_rand($users)]->id,
                'action' => $actions[array_rand($actions)],
                'entity_type' => fake()->randomElement(['User', 'Transaction', 'Account', 'Payment']),
                'entity_id' => fake()->numberBetween(1, 50),
                'old_values' => null,
                'new_values' => ['test' => 'value'],
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
            ]);
        }
    }
}
