<?php

namespace Tests\Feature;

use App\Models\Ledger\Account;
use App\Models\Ledger\AccountBalance;
use App\Models\Ledger\AccountType;
use App\Models\Payment;
use App\Models\User;
use App\Services\Fraud\FraudDetectionService;
use App\Services\Ledger\AtomicTransferService;
use App\Services\Payment\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PaymentService $paymentService;

    protected AccountType $assetType;

    protected Account $senderAccount;

    protected Account $receiverAccount;

    protected User $senderUser;

    protected User $receiverUser;

    protected function setUp(): void
    {
        parent::setUp();

        $atomicService = new AtomicTransferService;
        $fraudService = new FraudDetectionService;
        $this->paymentService = new PaymentService($atomicService, $fraudService);

        $this->senderUser = User::create([
            'name' => 'Sender User',
            'email' => 'sender@test.com',
            'password' => 'password',
        ]);

        $this->receiverUser = User::create([
            'name' => 'Receiver User',
            'email' => 'receiver@test.com',
            'password' => 'password',
        ]);

        $this->assetType = AccountType::create([
            'name' => 'Asset',
            'slug' => 'asset',
            'nature' => 'debit',
        ]);

        $this->senderAccount = Account::create([
            'account_type_id' => $this->assetType->id,
            'account_number' => '10000001',
            'name' => 'Sender Account',
            'is_active' => true,
            'user_id' => $this->senderUser->id,
        ]);

        AccountBalance::create([
            'account_id' => $this->senderAccount->id,
            'balance' => 1000000,
            'available_balance' => 1000000,
        ]);

        $this->receiverAccount = Account::create([
            'account_type_id' => $this->assetType->id,
            'account_number' => '10000002',
            'name' => 'Receiver Account',
            'is_active' => true,
            'user_id' => $this->receiverUser->id,
        ]);

        AccountBalance::create([
            'account_id' => $this->receiverAccount->id,
            'balance' => 500000,
            'available_balance' => 500000,
        ]);
    }

    public function test_successful_payment_creates_records(): void
    {
        $result = $this->paymentService->processPayment(
            $this->senderAccount,
            $this->receiverAccount,
            50000,
            'internal',
            'Test payment',
            1
        );

        $this->assertTrue($result->success);
        $this->assertNotNull($result->payment);
        $this->assertEquals(Payment::STATUS_COMPLETED, $result->payment->status);
        $this->assertEquals(50000, $result->payment->amount);
    }

    public function test_payment_fails_for_insufficient_funds(): void
    {
        $result = $this->paymentService->processPayment(
            $this->senderAccount,
            $this->receiverAccount,
            2000000,
            'internal',
            'Large payment',
            1
        );

        $this->assertFalse($result->success);
        $this->assertStringContainsString('Insufficient funds', $result->error);
    }

    public function test_payment_fails_for_same_account(): void
    {
        $result = $this->paymentService->processPayment(
            $this->senderAccount,
            $this->senderAccount,
            50000,
            'internal',
            'Same account',
            1
        );

        $this->assertFalse($result->success);
        $this->assertStringContainsString('Cannot transfer to the same account', $result->error);
    }

    public function test_payment_fails_for_inactive_receiver(): void
    {
        $this->receiverAccount->update(['is_active' => false]);

        $result = $this->paymentService->processPayment(
            $this->senderAccount,
            $this->receiverAccount,
            50000,
            'internal',
            'Inactive receiver',
            1
        );

        $this->assertFalse($result->success);
        $this->assertStringContainsString('not active', $result->error);
    }

    public function test_wire_transfer_validates_limits(): void
    {
        $result = $this->paymentService->processWireTransfer(
            $this->senderAccount,
            $this->receiverAccount,
            5000,
            'Small wire',
            1
        );

        $this->assertFalse($result->success);
        $this->assertStringContainsString('minimum', $result->error);
    }

    public function test_ach_transfer_validates_limits(): void
    {
        $result = $this->paymentService->processAchTransfer(
            $this->senderAccount,
            $this->receiverAccount,
            2000000,
            'Large ACH',
            1
        );

        $this->assertFalse($result->success);
        $this->assertStringContainsString('maximum', $result->error);
    }

    public function test_cancel_pending_payment(): void
    {
        $result = $this->paymentService->processPayment(
            $this->senderAccount,
            $this->receiverAccount,
            50000,
            'internal',
            'To be cancelled',
            1
        );

        $payment = $result->payment;
        $cancelled = $this->paymentService->cancelPayment($payment, 'Test cancellation');

        $this->assertTrue($cancelled);
        $this->assertEquals(Payment::STATUS_CANCELLED, $payment->fresh()->status);
    }

    public function test_cannot_cancel_completed_payment(): void
    {
        $result = $this->paymentService->processPayment(
            $this->senderAccount,
            $this->receiverAccount,
            50000,
            'internal',
            'Completed payment',
            1
        );

        $payment = $result->payment;
        $payment->markAsCompleted();

        $this->expectException(\InvalidArgumentException::class);
        $this->paymentService->cancelPayment($payment, 'Try to cancel');
    }

    public function test_payment_updates_balances(): void
    {
        $initialSenderBalance = $this->senderAccount->getCurrentBalance();
        $initialReceiverBalance = $this->receiverAccount->getCurrentBalance();

        $result = $this->paymentService->processPayment(
            $this->senderAccount,
            $this->receiverAccount,
            50000,
            'internal',
            'Balance test',
            1
        );

        $this->senderAccount->refresh();
        $this->receiverAccount->refresh();

        $this->assertEquals($initialSenderBalance - 50000, $this->senderAccount->getCurrentBalance());
        $this->assertEquals($initialReceiverBalance + 50000, $this->receiverAccount->getCurrentBalance());
    }
}
