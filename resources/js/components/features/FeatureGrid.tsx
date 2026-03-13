import type {
    LucideIcon} from 'lucide-react';
import {
    Shield,
    Zap,
    Globe,
    Lock,
    CreditCard,
    BarChart3,
} from 'lucide-react';
import * as React from 'react';
import { mockApi  } from '@/services/mockApi';
import type {Feature} from '@/services/mockApi';
import { Container, Section, Grid } from '../core';
import { FeatureCard } from './FeatureCard';

interface FeatureGridProps {
    className?: string;
    useMockData?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
    Shield,
    Zap,
    Globe,
    Lock,
    CreditCard,
    BarChart3,
};

const defaultFeatures: Feature[] = [
    {
        id: 'feature_001',
        icon: 'Shield',
        title: 'Bank-Grade Security',
        description:
            '256-bit encryption, two-factor authentication, and real-time fraud detection protect your money.',
    },
    {
        id: 'feature_002',
        icon: 'Zap',
        title: 'Instant Transfers',
        description:
            'Send and receive money instantly with zero latency. No more waiting for business days.',
    },
    {
        id: 'feature_003',
        icon: 'Globe',
        title: 'Global Access',
        description:
            'Use your account anywhere in the world with multi-currency support and real-time exchange rates.',
    },
    {
        id: 'feature_004',
        icon: 'Lock',
        title: 'Private by Design',
        description:
            'Your financial data is yours alone. We never sell your information to third parties.',
    },
    {
        id: 'feature_005',
        icon: 'CreditCard',
        title: 'Virtual Cards',
        description:
            'Create unlimited virtual cards for online purchases. Freeze or cancel anytime.',
    },
    {
        id: 'feature_006',
        icon: 'BarChart3',
        title: 'Smart Analytics',
        description:
            'Track spending, set budgets, and get insights with powerful analytics dashboard.',
    },
];

export const FeatureGrid: React.FC<FeatureGridProps> = ({
    className,
    useMockData = true,
}) => {
    const [features, setFeatures] = React.useState<Feature[]>(defaultFeatures);

    React.useEffect(() => {
        if (useMockData) {
            mockApi.getFeatures().then((data) => {
                setFeatures(data);
            });
        }
    }, [useMockData]);

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
                    {features.map((feature, index) => {
                        const Icon = iconMap[feature.icon] || Shield;

                        return (
                            <FeatureCard
                                key={feature.id || feature.title}
                                icon={Icon}
                                title={feature.title}
                                description={feature.description}
                                link={feature.link}
                                delay={index * 0.1}
                            />
                        );
                    })}
                </Grid>
            </Container>
        </Section>
    );
};

export default FeatureGrid;
