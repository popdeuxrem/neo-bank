import { useCallback, useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useOnboardingTourCompleted, setTourCompleted, resetTour } from '@/hooks/useOnboardingTour';

interface OnboardingTourProps {
    onTourComplete?: () => void;
}

const tourSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Welcome to Magnetiq! 👋</h3>
                <p>Let's take a quick tour of your new banking dashboard.</p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '[data-tour="sidebar"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Navigation Sidebar</h3>
                <p>Access all your banking features from here. Click icons to navigate between sections.</p>
            </div>
        ),
        placement: 'right',
    },
    {
        target: '[data-tour="balance"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Your Balance</h3>
                <p>View your total balance across all accounts at a glance.</p>
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: '[data-tour="cards"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Virtual Cards</h3>
                <p>Manage your virtual cards. Freeze, unfreeze, or view sensitive details securely.</p>
            </div>
        ),
        placement: 'right',
    },
    {
        target: '[data-tour="transfer"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Send Money</h3>
                <p>Transfer funds to other accounts quickly and securely.</p>
            </div>
        ),
        placement: 'top',
    },
    {
        target: '[data-tour="transactions"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <p>Track all your transactions in one place. Search, filter, and export your history.</p>
            </div>
        ),
        placement: 'top',
    },
    {
        target: '[data-tour="profile"]',
        content: (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Profile Settings</h3>
                <p>Manage your account settings, security preferences, and notifications.</p>
            </div>
        ),
        placement: 'top',
    },
];

export function OnboardingTour({ onTourComplete }: OnboardingTourProps) {
    const tourCompleted = useOnboardingTourCompleted();
    const [runTour, setRunTour] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        if (!tourCompleted) {
            setRunTour(true);
        }
    }, [tourCompleted]);

    const handleJoyrideCallback = useCallback(
        (data: CallBackProps) => {
            const { status, type, index } = data;

            if (type === 'step:after') {
                setStepIndex(index + 1);
            }

            if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
                setTourCompleted(true);
                setRunTour(false);
                onTourComplete?.();
            }
        },
        [onTourComplete],
    );

    const handleSkip = useCallback(() => {
        setTourCompleted(true);
        setRunTour(false);
        onTourComplete?.();
    }, [onTourComplete]);

    if (tourCompleted) {
        return null;
    }

    return (
        <>
            <Joyride
                steps={tourSteps}
                run={runTour}
                continuous
                showSkipButton
                showProgress
                stepIndex={stepIndex}
                callback={handleJoyrideCallback}
                styles={{
                    options: {
                        zIndex: 10000,
                        primaryColor: '#6366f1',
                        textColor: '#1f2937',
                        backgroundColor: '#ffffff',
                        arrowColor: '#ffffff',
                        overlayColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    buttonNext: {
                        borderRadius: '8px',
                        fontWeight: 500,
                    },
                    buttonBack: {
                        marginRight: '8px',
                    },
                }}
                locale={{
                    skip: 'Skip tour',
                    last: 'Finish',
                    next: 'Next',
                    back: 'Back',
                }}
                floaterProps={{
                    disableAnimation: true,
                }}
            />
            {runTour && (
                <div className="fixed bottom-4 right-4 z-[9999]">
                    <button
                        onClick={handleSkip}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                    >
                        Skip tour
                    </button>
                </div>
            )}
        </>
    );
}

export function RestartTourButton() {
    const handleRestart = useCallback(() => {
        resetTour();
        window.location.reload();
    }, []);

    return (
        <button
            onClick={handleRestart}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
            Restart tour
        </button>
    );
}
