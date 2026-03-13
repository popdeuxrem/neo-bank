import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../Card';
import { LucideIcon } from 'lucide-react';

interface TestimonialCardProps {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
    className?: string;
    delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
    quote,
    author,
    role,
    avatar,
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
            <Card className={cn('h-full', className)}>
                <CardContent className="pt-6">
                    <p className="text-lg text-[var(--color-text-primary)]">
                        "{quote}"
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                        {avatar && (
                            <img
                                src={avatar}
                                alt={author}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        )}
                        <div>
                            <p className="font-semibold text-[var(--color-text-primary)]">
                                {author}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                {role}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TestimonialCard;
