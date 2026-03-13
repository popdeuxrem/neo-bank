import { motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface SpendingChartProps {
    data?: { category: string; amount: number; color: string }[];
    title?: string;
    className?: string;
}

const defaultData = [
    { category: 'Shopping', amount: 450, color: '#8B5CF6' },
    { category: 'Food & Dining', amount: 320, color: '#10B981' },
    { category: 'Transportation', amount: 180, color: '#F59E0B' },
    { category: 'Entertainment', amount: 150, color: '#3B82F6' },
    { category: 'Bills & Utilities', amount: 280, color: '#EF4444' },
];

export const SpendingChart: React.FC<SpendingChartProps> = ({
    data = defaultData,
    title = 'Spending by Category',
    className,
}) => {
    const maxAmount = Math.max(...data.map((d) => d.amount));
    const total = data.reduce((sum, d) => sum + d.amount, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6',
                className,
            )}
        >
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {title}
                </h3>
                <span className="text-sm text-[var(--color-text-muted)]">
                    This Month
                </span>
            </div>

            <div className="space-y-4">
                {data.map((item, index) => {
                    const percentage = (item.amount / maxAmount) * 100;

                    return (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-[var(--color-text-muted)]">
                                    {item.category}
                                </span>
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                    ${item.amount}
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-background)]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${percentage}%` }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.1,
                                    }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-6 border-t border-[var(--color-border-light)] pt-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-muted)]">
                        Total Spending
                    </span>
                    <span className="text-lg font-bold text-[var(--color-text-primary)]">
                        ${total}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default SpendingChart;
