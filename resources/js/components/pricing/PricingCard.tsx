import { motion } from 'framer-motion';
import { LucideIcon, Check } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ButtonPrimary';
import { ButtonSecondary } from '../ButtonSecondary';

interface PricingFeature {
    text: string;
    included: boolean;
}

interface PricingCardProps {
    name: string;
    price: string;
    description: string;
    features: PricingFeature[];
    highlighted?: boolean;
    cta?: string;
    ctaVariant?: 'primary' | 'secondary';
    className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
    name,
    price,
    description,
    features,
    highlighted = false,
    cta = 'Get Started',
    ctaVariant = 'primary',
    className,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                'relative rounded-2xl border bg-[var(--color-surface)] p-8 transition-all',
                highlighted
                    ? 'scale-105 border-[var(--color-primary)] shadow-[var(--color-primary)]/10 shadow-xl'
                    : 'border-[var(--color-border)]',
                className,
            )}
        >
            {highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-4 py-1 text-sm font-medium text-white">
                    Recommended
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                    {name}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {description}
                </p>
            </div>

            <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                    {price}
                </span>
                {price !== 'Custom' && (
                    <span className="text-[var(--color-text-muted)]">
                        /month
                    </span>
                )}
            </div>

            <ul className="mb-8 space-y-3">
                {features.map((feature, index) => (
                    <li
                        key={index}
                        className={cn(
                            'flex items-center gap-3 text-sm',
                            feature.included
                                ? 'text-[var(--color-text-primary)]'
                                : 'text-[var(--color-text-disabled)]',
                        )}
                    >
                        <Check
                            className={cn(
                                'h-5 w-5',
                                feature.included
                                    ? 'text-[var(--color-success)]'
                                    : 'text-[var(--color-text-disabled)]',
                            )}
                        />
                        {feature.text}
                    </li>
                ))}
            </ul>

            {ctaVariant === 'primary' ? (
                <Button className="w-full">{cta}</Button>
            ) : (
                <ButtonSecondary className="w-full">{cta}</ButtonSecondary>
            )}
        </motion.div>
    );
};

export default PricingCard;
