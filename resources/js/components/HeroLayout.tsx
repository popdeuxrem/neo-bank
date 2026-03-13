import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeroLayoutProps {
    children: React.ReactNode;
    variant?: 'split' | 'centered' | 'float';
    className?: string;
}

const HeroLayout: React.FC<HeroLayoutProps> = ({
    children,
    variant = 'split',
    className,
}) => {
    const variants = {
        split: 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center',
        centered: 'flex flex-col items-center text-center max-w-4xl mx-auto',
        float: 'relative',
    };

    return (
        <section
            className={cn(
                'relative w-full px-4 py-16 md:px-8 md:py-24 lg:py-32',
                'bg-[var(--color-background)]',
                variant === 'float' && 'overflow-hidden',
                className,
            )}
        >
            <div className={cn('mx-auto w-full max-w-7xl', variants[variant])}>
                {children}
            </div>
        </section>
    );
};

interface HeroContentProps {
    children: React.ReactNode;
    className?: string;
}

const HeroContent: React.FC<HeroContentProps> = ({ children, className }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={cn('w-full', className)}
    >
        {children}
    </motion.div>
);

interface HeroVisualProps {
    children: React.ReactNode;
    className?: string;
    align?: 'left' | 'right' | 'center';
}

const HeroVisual: React.FC<HeroVisualProps> = ({
    children,
    className,
    align = 'right',
}) => {
    const alignClasses = {
        left: 'lg:order-first',
        right: 'lg:order-last',
        center: 'lg:order-none',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn(
                'flex w-full justify-center',
                alignClasses[align],
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export { HeroLayout, HeroContent, HeroVisual };
