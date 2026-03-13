<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Order matters: roles/permissions must exist before users,
     * and users must exist before ledger accounts are linked.
     */
    public function run(): void
    {
        $this->command->info('');
        $this->command->info('╔══════════════════════════════════════╗');
        $this->command->info('║    Magnetiq Neo-Bank — DB Seeder    ║');
        $this->command->info('╚══════════════════════════════════════╝');
        $this->command->info('');

        $this->call([
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
            LedgerSeeder::class,
        ]);

        $this->command->info('');
        $this->command->info('✓ Database seeded successfully.');
    }
}
