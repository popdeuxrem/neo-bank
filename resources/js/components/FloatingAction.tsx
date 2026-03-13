import { motion  } from 'framer-motion';
import type {HTMLMotionProps} from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface FloatingActionProps extends Omit<
    HTMLMotionProps<'button'>,
    'children'
> {
    icon: React.ReactNode;
    label: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

const FloatingAction: React.FC<FloatingActionProps> = ({
    icon,
    label,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const sizeClasses = {
        sm: 'h-12 w-12',
        md: 'h-14 w-14',
        lg: 'h-16 w-16',
    };

    const variantClasses = {
        primary:
            'bg-[var(--color-primary)] text-white shadow-[var(--shadow-primary-lg)] hover:bg-[var(--color-primary-dark)]',
        secondary:
            'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] hover:border-[var(--color-primary)]',
        outline:
            'bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)]',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                'flex items-center justify-center rounded-full transition-all duration-[var(--transition-fast)]',
                sizeClasses[size],
                variantClasses[variant],
                className,
            )}
            aria-label={label}
            {...props}
        >
            {icon}
        </motion.button>
    );
};

export { FloatingAction };
