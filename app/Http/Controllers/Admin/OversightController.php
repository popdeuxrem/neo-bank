<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\KYCApproved;
use App\Mail\KYCRejected;
use App\Models\IdentityDocument;
use App\Models\Ledger\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OversightController extends Controller
{
    public function kycIndex(): Response
    {
        $documents = IdentityDocument::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'user_id' => $doc->user_id,
                    'user_name' => $doc->user?->name,
                    'user_email' => $doc->user?->email,
                    'document_type' => $doc->document_type,
                    'document_type_label' => $doc->getDocumentTypeLabel(),
                    'file_path' => $doc->file_path,
                    'status' => $doc->status,
                    'created_at' => $doc->created_at->toIso8601String(),
                ];
            });

        $stats = [
            'pending' => IdentityDocument::whereIn('status', [
                IdentityDocument::STATUS_PENDING,
                IdentityDocument::STATUS_SUBMITTED,
                IdentityDocument::STATUS_UNDER_REVIEW,
            ])->count(),
            'approved_today' => IdentityDocument::where('status', IdentityDocument::STATUS_APPROVED)
                ->whereDate('updated_at', today())->count(),
            'rejected_today' => IdentityDocument::where('status', IdentityDocument::STATUS_REJECTED)
                ->whereDate('updated_at', today())->count(),
        ];

        return Inertia::render('admin/oversight/kyc', [
            'documents' => $documents,
            'stats' => $stats,
        ]);
    }

    public function fraudIndex(): Response
    {
        $transactions = Transaction::with(['creator'])
            ->where('status', Transaction::STATUS_FLAGGED)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($txn) {
                $metadata = $txn->metadata ?? [];

                return [
                    'id' => $txn->id,
                    'transaction_number' => $txn->transaction_number,
                    'type' => $txn->type,
                    'amount' => $txn->amount,
                    'currency' => $txn->currency,
                    'status' => $txn->status,
                    'description' => $txn->description,
                    'created_at' => $txn->created_at->toIso8601String(),
                    'flagged_at' => $metadata['flagged_at'] ?? $txn->created_at->toIso8601String(),
                    'user_id' => $txn->created_by,
                    'user_name' => $txn->creator?->name,
                    'user_email' => $txn->creator?->email,
                    'fraud_score' => $metadata['fraud_score'] ?? null,
                    'fraud_reason' => $metadata['fraud_reason'] ?? 'Manual review required',
                ];
            });

        return Inertia::render('admin/oversight/fraud', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Display the admin oversight dashboard.
     */
    public function index(): Response
    {
        // Fetch pending KYC documents
        $pendingDocuments = IdentityDocument::with('user')
            ->whereIn('status', [
                IdentityDocument::STATUS_PENDING,
                IdentityDocument::STATUS_SUBMITTED,
                IdentityDocument::STATUS_UNDER_REVIEW,
            ])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'user_id' => $doc->user_id,
                    'user_name' => $doc->user?->name,
                    'user_email' => $doc->user?->email,
                    'document_type' => $doc->document_type,
                    'document_type_label' => $doc->getDocumentTypeLabel(),
                    'file_name' => $doc->file_name,
                    'file_path' => $doc->file_path,
                    'status' => $doc->status,
                    'created_at' => $doc->created_at->toIso8601String(),
                ];
            });

        // Fetch flagged/fraud transactions
        $flaggedTransactions = Transaction::with(['creator', 'entries.account'])
            ->where('status', Transaction::STATUS_FLAGGED)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($txn) {
                $metadata = $txn->metadata ?? [];

                return [
                    'id' => $txn->id,
                    'transaction_number' => $txn->transaction_number,
                    'type' => $txn->type,
                    'amount' => $txn->amount,
                    'currency' => $txn->currency,
                    'status' => $txn->status,
                    'description' => $txn->description,
                    'created_at' => $txn->created_at->toIso8601String(),
                    'user_id' => $txn->created_by,
                    'user_name' => $txn->creator?->name,
                    'user_email' => $txn->creator?->email,
                    'fraud_score' => $metadata['fraud_score'] ?? null,
                    'fraud_reason' => $metadata['fraud_reason'] ?? 'Manual review required',
                    'flagged_at' => $metadata['flagged_at'] ?? $txn->created_at->toIso8601String(),
                ];
            });

        // Stats
        $stats = [
            'pending_kyc_count' => $pendingDocuments->count(),
            'flagged_transactions_count' => $flaggedTransactions->count(),
            'total_users' => User::count(),
            'active_users' => User::where('email_verified_at', '!=', null)->count(),
        ];

        return Inertia::render('Admin/Oversight', [
            'pendingDocuments' => $pendingDocuments,
            'flaggedTransactions' => $flaggedTransactions,
            'stats' => $stats,
        ]);
    }

    /**
     * Approve a KYC document.
     */
    public function approveKYC(IdentityDocument $document): JsonResponse
    {
        $document->approve(auth()->user());

        // Update user's account status
        $user = $document->user;
        if ($user) {
            $user->update(['email_verified_at' => now()]);

            // Check if all documents are approved
            $pendingDocs = IdentityDocument::where('user_id', $user->id)
                ->where('status', '!=', IdentityDocument::STATUS_APPROVED)
                ->count();

            if ($pendingDocs === 0) {
                $user->update(['email_verified_at' => now()]);
            }

            // Send approval email asynchronously
            Mail::to($user)->send(new KYCApproved($user));
        }

        return response()->json([
            'message' => 'KYC document approved successfully',
            'document' => $document,
        ]);
    }

    /**
     * Reject a KYC document and request re-upload.
     */
    public function rejectKYC(Request $request, IdentityDocument $document): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|min:10',
        ]);

        $reason = $request->reason;
        $document->reject($reason, auth()->user());

        // Send rejection email asynchronously
        $user = $document->user;
        if ($user) {
            Mail::to($user)->send(new KYCRejected($user, $reason));
        }

        return response()->json([
            'message' => 'KYC document rejected. User has been notified.',
            'document' => $document,
        ]);
    }

    /**
     * Resolve a flagged transaction (approve or reject).
     */
    public function resolveFraud(Request $request, Transaction $transaction): JsonResponse
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string',
        ]);

        $action = $request->input('action');

        if ($action === 'approve') {
            // Process the transaction normally
            $transaction->markAsCompleted();

            // Clear fraud flags from metadata
            $metadata = $transaction->metadata ?? [];
            $metadata['fraud_resolved'] = true;
            $metadata['fraud_resolved_by'] = auth()->user()->id;
            $metadata['fraud_resolved_at'] = now()->toIso8601String();
            $metadata['fraud_resolution_notes'] = $request->input('notes');
            $transaction->update(['metadata' => $metadata]);

            return response()->json([
                'message' => 'Transaction approved and processing completed',
                'transaction' => $transaction,
            ]);
        } else {
            // Reject/void the transaction
            $transaction->markAsFailed();

            // Update metadata
            $metadata = $transaction->metadata ?? [];
            $metadata['fraud_confirmed'] = true;
            $metadata['fraud_resolved_by'] = auth()->user()->id;
            $metadata['fraud_resolved_at'] = now()->toIso8601String();
            $metadata['fraud_resolution_notes'] = $request->input('notes');
            $transaction->update(['metadata' => $metadata]);

            // Optionally notify user (placeholder)

            return response()->json([
                'message' => 'Transaction voided. User will be notified.',
                'transaction' => $transaction,
            ]);
        }
    }

    /**
     * Block a user's account.
     */
    public function blockUser(User $user): JsonResponse
    {
        $user->update(['password' => $user->password]); // Placeholder - in production, you'd have a status field

        return response()->json([
            'message' => 'User account has been blocked',
            'user' => $user,
        ]);
    }

    /**
     * Get real-time updates via polling endpoint.
     */
    public function updates(Request $request): JsonResponse
    {
        $lastDocumentId = $request->input('last_document_id', 0);
        $lastTransactionId = $request->input('last_transaction_id', 0);

        $newDocuments = IdentityDocument::with('user')
            ->where('id', '>', $lastDocumentId)
            ->whereIn('status', [
                IdentityDocument::STATUS_PENDING,
                IdentityDocument::STATUS_SUBMITTED,
            ])
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'user_name' => $doc->user?->name,
                    'document_type' => $doc->document_type,
                    'created_at' => $doc->created_at->toIso8601String(),
                ];
            });

        $newTransactions = Transaction::with('creator')
            ->where('id', '>', $lastTransactionId)
            ->where('status', Transaction::STATUS_FLAGGED)
            ->get()
            ->map(function ($txn) {
                $metadata = $txn->metadata ?? [];

                return [
                    'id' => $txn->id,
                    'transaction_number' => $txn->transaction_number,
                    'amount' => $txn->amount,
                    'user_name' => $txn->creator?->name,
                    'fraud_reason' => $metadata['fraud_reason'] ?? 'Manual review',
                    'created_at' => $txn->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'new_documents' => $newDocuments,
            'new_transactions' => $newTransactions,
        ]);
    }
}
