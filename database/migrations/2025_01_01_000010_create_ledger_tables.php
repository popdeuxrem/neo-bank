<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('nature')->comment('debit normal or credit normal');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable()->unique();
            $table->foreignId('account_type_id')->constrained()->onDelete('restrict');
            $table->foreignId('parent_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->string('account_number')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false)->comment('System accounts cannot be deleted');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('account_type_id');
            $table->index('is_active');
        });

        Schema::create('account_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->bigInteger('balance')->default(0)->comment('Stored as integer (cents)');
            $table->bigInteger('available_balance')->default(0)->comment('Balance minus pending holds');
            $table->timestamp('as_of_date')->useCurrent();
            $table->timestamps();

            $table->unique('account_id', 'balance_account_unique');
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable()->unique();
            $table->string('transaction_number')->unique();
            $table->string('type')->comment('deposit, withdrawal, transfer, payment, refund, fee, interest');
            $table->text('description')->nullable();
            $table->bigInteger('amount')->comment('Total amount in cents');
            $table->string('currency', 3)->default('USD');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('status')->default('pending')->comment('pending, completed, failed, reversed, flagged');
            $table->json('metadata')->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
            $table->index('transaction_number');
        });

        Schema::create('transaction_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_id')->constrained()->onDelete('restrict');
            $table->string('entry_type')->comment('debit or credit');
            $table->bigInteger('amount')->comment('Amount in cents');
            $table->text('memo')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('transaction_id');
            $table->index('account_id');
            $table->index(['transaction_id', 'account_id']);
        });

        Schema::create('transaction_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('mime_type');
            $table->bigInteger('file_size');
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_attachments');
        Schema::dropIfExists('transaction_entries');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('account_balances');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('account_types');
    }
};
