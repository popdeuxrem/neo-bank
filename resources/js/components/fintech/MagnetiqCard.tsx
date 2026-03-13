'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagnetiqCardProps {
    cardholderName: string;
    lastFour: string;
    expiry: string;
    brand?: string;
    status?: 'active' | 'frozen' | 'cancelled';
    cvv?: string;
    className?: string;
    onFlip?: (isFlipped: boolean) => void;
}

export function MagnetiqCard({
    cardholderName,
    lastFour,
    expiry,
    brand = 'Visa',
    status = 'active',
    cvv,
    className,
    onFlip,
}: MagnetiqCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        if (status !== 'active') return;
        const newState = !isFlipped;
        setIsFlipped(newState);
        onFlip?.(newState);
    };

    const isFrozen = status === 'frozen';
    const isCancelled = status === 'cancelled';

    return (
        <div
            className={cn(
                'perspective-1000 relative h-48 w-80',
                isFrozen && 'opacity-75 grayscale',
                isCancelled && 'opacity-50 grayscale',
                className,
            )}
            style={{ aspectRatio: '1.586' }}
        >
            <motion.div
                className="preserve-3d relative h-full w-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of Card */}
                <div
                    className="absolute inset-0 overflow-hidden rounded-2xl backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-purple-900 via-violet-800 to-purple-950 p-6">
                        {/* Card Brand */}
                        <div className="flex items-start justify-between">
                            <div className="text-xl font-bold tracking-wider text-white">
                                {brand.toUpperCase()}
                            </div>
                            <svg
                                className="h-8 w-12 opacity-80"
                                viewBox="0 0 48 32"
                                fill="none"
                            >
                                <circle
                                    cx="16"
                                    cy="16"
                                    r="14"
                                    fill="#fff"
                                    fillOpacity="0.2"
                                />
                                <circle
                                    cx="32"
                                    cy="16"
                                    r="14"
                                    fill="#fff"
                                    fillOpacity="0.2"
                                />
                            </svg>
                        </div>

                        {/* Card Number */}
                        <div className="font-mono text-xl tracking-[0.2em] text-white">
                            **** **** **** {lastFour}
                        </div>

                        {/* Card Details */}
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="mb-1 text-xs text-white/60 uppercase">
                                    Card Holder
                                </div>
                                <div className="text-sm font-medium tracking-wide text-white">
                                    {cardholderName}
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 text-xs text-white/60 uppercase">
                                    Expires
                                </div>
                                <div className="text-sm font-medium text-white">
                                    {expiry}
                                </div>
                            </div>
                        </div>

                        {/* Frozen Badge Overlay */}
                        {isFrozen && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <div className="-rotate-12 transform rounded-full border-2 border-white bg-red-600 px-6 py-2 text-lg font-bold tracking-wider text-white">
                                    FROZEN
                                </div>
                            </div>
                        )}

                        {isCancelled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <div className="-rotate-12 transform rounded-full border-2 border-white bg-gray-600 px-6 py-2 text-lg font-bold tracking-wider text-white">
                                    CANCELLED
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back of Card */}
                <div
                    className="absolute inset-0 overflow-hidden rounded-2xl"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <div className="flex h-full w-full flex-col bg-gradient-to-br from-purple-900 via-violet-800 to-purple-950 p-6">
                        {/* Magnetic Strip */}
                        <div className="-mx-6 mb-6 h-10 w-full bg-black/40" />

                        {/* CVV Section */}
                        <div className="mt-auto">
                            <div className="mb-2 flex justify-end">
                                <div className="rounded bg-white px-2 py-1">
                                    <div className="font-mono text-lg tracking-widest text-purple-900">
                                        {cvv || '***'}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-xs text-white/60">
                                CVV
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

interface CardFlipButtonProps {
    isFlipped: boolean;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

export function CardFlipButton({
    isFlipped,
    onClick,
    disabled,
    className,
}: CardFlipButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                'bg-purple-100 text-purple-700 hover:bg-purple-200',
                'dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50',
                disabled && 'cursor-not-allowed opacity-50',
                className,
            )}
        >
            {isFlipped ? 'Show Front' : 'Show CVV'}
        </button>
    );
}
