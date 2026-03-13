import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/Card';
import { Container, Section } from '@/components/core';

export default function TermsOfService() {
    return (
        <>
            <Head title="Terms of Service - NeoBank" />

            <div className="min-h-screen bg-[var(--color-background)] py-16">
                <Container>
                    <Section spacing="lg">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="font-hero mb-8 text-4xl font-bold text-[var(--color-text-primary)]">
                                Terms of Service
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
                                                1. Acceptance of Terms
                                            </h2>
                                            <p>
                                                By accessing and using NeoBank's
                                                services, you accept and agree
                                                to be bound by the terms and
                                                provision of this agreement. If
                                                you do not agree to these terms,
                                                please do not use our services.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                2. Description of Service
                                            </h2>
                                            <p>
                                                NeoBank provides digital banking
                                                services including but not
                                                limited to:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Online account management
                                                </li>
                                                <li>
                                                    Fund transfers between
                                                    accounts
                                                </li>
                                                <li>Payment processing</li>
                                                <li>Multi-currency accounts</li>
                                                <li>
                                                    Investment account
                                                    management
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                3. User Accounts
                                            </h2>
                                            <p>
                                                To use our services, you must
                                                create an account. You agree to:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Provide accurate and
                                                    complete information
                                                </li>
                                                <li>
                                                    Maintain the security of
                                                    your account credentials
                                                </li>
                                                <li>
                                                    Promptly update any changes
                                                    to your information
                                                </li>
                                                <li>
                                                    Notify us immediately of any
                                                    unauthorized access
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                4. Account Verification
                                            </h2>
                                            <p>
                                                To comply with anti-money
                                                laundering (AML) and
                                                know-your-customer (KYC)
                                                regulations, we require identity
                                                verification. You agree to
                                                provide valid government-issued
                                                identification and any
                                                additional documentation
                                                requested.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                5. Transactions and Transfers
                                            </h2>
                                            <p>
                                                All transactions are subject to
                                                our review and approval. We
                                                reserve the right to:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Delay or decline
                                                    transactions for security
                                                    reasons
                                                </li>
                                                <li>
                                                    Reversa transactions found
                                                    to be fraudulent
                                                </li>
                                                <li>
                                                    Freeze accounts suspected of
                                                    violations
                                                </li>
                                                <li>
                                                    Charge reasonable fees for
                                                    certain services
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                6. Fees and Charges
                                            </h2>
                                            <p>
                                                Some services may incur fees.
                                                All fees will be disclosed
                                                before you complete a
                                                transaction. By using our
                                                services, you agree to pay all
                                                applicable fees.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                7. Prohibited Activities
                                            </h2>
                                            <p>
                                                You may not use our services to:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Engage in illegal activities
                                                </li>
                                                <li>
                                                    Money laundering or
                                                    terrorist financing
                                                </li>
                                                <li>
                                                    Violate any law, regulation,
                                                    or third-party rights
                                                </li>
                                                <li>
                                                    Attempt to gain unauthorized
                                                    access to systems
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                8. Limitation of Liability
                                            </h2>
                                            <p>
                                                NeoBank shall not be liable for
                                                any indirect, incidental,
                                                special, consequential, or
                                                punitive damages resulting from
                                                your use of or inability to use
                                                our services.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                9. Termination
                                            </h2>
                                            <p>
                                                We may terminate or suspend your
                                                account at any time for any
                                                reason. Upon termination, your
                                                right to use our services
                                                immediately ceases.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                10. Changes to Terms
                                            </h2>
                                            <p>
                                                We reserve the right to modify
                                                these terms at any time.
                                                Continued use of our services
                                                after changes constitutes
                                                acceptance of the new terms.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                11. Contact Information
                                            </h2>
                                            <p>
                                                For questions about these Terms
                                                of Service, please contact us at
                                                legal@neobank.com.
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
