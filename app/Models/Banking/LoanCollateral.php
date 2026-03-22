<?php

namespace App\Models\Banking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanCollateral extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'collateral_type',
        'description',
        'estimated_value',
        'documents',
        'status',
        'released_at',
    ];

    protected $casts = [
        'estimated_value' => 'integer',
        'documents' => 'array',
        'released_at' => 'datetime',
    ];

    public const TYPE_PROPERTY = 'property';

    public const TYPE_VEHICLE = 'vehicle';

    public const TYPE_FD = 'fd';

    public const TYPE_GOLD = 'gold';

    public const TYPE_OTHER = 'other';

    public const STATUS_PLEDGED = 'pledged';

    public const STATUS_RELEASED = 'released';

    public const STATUS_LIQUIDATED = 'liquidated';

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }

    public function scopeForLoan($query, int $loanId)
    {
        return $query->where('loan_id', $loanId);
    }

    public function scopePledged($query)
    {
        return $query->where('status', self::STATUS_PLEDGED);
    }

    public function scopeReleased($query)
    {
        return $query->where('status', self::STATUS_RELEASED);
    }

    public function scopeLiquidated($query)
    {
        return $query->where('status', self::STATUS_LIQUIDATED);
    }

    public function isPledged(): bool
    {
        return $this->status === self::STATUS_PLEDGED;
    }

    public function isReleased(): bool
    {
        return $this->status === self::STATUS_RELEASED;
    }

    public function isLiquidated(): bool
    {
        return $this->status === self::STATUS_LIQUIDATED;
    }

    public function release(): void
    {
        $this->update([
            'status' => self::STATUS_RELEASED,
            'released_at' => now(),
        ]);
    }

    public function liquidate(): void
    {
        $this->update([
            'status' => self::STATUS_LIQUIDATED,
            'released_at' => now(),
        ]);
    }

    public function getCollateralTypeLabel(): string
    {
        return match ($this->collateral_type) {
            self::TYPE_PROPERTY => 'Real Estate Property',
            self::TYPE_VEHICLE => 'Vehicle',
            self::TYPE_FD => 'Fixed Deposit',
            self::TYPE_GOLD => 'Gold/Jewelry',
            self::TYPE_OTHER => 'Other',
            default => 'Unknown',
        };
    }
}
