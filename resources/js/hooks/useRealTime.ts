import { useEffect, useCallback } from 'react';
import { getEchoInstance, disconnectEcho } from '@/lib/echo';

export interface TransactionCompletedData {
    uuid: string;
    transaction_number: string;
    type: string;
    amount: number;
    status: string;
    posted_at: string;
    created_at: string;
}

export interface FraudAlertData {
    alert_type: string;
    severity: 'critical' | 'high' | 'medium';
    account: {
        id: number;
        account_number: string;
        name: string;
    };
    transaction: {
        amount: number;
        type: string;
    };
    flags: string[];
    risk_score: number;
    recommendation: string;
    timestamp: string;
    message: string;
}

export interface RealTimeCallbacks {
    onTransactionCompleted?: (data: TransactionCompletedData) => void;
    onFraudAlert?: (data: FraudAlertData) => void;
    onConnected?: (channel: string) => void;
    onError?: (error: Error) => void;
}

export interface UseRealTimeOptions {
    userId?: number | string;
    enabled?: boolean;
    callbacks?: RealTimeCallbacks;
}

export function useRealTime(options: UseRealTimeOptions = {}) {
    const { userId, enabled = true, callbacks } = options;

    const handleTransactionCompleted = useCallback(
        (data: TransactionCompletedData) => {
            callbacks?.onTransactionCompleted?.(data);
        },
        [callbacks],
    );

    const handleFraudAlert = useCallback(
        (data: FraudAlertData) => {
            callbacks?.onFraudAlert?.(data);
        },
        [callbacks],
    );

    useEffect(() => {
        if (!enabled || !userId) {
            return;
        }

        const echo = getEchoInstance();

        const privateChannel = echo.private(`user.${userId}`);

        privateChannel
            .listen('transaction.completed', handleTransactionCompleted)
            .listen('fraud.alert', handleFraudAlert)
            .listen('.transaction.completed', handleTransactionCompleted)
            .listen('.fraud.alert', handleFraudAlert);

        privateChannel.on('pusher:subscription_succeeded', () => {
            callbacks?.onConnected?.(`user.${userId}`);
        });

        privateChannel.on('pusher:subscription_error', (error: Error) => {
            callbacks?.onError?.(error);
        });

        return () => {
            privateChannel.stopListening('transaction.completed');
            privateChannel.stopListening('fraud.alert');
            privateChannel.stopListening('.transaction.completed');
            privateChannel.stopListening('.fraud.alert');
        };
    }, [
        enabled,
        userId,
        handleTransactionCompleted,
        handleFraudAlert,
        callbacks,
    ]);

    return {
        disconnect: disconnectEcho,
    };
}

export default useRealTime;
