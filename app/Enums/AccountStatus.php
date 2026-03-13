<?php

namespace App\Enums;

enum AccountStatus: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case VERIFIED = 'verified';
    case RESTRICTED = 'restricted';
    case SUSPENDED = 'suspended';
    case CLOSED = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::ACTIVE => 'Active',
            self::VERIFIED => 'Verified',
            self::RESTRICTED => 'Restricted',
            self::SUSPENDED => 'Suspended',
            self::CLOSED => 'Closed',
        };
    }

    public function canTransact(): bool
    {
        return in_array($this, [self::ACTIVE, self::VERIFIED]);
    }

    public function requiresVerification(): bool
    {
        return in_array($this, [self::PENDING, self::RESTRICTED]);
    }
}
