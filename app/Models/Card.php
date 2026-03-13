<?php

namespace App\Models;

use App\Models\Ledger\Account;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'account_id',
        'card_number_encrypted',
        'cvv_encrypted',
        'expiry_month',
        'expiry_year',
        'pin_hash',
        'cardholder_name',
        'status',
        'type',
        'brand',
        'last_four',
        'frozen_at',
        'cancelled_at',
    ];

    protected $casts = [
        'frozen_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Card $card) {
            if (empty($card->uuid)) {
                $card->uuid = (string) Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isFrozen(): bool
    {
        return $this->status === 'frozen';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function freeze(): bool
    {
        if ($this->isCancelled()) {
            return false;
        }

        $this->status = 'frozen';
        $this->frozen_at = now();

        return $this->save();
    }

    public function unfreeze(): bool
    {
        if ($this->isCancelled()) {
            return false;
        }

        $this->status = 'active';
        $this->frozen_at = null;

        return $this->save();
    }

    public function toggleFreeze(): bool
    {
        if ($this->isCancelled()) {
            return false;
        }

        if ($this->isFrozen()) {
            return $this->unfreeze();
        }

        return $this->freeze();
    }

    public function cancel(): bool
    {
        $this->status = 'cancelled';
        $this->cancelled_at = now();
        $this->frozen_at = null;

        return $this->save();
    }

    public function getDecryptedCardNumber(): ?string
    {
        try {
            return Crypt::decryptString($this->card_number_encrypted);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getDecryptedCvv(): ?string
    {
        try {
            return Crypt::decryptString($this->cvv_encrypted);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function verifyPin(string $pin): bool
    {
        return hash_equals($this->pin_hash, hash('sha256', $pin));
    }

    public function updatePin(string $newPin): bool
    {
        $this->pin_hash = hash('sha256', $newPin);

        return $this->save();
    }

    public function getMaskedCardNumber(): string
    {
        return '**** **** **** '.$this->last_four;
    }

    public function getExpiry(): string
    {
        return $this->expiry_month.'/'.$this->expiry_year;
    }

    public function createRevealToken(): string
    {
        $token = Str::random(64);

        \DB::table('card_reveal_tokens')->insert([
            'card_id' => $this->id,
            'token' => $token,
            'expires_at' => now()->addSeconds(30),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $token;
    }

    public static function validateRevealToken(string $token): ?Card
    {
        $record = \DB::table('card_reveal_tokens')
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->whereNull('used_at')
            ->first();

        if (! $record) {
            return null;
        }

        \DB::table('card_reveal_tokens')
            ->where('id', $record->id)
            ->update(['used_at' => now()]);

        return static::find($record->card_id);
    }

    public function getRevealedData(): array
    {
        return [
            'card_number' => $this->getDecryptedCardNumber(),
            'cvv' => $this->getDecryptedCvv(),
            'expiry' => $this->getExpiry(),
        ];
    }
}
