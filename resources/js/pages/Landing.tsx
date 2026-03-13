import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/navigation/Navbar';
import { Hero } from '@/components/hero/Hero';
import { LogoCloud } from '@/components/social-proof/LogoCloud';
import { FeatureGrid } from '@/components/features/FeatureGrid';
import { SplitFeature } from '@/components/features/SplitFeature';
import { TrustSection } from '@/components/trust/TrustSection';
import { DashboardPreview } from '@/components/fintech/DashboardPreview';
import { TestimonialsGrid } from '@/components/social-proof/TestimonialsGrid';
import { PricingTable } from '@/components/pricing/PricingTable';
import { CallToAction } from '@/components/marketing/CallToAction';
import { SignupForm } from '@/components/marketing/SignupForm';
import { Footer } from '@/components/footer/Footer';
import { MetaTags, StructuredData } from '@/components/seo/MetaTags';
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

    const handleLeadSubmit = async (email: string) => {
        console.log('Lead submitted:', email);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    return (
        <>
            <Head>
                <MetaTags
                    title="NeoBank - Modern Digital Banking Platform"
                    description="NeoBank offers seamless account management, cards, investments, and financial tools in one powerful platform. Join 500,000+ users. Open your account today."
                    keywords="digital banking, online banking, fintech, neo bank, mobile banking, investment accounts, high yield savings"
                    ogImage="/og-image.png"
                    ogUrl="https://neobank.com"
                    twitterCard="summary_large_image"
                    twitterSite="@neobank"
                    canonical="https://neobank.com"
                />
                <StructuredData
                    type="FinancialProduct"
                    data={{
                        '@type': 'FinancialProduct',
                        name: 'NeoBank',
                        description:
                            'Modern digital banking platform with checking, savings, and investment accounts',
                        provider: {
                            '@type': 'Organization',
                            name: 'NeoBank',
                        },
                        annualPercentageRate: 4.5,
                        feesAndCharges: [
                            {
                                '@type': 'FeeOrChargeSpecification',
                                name: 'Monthly Fee',
                                amount: {
                                    '@type': 'MonetaryAmount',
                                    value: 0,
                                    currency: 'USD',
                                },
                            },
                        ],
                    }}
                />
            </Head>

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
                            {services.map((service) => (
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

                {/* Trust & Security Section */}
                <TrustSection />

                {/* Dashboard Preview */}
                <DashboardPreview />

                {/* Testimonials */}
                <TestimonialsGrid />

                {/* Pricing */}
                <PricingTable />

                {/* CTA with Signup Form */}
                <Section spacing="xl">
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
                                            <circle
                                                cx="1"
                                                cy="1"
                                                r="1"
                                                fill="white"
                                            />
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
                                <h2 className="font-hero mb-4 text-4xl font-bold text-white md:text-5xl">
                                    Ready to start banking smarter?
                                </h2>
                                <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
                                    Join 500,000+ users who trust NeoBank with
                                    their finances. Open your free account in
                                    minutes.
                                </p>

                                <SignupForm
                                    onSubmit={handleLeadSubmit}
                                    placeholder="Enter your email address"
                                    buttonText="Open Free Account"
                                />

                                <p className="mt-6 text-sm text-white/60">
                                    No credit card required • 14-day free trial
                                    • Cancel anytime
                                </p>
                            </div>
                        </div>
                    </Container>
                </Section>
            </main>

            <Footer />
        </>
    );
}
