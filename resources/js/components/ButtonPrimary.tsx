import { cva  } from 'class-variance-authority';
import type {VariantProps} from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium whitespace-nowrap transition-all duration-[var(--transition-base)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-[var(--color-primary)] text-white shadow-[var(--shadow-primary)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-primary-lg)] active:translate-y-0',
                secondary:
                    'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-background)]',
                outline:
                    'border-2 border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
                ghost: 'hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]',
                destructive:
                    'bg-[var(--color-error)] text-white hover:bg-[#DC2626]',
                link: 'text-[var(--color-primary)] underline-offset-4 hover:underline',
                success:
                    'bg-[var(--color-success)] text-white hover:bg-[#059669]',
                gradient:
                    'bg-primary-gradient text-white shadow-[var(--shadow-primary-lg)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(108_44_245_0.45)]',
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

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant, size, isLoading, disabled, children, ...props },
        ref,
    ) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
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
Button.displayName = 'Button';

export { Button, buttonVariants };
