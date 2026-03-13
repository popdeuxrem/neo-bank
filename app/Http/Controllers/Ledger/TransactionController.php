<?php

namespace App\Http\Controllers\Ledger;

use App\Http\Controllers\Controller;
use App\Mail\TransactionReversed;
use App\Models\Ledger\Account;
use App\Models\Ledger\Transaction;
use App\Models\User;
use App\Services\Ledger\AtomicTransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class TransactionController extends Controller
{
    public function __construct(
        protected AtomicTransferService $transferService
    ) {}

    public function index(Request $request): Response
    {
        $query = Transaction::with(['entries.account', 'creator'])
            ->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('from_date')) {
            $query->where('created_at', '>=', $request->input('from_date'));
        }

        if ($request->has('to_date')) {
            $query->where('created_at', '<=', $request->input('to_date'));
        }

        $transactions = $query->paginate(20);

        return Inertia::render('transactions', [
            'transactions' => $transactions->items(),
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        $transaction->load(['entries.account.accountType', 'creator']);

        return response()->json([
            'id' => $transaction->id,
            'uuid' => $transaction->uuid,
            'transaction_number' => $transaction->transaction_number,
            'type' => $transaction->type,
            'description' => $transaction->description,
            'amount' => $transaction->amount,
            'currency' => $transaction->currency,
            'status' => $transaction->status,
            'metadata' => $transaction->metadata,
            'posted_at' => $transaction->posted_at?->toIso8601String(),
            'created_at' => $transaction->created_at->toIso8601String(),
            'entries' => $transaction->entries->map(fn ($entry) => [
                'id' => $entry->id,
                'account' => [
                    'id' => $entry->account->id,
                    'account_number' => $entry->account->account_number,
                    'name' => $entry->account->name,
                ],
                'entry_type' => $entry->entry_type,
                'amount' => $entry->amount,
                'memo' => $entry->memo,
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:deposit,withdrawal,transfer,payment',
            'from_account_id' => 'required_if:type,withdrawal,transfer,payment|nullable|exists:accounts,id',
            'to_account_id' => 'required_if:type,deposit,transfer|nullable|exists:accounts,id',
            'amount' => 'required|integer|min:1',
            'description' => 'nullable|string|max:1000',
            'metadata' => 'nullable|array',
        ]);

        try {
            $transaction = $this->executeTransaction($request->user(), $validated);

            return response()->json([
                'message' => 'Transaction completed successfully',
                'transaction' => [
                    'id' => $transaction->id,
                    'uuid' => $transaction->uuid,
                    'transaction_number' => $transaction->transaction_number,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'status' => $transaction->status,
                ],
            ], SymfonyResponse::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], SymfonyResponse::HTTP_BAD_REQUEST);
        }
    }

    public function reverse(Request $request, Transaction $transaction): JsonResponse
    {
        $user = $request->user();

        if (! $user || ! $user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. Admin role required.'], SymfonyResponse::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $reversal = $this->transferService->reverseTransaction(
                $transaction,
                $validated['reason']
            );

            $this->sendReversalEmail($transaction, $reversal);

            return response()->json([
                'message' => 'Transaction reversed successfully',
                'reversal' => [
                    'id' => $reversal->id,
                    'transaction_number' => $reversal->transaction_number,
                ],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    protected function sendReversalEmail(Transaction $transaction, Transaction $reversal): void
    {
        $user = $transaction->creator;

        if ($user && $user instanceof User && $user->email) {
            Mail::to($user->email)->send(new TransactionReversed($transaction, $reversal));
        }
    }

    public function flag(Request $request, Transaction $transaction): JsonResponse
    {
        if (! $transaction->isCompleted()) {
            return response()->json(['error' => 'Can only flag completed transactions'], 400);
        }

        $transaction->markAsFlagged();

        return response()->json([
            'message' => 'Transaction flagged for review',
            'transaction' => [
                'id' => $transaction->id,
                'status' => $transaction->status,
            ],
        ]);
    }

    protected function executeTransaction($user, array $data): Transaction
    {
        $service = new AtomicTransferService($user?->id);

        $accountFrom = isset($data['from_account_id'])
            ? Account::findOrFail($data['from_account_id'])
            : null;
        $accountTo = isset($data['to_account_id'])
            ? Account::findOrFail($data['to_account_id'])
            : null;

        return match ($data['type']) {
            'deposit' => $service->deposit(
                $accountTo,
                $data['amount'],
                $data['description'] ?? null,
                $data['metadata'] ?? null
            ),
            'withdrawal' => $service->withdrawal(
                $accountFrom,
                $data['amount'],
                $data['description'] ?? null,
                $data['metadata'] ?? null
            ),
            'transfer' => $service->transfer(
                $accountFrom,
                $accountTo,
                $data['amount'],
                'transfer',
                $data['description'] ?? null,
                $data['metadata'] ?? null
            ),
            'payment' => $service->transfer(
                $accountFrom,
                $accountTo,
                $data['amount'],
                'payment',
                $data['description'] ?? null,
                $data['metadata'] ?? null
            ),
            default => throw new \InvalidArgumentException('Invalid transaction type'),
        };
    }
}
