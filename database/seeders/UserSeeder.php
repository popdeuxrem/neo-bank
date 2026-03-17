<?php

namespace Database\Seeders;

use App\Models\Banking\Wallet;
use App\Models\Rewards\UserPortfolio;
use App\Models\Rewards\UserReward;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public const ADMIN_EMAIL = 'admin@magnetiq.bank';

    public const DEMO_EMAIL = 'cody@example.com';

    public const AUDITOR_EMAIL = 'auditor@magnetiq.bank';

    public function run(): void
    {
        DB::transaction(function () {

            // ─────────────────────────────────────────────
            // SUPER ADMIN — full personal profile
            // ─────────────────────────────────────────────
            $admin = User::firstOrCreate(
                ['email' => self::ADMIN_EMAIL],
                [
                    // Identity
                    'name' => 'Maxwell Sterling',
                    'email' => self::ADMIN_EMAIL,
                    'password' => Hash::make('Admin@Magnetiq1!'),

                    // Personal
                    'phone' => '+1 (555) 000-0001',
                    'date_of_birth' => '1985-03-14',
                    'nationality' => 'US',
                    'gender' => 'male',
                    'occupation' => 'Banking Administrator',
                    'employer' => 'Magnetiq Bank N.A.',
                    'monthly_income' => 25000.00,

                    // Address
                    'address_line_1' => '1 Financial Plaza',
                    'address_line_2' => 'Suite 4200',
                    'city' => 'New York',
                    'state' => 'NY',
                    'postal_code' => '10005',
                    'country' => 'US',

                    // Account
                    'account_status' => User::STATUS_ACTIVE,
                    'kyc_status' => 'verified',
                    'email_verified_at' => now(),
                    'referral_code' => 'ADMIN001',

                    // Preferences
                    'preferred_currency' => 'USD',
                    'preferred_language' => 'en',
                    'theme_preference' => 'dark',
                    'notification_sound_enabled' => true,
                    'passcode_enabled' => false,

                    // Onboarding (admin skips tour)
                    'onboarding_completed_at' => now(),
                    'onboarding_last_step' => 12,

                    // Timestamps
                    'last_login_at' => now(),
                    'last_login_ip' => '127.0.0.1',
                ]
            );

            $admin->assignRole('admin');

            // Wallet
            Wallet::firstOrCreate(
                ['user_id' => $admin->id],
                [
                    'balance' => 1000000.00,
                    'currency' => 'USD',
                    'status' => 'active',
                ]
            );

            // Portfolio
            UserPortfolio::firstOrCreate(
                ['user_id' => $admin->id],
                [
                    'tier' => 'diamond',
                    'total_volume' => 50000000.00,
                ]
            );

            // Rewards
            UserReward::firstOrCreate(
                ['user_id' => $admin->id],
                [
                    'balance' => 50000,
                    'lifetime_earned' => 50000,
                    'lifetime_redeemed' => 0,
                ]
            );

            $this->command->info(
                "✓ Admin: {$admin->email} / Admin\@Magnetiq1!"
            );

            // ─────────────────────────────────────────────
            // DEMO USER — cody@example.com
            // ─────────────────────────────────────────────
            $demo = User::firstOrCreate(
                ['email' => self::DEMO_EMAIL],
                [
                    'name' => 'Cody Fisher',
                    'email' => self::DEMO_EMAIL,
                    'password' => Hash::make('User@Demo1234!'),
                    'phone' => '+1 (555) 010-2030',
                    'date_of_birth' => '1995-07-22',
                    'nationality' => 'US',
                    'gender' => 'male',
                    'occupation' => 'Software Engineer',
                    'employer' => 'Acme Corp',
                    'monthly_income' => 9500.00,
                    'address_line_1' => '42 Startup Lane',
                    'city' => 'San Francisco',
                    'state' => 'CA',
                    'postal_code' => '94105',
                    'country' => 'US',
                    'account_status' => User::STATUS_PENDING_KYC,
                    'kyc_status' => 'pending',
                    'email_verified_at' => now(),
                    'referral_code' => 'CODY2024',
                    'preferred_currency' => 'USD',
                    'preferred_language' => 'en',
                    'theme_preference' => 'system',
                    'onboarding_completed_at' => null,
                    'onboarding_last_step' => 0,
                    'last_login_at' => now()->subHours(2),
                ]
            );
            $demo->assignRole('user');
            Wallet::firstOrCreate(
                ['user_id' => $demo->id],
                ['balance' => 2450.00, 'currency' => 'USD', 'status' => 'active']
            );
            $this->command->info(
                "✓ Demo:  {$demo->email} / User\@Demo1234!"
            );

            // ─────────────────────────────────────────────
            // AUDITOR
            // ─────────────────────────────────────────────
            $auditor = User::firstOrCreate(
                ['email' => self::AUDITOR_EMAIL],
                [
                    'name' => 'Jane Hartwell',
                    'email' => self::AUDITOR_EMAIL,
                    'password' => Hash::make('Audit@Secure99!'),
                    'phone' => '+1 (555) 020-4050',
                    'date_of_birth' => '1988-11-03',
                    'nationality' => 'US',
                    'gender' => 'female',
                    'occupation' => 'Senior Auditor',
                    'employer' => 'Magnetiq Bank N.A.',
                    'monthly_income' => 12000.00,
                    'address_line_1' => '88 Compliance Ave',
                    'city' => 'Chicago',
                    'state' => 'IL',
                    'postal_code' => '60601',
                    'country' => 'US',
                    'account_status' => User::STATUS_ACTIVE,
                    'kyc_status' => 'verified',
                    'email_verified_at' => now(),
                    'referral_code' => 'AUDIT001',
                    'preferred_currency' => 'USD',
                    'preferred_language' => 'en',
                    'theme_preference' => 'light',
                    'onboarding_completed_at' => now(),
                    'onboarding_last_step' => 12,
                    'last_login_at' => now()->subDay(),
                ]
            );
            $auditor->assignRole('auditor');
            Wallet::firstOrCreate(
                ['user_id' => $auditor->id],
                ['balance' => 0, 'currency' => 'USD', 'status' => 'active']
            );
            $this->command->info(
                "✓ Auditor: {$auditor->email} / Audit\@Secure99!"
            );

            // ─────────────────────────────────────────────
            // 10 DEMO USERS
            // ─────────────────────────────────────────────
            $demoUsers = [
                ['name' => 'Alice Monroe',   'email' => 'alice@example.com',
                    'phone' => '+1 (555) 100-0001', 'city' => 'Austin',
                    'state' => 'TX', 'balance' => 8420.50],
                ['name' => 'Brian Okafor',   'email' => 'brian@example.com',
                    'phone' => '+1 (555) 100-0002', 'city' => 'Houston',
                    'state' => 'TX', 'balance' => 3100.00],
                ['name' => 'Clara Ndiaye',   'email' => 'clara@example.com',
                    'phone' => '+1 (555) 100-0003', 'city' => 'Atlanta',
                    'state' => 'GA', 'balance' => 15200.75],
                ['name' => 'David Chen',     'email' => 'david@example.com',
                    'phone' => '+1 (555) 100-0004', 'city' => 'Seattle',
                    'state' => 'WA', 'balance' => 42000.00],
                ['name' => 'Emma Johansson', 'email' => 'emma@example.com',
                    'phone' => '+1 (555) 100-0005', 'city' => 'Miami',
                    'state' => 'FL', 'balance' => 6750.25],
                ['name' => 'Frank Reyes',    'email' => 'frank@example.com',
                    'phone' => '+1 (555) 100-0006', 'city' => 'Phoenix',
                    'state' => 'AZ', 'balance' => 1200.00],
                ['name' => 'Grace Kim',      'email' => 'grace@example.com',
                    'phone' => '+1 (555) 100-0007', 'city' => 'Boston',
                    'state' => 'MA', 'balance' => 28900.00],
                ['name' => 'Henry Osei',     'email' => 'henry@example.com',
                    'phone' => '+1 (555) 100-0008', 'city' => 'Denver',
                    'state' => 'CO', 'balance' => 5500.00],
                ['name' => 'Isla Sharma',    'email' => 'isla@example.com',
                    'phone' => '+1 (555) 100-0009', 'city' => 'Portland',
                    'state' => 'OR', 'balance' => 11400.50],
                ['name' => 'James Wu',       'email' => 'james@example.com',
                    'phone' => '+1 (555) 100-0010', 'city' => 'Nashville',
                    'state' => 'TN', 'balance' => 7300.00],
            ];

            foreach ($demoUsers as $data) {
                $u = User::firstOrCreate(
                    ['email' => $data['email']],
                    [
                        'name' => $data['name'],
                        'password' => Hash::make('User@Pass1234!'),
                        'phone' => $data['phone'],
                        'date_of_birth' => fake()->dateOfBirthBetween(
                            '-45 years', '-22 years'
                        )->format('Y-m-d'),
                        'nationality' => 'US',
                        'occupation' => fake()->jobTitle(),
                        'monthly_income' => fake()->randomFloat(
                            2, 3000, 15000
                        ),
                        'address_line_1' => fake()->streetAddress(),
                        'city' => $data['city'],
                        'state' => $data['state'],
                        'postal_code' => fake()->postcode(),
                        'country' => 'US',
                        'account_status' => User::STATUS_ACTIVE,
                        'kyc_status' => 'verified',
                        'email_verified_at' => now(),
                        'referral_code' => strtoupper(
                            Str::random(8)
                        ),
                        'preferred_currency' => 'USD',
                        'preferred_language' => 'en',
                        'theme_preference' => 'system',
                        'onboarding_completed_at' => now(),
                        'onboarding_last_step' => 12,
                        'last_login_at' => fake()->dateTimeThisMonth(),
                    ]
                );
                $u->assignRole('user');
                Wallet::firstOrCreate(
                    ['user_id' => $u->id],
                    [
                        'balance' => $data['balance'],
                        'currency' => 'USD',
                        'status' => 'active',
                    ]
                );
                UserPortfolio::firstOrCreate(
                    ['user_id' => $u->id],
                    [
                        'tier' => fake()->randomElement([
                            'basic', 'silver', 'gold',
                        ]),
                        'total_volume' => fake()->randomFloat(
                            2, 1000, 500000
                        ),
                    ]
                );
                UserReward::firstOrCreate(
                    ['user_id' => $u->id],
                    [
                        'balance' => fake()->numberBetween(0, 5000),
                        'lifetime_earned' => fake()->numberBetween(
                            100, 10000
                        ),
                        'lifetime_redeemed' => 0,
                    ]
                );
            }

            $this->command->info('✓ 10 demo users created');
        });
    }
}
