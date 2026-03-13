<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Clear cached permissions to avoid stale data
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        DB::transaction(function () {
            $permissions = $this->createPermissions();
            $this->createRoles($permissions);
        });

        $this->command->info('Roles and permissions seeded successfully.');
    }

    /**
     * Create all permissions grouped by domain.
     *
     * @return array<string, string> Permission names keyed by name.
     */
    protected function createPermissions(): array
    {
        $permissionsByDomain = [
            'User Management' => [
                'user.view' => 'View users',
                'user.create' => 'Create users',
                'user.update' => 'Update users',
                'user.delete' => 'Delete users',
            ],
            'Account Management' => [
                'account.view' => 'View accounts',
                'account.create' => 'Create accounts',
                'account.update' => 'Update accounts',
                'account.delete' => 'Delete accounts',
                'account.freeze' => 'Freeze/unfreeze accounts',
            ],
            'Transaction Management' => [
                'transaction.view' => 'View transactions',
                'transaction.create' => 'Create transactions',
                'transaction.approve' => 'Approve transactions',
                'transaction.reverse' => 'Reverse transactions',
                'transaction.flag' => 'Flag suspicious transactions',
            ],
            'Audit & Reports' => [
                'audit.view' => 'View audit logs',
                'audit.export' => 'Export audit logs',
                'report.view' => 'View reports',
                'report.export' => 'Export reports',
            ],
            'Settings' => [
                'settings.view' => 'View settings',
                'settings.update' => 'Update settings',
            ],
        ];

        $allPermissions = [];

        foreach ($permissionsByDomain as $domain => $permissions) {
            foreach ($permissions as $name => $description) {
                Permission::firstOrCreate(
                    ['name' => $name, 'guard_name' => 'web'],
                );

                $allPermissions[$name] = $description;
            }

            $this->command->info("Created {$domain} permissions.");
        }

        return $allPermissions;
    }

    /**
     * Create roles and assign their permissions.
     *
     * @param  array<string, string>  $allPermissions
     */
    protected function createRoles(array $allPermissions): void
    {
        $roleDefinitions = [
            'admin' => array_keys($allPermissions),
            'user' => [
                'account.view',
                'transaction.view',
                'transaction.create',
                'report.view',
            ],
            'auditor' => [
                'account.view',
                'transaction.view',
                'audit.view',
                'audit.export',
                'report.view',
                'report.export',
            ],
        ];

        foreach ($roleDefinitions as $roleName => $permissions) {
            $role = Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => 'web'],
            );

            $role->syncPermissions($permissions);

            $count = count($permissions);
            $this->command->info("Role '{$roleName}' synced with {$count} permissions.");
        }
    }
}
