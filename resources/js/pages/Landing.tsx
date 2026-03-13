import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/navigation/Navbar';
import { Hero } from '@/components/hero/Hero';
import { LogoCloud } from '@/components/social-proof/LogoCloud';
import { FeatureGrid } from '@/components/features/FeatureGrid';
import { SplitFeature } from '@/components/features/SplitFeature';
import { DashboardPreview } from '@/components/fintech/DashboardPreview';
import { TestimonialsGrid } from '@/components/social-proof/TestimonialsGrid';
import { PricingTable } from '@/components/pricing/PricingTable';
import { CallToAction } from '@/components/marketing/CallToAction';
import { Footer } from '@/components/footer/Footer';
import { Container, Section } from '@/components/core';

export default function Landing() {
    const services = [
        {
            title: 'Offshore Banking',
            description:
                'Expand your global reach with multi-currency accounts. Hold, send, and receive funds in over 30 currencies with competitive exchange rates and low transfer fees.',
            features: [
                '30+ currencies supported',
                'Real-time exchange rates',
                'SWIFT & SEPA transfers',
                'Multi-signature security',
            ],
            ctaText: 'Learn about Offshore Banking',
            ctaHref: '/services/offshore',
        },
        {
            title: 'Investment Accounts',
            description:
                'Grow your wealth with our diverse investment options. From stocks and bonds to ETFs and mutual funds, access global markets with expert guidance.',
            features: [
                'Access to 50+ global markets',
                '0% commission on stocks',
                'Automated portfolio rebalancing',
                'Tax-efficient investing strategies',
            ],
            ctaText: 'Start Investing Today',
            ctaHref: '/services/investments',
            reverse: true,
        },
        {
            title: 'Advanced Security Tools',
            description:
                'Protect your assets with bank-grade security features. Our platform uses cutting-edge encryption and real-time fraud detection to keep your money safe.',
            features: [
                'Biometric authentication',
                'Real-time fraud monitoring',
                'Custom spending limits',
                'Instant account freezing',
            ],
            ctaText: 'Explore Security Features',
            ctaHref: '/services/security',
        },
    ];

    return (
        <>
            <Head title="NeoBank - The Future of Banking" />

            <Navbar />

            <main>
                <Hero />

                <LogoCloud />

                <FeatureGrid />

                {/* Services / Split Features */}
                <Section spacing="xl">
                    <Container>
                        <div className="mb-16 text-center">
                            <h2 className="font-hero text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
                                Banking services built for today
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)]">
                                Comprehensive financial solutions tailored to
                                meet the needs of modern individuals and
                                businesses.
                            </p>
                        </div>

                        <div className="space-y-24">
                            {services.map((service, index) => (
                                <SplitFeature
                                    key={service.title}
                                    title={service.title}
                                    description={service.description}
                                    features={service.features}
                                    ctaText={service.ctaText}
                                    ctaHref={service.ctaHref}
                                    reverse={service.reverse}
                                />
                            ))}
                        </div>
                    </Container>
                </Section>

                <DashboardPreview />

                <TestimonialsGrid />

                <PricingTable />

                <CallToAction />
            </main>

            <Footer />
        </>
    );
}
