import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ButtonPrimary';
import { InputPill } from '../InputPill';

interface SignupFormProps {
    onSubmit?: (email: string) => void;
    placeholder?: string;
    buttonText?: string;
    showPrivacy?: boolean;
    className?: string;
    useOptimisticUI?: boolean;
    useApi?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
    onSubmit,
    placeholder = 'Enter your email address',
    buttonText = 'Open Free Account',
    showPrivacy = true,
    className,
    useOptimisticUI = true,
    useApi = true,
}) => {
    const [email, setEmail] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required');

            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email');

            return;
        }

        setIsSubmitting(true);

        try {
            if (useApi) {
                try {
                    await fetch('/leads', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN':
                                document
                                    .querySelector('meta[name="csrf-token"]')
                                    ?.getAttribute('content') || '',
                        },
                        body: JSON.stringify({ email }),
                    });
                } catch {
                    // Fallback: just continue with success
                }
            }

            if (useOptimisticUI) {
                setIsSuccess(true);
            }

            await onSubmit?.(email);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                    'flex items-center justify-center gap-3 rounded-2xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 p-4',
                    className,
                )}
            >
                <CheckCircle2 className="h-6 w-6 text-[var(--color-success)]" />
                <span className="font-medium text-[var(--color-success)]">
                    Welcome to NeoBank! Check your email to get started.
                </span>
            </motion.div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={cn('w-full max-w-md', className)}
        >
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                    <InputPill
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={placeholder}
                        icon={<Mail className="h-5 w-5" />}
                        error={error}
                        aria-label="Email address"
                    />
                </div>
                <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    className="whitespace-nowrap"
                >
                    {buttonText}
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
            {showPrivacy && (
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                    By signing up, you agree to our{' '}
                    <a
                        href="/terms"
                        className="text-[var(--color-primary)] hover:underline"
                    >
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                        href="/privacy"
                        className="text-[var(--color-primary)] hover:underline"
                    >
                        Privacy Policy
                    </a>
                </p>
            )}
        </form>
    );
};

export default SignupForm;
