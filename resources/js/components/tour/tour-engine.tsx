import { usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Compass,
    TrendingUp,
    CreditCard,
    Zap,
    BarChart3,
    ArrowRightLeft,
    Bell,
    Send,
    Layers,
    ShieldCheck,
    Command,
    CheckCircle,
    Hexagon,
    PlusCircle,
    Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useMemo
    
    
} from 'react';
import type {ReactNode, ComponentType} from 'react';

interface TourStep {
    id: string;
    target: string;
    title: string;
    body: string;
    icon: LucideIcon;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    navigateTo?: string;
    beforeShow?: () => void | Promise<void>;
    afterShow?: () => void | Promise<void>;
    skipIf?: () => boolean;
    ctaLabel?: string;
    ctaAction?: () => void;
}

interface TourContextValue {
    isActive: boolean;
    currentStep: number;
    totalSteps: number;
    steps: TourStep[];
    currentStepData: TourStep | null;
    next: () => void;
    prev: () => void;
    skip: () => void;
    complete: () => void;
    goToStep: (n: number) => void;
    startTour: () => void;
    isCompleted: boolean;
    isWelcome: boolean;
    isComplete: boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

const TOUR_STEPS: TourStep[] = [
    {
        id: 'sidebar-nav',
        target: '[data-tour="sidebar"]',
        title: 'Your command center',
        body: 'Everything you need lives here. Accounts, transactions, payments, analytics — one click away.',
        icon: Compass,
        position: 'right',
    },
    {
        id: 'balance-card',
        target: '[data-tour="balance"]',
        title: 'Your financial picture, at a glance',
        body: 'This is your total net worth across all accounts. It updates in real time with every transaction.',
        icon: TrendingUp,
        position: 'bottom-right',
    },
    {
        id: 'account-cards',
        target: '[data-tour="accounts"]',
        title: 'All your accounts in one place',
        body: 'Checking, savings, and multi-currency accounts side by side. Click any card to see full details, statements, and transfer options.',
        icon: CreditCard,
        position: 'bottom',
    },
    {
        id: 'quick-actions',
        target: '[data-tour="quick-actions"]',
        title: 'Take action instantly',
        body: 'Send money, add funds, convert currencies, and generate statements — all from right here. No hunting through menus.',
        icon: Zap,
        position: 'left',
    },
    {
        id: 'balance-chart',
        target: '[data-tour="chart"]',
        title: 'Watch your money grow',
        body: 'Your balance history over time. Toggle between 1 week, 1 month, and 1 year to spot trends and plan ahead.',
        icon: BarChart3,
        position: 'top',
    },
    {
        id: 'transactions-feed',
        target: '[data-tour="transactions"]',
        title: 'Every move, instantly visible',
        body: 'Your latest transactions appear here the moment they happen — no refresh needed. Click any row to see the full ledger entry.',
        icon: ArrowRightLeft,
        position: 'left',
    },
    {
        id: 'notifications',
        target: '[data-tour="notifications"]',
        title: 'Stay in the loop',
        body: 'Transaction alerts, security notices, and payment reminders land here. You control exactly which notifications you receive in Settings.',
        icon: Bell,
        position: 'bottom-left',
    },
    {
        id: 'payments',
        target: '[data-tour="payments"]',
        title: 'Send money anywhere',
        body: 'Domestic ACH, international wire, or instant transfer. Save recipients and schedule recurring payments — all from one screen.',
        icon: Send,
        position: 'right',
        navigateTo: '/payments',
    },
    {
        id: 'virtual-cards',
        target: '[data-tour="cards"]',
        title: 'Virtual cards for every purpose',
        body: 'Create unlimited virtual cards for online shopping, subscriptions, and travel. Freeze, set limits, or cancel instantly.',
        icon: Layers,
        position: 'bottom',
        navigateTo: '/cards',
    },
    {
        id: 'kyc-verification',
        target: '[data-tour="kyc"]',
        title: 'Unlock your full account',
        body: 'Complete identity verification to remove transfer limits and access all features. Takes less than 5 minutes.',
        icon: ShieldCheck,
        position: 'right',
        navigateTo: '/settings/kyc',
        skipIf: () => {
            const { user } = usePage().props as { user?: { kyc_verified?: boolean } };

            return user?.kyc_verified === true;
        },
        ctaLabel: 'Start Verification →',
    },
    {
        id: 'command-palette',
        target: '[data-tour="command"]',
        title: 'Your power-user shortcut',
        body: 'Press ⌘K (or Ctrl+K) anywhere to instantly jump to any page, send money, or find a transaction. The fastest way to navigate.',
        icon: Command,
        position: 'bottom',
    },
];

interface TourProviderProps {
    children: ReactNode;
    autoStart?: boolean;
    initialStep?: number;
}

export function TourProvider({ children, autoStart = false, initialStep = 0 }: TourProviderProps) {
    const { onboarding, user } = usePage().props as {
        onboarding?: { completed: boolean; lastStep: number };
        user?: { id: string; first_name: string; kyc_verified?: boolean };
    };

    const [isActive, setIsActive] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [isNavigating, setIsNavigating] = useState(false);

    const isCompleted = onboarding?.completed ?? false;
    const userId = user?.id;
    const firstName = user?.first_name || 'there';

    const userTourKey = userId ? `magnetiq_tour_completed_${userId}` : null;
    const userStepKey = userId ? `magnetiq_tour_step_${userId}` : null;

    useEffect(() => {
        if (userTourKey && userStepKey) {
            const localCompleted = localStorage.getItem(userTourKey);
            const localStep = localStorage.getItem(userStepKey);
            
            if (!isCompleted && !localCompleted) {
                if (autoStart || initialStep > 0) {
                    setShowWelcome(true);
                }
            }
        }
    }, [autoStart, initialStep, isCompleted, userTourKey, userStepKey]);

    const syncStepToBackend = useCallback(async (step: number) => {
        if (userStepKey) {
            localStorage.setItem(userStepKey, step.toString());
        }
        
        try {
            await axios.post('/api/onboarding/step', { step });
        } catch (e) {
            console.error('Failed to sync step to backend:', e);
        }
    }, [userStepKey]);

    const handleComplete = useCallback(async () => {
        if (userTourKey) {
            localStorage.setItem(userTourKey, 'true');
        }
        
        try {
            await axios.post('/api/onboarding/complete');
        } catch (e) {
            console.error('Failed to complete onboarding:', e);
        }
    }, [userTourKey]);

    const handleSkip = useCallback(async () => {
        setIsActive(false);
        setShowWelcome(false);
        setShowComplete(false);
        
        if (userTourKey) {
            localStorage.setItem(userTourKey, 'true');
        }
        
        try {
            await axios.post('/api/onboarding/skip');
        } catch (e) {
            console.error('Failed to skip onboarding:', e);
        }
    }, [userTourKey]);

    const startTour = useCallback(() => {
        setShowWelcome(false);
        setIsActive(true);
        setCurrentStep(0);
        syncStepToBackend(0);
    }, [syncStepToBackend]);

    const next = useCallback(async () => {
        const steps = TOUR_STEPS;
        const nextIndex = currentStep + 1;
        
        if (nextIndex >= steps.length) {
            setIsActive(false);
            setShowComplete(true);
            await handleComplete();

            return;
        }

        const nextStepData = steps[nextIndex];
        
        if (nextStepData.navigateTo && !isNavigating) {
            setIsNavigating(true);
            setCurrentStep(nextIndex);
            
            try {
                await new Promise<void>((resolve) => {
                    router.visit(nextStepData.navigateTo!, {
                        onFinish: () => resolve(),
                    });
                });
            } finally {
                setIsNavigating(false);
                syncStepToBackend(nextIndex);
            }
        } else {
            setCurrentStep(nextIndex);
            syncStepToBackend(nextIndex);
        }
    }, [currentStep, handleComplete, isNavigating, syncStepToBackend]);

    const prev = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            syncStepToBackend(currentStep - 1);
        }
    }, [currentStep, syncStepToBackend]);

    const goToStep = useCallback((n: number) => {
        if (n >= 0 && n < TOUR_STEPS.length) {
            setCurrentStep(n);
            syncStepToBackend(n);
        }
    }, [syncStepToBackend]);

    const skip = useCallback(() => {
        setIsActive(false);
        setShowWelcome(false);
        setShowComplete(false);
        handleSkip();
    }, [handleSkip]);

    const complete = useCallback(async () => {
        setIsActive(false);
        setShowComplete(false);
        await handleComplete();
        router.visit('/dashboard');
    }, [handleComplete]);

    const value = useMemo<TourContextValue>(() => ({
        isActive,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        steps: TOUR_STEPS,
        currentStepData: isActive ? TOUR_STEPS[currentStep] : null,
        next,
        prev,
        skip,
        complete,
        goToStep,
        startTour,
        isCompleted,
        isWelcome: showWelcome,
        isComplete: showComplete,
    }), [
        isActive,
        currentStep,
        next,
        prev,
        skip,
        complete,
        goToStep,
        startTour,
        isCompleted,
        showWelcome,
        showComplete,
    ]);

    return (
        <TourContext.Provider value={value}>
            {children}
        </TourContext.Provider>
    );
}

export function useTour(): TourContextValue {
    const context = useContext(TourContext);

    if (!context) {
        throw new Error('useTour must be used within a TourProvider');
    }

    return context;
}

export const TOUR_ICONS = {
    Compass,
    TrendingUp,
    CreditCard,
    Zap,
    BarChart3,
    ArrowRightLeft,
    Bell,
    Send,
    Layers,
    ShieldCheck,
    Command,
    CheckCircle,
    Hexagon,
    PlusCircle,
    Home,
};

export { TOUR_STEPS };
export type { TourStep };