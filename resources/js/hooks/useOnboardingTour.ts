import { useSyncExternalStore } from 'react';

const TOUR_KEY = 'magnetiq_onboarding_tour_completed';

const listeners = new Set<() => void>();
let tourCompleted = false;

const getStoredTour = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    const stored = localStorage.getItem(TOUR_KEY);

    return stored === 'true';
};

const setStoredTour = (completed: boolean): void => {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(TOUR_KEY, completed.toString());
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => {
    listeners.forEach((listener) => listener());
};

export const initializeTour = (): void => {
    if (typeof window === 'undefined') {
        return;
    }

    tourCompleted = getStoredTour();
};

export const useOnboardingTourCompleted = (): boolean => {
    return useSyncExternalStore(
        subscribe,
        () => tourCompleted,
        () => false,
    );
};

export const setTourCompleted = (completed: boolean): void => {
    tourCompleted = completed;
    setStoredTour(completed);
    notify();
};

export const resetTour = (): void => {
    tourCompleted = false;
    localStorage.removeItem(TOUR_KEY);
    notify();
};
