import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import * as React from 'react';
import { Button } from '../ButtonPrimary';
import { ButtonSecondary } from '../ButtonSecondary';
import { Container, Section } from '../core';

interface CallToActionProps {
    className?: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({ className }) => {
    return (
        <Section spacing="xl" className={className}>
            <Container>
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] px-6 py-16 md:px-16 md:py-24">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg
                            className="h-full w-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <pattern
                                    id="grid"
                                    width="10"
                                    height="10"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <circle cx="1" cy="1" r="1" fill="white" />
                                </pattern>
                            </defs>
                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#grid)"
                            />
                        </svg>
                    </div>

                    <div className="relative text-center">
                        <h2 className="font-hero text-4xl font-bold text-white md:text-5xl">
                            Ready to get started?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                            Join thousands of businesses and individuals who
                            trust NeoBank for their financial needs.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/register">
                                <Button
                                    size="xl"
                                    className="bg-white text-[var(--color-primary)] hover:bg-white/90"
                                >
                                    Create Free Account
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <ButtonSecondary
                                    size="xl"
                                    className="border-white text-white hover:bg-white/10"
                                >
                                    Talk to Sales
                                </ButtonSecondary>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};

export default CallToAction;
