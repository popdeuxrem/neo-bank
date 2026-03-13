import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    Wallet,
    CreditCard,
} from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    currency: string;
    type: 'credit' | 'debit' | 'transfer';
    date: string;
    status: 'completed' | 'pending' | 'failed';
    category?: string;
}

interface TransactionListProps {
    transactions?: Transaction[];
    title?: string;
    className?: string;
    limit?: number;
}

const defaultTransactions: Transaction[] = [
    {
        id: '1',
        description: 'Apple Store',
        amount: -129.99,
        currency: 'USD',
        type: 'debit',
        date: '2024-01-15',
        status: 'completed',
        category: 'Shopping',
    },
    {
        id: '2',
        description: 'Payroll Deposit',
        amount: 4250.0,
        currency: 'USD',
        type: 'credit',
        date: '2024-01-14',
        status: 'completed',
        category: 'Income',
    },
    {
        id: '3',
        description: 'Netflix Subscription',
        amount: -15.99,
        currency: 'USD',
        type: 'debit',
        date: '2024-01-13',
        status: 'completed',
        category: 'Entertainment',
    },
    {
        id: '4',
        description: 'Transfer to Savings',
        amount: -500.0,
        currency: 'USD',
        type: 'transfer',
        date: '2024-01-12',
        status: 'completed',
        category: 'Transfer',
    },
    {
        id: '5',
        description: 'Whole Foods Market',
        amount: -87.32,
        currency: 'USD',
        type: 'debit',
        date: '2024-01-11',
        status: 'completed',
        category: 'Groceries',
    },
];

export const TransactionList: React.FC<TransactionListProps> = ({
    transactions = defaultTransactions,
    title = 'Recent Transactions',
    className,
    limit = 5,
}) => {
    const formatAmount = (amount: number) => {
        const prefix = amount >= 0 ? '+' : '';

        return `${prefix}$${Math.abs(amount).toFixed(2)}`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'credit':
                return <ArrowDownLeft className="h-4 w-4" />;
            case 'debit':
                return <ArrowUpRight className="h-4 w-4" />;
            case 'transfer':
                return <RefreshCw className="h-4 w-4" />;
        }
    };

    const displayTransactions = transactions.slice(0, limit);

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
                <button className="text-sm text-[var(--color-primary)] hover:underline">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {displayTransactions.map((transaction, index) => (
                    <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between border-b border-[var(--color-border-light)] py-3 last:border-0"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-full',
                                    transaction.type === 'credit'
                                        ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                                        : transaction.type === 'transfer'
                                          ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                          : 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
                                )}
                            >
                                {getIcon(transaction.type)}
                            </div>
                            <div>
                                <p className="font-medium text-[var(--color-text-primary)]">
                                    {transaction.description}
                                </p>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    {transaction.category}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p
                                className={cn(
                                    'font-semibold',
                                    transaction.amount >= 0
                                        ? 'text-[var(--color-success)]'
                                        : 'text-[var(--color-text-primary)]',
                                )}
                            >
                                {formatAmount(transaction.amount)}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                {formatDate(transaction.date)}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default TransactionList;
