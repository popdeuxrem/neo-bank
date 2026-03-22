<?php

namespace App\Exceptions\Payment;

use InvalidArgumentException;
use RuntimeException;

/**
 * Base exception for payment-related errors.
 */
class PaymentException extends RuntimeException
{
    public function __construct(
        string $message,
        ?string $transactionId = null,
        ?string $errorCode = null,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);

        $this->transactionId = $transactionId;
        $this->errorCode = $errorCode;
    }

    public readonly ?string $transactionId;

    public readonly ?string $errorCode;
}

/**
 * Exception thrown when payment amount is invalid.
 */
class InvalidPaymentAmountException extends InvalidArgumentException
{
    public function __construct(
        float $amount,
        ?float $minAmount = null,
        ?float $maxAmount = null
    ) {
        $message = 'Invalid payment amount: '.$amount;

        if ($minAmount !== null && $maxAmount !== null) {
            $message .= " (must be between {$minAmount} and {$maxAmount})";
        } elseif ($minAmount !== null) {
            $message .= " (must be at least {$minAmount})";
        } elseif ($maxAmount !== null) {
            $message .= " (must not exceed {$maxAmount})";
        }

        parent::__construct($message);

        $this->amount = $amount;
        $this->minAmount = $minAmount;
        $this->maxAmount = $maxAmount;
    }

    public readonly float $amount;

    public readonly ?float $minAmount;

    public readonly ?float $maxAmount;
}

/**
 * Exception thrown when payment gateway is not available.
 */
class GatewayUnavailableException extends PaymentException
{
    public function __construct(
        string $gateway
    ) {
        parent::__construct(
            message: "Payment gateway '{$gateway}' is not available",
            errorCode: 'GATEWAY_UNAVAILABLE'
        );

        $this->gateway = $gateway;
    }

    public readonly string $gateway;
}

/**
 * Exception thrown when currency is not supported.
 */
class CurrencyNotSupportedException extends InvalidArgumentException
{
    public function __construct(
        string $currency
    ) {
        parent::__construct("Currency '{$currency}' is not supported");

        $this->currency = $currency;
    }

    public readonly string $currency;
}

/**
 * Exception thrown when withdrawal fails.
 */
class WithdrawalException extends PaymentException
{
    public function __construct(
        string $message,
        ?string $transactionId = null,
        ?string $errorCode = null
    ) {
        parent::__construct($message, $transactionId, $errorCode ?? 'WITHDRAWAL_FAILED');
    }
}

/**
 * Exception thrown when deposit fails.
 */
class DepositException extends PaymentException
{
    public function __construct(
        string $message,
        ?string $transactionId = null,
        ?string $errorCode = null
    ) {
        parent::__construct($message, $transactionId, $errorCode ?? 'DEPOSIT_FAILED');
    }
}
