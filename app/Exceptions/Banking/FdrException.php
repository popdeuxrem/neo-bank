<?php

namespace App\Exceptions\Banking;

use RuntimeException;

/**
 * Exception thrown for FDR-related errors.
 */
class FdrException extends RuntimeException
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
 * Exception thrown when FDR is not yet matured.
 */
class FdrNotMaturedException extends FdrException
{
    public function __construct(
        int $subscriptionId,
        string $maturityDate
    ) {
        parent::__construct(
            message: "FDR not yet matured. Maturity date: {$maturityDate}",
            subscriptionId: $subscriptionId,
            errorCode: 'NOT_MATURED'
        );

        $this->maturityDate = $maturityDate;
    }

    public readonly string $maturityDate;
}

/**
 * Exception thrown for FDR compounding errors.
 */
class FdrCompoundingException extends FdrException
{
    public function __construct(
        int $subscriptionId,
        string $message
    ) {
        parent::__construct(
            message: "FDR compounding failed: {$message}",
            subscriptionId: $subscriptionId,
            errorCode: 'COMPOUNDING_FAILED'
        );
    }
}
