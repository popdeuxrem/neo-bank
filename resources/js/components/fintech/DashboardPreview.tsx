import * as React from 'react';
import { motion } from 'framer-motion';
import { Container, Section } from '../core';
import { BalanceCard } from './BalanceCard';
import { TransactionList } from './TransactionList';
import { SpendingChart } from './SpendingChart';
import { cn } from '@/lib/utils';

interface DashboardPreviewProps {
    className?: string;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
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
                        Banking that works for you
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)]">
                        Experience a powerful dashboard that gives you complete
                        control over your finances.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Balance Cards */}
                    <div className="space-y-6">
                        <BalanceCard
                            balance={28420.52}
                            accountName="Total Balance"
                            accountType="All Accounts"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                            >
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    Income
                                </p>
                                <p className="text-xl font-bold text-[var(--color-success)]">
                                    +$8,450
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                            >
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    Expenses
                                </p>
                                <p className="text-xl font-bold text-[var(--color-error)]">
                                    -$3,280
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <TransactionList limit={4} />
                            <SpendingChart />
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};

export default DashboardPreview;
