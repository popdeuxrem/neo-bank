import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeroIllustrationProps {
    variant?: 'primary' | 'gradient' | 'abstract';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const HeroIllustration: React.FC<HeroIllustrationProps> = ({
    variant = 'gradient',
    size = 'xl',
    className,
}) => {
    const sizeClasses = {
        sm: 'h-64 w-64',
        md: 'h-80 w-80',
        lg: 'h-96 w-96',
        xl: 'h-[500px] w-[500px]',
    };

    const AbstractPattern = () => (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
        >
            <defs>
                <linearGradient
                    id="heroGradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6C2CF5" />
                    <stop offset="100%" stopColor="#5A1EE5" />
                </linearGradient>
                <linearGradient
                    id="heroGradient2"
                    x1="100%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Main circle */}
            <motion.circle
                cx="200"
                cy="200"
                r="160"
                fill="url(#heroGradient1)"
                filter="url(#glow)"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* Inner circle */}
            <motion.circle
                cx="200"
                cy="200"
                r="100"
                fill="url(#heroGradient2)"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: [0.34, 1.56, 0.64, 1],
                }}
            />

            {/* Accent elements */}
            <motion.circle
                cx="200"
                cy="200"
                r="50"
                fill="white"
                fillOpacity="0.15"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 1,
                    delay: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                }}
            />

            {/* Floating card elements */}
            <motion.g
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <rect
                    x="100"
                    y="120"
                    width="80"
                    height="50"
                    rx="8"
                    fill="white"
                    fillOpacity="0.2"
                />
                <rect
                    x="220"
                    y="180"
                    width="100"
                    height="60"
                    rx="8"
                    fill="white"
                    fillOpacity="0.15"
                />
                <rect
                    x="140"
                    y="230"
                    width="120"
                    height="70"
                    rx="8"
                    fill="white"
                    fillOpacity="0.1"
                />
            </motion.g>

            {/* Decorative dots */}
            {[...Array(6)].map((_, i) => (
                <motion.circle
                    key={i}
                    cx={180 + Math.cos((i * 60 * Math.PI) / 180) * 170}
                    cy={200 + Math.sin((i * 60 * Math.PI) / 180) * 170}
                    r="4"
                    fill="white"
                    fillOpacity="0.5"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                />
            ))}
        </svg>
    );

    const GradientPattern = () => (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
        >
            <defs>
                <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#5A1EE5" />
                </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#radialGradient)" />
            <circle cx="200" cy="200" r="120" fill="white" fillOpacity="0.1" />
            <circle cx="200" cy="200" r="60" fill="white" fillOpacity="0.2" />
        </svg>
    );

    const PrimaryPattern = () => (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
        >
            <circle cx="200" cy="200" r="180" fill="#6C2CF5" />
            <circle cx="200" cy="200" r="100" fill="#7C3AED" />
            <circle cx="200" cy="200" r="50" fill="white" fillOpacity="0.2" />
        </svg>
    );

    const patterns = {
        primary: PrimaryPattern,
        gradient: GradientPattern,
        abstract: AbstractPattern,
    };

    const Pattern = patterns[variant];

    return (
        <div
            className={cn(
                'relative flex items-center justify-center',
                sizeClasses[size],
                className,
            )}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative"
            >
                <Pattern />
            </motion.div>

            {/* Floating orbs */}
            <motion.div
                className="absolute top-1/4 -right-8 h-4 w-4 rounded-full bg-[var(--color-primary-light)] opacity-60"
                animate={{
                    y: [0, -10, 0],
                    opacity: [0.6, 0.3, 0.6],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute bottom-1/3 -left-4 h-3 w-3 rounded-full bg-[var(--color-primary)] opacity-40"
                animate={{
                    y: [0, 10, 0],
                    opacity: [0.4, 0.2, 0.4],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                }}
            />
        </div>
    );
};

export { HeroIllustration };
