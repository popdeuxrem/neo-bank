import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/Card';
import { Container, Section } from '@/components/core';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Privacy Policy - NeoBank" />

            <div className="min-h-screen bg-[var(--color-background)] py-16">
                <Container>
                    <Section spacing="lg">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="font-hero mb-8 text-4xl font-bold text-[var(--color-text-primary)]">
                                Privacy Policy
                            </h1>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="prose prose-sm max-w-none space-y-6 text-[var(--color-text-muted)]">
                                        <p className="text-lg">
                                            <strong>
                                                Last updated: March 2026
                                            </strong>
                                        </p>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                1. Introduction
                                            </h2>
                                            <p>
                                                NeoBank ("we," "our," or "us")
                                                is committed to protecting your
                                                privacy. This Privacy Policy
                                                explains how your personal
                                                information is collected, used,
                                                and disclosed by NeoBank when
                                                you use our website, mobile
                                                application, and services.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                2. Information We Collect
                                            </h2>
                                            <p>
                                                We collect information you
                                                provide directly to us,
                                                including:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Account information (name,
                                                    email, phone number)
                                                </li>
                                                <li>
                                                    Government-issued
                                                    identification for
                                                    verification
                                                </li>
                                                <li>
                                                    Financial information (bank
                                                    accounts, transactions)
                                                </li>
                                                <li>
                                                    Device and usage information
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                3. How We Use Your Information
                                            </h2>
                                            <p>
                                                We use the information we
                                                collect to:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Provide and maintain our
                                                    services
                                                </li>
                                                <li>
                                                    Process transactions and
                                                    send related information
                                                </li>
                                                <li>
                                                    Verify your identity and
                                                    prevent fraud
                                                </li>
                                                <li>
                                                    Communicate with you about
                                                    products, services, and
                                                    promotions
                                                </li>
                                                <li>
                                                    Comply with legal
                                                    obligations
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                4. Information Sharing
                                            </h2>
                                            <p>
                                                We do not sell your personal
                                                information. We may share your
                                                information with:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Service providers who assist
                                                    in our operations
                                                </li>
                                                <li>
                                                    Financial institutions for
                                                    transaction processing
                                                </li>
                                                <li>
                                                    Legal authorities when
                                                    required by law
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                5. Data Security
                                            </h2>
                                            <p>
                                                We implement appropriate
                                                technical and organizational
                                                measures to protect your
                                                personal information, including
                                                256-bit encryption, two-factor
                                                authentication, and regular
                                                security audits.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                6. Your Rights
                                            </h2>
                                            <p>You have the right to:</p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Access your personal
                                                    information
                                                </li>
                                                <li>Correct inaccurate data</li>
                                                <li>
                                                    Request deletion of your
                                                    data
                                                </li>
                                                <li>
                                                    Opt-out of marketing
                                                    communications
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                7. Contact Us
                                            </h2>
                                            <p>
                                                If you have questions about this
                                                Privacy Policy, please contact
                                                us at privacy@neobank.com.
                                            </p>
                                        </section>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </Section>
                </Container>
            </div>
        </>
    );
}
