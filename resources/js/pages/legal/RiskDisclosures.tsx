import { Head } from '@inertiajs/react';
import { AlertTriangle, TrendingUp, DollarSign, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/Card';
import { Container, Section } from '@/components/core';

export default function RiskDisclosures() {
    return (
        <>
            <Head title="Risk Disclosures - NeoBank" />

            <div className="min-h-screen bg-[var(--color-background)] py-16">
                <Container>
                    <Section spacing="lg">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="font-hero mb-8 text-4xl font-bold text-[var(--color-text-primary)]">
                                Risk Disclosures
                            </h1>

                            <div className="mb-8 flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                                <AlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-600" />
                                <p className="text-sm text-yellow-800">
                                    <strong>Important:</strong> Investing
                                    involves risk, including possible loss of
                                    principal. Past performance does not
                                    guarantee future results.
                                </p>
                            </div>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="prose prose-sm max-w-none space-y-6 text-[var(--color-text-muted)]">
                                        <section>
                                            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                                                <TrendingUp className="h-5 w-5" />
                                                Investment Risk
                                            </h2>
                                            <p>
                                                All investments involve risk.
                                                The value of your investments
                                                can go up or down, and you may
                                                lose money. Different types of
                                                investments carry varying levels
                                                of risk, including:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    <strong>
                                                        Market Risk:
                                                    </strong>{' '}
                                                    The possibility that an
                                                    investment will lose value
                                                    due to general market
                                                    movements
                                                </li>
                                                <li>
                                                    <strong>
                                                        Credit Risk:
                                                    </strong>{' '}
                                                    The risk that a borrower
                                                    will default on payments
                                                </li>
                                                <li>
                                                    <strong>
                                                        Liquidity Risk:
                                                    </strong>{' '}
                                                    The difficulty of selling an
                                                    investment quickly
                                                </li>
                                                <li>
                                                    <strong>
                                                        Interest Rate Risk:
                                                    </strong>{' '}
                                                    Changes in interest rates
                                                    affecting bond values
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                                                <DollarSign className="h-5 w-5" />
                                                Currency and Exchange Rate Risk
                                            </h2>
                                            <p>
                                                If you hold accounts or make
                                                transactions in foreign
                                                currencies, you face exchange
                                                rate risk. Currency fluctuations
                                                can significantly impact the
                                                value of your holdings and any
                                                returns.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
                                                <Shield className="h-5 w-5" />
                                                Fraud and Security Risk
                                            </h2>
                                            <p>
                                                Despite our security measures,
                                                no system is completely secure.
                                                You acknowledge that:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Unauthorized access may
                                                    occur
                                                </li>
                                                <li>
                                                    Phishing and social
                                                    engineering attacks exist
                                                </li>
                                                <li>
                                                    Your devices may be
                                                    compromised
                                                </li>
                                                <li>
                                                    You must maintain security
                                                    of your credentials
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                Regulatory and Legal Risks
                                            </h2>
                                            <p>
                                                Financial services are subject
                                                to extensive regulation. Changes
                                                in laws, regulations, or
                                                regulatory interpretation may:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Restrict certain investment
                                                    strategies
                                                </li>
                                                <li>
                                                    Affect the tax treatment of
                                                    investments
                                                </li>
                                                <li>
                                                    Limit your ability to access
                                                    certain markets
                                                </li>
                                                <li>
                                                    Result in account
                                                    restrictions or closures
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                Offshore Banking Risks
                                            </h2>
                                            <p>
                                                Offshore accounts may involve
                                                additional risks including:
                                            </p>
                                            <ul className="mt-2 list-disc space-y-2 pl-6">
                                                <li>
                                                    Different regulatory
                                                    frameworks and consumer
                                                    protections
                                                </li>
                                                <li>
                                                    Currency conversion costs
                                                    and complexity
                                                </li>
                                                <li>
                                                    Potential tax reporting
                                                    requirements
                                                </li>
                                                <li>
                                                    Limited FDIC or equivalent
                                                    coverage
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                No Guarantee of Results
                                            </h2>
                                            <p>
                                                Past performance of any
                                                investment does not guarantee
                                                future results. There is no
                                                guarantee that your investment
                                                objectives will be achieved. You
                                                should carefully consider your
                                                investment objectives, risk
                                                tolerance, and financial
                                                situation before investing.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                Professional Advice
                                                Recommendation
                                            </h2>
                                            <p>
                                                This information is for
                                                educational purposes only and
                                                does not constitute financial,
                                                legal, or tax advice. You should
                                                consult with qualified
                                                professionals before making
                                                investment decisions.
                                            </p>
                                        </section>

                                        <section>
                                            <h2 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
                                                Acknowledgment
                                            </h2>
                                            <p>
                                                By using NeoBank's services, you
                                                acknowledge that you have read
                                                and understood these risk
                                                disclosures and accept the risks
                                                associated with financial
                                                services and investments.
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
