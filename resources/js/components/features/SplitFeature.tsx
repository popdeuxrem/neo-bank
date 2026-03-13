import { motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface SplitFeatureProps {
    title: string;
    description: string;
    features?: string[];
    ctaText?: string;
    ctaHref?: string;
    image?: React.ReactNode;
    reverse?: boolean;
    className?: string;
}

export const SplitFeature: React.FC<SplitFeatureProps> = ({
    title,
    description,
    features = [],
    ctaText,
    ctaHref,
    image,
    reverse = false,
    className,
}) => {
    return (
        <div
            className={cn(
                'grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16',
                reverse && 'lg:flex-row-reverse',
                className,
            )}
        >
            {/* Content */}
            <motion.div
                initial={{ opacity: 0, x: reverse ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={cn(reverse && 'lg:order-2')}
            >
                <h3 className="font-hero mb-4 text-3xl font-bold text-[var(--color-text-primary)] lg:text-4xl">
                    {title}
                </h3>
                <p className="mb-6 text-lg text-[var(--color-text-muted)]">
                    {description}
                </p>

                {features.length > 0 && (
                    <ul className="mb-8 space-y-3">
                        {features.map((feature, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                                <span className="text-[var(--color-text-primary)]">
                                    {feature}
                                </span>
                            </motion.li>
                        ))}
                    </ul>
                )}

                {ctaText && (
                    <a
                        href={ctaHref}
                        className="inline-flex items-center gap-2 font-medium text-[var(--color-primary)] transition-all hover:gap-3"
                    >
                        {ctaText}
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </a>
                )}
            </motion.div>

            {/* Visual */}
            <motion.div
                initial={{ opacity: 0, x: reverse ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={cn(reverse && 'lg:order-1')}
            >
                {image || (
                    <div className="relative flex min-h-[300px] items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-light)]/5 p-8">
                        <div className="absolute inset-4 rounded-xl border border-[var(--color-primary)]/20" />
                        <div className="absolute inset-8 rounded-lg border border-[var(--color-primary)]/10" />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SplitFeature;
