<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Phase 1: Identity & Access Management (IAM) Enhancements
     * - User Impersonation logging
     * - KYC Verification workflow
     * - User Activity tracking
     * - Login history
     * - Passcode audit
     * - Two-factor audit
     */
    public function up(): void
    {
        // User Impersonation Logs - Admin/Staff login as user
        Schema::create('impersonation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('impersonator_id')->constrained('users')->onDelete('cascade')->comment('Staff/Admin who impersonated');
            $table->foreignId('impersonated_user_id')->constrained('users')->onDelete('cascade')->comment('User being impersonated');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->text('reason')->nullable();
            $table->json('actions_taken')->nullable()->comment('Actions performed during impersonation');
            $table->timestamps();

            $table->index(['impersonator_id', 'started_at']);
            $table->index(['impersonated_user_id', 'started_at']);
            $table->index('started_at');
        });

        // KYC Verification Sessions - Track KYC verification attempts
        Schema::create('kyc_verification_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('status')->default('pending')->comment('pending, in_review, approved, rejected, escalated');
            $table->string('verification_type')->default('standard')->comment('standard, enhanced, manual');
            $table->integer('risk_score')->nullable()->comment('Automated risk assessment score');
            $table->text('notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->json('verified_data')->nullable()->comment('Extracted and verified KYC data');
            $table->json('flags')->nullable()->comment('Any red flags during verification');
            $table->timestamp('submitted_at');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'submitted_at']);
            $table->index('reviewer_id');
        });

        // KYC Documents Linking - Link documents to verification sessions
        Schema::create('kyc_session_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('kyc_verification_sessions')->onDelete('cascade');
            $table->foreignId('document_id')->constrained('identity_documents')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['session_id', 'document_id']);
        });

        // User Activity Logs - Comprehensive activity tracking
        Schema::create('user_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('activity_type')->comment('login, logout, password_change, email_change, phone_change, kyc_submit, etc.');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->json('metadata')->nullable();
            $table->string('session_id')->nullable();
            $table->timestamp('created_at');

            $table->index(['user_id', 'activity_type']);
            $table->index(['user_id', 'created_at']);
            $table->index('activity_type');
            $table->index('ip_address');
            $table->index('created_at');
        });

        // User Sessions - Track active sessions for session management
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->unique();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('device_type')->nullable()->comment('desktop, mobile, tablet');
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('location')->nullable();
            $table->timestamp('last_activity_at');
            $table->timestamp('expires_at');
            $table->boolean('is_current')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'last_activity_at']);
            $table->index('session_id');
            $table->index('expires_at');
        });

        // Passcode Audit - Track passcode changes and attempts
        Schema::create('passcode_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action')->comment('set, changed, reset, failed_attempt, locked, unlocked');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->integer('failed_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'action']);
            $table->index(['user_id', 'created_at']);
        });

        // Two-Factor Audit - Track 2FA events
        Schema::create('two_factor_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action')->comment('enabled, disabled, verified, failed, backup_used, regenerated');
            $table->string('method')->nullable()->comment('totp, sms, email');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'action']);
            $table->index(['user_id', 'created_at']);
        });

        // Inactive User Settings - System-wide inactive user handling
        Schema::create('inactive_user_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('warning_days')->default(30)->comment('Days before warning email');
            $table->integer('deactivation_days')->default(90)->comment('Days before auto-deactivation');
            $table->integer('deletion_days')->default(365)->comment('Days before account deletion');
            $table->boolean('send_warning_email')->default(true);
            $table->string('warning_email_template')->nullable();
            $table->boolean('auto_deactivate')->default(false);
            $table->boolean('auto_delete')->default(false);
            $table->json('excluded_roles')->nullable()->comment('Roles excluded from auto-deactivation');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // User Inactivity Tracking - Per-user inactivity status
        Schema::create('user_inactivity_status', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('last_activity_at');
            $table->timestamp('warning_sent_at')->nullable();
            $table->timestamp('deactivated_at')->nullable();
            $table->timestamp('deletion_scheduled_at')->nullable();
            $table->string('status')->default('active')->comment('active, warned, deactivated, pending_deletion');
            $table->timestamps();

            $table->unique('user_id');
            $table->index(['status', 'last_activity_at']);
        });

        // Role Expiration - For temporary role assignments
        Schema::create('role_expirations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->timestamp('expires_at');
            $table->foreignId('granted_by')->constrained('users')->onDelete('cascade');
            $table->text('reason')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'role_id']);
            $table->index('expires_at');
            $table->index('is_active');
        });

        // Permission Requests - Users requesting additional permissions
        Schema::create('permission_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('permission_name');
            $table->text('reason');
            $table->string('status')->default('pending')->comment('pending, approved, rejected');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('review_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_requests');
        Schema::dropIfExists('role_expirations');
        Schema::dropIfExists('user_inactivity_status');
        Schema::dropIfExists('inactive_user_settings');
        Schema::dropIfExists('two_factor_audits');
        Schema::dropIfExists('passcode_audits');
        Schema::dropIfExists('user_sessions');
        Schema::dropIfExists('user_activity_logs');
        Schema::dropIfExists('kyc_session_documents');
        Schema::dropIfExists('kyc_verification_sessions');
        Schema::dropIfExists('impersonation_logs');
    }
};
