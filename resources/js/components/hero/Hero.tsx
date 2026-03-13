import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../core';
import { cn } from '@/lib/utils';
import { HeroHeadline } from '../HeroHeadline';
import { HeroIllustration } from '../HeroIllustration';
import { LeadForm } from '../LeadForm';
import { CheckCircle2 } from 'lucide-react';

interface HeroProps {
    className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className }) => {
    return (
        <section
            className={cn(
                'relative overflow-hidden bg-[var(--color-background)] pt-32 pb-20 md:pt-40 md:pb-28',
                className,
            )}
        >
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="bg-gradient-radial absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full from-[var(--color-primary)]/10 to-transparent blur-3xl" />
            </div>

            <Container>
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <HeroHeadline
                            title="Banking built for the future"
                            subtitle="Experience seamless financial management with NeoBank. Instant transfers, smart budgeting, and bank-grade security—all in one beautiful app."
                            highlights={['future', 'NeoBank']}
                        />

                        <LeadForm
                            placeholder="Enter your work email"
                            buttonText="Start Free"
                        />

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
                                <span className="text-sm text-[var(--color-text-muted)]">
                                    No credit card required
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
                                <span className="text-sm text-[var(--color-text-muted)]">
                                    14-day free trial
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 pt-6">
                            {[
                                {
                                    value: '$2.5B+',
                                    label: 'Assets Under Management',
                                },
                                { value: '500K+', label: 'Active Users' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <HeroIllustration variant="abstract" size="xl" />
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};

export default Hero;
