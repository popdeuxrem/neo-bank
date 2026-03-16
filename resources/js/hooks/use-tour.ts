import { useRef, useCallback, useEffect } from 'react';

const registeredTargets = new Map<string, HTMLElement>();

export function registerTourTarget(id: string, element: HTMLElement) {
    registeredTargets.set(id, element);
}

export function getTourTarget(id: string): HTMLElement | undefined {
    return registeredTargets.get(id);
}

export function useTourTarget(stepId: string) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (ref.current) {
            registerTourTarget(stepId, ref.current);
        }

        return () => {
            registeredTargets.delete(stepId);
        };
    }, [stepId]);

    return ref;
}

export function useTour() {
    const { useTour: useTourEngine } = require('./tour-engine');

    return useTourEngine();
}