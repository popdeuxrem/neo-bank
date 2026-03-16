import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useTour } from './tour-engine';

interface TourTooltipProps {
    targetSelector: string;
}

export function TourTooltip({ targetSelector }: TourTooltipProps) {
    const { currentStepData, currentStep, totalSteps, next, prev, skip, isActive } = useTour();
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
        if (!targetSelector || !currentStepData) {
return;
}

        const element = document.querySelector(targetSelector) as HTMLElement | null;

        if (!element) {
return;
}

        const rect = element.getBoundingClientRect();
        const tooltipWidth = 380;
        const tooltipHeight = 280;
        const gap = 16;

        let top = 0;
        let left = 0;

        switch (currentStepData.position) {
            case 'top':
                top = rect.top - tooltipHeight - gap;
                left = rect.left + (rect.width - tooltipWidth) / 2;
                break;
            case 'top-right':
                top = rect.top - tooltipHeight - gap;
                left = rect.right - tooltipWidth;
                break;
            case 'top-left':
                top = rect.top - tooltipHeight - gap;
                left = rect.left;
                break;
            case 'bottom':
                top = rect.bottom + gap;
                left = rect.left + (rect.width - tooltipWidth) / 2;
                break;
            case 'bottom-right':
                top = rect.bottom + gap;
                left = rect.right - tooltipWidth;
                break;
            case 'bottom-left':
                top = rect.bottom + gap;
                left = rect.left;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipHeight) / 2;
                left = rect.left - tooltipWidth - gap;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipHeight) / 2;
                left = rect.right + gap;
                break;
            case 'center':
                top = (window.innerHeight - tooltipHeight) / 2;
                left = (window.innerWidth - tooltipWidth) / 2;
                break;
        }

        const padding = 20;

        if (left < padding) {
left = padding;
}

        if (left + tooltipWidth > window.innerWidth - padding) {
            left = window.innerWidth - tooltipWidth - padding;
        }

        if (top < padding) {
top = padding;
}

        if (top + tooltipHeight > window.innerHeight - padding) {
            top = window.innerHeight - tooltipHeight - padding;
        }

        setPosition({ top, left });
    }, [targetSelector, currentStepData]);

    useEffect(() => {
        updatePosition();

        const handleResize = () => updatePosition();
        window.addEventListener('resize', handleResize);

        const interval = setInterval(updatePosition, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, [updatePosition]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isActive) {
return;
}
            
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                e.preventDefault();
                next();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prev();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                skip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, next, prev, skip]);

    if (!isActive || !currentStepData) {
return null;
}

    const Icon = currentStepData.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed z-[9999] w-[380px] overflow-hidden rounded-2xl border border-white/15 bg-zinc-900/95 backdrop-blur-xl shadow-2xl"
                style={{ top: position.top, left: position.left }}
            >
                <div className="relative p-6">
                    <button
                        onClick={skip}
                        className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>

                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                        <Icon className="h-5 w-5 text-indigo-400" />
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-white">
                        {currentStepData.title}
                    </h3>

                    <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                        {currentStepData.body}
                    </p>

                    {currentStepData.ctaLabel && (
                        <button
                            onClick={currentStepData.ctaAction}
                            className="mb-6 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
                        >
                            {currentStepData.ctaLabel}
                        </button>
                    )}

                    <div className="flex items-center justify-between">
                        <button
                            onClick={prev}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                currentStep === 0
                                    ? 'text-zinc-600 cursor-not-allowed'
                                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                                        i < currentStep
                                            ? 'bg-indigo-500'
                                            : i === currentStep
                                            ? 'bg-indigo-400 scale-125'
                                            : 'bg-zinc-700'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="absolute right-6 top-6 text-xs font-medium text-zinc-600">
                        {currentStep + 1} of {totalSteps}
                    </div>
                </div>

                {currentStepData.position.includes('bottom') && (
                    <div
                        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full"
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderBottom: '8px solid rgba(24, 24, 27, 0.95)',
                        }}
                    />
                )}
                {currentStepData.position.includes('top') && (
                    <div
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full"
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid rgba(24, 24, 27, 0.95)',
                        }}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}