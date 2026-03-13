import { motion } from 'framer-motion';
import type { LucideIcon} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../Card';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    link?: string;
    className?: string;
    delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon: Icon,
    title,
    description,
    link,
    className,
    delay = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
        >
            <Card hover className={cn('h-full', className)}>
                <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
                        <Icon className="h-6 w-6 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
                        {title}
                    </h3>
                    <p className="mb-4 text-sm text-[var(--color-text-muted)]">
                        {description}
                    </p>
                    {link && (
                        <a
                            href={link}
                            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] transition-all hover:gap-2"
                        >
                            Learn more
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default FeatureCard;
