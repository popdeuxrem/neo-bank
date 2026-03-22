<?php

namespace App\Models\Banking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanGuarantor extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'name',
        'relationship',
        'phone',
        'email',
        'address',
        'occupation',
        'monthly_income',
        'documents',
    ];

    protected $casts = [
        'monthly_income' => 'integer',
        'documents' => 'array',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }

    public function scopeForLoan($query, int $loanId)
    {
        return $query->where('loan_id', $loanId);
    }
}
