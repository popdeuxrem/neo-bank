<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('accounts', 'user_id')) {
            Schema::table('accounts', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null')->after('id');
                $table->index('user_id');
            });
        }

        if (! Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->string('reference')->unique();
                $table->foreignId('sender_account_id')->constrained('accounts')->onDelete('restrict');
                $table->foreignId('receiver_account_id')->constrained('accounts')->onDelete('restrict');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->bigInteger('amount');
                $table->string('currency', 3)->default('USD');
                $table->string('type')->comment('internal, external, wire, ach');
                $table->string('status')->default('pending');
                $table->text('description')->nullable();
                $table->json('metadata')->nullable();
                $table->timestamp('processed_at')->nullable();
                $table->timestamps();

                $table->index('status');
                $table->index('user_id');
            });
        }

        if (! Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
                $table->string('action');
                $table->string('entity_type')->nullable();
                $table->unsignedBigInteger('entity_id')->nullable();
                $table->json('old_values')->nullable();
                $table->json('new_values')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamps();

                $table->index('user_id');
                $table->index('action');
                $table->index(['entity_type', 'entity_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('payments');
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
