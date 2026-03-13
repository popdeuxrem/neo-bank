import { useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/Toast';

export interface TransactionCompletedEvent {
    id: string;
    amount: number;
    currency: string;
    type: 'credit' | 'debit' | 'transfer' | 'payment';
    merchant?: string;
    description: string;
    accountId: string;
    userId: string;
    timestamp: string;
}

export interface FraudAlertTriggeredEvent {
    id: string;
    accountId: string;
    userId: string;
    alertType:
        | 'unusual_activity'
        | 'large_transaction'
        | 'multiple_failed_attempts'
        | 'location_mismatch';
    amount?: number;
    description: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
}

interface UseNotificationEventsOptions {
    enableTransactionCompleted?: boolean;
    enableFraudAlertTriggered?: boolean;
    onTransactionCompleted?: (event: TransactionCompletedEvent) => void;
    onFraudAlertTriggered?: (event: FraudAlertTriggeredEvent) => void;
}

export function useNotificationEvents(
    options: UseNotificationEventsOptions = {},
) {
    const {
        enableTransactionCompleted = true,
        enableFraudAlertTriggered = true,
        onTransactionCompleted,
        onFraudAlertTriggered,
    } = options;

    const handleTransactionCompleted = useCallback(
        (event: TransactionCompletedEvent) => {
            const formattedAmount = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: event.currency,
            }).format(Math.abs(event.amount));

            const prefix = event.type === 'credit' ? '+' : '-';

            toast.success(
                'Transaction Completed',
                `${prefix}${formattedAmount} ${event.type === 'credit' ? 'received from' : 'sent to'} ${event.merchant || event.description}`,
                5000,
            );

            onTransactionCompleted?.(event);
        },
        [onTransactionCompleted],
    );

    const handleFraudAlert = useCallback(
        (event: FraudAlertTriggeredEvent) => {
            const severityLabels = {
                low: 'Low Risk',
                medium: 'Medium Risk',
                high: 'High Risk',
            };

            const toastMethod =
                event.severity === 'high' ? toast.error : toast.warning;

            toastMethod(
                'Security Alert',
                `[${severityLabels[event.severity]}] ${event.description}`,
                event.severity === 'high' ? 0 : 8000,
            );

            onFraudAlertTriggered?.(event);
        },
        [onFraudAlertTriggered],
    );

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const setupEchoListeners = async () => {
            try {
                const { default: echo } = await import('@/lib/echo');
                const echoInstance = echo();

                if (enableTransactionCompleted && echoInstance) {
                    echoInstance
                        .private(`user.{userId}`)
                        .listen(
                            '.transaction.completed',
                            handleTransactionCompleted,
                        )
                        .listen(
                            '.ledger.transaction.created',
                            handleTransactionCompleted,
                        );
                }

                if (enableFraudAlertTriggered && echoInstance) {
                    echoInstance
                        .private(`user.{userId}`)
                        .listen('.fraud.alert', handleFraudAlert)
                        .listen('.security.alert', handleFraudAlert);
                }
            } catch {
                console.warn(
                    'Echo not available, skipping real-time notifications',
                );
            }
        };

        setupEchoListeners();

        return () => {
            // Cleanup is handled by Echo automatically
        };
    }, [
        enableTransactionCompleted,
        enableFraudAlertTriggered,
        handleTransactionCompleted,
        handleFraudAlert,
    ]);

    return {
        handleTransactionCompleted,
        handleFraudAlert,
    };
}

export function simulateTransactionCompleted(
    data: Partial<TransactionCompletedEvent> = {},
) {
    const event: TransactionCompletedEvent = {
        id: data.id || `txn_${Date.now()}`,
        amount: data.amount || Math.random() * 1000,
        currency: data.currency || 'USD',
        type: data.type || (Math.random() > 0.5 ? 'debit' : 'credit'),
        merchant: data.merchant || 'Sample Merchant',
        description: data.description || 'Test transaction',
        accountId: data.accountId || 'acc_001',
        userId: data.userId || 'usr_001',
        timestamp: data.timestamp || new Date().toISOString(),
    };

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: event.currency,
    }).format(Math.abs(event.amount));

    const prefix = event.type === 'credit' ? '+' : '-';

    toast.success(
        'Transaction Completed',
        `${prefix}${formattedAmount} ${event.type === 'credit' ? 'received from' : 'sent to'} ${event.merchant}`,
        5000,
    );

    return event;
}

export function simulateFraudAlert(
    data: Partial<FraudAlertTriggeredEvent> = {},
) {
    const alertTypes: FraudAlertTriggeredEvent['alertType'][] = [
        'unusual_activity',
        'large_transaction',
        'multiple_failed_attempts',
        'location_mismatch',
    ];

    const event: FraudAlertTriggeredEvent = {
        id: data.id || `alert_${Date.now()}`,
        accountId: data.accountId || 'acc_001',
        userId: data.userId || 'usr_001',
        alertType:
            data.alertType ||
            alertTypes[Math.floor(Math.random() * alertTypes.length)],
        amount: data.amount,
        description:
            data.description || 'Unusual activity detected on your account',
        timestamp: data.timestamp || new Date().toISOString(),
        severity:
            data.severity ||
            (Math.random() > 0.7
                ? 'high'
                : Math.random() > 0.4
                  ? 'medium'
                  : 'low'),
    };

    const severityLabels = {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
    };

    const toastMethod = event.severity === 'high' ? toast.error : toast.warning;

    toastMethod(
        'Security Alert',
        `[${severityLabels[event.severity]}] ${event.description}`,
        event.severity === 'high' ? 0 : 8000,
    );

    return event;
}
