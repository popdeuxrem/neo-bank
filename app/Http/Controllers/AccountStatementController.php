<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateStatementJob;
use App\Models\Ledger\Account;
use App\Models\Statement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class AccountStatementController extends Controller
{
    /**
     * Return a list of previously generated statements.
     */
    public function index(Request $request): JsonResponse
    {
        $statements = Statement::where('user_id', $request->user()->id)
            ->with('account')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'statements' => $statements,
        ]);
    }

    /**
     * Validate and dispatch statement generation.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'period' => 'required|string|regex:/^\d{4}-\d{2}$/',
        ]);

        $account = Account::where('id', $validated['account_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Check if statement already exists
        $existingStatement = Statement::where('user_id', $request->user()->id)
            ->where('account_id', $validated['account_id'])
            ->where('period', $validated['period'])
            ->first();

        if ($existingStatement) {
            if ($existingStatement->isCompleted()) {
                return response()->json([
                    'message' => 'Statement already available for download.',
                    'statement' => $existingStatement,
                ]);
            }

            if ($existingStatement->isPending() || $existingStatement->status === 'processing') {
                return response()->json([
                    'message' => 'Statement is already being generated.',
                    'statement' => $existingStatement,
                ]);
            }
        }

        // Create new statement record
        $statement = Statement::create([
            'user_id' => $request->user()->id,
            'account_id' => $validated['account_id'],
            'period' => $validated['period'],
            'status' => 'pending',
        ]);

        // Dispatch the job
        GenerateStatementJob::dispatch($statement);

        return response()->json([
            'message' => 'Statement generation started.',
            'statement' => $statement,
        ], 202);
    }

    /**
     * Download the generated PDF statement.
     */
    public function download(Request $request, Statement $statement): Response|JsonResponse
    {
        // Verify ownership
        if ($statement->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$statement->isCompleted()) {
            return response()->json([
                'message' => 'Statement is not ready for download.',
                'status' => $statement->status,
            ], 400);
        }

        if (!$statement->file_path || !Storage::disk('public')->exists($statement->file_path)) {
            return response()->json(['message' => 'Statement file not found.'], 404);
        }

        $fullPath = Storage::disk('public')->path($statement->file_path);
        $filename = "statement-{$statement->account->name}-{$statement->period}.pdf";

        return response()->download($fullPath, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
