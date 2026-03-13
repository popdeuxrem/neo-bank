import * as React from 'react';
import { Container, Section, Grid } from '../core';
import { FeatureCard } from './FeatureCard';
import {
    LucideIcon,
    Shield,
    Zap,
    Globe,
    Lock,
    CreditCard,
    BarChart3,
} from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    link?: string;
}

interface FeatureGridProps {
    className?: string;
}

const features: Feature[] = [
    {
        icon: Shield,
        title: 'Bank-Grade Security',
        description:
            '256-bit encryption, two-factor authentication, and real-time fraud detection protect your money.',
    },
    {
        icon: Zap,
        title: 'Instant Transfers',
        description:
            'Send and receive money instantly with zero latency. No more waiting for business days.',
    },
    {
        icon: Globe,
        title: 'Global Access',
        description:
            'Use your account anywhere in the world with multi-currency support and real-time exchange rates.',
    },
    {
        icon: Lock,
        title: 'Private by Design',
        description:
            'Your financial data is yours alone. We never sell your information to third parties.',
    },
    {
        icon: CreditCard,
        title: 'Virtual Cards',
        description:
            'Create unlimited virtual cards for online purchases. Freeze or cancel anytime.',
    },
    {
        icon: BarChart3,
        title: 'Smart Analytics',
        description:
            'Track spending, set budgets, and get insights with powerful analytics dashboard.',
    },
];

export const FeatureGrid: React.FC<FeatureGridProps> = ({ className }) => {
    return (
        <Section spacing="xl" className={className}>
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="font-hero text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
                        Everything you need to manage your money
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)]">
                        Powerful features designed to make your financial life
                        easier. No hidden fees, no surprises.
                    </p>
                </div>

                <Grid cols={3} gap="lg">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            link={feature.link}
                            delay={index * 0.1}
                        />
                    ))}
                </Grid>
            </Container>
        </Section>
    );
};

export default FeatureGrid;
