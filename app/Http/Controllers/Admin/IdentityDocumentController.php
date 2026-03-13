<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IdentityDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IdentityDocumentController extends Controller
{
    public function show(Request $request, IdentityDocument $document): JsonResponse
    {
        if (! $request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $temporaryUrl = Storage::disk('local')->temporaryUrl(
            $document->file_path,
            now()->addMinutes(5)
        );

        return response()->json([
            'url' => $temporaryUrl,
            'document' => [
                'id' => $document->id,
                'user_id' => $document->user_id,
                'user_name' => $document->user?->name,
                'user_email' => $document->user?->email,
                'document_type' => $document->document_type,
                'document_type_label' => $document->getDocumentTypeLabel(),
                'file_name' => $document->file_name,
                'file_size' => $document->file_size,
                'mime_type' => $document->mime_type,
                'status' => $document->status,
                'rejection_reason' => $document->rejection_reason,
                'extracted_data' => $document->extracted_data,
                'created_at' => $document->created_at->toIso8601String(),
                'reviewed_at' => $document->reviewed_at?->toIso8601String(),
            ],
        ]);
    }

    public function updateStatus(Request $request, IdentityDocument $document): JsonResponse
    {
        if (! $request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|string|in:'.IdentityDocument::STATUS_APPROVED.','.IdentityDocument::STATUS_REJECTED,
            'rejection_reason' => 'required_if:status,'.IdentityDocument::STATUS_REJECTED.'|nullable|string|max:1000',
        ]);

        $user = $request->user();

        if ($request->status === IdentityDocument::STATUS_APPROVED) {
            $document->approve($user);
        } else {
            $document->reject($request->input('rejection_reason'), $user);
        }

        return response()->json([
            'message' => 'Document status updated successfully',
            'document' => [
                'id' => $document->id,
                'status' => $document->status,
                'reviewed_at' => $document->reviewed_at?->toIso8601String(),
            ],
        ]);
    }
}
