import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const CheckboxPill = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
        label?: string;
        error?: string;
    }
>(({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
                <CheckboxPrimitive.Root
                    id={checkboxId}
                    className={cn(
                        'peer h-6 w-6 shrink-0 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-[var(--transition-fast)]',
                        'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:bg-[var(--color-primary)]',
                        className,
                    )}
                    ref={ref}
                    {...props}
                >
                    <CheckboxPrimitive.Indicator
                        className={cn(
                            'flex items-center justify-center text-white',
                        )}
                    >
                        <Check className="h-4 w-4" strokeWidth={3} />
                    </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className="cursor-pointer text-sm font-medium text-[var(--color-text-primary)] select-none"
                    >
                        {label}
                    </label>
                )}
            </div>
            {error && (
                <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
});
CheckboxPill.displayName = 'CheckboxPill';

export { CheckboxPill };
