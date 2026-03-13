<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_id')->nullable()->constrained()->onDelete('set null');
            $table->string('card_number_encrypted');
            $table->string('cvv_encrypted');
            $table->string('expiry_month');
            $table->string('expiry_year');
            $table->string('pin_hash');
            $table->string('cardholder_name');
            $table->enum('status', ['active', 'frozen', 'cancelled'])->default('active');
            $table->string('type')->default('virtual')->comment('virtual, physical');
            $table->string('brand')->default('Visa')->comment('Visa, Mastercard, etc');
            $table->string('last_four', 4);
            $table->timestamp('frozen_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
        });

        Schema::create('card_reveal_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained()->onDelete('cascade');
            $table->string('token')->unique();
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();

            $table->index('token');
            $table->index('card_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_reveal_tokens');
        Schema::dropIfExists('cards');
    }
};
