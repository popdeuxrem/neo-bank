import { useSyncExternalStore } from 'react';

const CONSENT_KEY = 'magnetiq_consent';
const CONSENT_EXPIRY_DAYS = 365;

type ConsentState = {
    accepted: boolean;
    timestamp: string | null;
};

const listeners = new Set<() => void>();
let currentConsent: ConsentState = { accepted: false, timestamp: null };

const getStoredConsent = (): ConsentState => {
    if (typeof window === 'undefined') {
        return { accepted: false, timestamp: null };
    }

    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
        return { accepted: false, timestamp: null };
    }

    try {
        return JSON.parse(stored) as ConsentState;
    } catch {
        return { accepted: false, timestamp: null };
    }
};

const setStoredConsent = (state: ConsentState): void => {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    localStorage.setItem(`${CONSENT_KEY}_timestamp`, new Date().toISOString());
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

const notify = (): void => {
    listeners.forEach((listener) => listener());
};

export const initializeConsent = (): void => {
    if (typeof window === 'undefined') {
        return;
    }

    currentConsent = getStoredConsent();
};

export const useCookieConsent = (): {
    readonly hasConsented: boolean;
    readonly consentTimestamp: string | null;
    readonly acceptConsent: () => void;
    readonly resetConsent: () => void;
} => {
    const consent = useSyncExternalStore(
        subscribe,
        () => currentConsent,
        () => ({ accepted: false, timestamp: null }),
    );

    const acceptConsent = () => {
        const newState: ConsentState = {
            accepted: true,
            timestamp: new Date().toISOString(),
        };
        currentConsent = newState;
        setStoredConsent(newState);
        notify();
    };

    const resetConsent = () => {
        currentConsent = { accepted: false, timestamp: null };
        localStorage.removeItem(CONSENT_KEY);
        notify();
    };

    return {
        hasConsented: consent.accepted,
        consentTimestamp: consent.timestamp,
        acceptConsent,
        resetConsent,
    } as const;
};

export const hasConsent = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }
    const stored = getStoredConsent();
    return stored.accepted;
};

export const getConsentTimestamp = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem(`${CONSENT_KEY}_timestamp`);
};
