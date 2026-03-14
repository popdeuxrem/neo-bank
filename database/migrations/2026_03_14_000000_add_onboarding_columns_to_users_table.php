<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('onboarding_completed_at')->nullable()->after('account_status');
            $table->timestamp('onboarding_started_at')->nullable()->after('onboarding_completed_at');
            $table->integer('onboarding_last_step')->default(0)->after('onboarding_started_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'onboarding_completed_at',
                'onboarding_started_at',
                'onboarding_last_step',
            ]);
        });
    }
};
