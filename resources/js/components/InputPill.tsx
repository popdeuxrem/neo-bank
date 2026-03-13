import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputPillProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const InputPill = React.forwardRef<HTMLInputElement, InputPillProps>(
    ({ className, label, error, icon, type = 'text', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-text-muted)]">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            'focus:ring-opacity-20 flex h-14 w-full rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-base text-[var(--color-text-primary)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-text-disabled)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                            icon && 'pl-12',
                            error &&
                                'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]',
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-[var(--color-error)]">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);
InputPill.displayName = 'InputPill';

export { InputPill };
