<?php

namespace App\Models\IAM;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InactiveUserSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'warning_days',
        'deactivation_days',
        'deletion_days',
        'send_warning_email',
        'warning_email_template',
        'auto_deactivate',
        'auto_delete',
        'excluded_roles',
        'updated_by',
    ];

    protected $casts = [
        'warning_days' => 'integer',
        'deactivation_days' => 'integer',
        'deletion_days' => 'integer',
        'send_warning_email' => 'boolean',
        'auto_deactivate' => 'boolean',
        'auto_delete' => 'boolean',
        'excluded_roles' => 'array',
    ];

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function getCurrent(): self
    {
        return self::firstOrCreate([], [
            'warning_days' => 30,
            'deactivation_days' => 90,
            'deletion_days' => 365,
            'send_warning_email' => true,
            'auto_deactivate' => false,
            'auto_delete' => false,
            'excluded_roles' => ['admin', 'staff'],
        ]);
    }

    public function shouldExcludeRole(string $role): bool
    {
        return in_array($role, $this->excluded_roles ?? [], true);
    }

    public function getWarningDate(): \Carbon\Carbon
    {
        return now()->subDays($this->warning_days);
    }

    public function getDeactivationDate(): \Carbon\Carbon
    {
        return now()->subDays($this->deactivation_days);
    }

    public function getDeletionDate(): \Carbon\Carbon
    {
        return now()->subDays($this->deletion_days);
    }
}
