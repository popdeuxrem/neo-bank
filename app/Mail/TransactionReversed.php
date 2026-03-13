<?php

namespace App\Mail;

use App\Models\Ledger\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionReversed extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
        public Transaction $reversal
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Transaction Reversed - Administrative Correction',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.transactions.reversed',
            with: [
                'transaction' => $this->transaction,
                'reversal' => $this->reversal,
                'amount' => $this->formatAmount($this->transaction->amount),
                'reason' => $this->reversal->description,
            ],
        );
    }

    protected function formatAmount(int $amountInCents): string
    {
        return '$'.number_format(abs($amountInCents) / 100, 2);
    }
}
