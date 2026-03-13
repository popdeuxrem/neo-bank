<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public const ADMIN_EMAIL = 'admin@magnetiq.bank';

    public const DEMO_EMAIL = 'cody@example.com';

    public function run(): void
    {
        DB::transaction(function () {
            $adminCount = 0;
            $auditorCount = 0;
            $demoCount = 0;

            // Super Admin
            $admin = User::firstOrCreate(
                ['email' => self::ADMIN_EMAIL],
                [
                    'name' => 'Magnetiq Admin',
                    'password' => Hash::make('SecurePassword123!'),
                    'email_verified_at' => now(),
                    'account_status' => User::STATUS_ACTIVE,
                ]
            );
            $admin->assignRole('admin');
            $adminCount++;

            // Demo User
            $demo = User::firstOrCreate(
                ['email' => self::DEMO_EMAIL],
                [
                    'name' => 'Cody Fisher',
                    'password' => Hash::make('UserPassword123!'),
                    'email_verified_at' => now(),
                    'account_status' => User::STATUS_PENDING_KYC,
                ]
            );
            $demo->assignRole('user');
            $demoCount++;

            // Auditor
            $auditor = User::firstOrCreate(
                ['email' => 'auditor@magnetiq.bank'],
                [
                    'name' => 'Jane Auditor',
                    'password' => Hash::make('AuditorPassword123!'),
                    'email_verified_at' => now(),
                    'account_status' => User::STATUS_ACTIVE,
                ]
            );
            $auditor->assignRole('auditor');
            $auditorCount++;

            // Additional demo users
            for ($i = 1; $i <= 10; $i++) {
                $user = User::firstOrCreate(
                    ['email' => "user{$i}@example.com"],
                    [
                        'name' => fake()->name(),
                        'password' => Hash::make('Password123!'),
                        'email_verified_at' => now(),
                        'account_status' => User::STATUS_ACTIVE,
                    ]
                );
                $user->assignRole('user');
                $demoCount++;
            }

            $total = $adminCount + $auditorCount + $demoCount;

            $this->command->info("✓ Created {$total} users (admin: {$adminCount}, auditor: {$auditorCount}, demo: {$demoCount})");
        });
    }
}
