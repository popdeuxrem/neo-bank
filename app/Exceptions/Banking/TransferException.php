<?php

namespace App\Exceptions\Banking;

use InvalidArgumentException;
use RuntimeException;

/**
 * Base exception for transfer-related errors.
 */
class TransferException extends RuntimeException
{
    public function __construct(
        string $message,
        ?string $reference = null,
        ?string $errorCode = null,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);

        $this->reference = $reference;
        $this->errorCode = $errorCode;
    }

    public readonly ?string $reference;

    public readonly ?string $errorCode;
}

/**
 * Exception thrown when transfer validation fails.
 */
class TransferValidationException extends InvalidArgumentException
{
    /** @var array<string> */
    public readonly array $errors;

    public function __construct(array $errors)
    {
        $message = 'Transfer validation failed: '.implode('; ', $errors);
        parent::__construct($message);

        $this->errors = $errors;
    }
}

/**
 * Exception thrown when transfer limit is exceeded.
 */
class TransferLimitException extends TransferException
{
    public function __construct(
        float $amount,
        float $limit,
        string $type = 'daily'
    ) {
        parent::__construct(
            message: sprintf('Transfer limit exceeded: %.2f exceeds %s limit of %.2f', $amount, $type, $limit),
            errorCode: 'LIMIT_EXCEEDED'
        );

        $this->amount = $amount;
        $this->limit = $limit;
        $this->limitType = $type;
    }

    public readonly float $amount;

    public readonly float $limit;

    public readonly string $limitType;
}

/**
 * Exception thrown when wire transfer fails.
 */
class WireTransferException extends TransferException
{
    public function __construct(
        string $message,
        ?string $reference = null,
        ?string $errorCode = null
    ) {
        parent::__construct($message, $reference, $errorCode ?? 'WIRE_TRANSFER_FAILED');
    }
}

/**
 * Exception thrown when SWIFT transfer fails.
 */
class SwiftTransferException extends TransferException
{
    public function __construct(
        string $message,
        ?string $reference = null,
        ?string $errorCode = null
    ) {
        parent::__construct($message, $reference, $errorCode ?? 'SWIFT_TRANSFER_FAILED');
    }
}
