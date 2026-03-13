import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeroHeadlineProps {
    title: string;
    subtitle?: string;
    highlights?: string[];
    className?: string;
}

const HeroHeadline: React.FC<HeroHeadlineProps> = ({
    title,
    subtitle,
    highlights = [],
    className,
}) => {
    const renderHighlightedText = () => {
        if (highlights.length === 0) {
            return title;
        }

        const parts = title.split(
            new RegExp(`(${highlights.join('|')})`, 'gi'),
        );
        return parts.map((part, index) => {
            const isHighlight = highlights.some(
                (h) => h.toLowerCase() === part.toLowerCase(),
            );
            return isHighlight ? (
                <span
                    key={index}
                    className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent"
                >
                    {part}
                </span>
            ) : (
                part
            );
        });
    };

    return (
        <div className={cn('max-w-2xl', className)}>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="font-hero text-5xl leading-tight font-bold tracking-tight text-[var(--color-text-primary)] md:text-6xl lg:text-[var(--text-hero-xl)]"
            >
                {renderHighlightedText()}
            </motion.h1>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.1,
                        ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="mt-6 text-lg text-[var(--color-text-muted)] md:text-xl"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
};

export { HeroHeadline };
