<?php

namespace App\Http\Controllers;

use App\Models\Ledger\Account;
use App\Models\Payment;
use App\Services\Ledger\AtomicTransferService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class PaymentController extends Controller
{
    public function __construct(
        protected AtomicTransferService $transferService
    ) {}

    public function index(Request $request): Response
    {
        $query = Payment::with(['senderAccount', 'receiverAccount', 'user'])
            ->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        $payments = $query->paginate(20);

        return Inertia::render('payments', [
            'payments' => $payments->items(),
            'pagination' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    public function store(Request $request): SymfonyResponse
    {
        $validated = $request->validate([
            'sender_account_id' => 'required|exists:accounts,id',
            'receiver_account_id' => 'required|exists:accounts,id|different:sender_account_id',
            'amount' => 'required|integer|min:1',
            'type' => 'required|in:internal,external,wire,ach',
            'description' => 'nullable|string|max:1000',
        ]);

        $senderAccount = Account::findOrFail($validated['sender_account_id']);

        if ($senderAccount->getAvailableBalance() < $validated['amount']) {
            return response()->json(['error' => 'Insufficient funds'], 400);
        }

        $payment = Payment::create([
            'reference' => Payment::generateReference(),
            'sender_account_id' => $validated['sender_account_id'],
            'receiver_account_id' => $validated['receiver_account_id'],
            'user_id' => $request->user()->id,
            'amount' => $validated['amount'],
            'currency' => 'USD',
            'type' => $validated['type'],
            'status' => Payment::STATUS_PENDING,
            'description' => $validated['description'] ?? null,
        ]);

        try {
            $this->transferService->transfer(
                $senderAccount,
                Account::findOrFail($validated['receiver_account_id']),
                $validated['amount'],
                'payment',
                $validated['description'] ?? 'Payment transfer'
            );

            $payment->markAsCompleted();
        } catch (\Exception $e) {
            $payment->update(['status' => Payment::STATUS_FAILED]);

            return response()->json(['error' => $e->getMessage()], 400);
        }

        return response()->json([
            'message' => 'Payment processed successfully',
            'payment' => $payment,
        ], 201);
    }

    public function show(Payment $payment): SymfonyResponse
    {
        $payment->load(['senderAccount', 'receiverAccount', 'user']);

        return response()->json($payment);
    }
}
