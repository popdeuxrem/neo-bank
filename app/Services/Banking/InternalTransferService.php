<?php

declare(strict_types=1);

namespace App\Services\Banking;

use App\Models\Banking\InternalTransfer;
use App\Models\Banking\Wallet;
use App\Models\User;
use App\Services\Ledger\LedgerService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Internal Transfer Service
 *
 * Handles internal fund transfers between users within the platform.
 * Uses atomic double-entry ledger transactions for complete audit trail.
 *
 * @package App\Services\Banking
 */
class InternalTransferService
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_REVERSED = 'reversed';

    protected const MIN_TRANSFER_AMOUNT = 1.0;
    protected const MAX_TRANSFER_AMOUNT = 100000.0;

    public function __construct(
        protected LedgerService $ledgerService,
        protected ?int $userId = null
    ) {}

    /**
     * Create a new internal transfer.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function createTransfer(User $sender, array $data): InternalTransfer
    {
        $this->validateTransferData($sender, $data);

        $recipient = User::findOrFail($data['recipient_user_id']);

        if ($sender->id === $recipient->id) {
            throw new InvalidArgumentException('Cannot transfer to yourself');
        }

        $senderWallet = $sender->wallet;
        $recipientWallet = $recipient->wallet;

        if (!$senderWallet || !$recipientWallet) {
            throw new RuntimeException('Wallet not found for one or both users');
        }

        $amount = (float) $data['amount'];
        $fee = $this->calculateFee($amount);
        $totalDeduction = $amount + $fee;

        if ($senderWallet->balance < $totalDeduction) {
            throw new InsufficientFundsException(
                'Insufficient funds. Available: ' . $senderWallet->balance . ', Required: ' . $totalDeduction
            );
        }

        return DB::transaction(function () use ($sender, $recipient, $senderWallet, $recipientWallet, $data, $amount, $fee) {
            $transfer = InternalTransfer::create([
                'sender_user_id' => $sender->id,
                'sender_wallet_id' => $senderWallet->id,
                'recipient_user_id' => $recipient->id,
                'recipient_wallet_id' => $recipientWallet->id,
                'amount' => (int) round($amount * 100),
                'currency' => $data['currency'] ?? 'USD',
                'fee' => (int) round($fee * 100),
                'description' => $data['description'] ?? null,
                'status' => self::STATUS_PENDING,
                'metadata' => [
                    'ip_address' => $data['ip_address'] ?? null,
                    'user_agent' => $data['user_agent'] ?? null,
                ],
            ]);

            $this->processTransfer($transfer);

            Log::info('Internal transfer created', [
                'transfer_id' => $transfer->id,
                'sender_id' => $sender->id,
                'recipient_id' => $recipient->id,
                'amount' => $amount,
            ]);

            return $transfer;
        });
    }

    /**
     * Process the transfer (atomic operation).
     *
     * @throws RuntimeException
     */
    public function processTransfer(InternalTransfer $transfer): void
    {
        if ($transfer->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Transfer is not in pending status');
        }

        DB::transaction(function () use ($transfer) {
            $transfer->update(['status' => self::STATUS_PROCESSING]);

            $senderWallet = $transfer->senderWallet;
            $recipientWallet = $transfer->recipientWallet;

            if (!$senderWallet || !$recipientWallet) {
                throw new RuntimeException('Wallet not found');
            }

            $senderWallet->decrement('balance', $transfer->amount / 100 + $transfer->fee / 100);
            $recipientWallet->increment('balance', $transfer->amount / 100);

            $this->createLedgerEntries($transfer);

            $transfer->update([
                'status' => self::STATUS_COMPLETED,
                'completed_at' => now(),
            ]);

            Log::info('Internal transfer completed', [
                'transfer_id' => $transfer->id,
                'amount' => $transfer->amount,
            ]);
        });
    }

    /**
     * Reverse a completed transfer.
     *
     * @throws InvalidArgumentException
     * @throws RuntimeException
     */
    public function reverseTransfer(InternalTransfer $transfer, string $reason): InternalTransfer
    {
        if ($transfer->status !== self::STATUS_COMPLETED) {
            throw new InvalidArgumentException('Only completed transfers can be reversed');
        }

        return DB::transaction(function () use ($transfer, $reason) {
            $senderWallet = $transfer->senderWallet;
            $recipientWallet = $transfer->recipientWallet;

            if (!$senderWallet || !$recipientWallet) {
                throw new RuntimeException('Wallet not found');
            }

            $recipientWallet->decrement('balance', $transfer->amount / 100);
            $senderWallet->increment('balance', $transfer->amount / 100 + $transfer->fee / 100);

            $transfer->update([
                'status' => self::STATUS_REVERSED,
                'metadata' => array_merge($transfer->metadata ?? [], [
                    'reversed_at' => now()->toIso8601String(),
                    'reversal_reason' => $reason,
                ]),
            ]);

            Log::info('Internal transfer reversed', [
                'transfer_id' => $transfer->id,
                'reason' => $reason,
            ]);

            return $transfer;
        });
    }

    /**
     * Cancel a pending transfer.
     *
     * @throws InvalidArgumentException
     */
    public function cancelTransfer(InternalTransfer $transfer): InternalTransfer
    {
        if ($transfer->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending transfers can be cancelled');
        }

        $transfer->update([
            'status' => self::STATUS_FAILED,
            'metadata' => array_merge($transfer->metadata ?? [], [
                'cancelled_at' => now()->toIso8601String(),
            ]),
        ]);

        Log::info('Internal transfer cancelled', [
            'transfer_id' => $transfer->id,
        ]);

        return $transfer;
    }

    /**
     * Get transfer history for a user.
     *
     * @return Collection<int, InternalTransfer>
     */
    public function getTransferHistory(User $user, array $filters = []): Collection
    {
        $query = InternalTransfer::forUser($user->id);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        return $query->orderByDesc('created_at')->get();
    }

    /**
     * Get sent transfers.
     */
    public function getSentTransfers(User $user, ?int $limit = null): Collection
    {
        $query = InternalTransfer::forSender($user->id)->orderByDesc('created_at');

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }

    /**
     * Get received transfers.
     */
    public function getReceivedTransfers(User $user, ?int $limit = null): Collection
    {
        $query = InternalTransfer::forRecipient($user->id)->orderByDesc('created_at');

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }

    /**
     * Calculate transfer fee.
     */
    public function calculateFee(float $amount): float
    {
        $feePercentage = 0.005;
        $fixedFee = 0.10;

        return $amount * $feePercentage + $fixedFee;
    }

    /**
     * Get transfer by ID.
     */
    public function getTransfer(int $transferId): ?InternalTransfer
    {
        return InternalTransfer::find($transferId);
    }

    /**
     * Validate transfer data.
     *
     * @throws InvalidArgumentException
     */
    protected function validateTransferData(User $sender, array $data): void
    {
        $required = ['recipient_user_id', 'amount'];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }

        if ($data['amount'] < self::MIN_TRANSFER_AMOUNT) {
            throw new InvalidArgumentException(
                'Minimum transfer amount is ' . self::MIN_TRANSFER_AMOUNT
            );
        }

        if ($data['amount'] > self::MAX_TRANSFER_AMOUNT) {
            throw new InvalidArgumentException(
                'Maximum transfer amount is ' . self::MAX_TRANSFER_AMOUNT
            );
        }

        $recipient = User::find($data['recipient_user_id']);
        if (!$recipient) {
            throw new InvalidArgumentException('Recipient not found');
        }

        if ($recipient->account_status !== User::STATUS_ACTIVE) {
            throw new InvalidArgumentException('Recipient account is not active');
        }
    }

    /**
     * Create ledger entries for the transfer.
     */
    protected function createLedgerEntries(InternalTransfer $transfer): void
    {
        $this->ledgerService->transfer(
            $transfer->senderWallet->id,
            $transfer->recipientWallet->id,
            $transfer->amount,
            'Internal Transfer',
            [
                'metadata' => [
                    'internal_transfer_id' => $transfer->id,
                    'reference_number' => $transfer->reference_number,
                ],
            ]
        );
    }
}

/**
 * Insufficient Funds Exception
 */
class InsufficientFundsException extends RuntimeException
{
    public function __construct(string $message)
    {
        parent::__construct($message);
    }
}
