import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonSecondaryVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 text-sm font-medium whitespace-nowrap transition-all duration-[var(--transition-base)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
                outline:
                    'border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
                subtle: 'border-[var(--color-border-light)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
            },
            size: {
                default: 'h-11 px-6 py-2',
                sm: 'h-9 rounded-md px-4 text-xs',
                lg: 'h-14 rounded-md px-8 text-base',
                xl: 'h-16 rounded-lg px-10 text-lg',
                icon: 'h-10 w-10',
                'icon-sm': 'h-8 w-8',
                'icon-lg': 'h-12 w-12',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonSecondaryProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonSecondaryVariants> {
    isLoading?: boolean;
}

const ButtonSecondary = React.forwardRef<
    HTMLButtonElement,
    ButtonSecondaryProps
>(
    (
        { className, variant, size, isLoading, disabled, children, ...props },
        ref,
    ) => {
        return (
            <button
                className={cn(
                    buttonSecondaryVariants({ variant, size, className }),
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    },
);
ButtonSecondary.displayName = 'ButtonSecondary';

export { ButtonSecondary, buttonSecondaryVariants };
