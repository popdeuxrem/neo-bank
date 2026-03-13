import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Shield, Lock, AlertTriangle, Award, CheckCircle2 } from 'lucide-react';

interface TrustCardProps {
    title: string;
    description: string;
    icon: 'shield' | 'lock' | 'alert' | 'certificate' | 'check';
    className?: string;
    delay?: number;
}

const iconMap = {
    shield: Shield,
    lock: Lock,
    alert: AlertTriangle,
    certificate: Award,
    check: CheckCircle2,
};

export const TrustCard: React.FC<TrustCardProps> = ({
    title,
    description,
    icon,
    className,
    delay = 0,
}) => {
    const Icon = iconMap[icon] || Shield;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={cn(
                'flex flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center',
                className,
            )}
        >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
                <Icon className="h-7 w-7 text-[var(--color-primary)]" />
            </div>
            <h3 className="mb-2 font-semibold text-[var(--color-text-primary)]">
                {title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
                {description}
            </p>
        </motion.div>
    );
};

interface BadgeListProps {
    badges: { label: string; icon?: string }[];
    className?: string;
}

export const BadgeList: React.FC<BadgeListProps> = ({ badges, className }) => {
    return (
        <div className={cn('flex flex-wrap gap-3', className)}>
            {badges.map((badge, index) => (
                <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-text-muted)]"
                >
                    {badge.icon && (
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
                    )}
                    {badge.label}
                </motion.div>
            ))}
        </div>
    );
};

interface TrustSectionProps {
    className?: string;
}

const trustCards = [
    {
        title: 'Multi-Factor Authentication',
        description:
            'Protect your account with biometric login, SMS verification, and hardware keys.',
        icon: 'shield' as const,
    },
    {
        title: '256-Bit Encryption',
        description:
            'All data is encrypted using industry-leading AES-256 encryption standards.',
        icon: 'lock' as const,
    },
    {
        title: 'Fraud Protection',
        description:
            'Real-time AI monitoring detects and blocks suspicious transactions instantly.',
        icon: 'alert' as const,
    },
    {
        title: 'Licensed & Regulated',
        description:
            'Fully licensed by financial authorities. Your deposits are insured up to $250,000.',
        icon: 'certificate' as const,
    },
];

export const TrustSection: React.FC<TrustSectionProps> = ({ className }) => {
    return (
        <section
            className={cn('bg-[var(--color-background)] py-24', className)}
        >
            <div className="mx-auto max-w-[1280px] px-6">
                <div className="mb-16 text-center">
                    <h2 className="font-hero mb-4 text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
                        Your security is our priority
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-muted)]">
                        We use bank-grade security measures to protect your
                        money and personal information.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {trustCards.map((card, index) => (
                        <TrustCard
                            key={card.title}
                            title={card.title}
                            description={card.description}
                            icon={card.icon}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <BadgeList
                        badges={[
                            { label: 'FDIC Insured', icon: 'check' },
                            { label: 'SOC 2 Type II', icon: 'check' },
                            { label: 'PCI DSS Compliant', icon: 'check' },
                            { label: 'GDPR Compliant', icon: 'check' },
                        ]}
                        className="justify-center"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default TrustSection;
