<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportController extends Controller
{
    public function index(): Response
    {
        $tickets = collect([
            ['id' => 1, 'ticket_number' => 'TKT-001', 'subject' => 'Cannot transfer funds', 'user' => ['name' => 'John Doe', 'email' => 'john@example.com'], 'priority' => 'urgent', 'status' => 'pending', 'last_reply' => now()->subHours(2)->toIso8601String(), 'created_at' => now()->subDays(2)->toIso8601String()],
            ['id' => 2, 'ticket_number' => 'TKT-002', 'subject' => 'Question about interest rates', 'user' => ['name' => 'Jane Smith', 'email' => 'jane@example.com'], 'priority' => 'normal', 'status' => 'answered', 'last_reply' => now()->subHours(5)->toIso8601String(), 'created_at' => now()->subDays(3)->toIso8601String()],
            ['id' => 3, 'ticket_number' => 'TKT-003', 'subject' => 'Card not working abroad', 'user' => ['name' => 'Bob Wilson', 'email' => 'bob@example.com'], 'priority' => 'high', 'status' => 'pending', 'last_reply' => now()->subMinutes(30)->toIso8601String(), 'created_at' => now()->subDay()->toIso8601String()],
        ]);

        return Inertia::render('admin/support/index', [
            'tickets' => $tickets->toArray(),
        ]);
    }

    public function show(int $ticket): Response
    {
        $ticket = [
            'id' => $ticket,
            'ticket_number' => 'TKT-001',
            'subject' => 'Cannot transfer funds',
            'status' => 'pending',
            'priority' => 'urgent',
            'created_at' => now()->subDays(2)->toIso8601String(),
            'user' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
            ],
        ];

        $messages = [
            ['id' => 1, 'is_admin' => false, 'message' => 'Hi, I\'m trying to transfer funds but getting an error message.', 'created_at' => now()->subDays(2)->toIso8601String(), 'user' => ['name' => 'John Doe', 'email' => 'john@example.com']],
            ['id' => 2, 'is_admin' => true, 'message' => 'Thank you for contacting us. Can you provide more details about the error?', 'created_at' => now()->subDays(1)->toIso8601String()],
            ['id' => 3, 'is_admin' => false, 'message' => 'The error says "Insufficient funds" but I have money in my account.', 'created_at' => now()->subHours(12)->toIso8601String(), 'user' => ['name' => 'John Doe', 'email' => 'john@example.com']],
        ];

        return Inertia::render('admin/support/show', [
            'ticket' => $ticket,
            'messages' => $messages,
        ]);
    }

    public function reply(Request $request, int $ticket): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
            'close_ticket' => 'boolean',
        ]);

        return response()->json([
            'message' => 'Reply sent successfully',
        ]);
    }

    public function close(Request $request, int $ticket): JsonResponse
    {
        return response()->json([
            'message' => 'Ticket closed successfully',
        ]);
    }
}
