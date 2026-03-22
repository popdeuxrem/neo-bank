<?php

namespace App\Exceptions\Banking;

use InvalidArgumentException;
use RuntimeException;

/**
 * Exception thrown for DPS-related errors.
 */
class DpsException extends RuntimeException
{
    public function __construct(
        string $message,
        ?int $subscriptionId = null,
        ?string $errorCode = null,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);

        $this->subscriptionId = $subscriptionId;
        $this->errorCode = $errorCode;
    }

    public readonly ?int $subscriptionId;

    public readonly ?string $errorCode;
}

/**
 * Exception thrown when installment payment fails.
 */
class DpsInstallmentException extends DpsException
{
    public function __construct(
        int $subscriptionId,
        int $installmentNumber,
        string $reason
    ) {
        parent::__construct(
            message: "Installment #{$installmentNumber} payment failed: {$reason}",
            subscriptionId: $subscriptionId,
            errorCode: 'INSTALLMENT_FAILED'
        );

        $this->installmentNumber = $installmentNumber;
        $this->reason = $reason;
    }

    public readonly int $installmentNumber;

    public readonly string $reason;
}

/**
 * Exception thrown when DPS plan validation fails.
 */
class DpsPlanValidationException extends InvalidArgumentException
{
    /** @var array<string> */
    public readonly array $errors;

    public function __construct(array $errors)
    {
        $message = 'DPS plan validation failed: '.implode('; ', $errors);
        parent::__construct($message);

        $this->errors = $errors;
    }
}
