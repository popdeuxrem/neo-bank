<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // User Management
            'user.view' => 'View users',
            'user.create' => 'Create users',
            'user.update' => 'Update users',
            'user.delete' => 'Delete users',

            // Account Management
            'account.view' => 'View accounts',
            'account.create' => 'Create accounts',
            'account.update' => 'Update accounts',
            'account.delete' => 'Delete accounts',
            'account.freeze' => 'Freeze/unfreeze accounts',

            // Transaction Management
            'transaction.view' => 'View transactions',
            'transaction.create' => 'Create transactions',
            'transaction.approve' => 'Approve transactions',
            'transaction.reverse' => 'Reverse transactions',
            'transaction.flag' => 'Flag suspicious transactions',

            // Audit & Reports
            'audit.view' => 'View audit logs',
            'audit.export' => 'Export audit logs',
            'report.view' => 'View reports',
            'report.export' => 'Export reports',

            // Settings
            'settings.view' => 'View settings',
            'settings.update' => 'Update settings',
        ];

        foreach ($permissions as $name => $description) {
            $group = explode('.', $name)[0];
            Permission::firstOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                ['description' => $description, 'group' => $group]
            );
        }

        $roles = [
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
            'admin' => array_keys($permissions),
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => 'web']
            );
            $role->syncPermissions($rolePermissions);
        }

        $this->command->info('Roles and permissions seeded successfully.');
    }
}
