<?php

namespace App\Jobs;

use App\Models\Ledger\Account;
use App\Models\Ledger\Transaction;
use App\Models\Statement;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class GenerateStatementJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Statement $statement
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->statement->update(['status' => 'processing']);

        try {
            // Parse the period (expected format: YYYY-MM)
            $period = $this->statement->period;
            $year = (int) substr($period, 0, 4);
            $month = (int) substr($period, 5, 2);

            $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
            $endDate = $startDate->copy()->endOfMonth();

            // Fetch transactions for the period
            $transactions = Transaction::where('account_id', $this->statement->account_id)
                ->whereBetween('date', [$startDate->toDateTimeString(), $endDate->toDateTimeString()])
                ->orderBy('date', 'asc')
                ->get();

            // Get account relationship
            $account = $this->statement->account;
            $user = $this->statement->user;

            // Calculate opening balance (balance before the period)
            $accountModel = Account::find($this->statement->account_id);
            $openingBalance = $accountModel && method_exists($accountModel, 'balance_at') 
                ? $accountModel->balance_at($startDate->copy()->subDay()) 
                : 0;

            // Calculate closing balance
            $closingBalance = $openingBalance + $transactions
                ->where('status', 'completed')
                ->sum('amount');

            // Calculate totals
            $totalCredits = $transactions
                ->where('type', 'credit')
                ->where('status', 'completed')
                ->sum('amount');

            $totalDebits = $transactions
                ->whereIn('type', ['debit', 'payment'])
                ->where('status', 'completed')
                ->sum('amount');

            // Estimate total pages for page numbering
            $transactionsPerPage = 25;
            $totalPages = max(1, ceil($transactions->count() / $transactionsPerPage));

            // Generate PDF using the high-fidelity template
            $html = view('pdfs.statement', [
                'statement' => $this->statement,
                'account' => $account,
                'user' => $user,
                'period' => $period,
                'startDate' => $startDate->format('F d, Y'),
                'endDate' => $endDate->format('F d, Y'),
                'transactions' => $transactions,
                'openingBalance' => $openingBalance,
                'closingBalance' => $closingBalance,
                'totalCredits' => $totalCredits,
                'totalDebits' => $totalDebits,
                'page' => 1,
                'totalPages' => $totalPages,
            ])->render();

            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('a4', 'portrait');
            $dompdf->render();

            // Save the PDF
            $directory = 'statements/' . $this->statement->user_id;
            $filename = "statement-{$this->statement->account_id}-{$period}.pdf";
            $path = "{$directory}/{$filename}";

            Storage::disk('public')->put($path, $dompdf->output());

            // Update statement record
            $this->statement->update([
                'file_path' => $path,
                'status' => 'completed',
                'completed_at' => now(),
            ]);

        } catch (\Exception $e) {
            $this->statement->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
