<?php

namespace App\Exceptions\Banking;

use InvalidArgumentException;

/**
 * Exception thrown when account has insufficient funds.
 */
class InsufficientFundsException extends InvalidArgumentException
{
    public function __construct(
        float $available,
        float $required,
        string $currency = 'USD'
    ) {
        $message = sprintf(
            'Insufficient funds: available %.2f %s, required %.2f %s',
            $available,
            $currency,
            $required,
            $currency
        );

        parent::__construct($message);

        $this->available = $available;
        $this->required = $required;
        $this->currency = $currency;
    }

    public readonly float $available;

    public readonly float $required;

    public readonly string $currency;
}
