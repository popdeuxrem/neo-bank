import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextAreaPillProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const TextAreaPill = React.forwardRef<HTMLTextAreaElement, TextAreaPillProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        'focus:ring-opacity-20 flex min-h-[120px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-base text-[var(--color-text-primary)] transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-text-disabled)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                        error &&
                            'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-sm text-[var(--color-error)]">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);
TextAreaPill.displayName = 'TextAreaPill';

export { TextAreaPill };
