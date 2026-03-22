# Implementation Plan: FinCore Phase 2 & 3 Services

## Status: COMPLETED ✅

All services have been implemented successfully.

## Existing Code Analysis

### Already Implemented ✅
1. **FDR Compounding Job** - `app/Jobs/Banking/ProcessFdrCompounding.php` (Complete)
2. **Loan Origination Service** - `app/Services/Banking/LoanOriginationService.php` (Complete)
3. **Deposit Service** - `app/Services/Banking/DepositService.php` (Complete)
4. **Withdrawal Service** - `app/Services/Banking/WithdrawalService.php` (Complete)
5. **Payment Gateway Interface** - `app/Contracts/Payment/PaymentGatewayInterface.php` (Complete)
6. **Gateway Implementations**:
   - StripeGateway ✅
   - CryptoGateway ✅
   - ManualGateway ✅
7. **Ledger Services**:
   - LedgerService ✅
   - AtomicTransferService ✅

### Missing Services ❌
1. **InternalTransferService** - Internal fund transfers between users
2. **WireTransferService** - Wire transfer operations
3. **SwiftTransferService** - SWIFT international transfers
4. **BillPaymentService** - Bill payment processing
5. **DpsCompoundingJob** - DPS installment processing job

## Implementation Tasks

### Task 1: InternalTransferService
**File**: `app/Services/Banking/InternalTransferService.php`

**Requirements**:
- Handle internal fund transfers between users
- Integrate with LedgerService for atomic double-entry transactions
- Apply fraud detection checks
- Support transaction fees
- Handle metadata and audit logging

**Methods**:
- `createTransfer(User $sender, array $data): InternalTransfer`
- `validateTransfer(User $sender, array $data): void`
- `processTransfer(InternalTransfer $transfer): void`
- `reverseTransfer(InternalTransfer $transfer, string $reason): void`
- `getTransferHistory(User $user, array $filters): Collection`

**Exception Handling**:
- InvalidArgumentException for validation failures
- RuntimeException for processing failures
- InsufficientFundsException

---

### Task 2: WireTransferService
**File**: `app/Services/Banking/WireTransferService.php`

**Requirements**:
- Handle domestic and international wire transfers
- Compliance checks for international transfers
- Fee calculation based on destination
- SWIFT/BIC validation
- Status tracking

**Methods**:
- `createTransfer(User $user, array $data): WireTransfer`
- `validateTransferData(array $data): void`
- `calculateFees(float $amount, string $destinationCountry): array`
- `submitTransfer(WireTransfer $transfer): void`
- `trackTransfer(string $trackingNumber): array`
- `cancelTransfer(WireTransfer $transfer): void`

**Exception Handling**:
- InvalidArgumentException for invalid data
- RuntimeException for submission failures
- ComplianceException for compliance failures

---

### Task 3: SwiftTransferService
**File**: `app/Services/Banking/SwiftTransferService.php`

**Requirements**:
- Handle SWIFT international transfers
- Multi-currency support with exchange rates
- Compliance and sanctions screening
- Intermediary bank handling
- MT103 message generation support

**Methods**:
- `createTransfer(User $user, array $data): SwiftTransfer`
- `validateSwiftDetails(array $data): void`
- `calculateExchangeRate(string $fromCurrency, string $toCurrency): float`
- `calculateFees(float $amount, array $data): array`
- `submitTransfer(SwiftTransfer $transfer): void`
- `updateSwiftStatus(SwiftTransfer $transfer, string $status): void`
- `getTrackingInfo(SwiftTransfer $transfer): array`

**Exception Handling**:
- InvalidArgumentException for validation failures
- RuntimeException for processing failures
- ComplianceException for sanctions screening failures

---

### Task 4: BillPaymentService
**File**: `app/Services/Banking/BillPaymentService.php`

**Requirements**:
- Process bill payments for various providers
- Support multiple bill categories (utilities, telecom, etc.)
- Fee calculation per provider
- Status tracking and reconciliation
- Recurring bill payment support

**Methods**:
- `processPayment(User $user, array $data): BillPayment`
- `validatePaymentData(array $data): void`
- `getBillCategories(): array`
- `getProviders(int $categoryId): array`
- `calculateFees(float $amount, BillProvider $provider): array`
- `checkBillStatus(BillPayment $payment): array`
- `scheduleRecurringPayment(User $user, array $data): ScheduledPayment`

**Exception Handling**:
- InvalidArgumentException for validation failures
- RuntimeException for processing failures
- ProviderUnavailableException

---

### Task 5: DpsCompoundingJob
**File**: `app/Jobs/Banking/ProcessDpsCompounding.php`

**Requirements**:
- Process DPS (Deposit Pension Scheme) installments
- Calculate interest on accumulated deposits
- Handle maturity processing
- Integrate with LedgerService
- Update DpsSubscription records

**Methods**:
- `handle(): void`
- `getSubscriptionsToProcess(): Collection`
- `processInstallment(DpsSubscription $subscription): void`
- `calculateInterest(DpsSubscription $subscription): int`
- `processMaturity(DpsSubscription $subscription): void`
- `recordUserEarnings(DpsSubscription $subscription, int $interest): void`

**Exception Handling**:
- InvalidArgumentException for calculation errors
- RuntimeException for processing failures

---

## Type Definitions

### Transfer Data Structures
```php
// Internal Transfer Data
array{
    recipient_user_id: int,
    amount: float,
    currency: string,
    description?: string,
    metadata?: array
}

// Wire Transfer Data
array{
    recipient_name: string,
    bank_name: string,
    account_number: string,
    swift_bic?: string,
    amount: float,
    currency: string,
    purpose: string,
    destination_country: string
}

// SWIFT Transfer Data
array{
    recipient_name: string,
    recipient_address: string,
    recipient_country: string,
    bank_name: string,
    bank_address: string,
    bank_country: string,
    swift_bic: string,
    iban?: string,
    account_number?: string,
    amount: float,
    currency: string,
    purpose: string,
    intermediary_bank?: array
}

// Bill Payment Data
array{
    provider_id: int,
    bill_number: string,
    amount: float,
    account_id?: int,
    metadata?: array
}
```

## Exception Classes

All services should throw these exception types:
- `InvalidArgumentException` - Validation failures
- `RuntimeException` - Processing failures
- `InsufficientFundsException` - Balance check failures
- `ComplianceException` - Regulatory/compliance failures

## Testing Strategy

1. Unit tests for each service method
2. Integration tests with LedgerService
3. Exception handling tests
4. Database transaction rollback tests

## Dependencies

### Services
- LedgerService
- FraudDetectionService
- GatewayManager

### Models
- InternalTransfer
- WireTransfer
- SwiftTransfer
- BillPayment
- BillCategory
- BillProvider
- DpsSubscription
- DpsInstallment
- Wallet
- User

### Contracts/Interfaces
- PaymentGatewayInterface

## Implementation Order

1. InternalTransferService (highest priority - core banking)
2. BillPaymentService (Phase 2 requirement)
3. WireTransferService (Phase 2 requirement)
4. SwiftTransferService (Phase 2 requirement)
5. DpsCompoundingJob (Phase 2 requirement)

## Notes

- All services must use strict typing (`declare(strict_types=1)`)
- All methods must have proper PHPDoc with type hints
- Database transactions must be used for atomic operations
- Audit logging required for all financial operations
- Follow existing code patterns in DepositService/WithdrawalService
- Never implement or reference Paystack (per specification constraint)
