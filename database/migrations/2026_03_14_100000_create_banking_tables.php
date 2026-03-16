<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Wallets
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('balance', 20, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->string('status', 20)->default('active');
            $table->timestamps();
            $table->unique(['user_id', 'currency']);
        });

        // Wire Transfers
        Schema::create('wire_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->string('recipient_name');
            $table->text('recipient_address')->nullable();
            $table->string('bank_name');
            $table->string('bank_country', 2);
            $table->string('swift_bic', 11)->nullable();
            $table->string('iban', 50)->nullable();
            $table->string('account_number', 50)->nullable();
            $table->decimal('amount', 20, 2);
            $table->string('currency', 3)->default('USD');
            $table->decimal('fee', 10, 2)->default(0);
            $table->text('purpose')->nullable();
            $table->string('status', 20)->default('pending');
            $table->string('tracking_number', 50)->nullable();
            $table->timestamps();
        });

        // Scheduled Payments
        Schema::create('scheduled_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->string('recipient_name');
            $table->string('account_number', 50);
            $table->string('routing_number', 20)->nullable();
            $table->decimal('amount', 20, 2);
            $table->string('currency', 3)->default('USD');
            $table->text('memo')->nullable();
            $table->enum('frequency', ['once', 'daily', 'weekly', 'biweekly', 'monthly']);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->dateTime('next_run_at')->nullable();
            $table->dateTime('last_run_at')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // DPS Plans
        Schema::create('dps_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('interest_rate', 5, 2);
            $table->decimal('min_amount', 20, 2);
            $table->decimal('max_amount', 20, 2);
            $table->integer('duration_months');
            $table->text('description')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // DPS Subscriptions
        Schema::create('dps_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('dps_plans')->onDelete('cascade');
            $table->foreignId('account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->decimal('monthly_amount', 20, 2);
            $table->date('start_date');
            $table->date('maturity_date');
            $table->decimal('total_deposited', 20, 2)->default(0);
            $table->decimal('interest_earned', 20, 2)->default(0);
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // DPS Installments
        Schema::create('dps_installments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained('dps_subscriptions')->onDelete('cascade');
            $table->integer('installment_number');
            $table->date('due_date');
            $table->decimal('amount', 20, 2);
            $table->dateTime('paid_at')->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestamps();
        });

        // FDR Plans
        Schema::create('fdr_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('interest_rate', 5, 2);
            $table->decimal('min_amount', 20, 2);
            $table->decimal('max_amount', 20, 2);
            $table->json('duration_options');
            $table->string('compounding_frequency', 20)->default('monthly');
            $table->decimal('early_withdrawal_penalty', 5, 2)->default(0);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // FDR Subscriptions
        Schema::create('fdr_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('fdr_plans')->onDelete('cascade');
            $table->foreignId('account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->decimal('principal', 20, 2);
            $table->decimal('interest_rate', 5, 2);
            $table->integer('duration_months');
            $table->string('compounding_frequency', 20)->default('monthly');
            $table->date('start_date');
            $table->date('maturity_date');
            $table->decimal('current_value', 20, 2)->default(0);
            $table->decimal('interest_earned', 20, 2)->default(0);
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // Loan Plans
        Schema::create('loan_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('interest_rate', 5, 2);
            $table->decimal('min_amount', 20, 2);
            $table->decimal('max_amount', 20, 2);
            $table->json('duration_options');
            $table->decimal('processing_fee', 5, 2)->default(0);
            $table->decimal('late_payment_fee', 10, 2)->default(0);
            $table->boolean('kyc_required')->default(true);
            $table->boolean('collateral_required')->default(false);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // Loans
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('loan_plans')->onDelete('cascade');
            $table->foreignId('account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->decimal('amount', 20, 2);
            $table->decimal('interest_rate', 5, 2);
            $table->integer('duration_months');
            $table->decimal('emi_amount', 20, 2);
            $table->decimal('total_payable', 20, 2);
            $table->decimal('total_paid', 20, 2)->default(0);
            $table->text('purpose')->nullable();
            $table->string('employment_type', 50)->nullable();
            $table->decimal('monthly_income', 20, 2)->nullable();
            $table->string('status', 20)->default('pending');
            $table->dateTime('disbursed_at')->nullable();
            $table->timestamps();
        });

        // Loan EMIs
        Schema::create('loan_emis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained('loans')->onDelete('cascade');
            $table->integer('month');
            $table->date('due_date');
            $table->decimal('emi_amount', 20, 2);
            $table->decimal('principal_amount', 20, 2);
            $table->decimal('interest_amount', 20, 2);
            $table->decimal('late_fee', 10, 2)->default(0);
            $table->dateTime('paid_at')->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestamps();
        });

        // Virtual Cards
        Schema::create('virtual_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('card_number_encrypted');
            $table->string('last_four', 4);
            $table->string('cardholder_name');
            $table->string('expiry_month', 2);
            $table->string('expiry_year', 4);
            $table->string('cvv_encrypted')->nullable();
            $table->string('network', 20)->default('visa');
            $table->string('type', 20)->default('virtual');
            $table->string('status', 20)->default('active');
            $table->boolean('frozen')->default(false);
            $table->decimal('daily_limit', 20, 2)->default(1000);
            $table->decimal('monthly_limit', 20, 2)->default(10000);
            $table->json('merchant_controls')->nullable();
            $table->decimal('balance', 20, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->timestamps();
        });

        // Bill Categories
        Schema::create('bill_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon', 50)->nullable();
            $table->string('color', 7)->nullable();
            $table->integer('order')->default(0);
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // Bill Providers
        Schema::create('bill_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('bill_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('logo', 255)->nullable();
            $table->string('country', 2)->default('US');
            $table->string('api_type', 50)->nullable();
            $table->json('fee_structure')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // Bill Payments
        Schema::create('bill_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('provider_id')->constrained('bill_providers')->onDelete('cascade');
            $table->foreignId('account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->string('bill_number', 50)->nullable();
            $table->decimal('amount', 20, 2);
            $table->decimal('fee', 10, 2)->default(0);
            $table->string('status', 20)->default('pending');
            $table->string('reference', 50)->nullable();
            $table->timestamps();
        });

        // Money Requests
        Schema::create('money_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('requestee_email')->nullable();
            $table->foreignId('requestee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('amount', 20, 2);
            $table->string('currency', 3)->default('USD');
            $table->text('note')->nullable();
            $table->string('status', 20)->default('pending');
            $table->dateTime('expires_at');
            $table->timestamps();
        });

        // User Portfolios
        Schema::create('user_portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->unique();
            $table->string('tier', 20)->default('basic');
            $table->decimal('total_volume', 20, 2)->default(0);
            $table->integer('join_points')->default(0);
            $table->timestamps();
        });

        // Badges
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('icon', 50)->nullable();
            $table->json('criteria')->nullable();
            $table->timestamps();
        });

        // User Badges
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('badge_id')->constrained('badges')->onDelete('cascade');
            $table->dateTime('earned_at');
            $table->timestamps();
            $table->unique(['user_id', 'badge_id']);
        });

        // User Rewards
        Schema::create('user_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->unique();
            $table->integer('balance')->default(0);
            $table->integer('lifetime_earned')->default(0);
            $table->integer('lifetime_redeemed')->default(0);
            $table->timestamps();
        });

        // Reward Transactions
        Schema::create('reward_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('points');
            $table->string('type', 20);
            $table->string('reason', 100)->nullable();
            $table->decimal('reference_amount', 20, 2)->nullable();
            $table->decimal('cash_value', 20, 2)->nullable();
            $table->timestamps();
        });

        // Reward Settings
        Schema::create('reward_settings', function (Blueprint $table) {
            $table->id();
            $table->string('type', 50)->unique();
            $table->integer('points')->default(0);
            $table->string('calculation_type', 20)->default('fixed');
            $table->integer('per_amount_unit')->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->boolean('enabled')->default(true);
            $table->timestamps();
        });

        // Referral Commissions
        Schema::create('referral_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('referred_id')->constrained('users')->onDelete('cascade');
            $table->integer('level');
            $table->decimal('rate', 5, 2);
            $table->decimal('amount', 20, 2)->nullable();
            $table->decimal('transaction_amount', 20, 2)->nullable();
            $table->string('type', 50)->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestamps();
        });

        // Saved Recipients
        Schema::create('saved_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('account_number', 50);
            $table->string('routing_number', 20)->nullable();
            $table->string('bank_name')->nullable();
            $table->string('type', 20)->default('local');
            $table->string('country', 2)->nullable();
            $table->string('swift', 11)->nullable();
            $table->string('iban', 50)->nullable();
            $table->timestamps();
        });

        // Deposits
        Schema::create('deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('method_id')->nullable()->constrained('deposit_methods')->onDelete('set null');
            $table->decimal('amount', 20, 2);
            $table->string('currency', 3)->default('USD');
            $table->decimal('fee', 10, 2)->default(0);
            $table->string('status', 20)->default('pending');
            $table->string('proof_path', 255)->nullable();
            $table->string('reference', 50)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Withdrawals
        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('method_id')->nullable()->constrained('withdrawal_methods')->onDelete('set null');
            $table->decimal('amount', 20, 2);
            $table->string('currency', 3)->default('USD');
            $table->decimal('fee', 10, 2)->default(0);
            $table->decimal('net_amount', 20, 2);
            $table->json('account_details');
            $table->string('status', 20)->default('pending');
            $table->text('failure_reason')->nullable();
            $table->timestamps();
        });

        // Deposit Methods
        Schema::create('deposit_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type', 20);
            $table->json('currencies');
            $table->decimal('min_amount', 20, 2);
            $table->decimal('max_amount', 20, 2);
            $table->json('fee_structure')->nullable();
            $table->string('processing_time')->nullable();
            $table->text('instructions')->nullable();
            $table->string('icon', 50)->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // Withdrawal Methods
        Schema::create('withdrawal_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type', 20);
            $table->json('currencies');
            $table->decimal('min_amount', 20, 2);
            $table->decimal('max_amount', 20, 2);
            $table->json('fee_structure')->nullable();
            $table->string('processing_time')->nullable();
            $table->json('required_fields')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
        });

        // Support Tickets
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('subject');
            $table->foreignId('category_id')->nullable()->constrained('ticket_categories')->onDelete('set null');
            $table->string('priority', 20)->default('medium');
            $table->string('status', 20)->default('open');
            $table->timestamps();
        });

        // Ticket Messages
        Schema::create('ticket_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('support_tickets')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('message');
            $table->json('attachments')->nullable();
            $table->boolean('is_admin')->default(false);
            $table->timestamps();
        });

        // Ticket Categories
        Schema::create('ticket_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('color', 7)->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Budgets
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('category', 50);
            $table->decimal('amount', 20, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('period', 20)->default('monthly');
            $table->timestamps();
        });

        // Account Statements
        Schema::create('account_statements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->date('period_start');
            $table->date('period_end');
            $table->string('file_path', 255);
            $table->string('format', 10)->default('pdf');
            $table->timestamps();
        });

        // Login History
        Schema::create('login_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('location', 100)->nullable();
            $table->boolean('success')->default(true);
            $table->timestamps();
        });

        // Scheduled Notifications
        Schema::create('scheduled_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type', 50);
            $table->json('channels');
            $table->text('message');
            $table->dateTime('scheduled_at');
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
        });

        // Update ledger_transactions table if needed
        Schema::table('transactions', function (Blueprint $table) {
            if (! Schema::hasColumn('ledger_transactions', 'category')) {
                $table->string('category', 50)->nullable()->after('description');
            }
            if (! Schema::hasColumn('ledger_transactions', 'reference')) {
                $table->string('reference', 50)->nullable()->after('category');
            }
            if (! Schema::hasColumn('ledger_transactions', 'flagged')) {
                $table->boolean('flagged')->default(false)->after('reference');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheduled_notifications');
        Schema::dropIfExists('login_history');
        Schema::dropIfExists('account_statements');
        Schema::dropIfExists('budgets');
        Schema::dropIfExists('ticket_categories');
        Schema::dropIfExists('ticket_messages');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('withdrawal_methods');
        Schema::dropIfExists('deposit_methods');
        Schema::dropIfExists('withdrawals');
        Schema::dropIfExists('deposits');
        Schema::dropIfExists('saved_recipients');
        Schema::dropIfExists('referral_commissions');
        Schema::dropIfExists('reward_settings');
        Schema::dropIfExists('reward_transactions');
        Schema::dropIfExists('user_rewards');
        Schema::dropIfExists('user_badges');
        Schema::dropIfExists('badges');
        Schema::dropIfExists('user_portfolios');
        Schema::dropIfExists('money_requests');
        Schema::dropIfExists('bill_payments');
        Schema::dropIfExists('bill_providers');
        Schema::dropIfExists('bill_categories');
        Schema::dropIfExists('virtual_cards');
        Schema::dropIfExists('loan_emis');
        Schema::dropIfExists('loans');
        Schema::dropIfExists('loan_plans');
        Schema::dropIfExists('fdr_subscriptions');
        Schema::dropIfExists('fdr_plans');
        Schema::dropIfExists('dps_installments');
        Schema::dropIfExists('dps_subscriptions');
        Schema::dropIfExists('dps_plans');
        Schema::dropIfExists('scheduled_payments');
        Schema::dropIfExists('wire_transfers');
        Schema::dropIfExists('wallets');
    }
};
