<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ledger\AccountResource;
use App\Http\Resources\Ledger\TransactionResource;
use App\Http\Resources\PaymentResource;
use App\Models\Ledger\Account;
use App\Models\Ledger\Transaction;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiController extends Controller
{
    public function accounts(Request $request): AnonymousResourceCollection
    {
        $query = Account::with(['accountType', 'balance']);

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->has('status')) {
            $query->where('is_active', $request->input('status') === 'active');
        }

        $accounts = $query->orderBy('created_at', 'desc')->paginate(20);

        return AccountResource::collection($accounts);
    }

    public function showAccount(Account $account): AccountResource
    {
        $account->load(['accountType', 'balance', 'entries.transaction']);

        return new AccountResource($account);
    }

    public function transactions(Request $request): AnonymousResourceCollection
    {
        $query = Transaction::with(['entries.account', 'creator']);

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

        $transactions = $query->orderBy('created_at', 'desc')->paginate(20);

        return TransactionResource::collection($transactions);
    }

    public function showTransaction(Transaction $transaction): TransactionResource
    {
        $transaction->load(['entries.account.accountType', 'creator']);

        return new TransactionResource($transaction);
    }

    public function payments(Request $request): AnonymousResourceCollection
    {
        $query = Payment::with(['senderAccount', 'receiverAccount']);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $payments = $query->orderBy('created_at', 'desc')->paginate(20);

        return PaymentResource::collection($payments);
    }

    public function showPayment(Payment $payment): PaymentResource
    {
        $payment->load(['senderAccount', 'receiverAccount', 'user']);

        return new PaymentResource($payment);
    }

    public function stats(): array
    {
        return [
            'total_accounts' => Account::count(),
            'active_accounts' => Account::where('is_active', true)->count(),
            'total_transactions' => Transaction::count(),
            'completed_transactions' => Transaction::where('status', 'completed')->count(),
            'pending_transactions' => Transaction::where('status', 'pending')->count(),
            'total_payments' => Payment::count(),
            'completed_payments' => Payment::where('status', 'completed')->count(),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'total_volume' => Transaction::where('status', 'completed')->sum('amount'),
        ];
    }
}
