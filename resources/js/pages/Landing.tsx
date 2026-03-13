import { Head } from '@inertiajs/react';
import { Navbar } from '@/components/navigation/Navbar';
import { Hero } from '@/components/hero/Hero';
import { LogoCloud } from '@/components/social-proof/LogoCloud';
import { FeatureGrid } from '@/components/features/FeatureGrid';
import { TestimonialsGrid } from '@/components/social-proof/TestimonialsGrid';
import { PricingTable } from '@/components/pricing/PricingTable';
import { CallToAction } from '@/components/marketing/CallToAction';
import { Footer } from '@/components/footer/Footer';

export default function Landing() {
    return (
        <>
            <Head title="NeoBank - The Future of Banking" />

            <Navbar />

            <main>
                <Hero />

                <LogoCloud />

                <FeatureGrid />

                <TestimonialsGrid />

                <PricingTable />

                <CallToAction />
            </main>

            <Footer />
        </>
    );
}
