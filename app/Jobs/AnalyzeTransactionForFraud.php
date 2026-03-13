<?php

namespace App\Jobs;

use App\Models\Ledger\Account;
use App\Services\Fraud\FraudDetectionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AnalyzeTransactionForFraud implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public Account $account,
        public int $amount,
        public string $type,
        public ?int $transactionId = null
    ) {}

    public function handle(FraudDetectionService $fraudService): void
    {
        Log::info('Analyzing transaction for fraud', [
            'account_id' => $this->account->id,
            'amount' => $this->amount,
            'type' => $this->type,
            'transaction_id' => $this->transactionId,
        ]);

        $result = $fraudService->analyzeTransaction(
            $this->account,
            $this->amount,
            $this->type
        );

        if ($result->shouldFlag()) {
            Log::warning('Transaction flagged by fraud detection', [
                'account_id' => $this->account->id,
                'amount' => $this->amount,
                'risk_score' => $result->riskScore,
                'flags' => $result->flags,
                'recommendation' => $result->recommendation,
            ]);
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Fraud analysis job failed', [
            'account_id' => $this->account->id,
            'amount' => $this->amount,
            'type' => $this->type,
            'error' => $exception->getMessage(),
        ]);
    }
}
