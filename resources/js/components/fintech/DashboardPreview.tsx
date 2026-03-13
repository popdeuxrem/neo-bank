import {
    motion,
    useSpring,
    useInView,
    useTransform,
    useMotionValue,
} from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { mockApi } from '@/services/mockApi';
import { Container, Section } from '../core';
import { BalanceCard } from './BalanceCard';
import { SpendingChart } from './SpendingChart';
import { TransactionList } from './TransactionList';

interface DashboardPreviewProps {
    className?: string;
    useMockData?: boolean;
}

function AnimatedCounter({
    value,
    prefix = '',
    suffix = '',
    decimals = 2,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    const displayValue = useTransform(
        springValue,
        (latest) =>
            prefix +
            latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
            suffix,
    );

    React.useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    return (
        <span ref={ref} className="tabular-nums">
            {isInView ? (
                <motion.span>{displayValue}</motion.span>
            ) : (
                <span>
                    {prefix}0{suffix}
                </span>
            )}
        </span>
    );
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
    className,
    useMockData = true,
}) => {
    const [stats, setStats] = React.useState<{
        income: number;
        expenses: number;
        pending: number;
    } | null>(null);

    React.useEffect(() => {
        if (useMockData) {
            mockApi.getStats('acc_001').then((data) => {
                setStats(data);
            });
        }
    }, [useMockData]);

    const displayStats = stats || {
        income: 8450,
        expenses: 3280,
        pending: 0,
    };

    const totalBalance = 28420.52;

    return (
        <Section
            spacing="xl"
            className={cn('bg-[var(--color-background)]', className)}
        >
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="font-sans text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
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
                        <div className="rounded-2xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] p-6 shadow-xl">
                            <p className="mb-1 text-sm text-purple-300/80">
                                Total Balance
                            </p>
                            <p className="text-4xl font-black text-white">
                                <AnimatedCounter
                                    value={totalBalance}
                                    prefix="$"
                                />
                            </p>
                            <p className="mt-1 text-xs text-purple-300/60">
                                Across all accounts
                            </p>
                        </div>
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
                                <p className="text-xl font-bold text-green-500">
                                    +$
                                    <AnimatedCounter
                                        value={displayStats.income}
                                        decimals={0}
                                    />
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
                                <p className="text-xl font-bold text-red-500">
                                    -$
                                    <AnimatedCounter
                                        value={displayStats.expenses}
                                        decimals={0}
                                    />
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
