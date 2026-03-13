<?php

namespace Tests\Feature;

use App\Models\Ledger\Account;
use App\Models\Ledger\AccountBalance;
use App\Models\Ledger\AccountType;
use App\Models\Ledger\Transaction;
use App\Models\Ledger\TransactionEntry;
use App\Services\Fraud\FraudDetectionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FraudDetectionServiceTest extends TestCase
{
    use RefreshDatabase;

    protected FraudDetectionService $fraudService;

    protected AccountType $assetType;

    protected Account $testAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->fraudService = new FraudDetectionService;

        $this->assetType = AccountType::create([
            'name' => 'Asset',
            'slug' => 'asset',
            'nature' => 'debit',
        ]);

        $this->testAccount = Account::create([
            'account_type_id' => $this->assetType->id,
            'account_number' => '99999999',
            'name' => 'Test Account',
            'is_active' => true,
        ]);

        AccountBalance::create([
            'account_id' => $this->testAccount->id,
            'balance' => 10000000,
            'available_balance' => 10000000,
        ]);
    }

    public function test_small_transaction_passes_fraud_checks(): void
    {
        $result = $this->fraudService->analyzeTransaction(
            $this->testAccount,
            50000,
            'transfer'
        );

        $this->assertTrue($result->passed);
        $this->assertEquals(0, $result->riskScore);
    }

    public function test_large_transaction_triggers_flag(): void
    {
        $result = $this->fraudService->analyzeTransaction(
            $this->testAccount,
            2000000,
            'transfer'
        );

        $this->assertFalse($result->passed);
        $this->assertTrue($result->shouldFlag());
        $this->assertContains('Large transaction detected', $result->flags);
    }

    public function test_high_velocity_triggers_flag(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $transaction = Transaction::create([
                'transaction_number' => 'TXN-TEST-'.$i,
                'type' => 'transfer',
                'amount' => 10000,
                'status' => 'completed',
            ]);

            TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $this->testAccount->id,
                'entry_type' => 'debit',
                'amount' => 10000,
            ]);
        }

        $result = $this->fraudService->analyzeTransaction(
            $this->testAccount,
            10000,
            'transfer'
        );

        $this->assertFalse($result->passed);
        $this->assertContains('High transaction velocity detected', $result->flags);
    }

    public function test_unusual_amount_triggers_flag(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $transaction = Transaction::create([
                'transaction_number' => 'TXN-AVG-'.$i,
                'type' => 'transfer',
                'amount' => 10000,
                'status' => 'completed',
            ]);

            TransactionEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $this->testAccount->id,
                'entry_type' => 'debit',
                'amount' => 10000,
            ]);
        }

        $result = $this->fraudService->analyzeTransaction(
            $this->testAccount,
            100000,
            'transfer'
        );

        $this->assertFalse($result->passed);
        $this->assertContains('Unusual transaction amount pattern', $result->flags);
    }

    public function test_new_account_activity_triggers_flag(): void
    {
        $newAccount = Account::create([
            'account_type_id' => $this->assetType->id,
            'account_number' => '99999998',
            'name' => 'New Account',
            'is_active' => true,
            'created_at' => now()->subDays(3),
        ]);

        AccountBalance::create([
            'account_id' => $newAccount->id,
            'balance' => 1000000,
            'available_balance' => 1000000,
        ]);

        $result = $this->fraudService->analyzeTransaction(
            $newAccount,
            50000,
            'transfer'
        );

        $this->assertFalse($result->passed);
        $this->assertContains('New account with activity', $result->flags);
    }

    public function test_calculate_risk_score(): void
    {
        $result = $this->fraudService->analyzeTransaction(
            $this->testAccount,
            50000000,
            'wire'
        );

        $this->assertGreaterThan(50, $result->riskScore);
        $this->assertEquals('REVIEW_MANUALLY', $result->recommendation);
    }
}
