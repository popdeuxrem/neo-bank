import * as React from 'react';
import { cn } from '@/lib/utils';
import { Container, Section, Grid } from '../core';
import { TestimonialCard } from './TestimonialCard';

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
}

interface TestimonialsGridProps {
    className?: string;
}

const testimonials: Testimonial[] = [
    {
        quote: "I have been with Neo Bank since 2017, it was scary when the merger happened a while back, I'm still happy with you people, no matter what problems concern me, they have always been corrected with your patience. I appreciate all you do..thanks for a GREAT BANK!",
        author: 'Maxwell Ker',
        role: 'Customer since 2017',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maxwell',
    },
    {
        quote: "NeoBank transformed how I manage my business finances. The instant transfers alone save me hours every week.",
        author: 'Sarah Chen',
        role: 'CEO, TechFlow',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
    {
        quote: "The best banking experience I've ever had. Clean interface, zero fees, and amazing customer support.",
        author: 'Marcus Johnson',
        role: 'Freelance Designer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    },
];

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({
    className,
}) => {
    return (
        <Section
            spacing="xl"
            className={cn('bg-[var(--color-background)]', className)}
        >
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="font-hero text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
                        Trusted by thousands
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)]">
                        See what our customers have to say about their
                        experience with NeoBank.
                    </p>
                </div>

                <Grid cols={3} gap="lg">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={testimonial.author}
                            quote={testimonial.quote}
                            author={testimonial.author}
                            role={testimonial.role}
                            avatar={testimonial.avatar}
                            delay={index * 0.1}
                        />
                    ))}
                </Grid>
            </Container>
        </Section>
    );
};

export default TestimonialsGrid;
