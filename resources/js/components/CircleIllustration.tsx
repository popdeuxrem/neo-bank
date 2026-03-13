import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CircleIllustrationProps {
    variant?: 'primary' | 'gradient' | 'subtle';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children?: React.ReactNode;
    className?: string;
    animated?: boolean;
}

const CircleIllustration: React.FC<CircleIllustrationProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className,
    animated = true,
}) => {
    const sizeClasses = {
        sm: 'h-32 w-32',
        md: 'h-64 w-64',
        lg: 'h-96 w-96',
        xl: 'h-[500px] w-[500px]',
    };

    const variantClasses = {
        primary: 'bg-[var(--color-primary)]',
        gradient: 'bg-primary-gradient',
        subtle: 'bg-[var(--color-primary)]/10',
    };

    const defaultIcons = (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full opacity-90"
        >
            <circle cx="100" cy="100" r="80" fill="url(#circleGradient)" />
            <path
                d="M100 40C66.8629 40 40 66.8629 40 100C40 133.137 66.8629 160 100 160C133.137 160 160 133.137 160 100C160 66.8629 133.137 40 100 40Z"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.3"
            />
            <circle cx="100" cy="100" r="30" fill="white" fillOpacity="0.2" />
            <path
                d="M70 100C70 83.4315 83.4315 70 100 70C116.569 70 130 83.4315 130 100"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <path
                d="M80 120L100 140L130 100"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient
                    id="circleGradient"
                    x1="40"
                    y1="40"
                    x2="160"
                    y2="160"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#6C2CF5" />
                </linearGradient>
            </defs>
        </svg>
    );

    const Component = animated ? motion.div : 'div';
    const animationProps = animated
        ? {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: {
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1] as any,
              },
          }
        : {};

    return (
        <Component
            className={cn(
                'flex items-center justify-center rounded-full',
                sizeClasses[size],
                variantClasses[variant],
                className,
            )}
            {...animationProps}
        >
            {children || defaultIcons}
        </Component>
    );
};

export { CircleIllustration };
