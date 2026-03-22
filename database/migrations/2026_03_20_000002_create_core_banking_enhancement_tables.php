<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Phase 2: Core Banking & Ledger Engine Enhancements
     * - Wallet types (Main, Portfolio Earnings)
     * - Internal Fund Transfers
     * - Swift/WIRE transfers enhancement
     * - FDR with compounding logic
     * - DPS (Deposit Pension Scheme)
     * - Loan origination and management
     * - Bill Payments
     * - Bank and User Profits
     */
    public function up(): void
    {
        // Wallet Types - Define different wallet categories
        Schema::create('wallet_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('category')->default('user')->comment('user, system, reserve, profit');
            $table->boolean('allows_interest')->default(false);
            $table->decimal('interest_rate', 5, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false);
            $table->timestamps();

            $table->index('category');
            $table->index('is_active');
        });

        // Update wallets table to reference wallet types
        Schema::table('wallets', function (Blueprint $table) {
            $table->foreignId('wallet_type_id')->nullable()->after('user_id')->constrained('wallet_types')->onDelete('restrict');
            $table->string('wallet_name')->nullable()->after('wallet_type_id');
            $table->bigInteger('hold_balance')->default(0)->after('balance')->comment('Funds on hold/pending');
            $table->bigInteger('available_balance')->default(0)->after('hold_balance');
            $table->timestamp('last_transaction_at')->nullable();
        });

        // Internal Fund Transfers - User-to-user transfers within the platform
        Schema::create('internal_transfers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('reference_number')->unique();
            $table->foreignId('sender_user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('sender_wallet_id')->constrained('wallets')->onDelete('restrict');
            $table->foreignId('recipient_user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('recipient_wallet_id')->constrained('wallets')->onDelete('restrict');
            $table->bigInteger('amount');
            $table->string('currency', 3)->default('USD');
            $table->bigInteger('fee')->default(0);
            $table->text('description')->nullable();
            $table->string('status')->default('pending')->comment('pending, processing, completed, failed, reversed');
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null');
            $table->timestamp('completed_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['sender_user_id', 'status']);
            $table->index(['recipient_user_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index('reference_number');
        });

        // Swift Transfers Enhancement - International wire transfers
        Schema::create('swift_transfers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('reference_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->foreignId('wallet_id')->constrained('wallets')->onDelete('restrict');
            $table->string('recipient_name');
            $table->string('recipient_address')->nullable();
            $table->string('recipient_country');
            $table->string('recipient_email')->nullable();
            $table->string('recipient_phone')->nullable();
            $table->string('bank_name');
            $table->string('bank_address')->nullable();
            $table->string('bank_country');
            $table->string('swift_bic');
            $table->string('iban')->nullable();
            $table->string('account_number')->nullable();
            $table->string('intermediary_bank')->nullable();
            $table->string('intermediary_swift')->nullable();
            $table->bigInteger('amount');
            $table->string('currency', 3)->default('USD');
            $table->bigInteger('fee')->default(0);
            $table->decimal('exchange_rate', 15, 8)->nullable();
            $table->string('purpose')->nullable();
            $table->text('purpose_details')->nullable();
            $table->string('status')->default('pending')->comment('pending, processing, completed, failed, reversed, on_hold');
            $table->string('swift_status')->nullable()->comment('SWIFT network status codes');
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null');
            $table->timestamp('submitted_at');
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->json('tracking_info')->nullable();
            $table->json('compliance_checks')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index('swift_bic');
            $table->index('reference_number');
        });

        // FDR Plans Enhancement - Fixed Deposit Receipt plans
        Schema::table('fdr_plans', function (Blueprint $table) {
            $table->string('tenure_type')->default('monthly')->after('duration_options')->comment('monthly, quarterly, yearly');
            $table->integer('min_tenure')->default(1)->comment('Minimum tenure in tenure_type units');
            $table->integer('max_tenure')->default(60)->comment('Maximum tenure in tenure_type units');
            $table->string('compounding_frequency')->default('annually')->comment('monthly, quarterly, semi_annually, annually, at_maturity');
            $table->decimal('premature_withdrawal_penalty_rate', 5, 2)->default(0)->comment('Percentage penalty for early withdrawal');
            $table->bigInteger('premature_withdrawal_min_amount')->default(0);
            $table->boolean('auto_renewal')->default(false);
            $table->string('auto_renewal_type')->nullable()->comment('principal_only, principal_and_interest');
            $table->boolean('is_tax_applicable')->default(false);
            $table->decimal('tax_rate', 5, 2)->nullable();
            $table->bigInteger('processing_fee')->default(0);
            $table->text('terms_and_conditions')->nullable();
        });

        // FDR Subscriptions Enhancement
        Schema::table('fdr_subscriptions', function (Blueprint $table) {
            $table->foreignId('wallet_id')->nullable()->after('account_id')->constrained('wallets')->onDelete('set null');
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null');
            $table->integer('tenure_months')->after('duration_months');
            $table->string('compounding_frequency')->after('compounding_frequency');
            $table->bigInteger('maturity_amount')->nullable();
            $table->bigInteger('total_interest_earned')->default(0);
            $table->date('last_compounded_at')->nullable();
            $table->date('next_compounding_at')->nullable();
            $table->boolean('auto_renewal')->default(false);
            $table->string('renewal_status')->nullable()->comment('renewed, withdrawn, lapsed');
            $table->bigInteger('tax_deducted')->default(0);
            $table->text('closure_reason')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->json('interest_schedule')->nullable();
        });

        // FDR Interest History - Track compounding events
        Schema::create('fdr_interest_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained('fdr_subscriptions')->onDelete('cascade');
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null');
            $table->date('compounding_date');
            $table->bigInteger('principal_before');
            $table->bigInteger('interest_amount');
            $table->bigInteger('tax_amount')->default(0);
            $table->bigInteger('principal_after');
            $table->decimal('interest_rate', 5, 2);
            $table->timestamps();

            $table->index(['subscription_id', 'compounding_date']);
        });

        // DPS Plans Enhancement - Deposit Pension Scheme plans
        Schema::table('dps_plans', function (Blueprint $table) {
            $table->string('installment_frequency')->default('monthly')->after('duration_months')->comment('weekly, monthly, quarterly');
            $table->integer('min_installments')->default(12);
            $table->integer('max_installments')->default(120);
            $table->bigInteger('min_monthly_amount')->default(0);
            $table->bigInteger('max_monthly_amount')->default(0);
            $table->decimal('late_payment_penalty_rate', 5, 2)->default(0);
            $table->bigInteger('late_payment_min_fee')->default(0);
            $table->boolean('allow_prepayment')->default(false);
            $table->boolean('auto_deduct')->default(false);
            $table->bigInteger('processing_fee')->default(0);
            $table->text('terms_and_conditions')->nullable();
        });

        // DPS Subscriptions Enhancement
        Schema::table('dps_subscriptions', function (Blueprint $table) {
            $table->foreignId('wallet_id')->nullable()->after('account_id')->constrained('wallets')->onDelete('set null');
            $table->integer('total_installments')->after('plan_id');
            $table->integer('paid_installments')->default(0);
            $table->bigInteger('total_paid')->default(0);
            $table->bigInteger('projected_amount')->nullable();
            $table->bigInteger('maturity_amount')->nullable();
            $table->bigInteger('penalty_amount')->default(0);
            $table->string('payment_status')->default('active')->comment('active, defaulted, closed, matured');
            $table->date('last_payment_date')->nullable();
            $table->date('next_payment_date')->nullable();
            $table->text('closure_reason')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->json('payment_schedule')->nullable();
        });

        // Loan Plans Enhancement
        Schema::table('loan_plans', function (Blueprint $table) {
            $table->string('loan_type')->default('personal')->after('name')->comment('personal, business, home, auto, education');
            $table->string('interest_calculation_method')->default('reducing_balance')->comment('flat_rate, reducing_balance, simple_interest');
            $table->decimal('min_interest_rate', 5, 2)->nullable();
            $table->decimal('max_interest_rate', 5, 2)->nullable();
            $table->integer('min_duration_months')->default(3);
            $table->integer('max_duration_months')->default(60);
            $table->string('duration_step')->default('monthly')->comment('monthly, quarterly, yearly');
            $table->decimal('processing_fee_rate', 5, 2)->default(0);
            $table->bigInteger('processing_fee_fixed')->default(0);
            $table->decimal('late_payment_penalty_rate', 5, 2)->default(0);
            $table->bigInteger('late_payment_min_fee')->default(0);
            $table->bigInteger('min_income_requirement')->nullable();
            $table->integer('min_credit_score')->nullable();
            $table->boolean('requires_guarantor')->default(false);
            $table->text('eligibility_criteria')->nullable();
            $table->text('required_documents')->nullable();
            $table->text('terms_and_conditions')->nullable();
        });

        // Loans Enhancement
        Schema::table('loans', function (Blueprint $table) {
            $table->foreignId('wallet_id')->nullable()->after('account_id')->constrained('wallets')->onDelete('set null');
            $table->foreignId('application_id')->nullable()->after('plan_id');
            $table->string('loan_number')->unique()->after('id');
            $table->string('interest_calculation_method')->nullable();
            $table->bigInteger('processing_fee')->default(0);
            $table->bigInteger('total_interest')->default(0);
            $table->bigInteger('total_amount')->default(0);
            $table->bigInteger('remaining_amount')->default(0);
            $table->bigInteger('penalty_amount')->default(0);
            $table->date('first_emi_date')->nullable();
            $table->date('last_emi_date')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('rejected_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('rejected_at')->nullable();
            $table->foreignId('disbursed_by')->nullable()->constrained('users')->onDelete('set null');
        });

        // Loan Applications - Separate table for loan applications
        Schema::create('loan_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('loan_plans')->onDelete('restrict');
            $table->bigInteger('requested_amount');
            $table->integer('requested_duration_months');
            $table->decimal('offered_interest_rate', 5, 2)->nullable();
            $table->bigInteger('offered_amount')->nullable();
            $table->integer('offered_duration_months')->nullable();
            $table->bigInteger('offered_emi')->nullable();
            $table->text('purpose');
            $table->string('employment_type')->comment('salaried, self_employed, business, unemployed');
            $table->bigInteger('monthly_income');
            $table->bigInteger('existing_emi_obligations')->default(0);
            $table->json('employer_details')->nullable();
            $table->json('bank_details')->nullable();
            $table->json('documents')->nullable();
            $table->json('guarantor_details')->nullable();
            $table->string('status')->default('submitted')->comment('submitted, under_review, documents_pending, approved, rejected');
            $table->integer('credit_score')->nullable();
            $table->text('review_notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
        });

        // Loan Guarantors
        Schema::create('loan_guarantors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('relationship');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('address');
            $table->string('occupation')->nullable();
            $table->bigInteger('monthly_income')->nullable();
            $table->json('documents')->nullable();
            $table->timestamps();

            $table->index('loan_id');
        });

        // Loan Collateral
        Schema::create('loan_collaterals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->string('collateral_type')->comment('property, vehicle, fd, gold, other');
            $table->text('description');
            $table->bigInteger('estimated_value');
            $table->json('documents')->nullable();
            $table->string('status')->default('pledged')->comment('pledged, released, liquidated');
            $table->timestamp('released_at')->nullable();
            $table->timestamps();

            $table->index('loan_id');
        });

        // Bill Categories Enhancement
        Schema::table('bill_categories', function (Blueprint $table) {
            $table->string('code')->unique()->after('name');
            $table->text('description')->nullable();
            $table->string('api_provider')->nullable()->comment('Third-party API provider');
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->integer('display_order')->default(0);
        });

        // Bill Providers Enhancement
        Schema::table('bill_providers', function (Blueprint $table) {
            $table->string('code')->after('category_id');
            $table->string('country', 2)->after('name');
            $table->string('service_type')->default('api')->comment('api, manual, hybrid');
            $table->json('api_configuration')->nullable();
            $table->string('api_endpoint')->nullable();
            $table->bigInteger('min_amount')->default(0);
            $table->bigInteger('max_amount')->default(0);
            $table->bigInteger('fixed_fee')->default(0);
            $table->decimal('percentage_fee', 5, 2)->default(0);
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->integer('processing_time_minutes')->nullable();
            $table->boolean('requires_reference')->default(true);
            $table->boolean('supports_validation')->default(false);
            $table->integer('display_order')->default(0);

            $table->unique(['category_id', 'code']);
        });

        // Bill Payments Enhancement
        Schema::table('bill_payments', function (Blueprint $table) {
            $table->foreignId('wallet_id')->nullable()->after('account_id')->constrained('wallets')->onDelete('set null');
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null');
            $table->string('customer_reference')->after('bill_number');
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->string('bill_period')->nullable();
            $table->date('bill_due_date')->nullable();
            $table->bigInteger('bill_amount')->nullable();
            $table->bigInteger('convenience_fee')->default(0);
            $table->bigInteger('total_amount');
            $table->string('payment_method')->default('wallet');
            $table->string('external_transaction_id')->nullable();
            $table->string('external_status')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->json('api_response')->nullable();
        });

        // Bank Profits - Track bank earnings
        Schema::create('bank_profits', function (Blueprint $table) {
            $table->id();
            $table->string('profit_type')->comment('interest_spread, fees, commissions, penalties, other');
            $table->string('source_type')->comment('loan, fdr, dps, transfer, bill, other');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->bigInteger('amount');
            $table->string('currency', 3)->default('USD');
            $table->date('profit_date');
            $table->string('period')->nullable()->comment('daily, weekly, monthly, yearly');
            $table->text('description')->nullable();
            $table->json('breakdown')->nullable();
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null');
            $table->timestamps();

            $table->index(['profit_type', 'profit_date']);
            $table->index(['source_type', 'source_id']);
            $table->index('profit_date');
        });

        // User Earnings/Profits - Track user earnings from investments
        Schema::create('user_earnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('wallet_id')->constrained('wallets')->onDelete('cascade');
            $table->string('earning_type')->comment('fdr_interest, dps_interest, referral_bonus, cashback, reward, other');
            $table->string('source_type')->comment('fdr, dps, referral, promotion, other');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->bigInteger('amount');
            $table->string('currency', 3)->default('USD');
            $table->date('earning_date');
            $table->string('status')->default('credited')->comment('pending, credited, reversed');
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('set null');
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'earning_type']);
            $table->index(['user_id', 'earning_date']);
            $table->index(['source_type', 'source_id']);
        });

        // Bank Accounts - Bank's own accounting
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_code')->unique();
            $table->string('account_name');
            $table->string('account_type')->comment('asset, liability, equity, revenue, expense');
            $table->string('category')->comment('cash, reserve, receivable, payable, equity, income, expense');
            $table->bigInteger('opening_balance')->default(0);
            $table->bigInteger('current_balance')->default(0);
            $table->string('currency', 3)->default('USD');
            $table->foreignId('ledger_account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('account_type');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
        Schema::dropIfExists('user_earnings');
        Schema::dropIfExists('bank_profits');
        Schema::dropIfExists('loan_collaterals');
        Schema::dropIfExists('loan_guarantors');
        Schema::dropIfExists('loan_applications');
        Schema::dropIfExists('fdr_interest_history');
        Schema::dropIfExists('swift_transfers');
        Schema::dropIfExists('internal_transfers');
        Schema::dropIfExists('wallet_types');

        // Drop columns added to existing tables
        Schema::table('bill_payments', function (Blueprint $table) {
            $table->dropForeign(['wallet_id']);
            $table->dropForeign(['transaction_id']);
            $table->dropColumn([
                'wallet_id', 'transaction_id', 'customer_reference', 'customer_name',
                'customer_phone', 'bill_period', 'bill_due_date', 'bill_amount',
                'convenience_fee', 'total_amount', 'payment_method',
                'external_transaction_id', 'external_status', 'processed_at', 'completed_at', 'api_response'
            ]);
        });

        Schema::table('bill_providers', function (Blueprint $table) {
            $table->dropUnique(['category_id', 'code']);
            $table->dropColumn([
                'code', 'country', 'service_type', 'api_configuration', 'api_endpoint',
                'min_amount', 'max_amount', 'fixed_fee', 'percentage_fee', 'commission_rate',
                'processing_time_minutes', 'requires_reference', 'supports_validation', 'display_order'
            ]);
        });

        Schema::table('bill_categories', function (Blueprint $table) {
            $table->dropUnique(['code']);
            $table->dropColumn(['code', 'description', 'api_provider', 'commission_rate', 'display_order']);
        });

        Schema::table('loans', function (Blueprint $table) {
            $table->dropForeign(['wallet_id']);
            $table->dropForeign(['approved_by']);
            $table->dropForeign(['rejected_by']);
            $table->dropForeign(['disbursed_by']);
            $table->dropColumn([
                'wallet_id', 'application_id', 'loan_number', 'interest_calculation_method',
                'processing_fee', 'total_interest', 'total_amount', 'remaining_amount',
                'penalty_amount', 'first_emi_date', 'last_emi_date', 'rejection_reason',
                'approved_by', 'approved_at', 'rejected_by', 'rejected_at', 'disbursed_by'
            ]);
        });

        Schema::table('loan_plans', function (Blueprint $table) {
            $table->dropColumn([
                'loan_type', 'interest_calculation_method', 'min_interest_rate', 'max_interest_rate',
                'min_duration_months', 'max_duration_months', 'duration_step', 'processing_fee_rate',
                'processing_fee_fixed', 'late_payment_penalty_rate', 'late_payment_min_fee',
                'min_income_requirement', 'min_credit_score', 'requires_guarantor',
                'eligibility_criteria', 'required_documents', 'terms_and_conditions'
            ]);
        });

        Schema::table('dps_subscriptions', function (Blueprint $table) {
            $table->dropForeign(['wallet_id']);
            $table->dropColumn([
                'wallet_id', 'total_installments', 'paid_installments', 'total_paid',
                'projected_amount', 'maturity_amount', 'penalty_amount', 'payment_status',
                'last_payment_date', 'next_payment_date', 'closure_reason', 'closed_at', 'payment_schedule'
            ]);
        });

        Schema::table('dps_plans', function (Blueprint $table) {
            $table->dropColumn([
                'installment_frequency', 'min_installments', 'max_installments',
                'min_monthly_amount', 'max_monthly_amount', 'late_payment_penalty_rate',
                'late_payment_min_fee', 'allow_prepayment', 'auto_deduct', 'processing_fee', 'terms_and_conditions'
            ]);
        });

        Schema::table('fdr_subscriptions', function (Blueprint $table) {
            $table->dropForeign(['wallet_id']);
            $table->dropForeign(['transaction_id']);
            $table->dropColumn([
                'wallet_id', 'transaction_id', 'tenure_months', 'compounding_frequency',
                'maturity_amount', 'total_interest_earned', 'last_compounded_at',
                'next_compounding_at', 'auto_renewal', 'renewal_status', 'tax_deducted',
                'closure_reason', 'closed_at', 'interest_schedule'
            ]);
        });

        Schema::table('fdr_plans', function (Blueprint $table) {
            $table->dropColumn([
                'tenure_type', 'min_tenure', 'max_tenure', 'compounding_frequency',
                'premature_withdrawal_penalty_rate', 'premature_withdrawal_min_amount',
                'auto_renewal', 'auto_renewal_type', 'is_tax_applicable', 'tax_rate',
                'processing_fee', 'terms_and_conditions'
            ]);
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->dropForeign(['wallet_type_id']);
            $table->dropColumn([
                'wallet_type_id', 'wallet_name', 'hold_balance', 'available_balance', 'last_transaction_at'
            ]);
        });
    }
};
