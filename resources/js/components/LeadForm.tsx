import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ButtonPrimary';
import { InputPill } from '@/components/InputPill';
import { Mail, ArrowRight } from 'lucide-react';

interface LeadFormProps {
    onSubmit?: (email: string) => void;
    placeholder?: string;
    buttonText?: string;
    className?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({
    onSubmit,
    placeholder = 'Enter your email',
    buttonText = 'Get Started',
    className,
}) => {
    const [email, setEmail] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState('');
    const [isSuccess, setIsSuccess] = React.useState(false);

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
            await onSubmit?.(email);
            setIsSuccess(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    'flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-success)]/10 px-6 py-4 text-[var(--color-success)]',
                    className,
                )}
            >
                <span className="font-medium">
                    Thanks! We'll be in touch soon.
                </span>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={cn('w-full', className)}>
            <div className="flex gap-3">
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
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                No spam, ever. Unsubscribe anytime.
            </p>
        </form>
    );
};

export { LeadForm };
