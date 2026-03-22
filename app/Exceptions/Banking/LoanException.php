<?php

namespace App\Exceptions\Banking;

use InvalidArgumentException;
use RuntimeException;

/**
 * Exception thrown for loan-related errors.
 */
class LoanException extends RuntimeException
{
    public function __construct(
        string $message,
        ?string $loanId = null,
        ?string $errorCode = null,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);

        $this->loanId = $loanId;
        $this->errorCode = $errorCode;
    }

    public readonly ?string $loanId;

    public readonly ?string $errorCode;
}

/**
 * Exception thrown when loan eligibility check fails.
 */
class LoanEligibilityException extends InvalidArgumentException
{
    /** @var array<string> */
    public readonly array $reasons;

    public function __construct(array $reasons)
    {
        $message = 'Loan eligibility check failed: '.implode('; ', $reasons);
        parent::__construct($message);

        $this->reasons = $reasons;
    }
}

/**
 * Exception thrown when loan amount exceeds limit.
 */
class LoanAmountExceededException extends LoanException
{
    public function __construct(
        float $requested,
        float $maximum,
        ?string $loanId = null
    ) {
        parent::__construct(
            message: sprintf('Requested amount %.2f exceeds maximum allowed %.2f', $requested, $maximum),
            loanId: $loanId,
            errorCode: 'AMOUNT_EXCEEDED'
        );

        $this->requestedAmount = $requested;
        $this->maximumAmount = $maximum;
    }

    public readonly float $requestedAmount;

    public readonly float $maximumAmount;
}

/**
 * Exception thrown when loan is in invalid state for operation.
 */
class LoanStateException extends LoanException
{
    public function __construct(
        string $currentState,
        string $requiredState,
        ?string $loanId = null
    ) {
        parent::__construct(
            message: sprintf('Loan state "%s" does not allow operation (required: %s)', $currentState, $requiredState),
            loanId: $loanId,
            errorCode: 'INVALID_STATE'
        );

        $this->currentState = $currentState;
        $this->requiredState = $requiredState;
    }

    public readonly string $currentState;

    public readonly string $requiredState;
}
