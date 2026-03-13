<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columns = DB::select('PRAGMA table_info(users)');
        $existingColumns = array_column($columns, 'name');

        Schema::table('users', function (Blueprint $table) use ($existingColumns) {
            if (! in_array('failed_login_attempts', $existingColumns)) {
                $table->integer('failed_login_attempts')->default(0)->after('password');
            }
            if (! in_array('locked_until', $existingColumns)) {
                $table->timestamp('locked_until')->nullable()->after('failed_login_attempts');
            }
            if (! in_array('last_login_at', $existingColumns)) {
                $table->timestamp('last_login_at')->nullable()->after('locked_until');
            }
            if (! in_array('last_login_ip', $existingColumns)) {
                $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            }
            if (! in_array('two_factor_enabled', $existingColumns)) {
                $table->boolean('two_factor_enabled')->default(false)->after('last_login_ip');
            }
            if (! in_array('two_factor_secret', $existingColumns)) {
                $table->text('two_factor_secret')->nullable()->after('two_factor_enabled');
            }
            if (! in_array('two_factor_recovery_codes', $existingColumns)) {
                $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'failed_login_attempts',
                'locked_until',
                'last_login_at',
                'last_login_ip',
                'two_factor_enabled',
                'two_factor_secret',
                'two_factor_recovery_codes',
            ]);
        });
    }
};
