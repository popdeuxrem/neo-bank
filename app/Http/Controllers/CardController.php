<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CardController extends Controller
{
    public function index(Request $request): Response
    {
        $cards = $request->user()
            ->cards()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Card $card) {
                return [
                    'id' => $card->id,
                    'uuid' => $card->uuid,
                    'type' => $card->type,
                    'brand' => $card->brand,
                    'last_four' => $card->last_four,
                    'status' => $card->status,
                    'cardholder_name' => $card->cardholder_name,
                    'expiry' => $card->getExpiry(),
                    'frozen_at' => $card->frozen_at?->toIso8601String(),
                    'cancelled_at' => $card->cancelled_at?->toIso8601String(),
                    'created_at' => $card->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Dashboard/Cards', [
            'cards' => $cards,
        ]);
    }

    public function toggleFreeze(Request $request, Card $card): JsonResponse
    {
        $user = $request->user();

        if ($card->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], SymfonyResponse::HTTP_FORBIDDEN);
        }

        if ($card->isCancelled()) {
            return response()->json(['error' => 'Cannot modify a cancelled card'], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $card->toggleFreeze();

        return response()->json([
            'message' => $card->isFrozen() ? 'Card frozen successfully' : 'Card unfrozen successfully',
            'card' => [
                'id' => $card->id,
                'status' => $card->status,
                'frozen_at' => $card->frozen_at?->toIso8601String(),
            ],
        ]);
    }

    public function revealSensitiveData(Request $request, Card $card): JsonResponse
    {
        $user = $request->user();

        if ($card->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], SymfonyResponse::HTTP_FORBIDDEN);
        }

        if (! $card->isActive()) {
            return response()->json(['error' => 'Cannot reveal data for inactive card'], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        if (! Hash::check($validated['password'], $user->password)) {
            return response()->json(['error' => 'Invalid password'], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $token = $card->createRevealToken();

        return response()->json([
            'token' => $token,
            'expires_in' => 30,
        ]);
    }

    public function revealWithToken(string $token): JsonResponse
    {
        $card = Card::validateRevealToken($token);

        if (! $card) {
            return response()->json(['error' => 'Invalid or expired token'], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json([
            'card' => [
                'id' => $card->id,
                'card_number' => $card->getDecryptedCardNumber(),
                'cvv' => $card->getDecryptedCvv(),
                'expiry' => $card->getExpiry(),
            ],
        ]);
    }

    public function updatePin(Request $request, Card $card): JsonResponse
    {
        $user = $request->user();

        if ($card->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], SymfonyResponse::HTTP_FORBIDDEN);
        }

        if (! $card->isActive()) {
            return response()->json(['error' => 'Cannot update PIN for inactive card'], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated = $request->validate([
            'current_pin' => 'required|string|size:4',
            'new_pin' => 'required|string|size:4',
        ]);

        if (! $card->verifyPin($validated['current_pin'])) {
            return response()->json(['error' => 'Invalid current PIN'], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($validated['current_pin'] === $validated['new_pin']) {
            return response()->json(['error' => 'New PIN must be different from current PIN'], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $card->updatePin($validated['new_pin']);

        return response()->json([
            'message' => 'PIN updated successfully',
        ]);
    }

    public function cancel(Request $request, Card $card): JsonResponse
    {
        $user = $request->user();

        if ($card->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], SymfonyResponse::HTTP_FORBIDDEN);
        }

        if ($card->isCancelled()) {
            return response()->json(['error' => 'Card is already cancelled'], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $card->cancel();

        return response()->json([
            'message' => 'Card cancelled successfully',
            'card' => [
                'id' => $card->id,
                'status' => $card->status,
                'cancelled_at' => $card->cancelled_at?->toIso8601String(),
            ],
        ]);
    }
}
