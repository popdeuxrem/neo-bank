<?php

namespace App\Services\Payment;

use App\Models\AuditLog;
use App\Models\Ledger\Account;
use App\Models\Payment;
use App\Services\Fraud\FraudDetectionService;
use App\Services\Fraud\FraudResult;
use App\Services\Ledger\AtomicTransferService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function __construct(
        protected AtomicTransferService $transferService,
        protected FraudDetectionService $fraudService
    ) {}

    public function processPayment(
        Account $senderAccount,
        Account $receiverAccount,
        int $amount,
        string $type,
        ?string $description = null,
        ?int $userId = null
    ): PaymentResult {
        try {
            return DB::transaction(function () use ($senderAccount, $receiverAccount, $amount, $type, $description, $userId) {
                $this->validateSenderAccount($senderAccount);
                $this->validateReceiverAccount($receiverAccount, $senderAccount);
                $this->validateSufficientFunds($senderAccount, $amount);

                $fraudResult = $this->fraudService->analyzeTransaction($senderAccount, $amount, $type);

                $payment = Payment::create([
                    'reference' => Payment::generateReference(),
                    'sender_account_id' => $senderAccount->id,
                    'receiver_account_id' => $receiverAccount->id,
                    'user_id' => $userId,
                    'amount' => $amount,
                    'currency' => 'USD',
                    'type' => $type,
                    'status' => $fraudResult->shouldFlag() ? 'pending_review' : Payment::STATUS_PENDING,
                    'description' => $description,
                    'metadata' => [
                        'fraud_risk_score' => $fraudResult->riskScore,
                        'fraud_flags' => $fraudResult->flags,
                        'fraud_recommendation' => $fraudResult->recommendation,
                    ],
                ]);

                $this->transferService->transfer(
                    $senderAccount,
                    $receiverAccount,
                    $amount,
                    $type,
                    $description
                );

                $payment->markAsCompleted();

                AuditLog::log(
                    'payment.completed',
                    null,
                    Payment::class,
                    $payment->id,
                    null,
                    [
                        'amount' => $amount,
                        'sender_account' => $senderAccount->account_number,
                        'receiver_account' => $receiverAccount->account_number,
                        'fraud_score' => $fraudResult->riskScore,
                    ]
                );

                Log::info('Payment processed', [
                    'payment_id' => $payment->id,
                    'amount' => $amount,
                    'fraud_result' => $fraudResult->riskScore,
                ]);

                return new PaymentResult(
                    success: true,
                    payment: $payment,
                    fraudResult: $fraudResult
                );
            });
        } catch (\Exception $e) {
            Log::error('Payment failed', [
                'error' => $e->getMessage(),
                'sender_account' => $senderAccount->account_number ?? null,
                'receiver_account' => $receiverAccount->account_number ?? null,
                'amount' => $amount ?? null,
            ]);

            return new PaymentResult(
                success: false,
                payment: null,
                fraudResult: null,
                error: $e->getMessage()
            );
        }
    }

    public function processWireTransfer(
        Account $senderAccount,
        Account $receiverAccount,
        int $amount,
        string $description,
        ?int $userId = null
    ): PaymentResult {
        $this->validateWireTransferLimits($amount);

        return $this->processPayment(
            $senderAccount,
            $receiverAccount,
            $amount,
            Payment::TYPE_WIRE,
            $description,
            $userId
        );
    }

    public function processAchTransfer(
        Account $senderAccount,
        Account $receiverAccount,
        int $amount,
        string $description,
        ?int $userId = null
    ): PaymentResult {
        $this->validateAchTransferLimits($amount);

        return $this->processPayment(
            $senderAccount,
            $receiverAccount,
            $amount,
            Payment::TYPE_ACH,
            $description,
            $userId
        );
    }

    public function cancelPayment(Payment $payment, ?string $reason = null): bool
    {
        if ($payment->status !== Payment::STATUS_PENDING && $payment->status !== 'pending_review') {
            throw new \InvalidArgumentException('Only pending payments can be cancelled');
        }

        $payment->update([
            'status' => Payment::STATUS_CANCELLED,
            'metadata' => array_merge($payment->metadata ?? [], [
                'cancelled_at' => now()->toIso8601String(),
                'cancellation_reason' => $reason,
            ]),
        ]);

        AuditLog::log(
            'payment.cancelled',
            null,
            Payment::class,
            $payment->id,
            null,
            ['reason' => $reason]
        );

        return true;
    }

    protected function validateSenderAccount(Account $account): void
    {
        if (! $account->is_active) {
            throw new \InvalidArgumentException('Sender account is not active');
        }
    }

    protected function validateReceiverAccount(Account $account, Account $senderAccount): void
    {
        if (! $account->is_active) {
            throw new \InvalidArgumentException('Receiver account is not active');
        }

        if ($account->id === $senderAccount->id) {
            throw new \InvalidArgumentException('Cannot transfer to the same account');
        }
    }

    protected function validateSufficientFunds(Account $account, int $amount): void
    {
        $available = $account->getAvailableBalance();

        if ($available < $amount) {
            throw new \InvalidArgumentException("Insufficient funds. Available: {$available}, Required: {$amount}");
        }
    }

    protected function validateWireTransferLimits(int $amount): void
    {
        $minWire = 100000;
        $maxWire = 10000000;

        if ($amount < $minWire) {
            throw new \InvalidArgumentException('Wire transfer minimum is '.($minWire / 100));
        }

        if ($amount > $maxWire) {
            throw new \InvalidArgumentException('Wire transfer maximum is '.($maxWire / 100));
        }
    }

    protected function validateAchTransferLimits(int $amount): void
    {
        $maxAch = 1000000;

        if ($amount > $maxAch) {
            throw new \InvalidArgumentException('ACH transfer maximum is '.($maxAch / 100));
        }
    }
}

class PaymentResult
{
    public function __construct(
        public bool $success,
        public ?Payment $payment,
        public ?FraudResult $fraudResult,
        public ?string $error = null
    ) {}

    public function requiresReview(): bool
    {
        return $this->fraudResult && $this->fraudResult->requiresManualReview();
    }
}
