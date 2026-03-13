import * as React from 'react';
import { Container, Section, Grid } from '../core';
import { PricingCard } from './PricingCard';

interface PricingPlan {
    name: string;
    price: string;
    description: string;
    features: { text: string; included: boolean }[];
    highlighted?: boolean;
}

interface PricingTableProps {
    className?: string;
}

const plans: PricingPlan[] = [
    {
        name: 'Starter',
        price: '$0',
        description: 'Perfect for individuals getting started',
        features: [
            { text: 'Free bank account', included: true },
            { text: 'Debit card', included: true },
            { text: '5 free transfers/month', included: true },
            { text: 'Basic analytics', included: true },
            { text: 'Email support', included: true },
            { text: 'API access', included: false },
        ],
    },
    {
        name: 'Pro',
        price: '$19',
        description: 'For growing businesses with more needs',
        features: [
            { text: 'Everything in Starter', included: true },
            { text: 'Unlimited transfers', included: true },
            { text: 'Virtual cards', included: true },
            { text: 'Advanced analytics', included: true },
            { text: 'Priority support', included: true },
            { text: 'API access', included: true },
        ],
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations',
        features: [
            { text: 'Everything in Pro', included: true },
            { text: 'Dedicated account manager', included: true },
            { text: 'Custom integrations', included: true },
            { text: 'SLA guarantee', included: true },
            { text: '24/7 phone support', included: true },
            { text: 'Onboarding assistance', included: true },
        ],
    },
];

export const PricingTable: React.FC<PricingTableProps> = ({ className }) => {
    return (
        <Section spacing="xl" className={className}>
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="font-hero text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
                        Simple, transparent pricing
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)]">
                        Choose the plan that works best for you. No hidden fees,
                        cancel anytime.
                    </p>
                </div>

                <Grid cols={3} gap="lg">
                    {plans.map((plan) => (
                        <PricingCard
                            key={plan.name}
                            name={plan.name}
                            price={plan.price}
                            description={plan.description}
                            features={plan.features}
                            highlighted={plan.highlighted}
                        />
                    ))}
                </Grid>
            </Container>
        </Section>
    );
};

export default PricingTable;
