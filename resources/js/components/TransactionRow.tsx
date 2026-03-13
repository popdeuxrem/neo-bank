import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    ArrowUpRight,
    ArrowDownLeft,
    ArrowRight,
    RefreshCw,
} from 'lucide-react';

interface TransactionRowProps {
    id: string;
    type: 'credit' | 'debit' | 'transfer' | 'payment';
    amount: number;
    currency?: string;
    description: string;
    merchant?: string;
    category?: string;
    date: string | Date;
    status: 'pending' | 'completed' | 'failed';
    icon?: 'arrow-up' | 'arrow-down' | 'transfer' | 'payment';
    onClick?: (id: string) => void;
    className?: string;
}

const TransactionRow: React.FC<TransactionRowProps> = ({
    id,
    type,
    amount,
    currency = 'USD',
    description,
    merchant,
    category,
    date,
    status,
    icon,
    onClick,
    className,
}) => {
    const formatDate = (d: string | Date) => {
        const dateObj = new Date(d);
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatAmount = (amt: number, curr: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: curr,
        }).format(Math.abs(amt));
    };

    const getIcon = () => {
        if (icon) {
            switch (icon) {
                case 'arrow-up':
                    return <ArrowUpRight className="h-4 w-4" />;
                case 'arrow-down':
                    return <ArrowDownLeft className="h-4 w-4" />;
                case 'transfer':
                    return <RefreshCw className="h-4 w-4" />;
                case 'payment':
                    return <ArrowRight className="h-4 w-4" />;
            }
        }
        switch (type) {
            case 'credit':
                return <ArrowDownLeft className="h-4 w-4" />;
            case 'debit':
                return <ArrowUpRight className="h-4 w-4" />;
            case 'transfer':
                return <RefreshCw className="h-4 w-4" />;
            case 'payment':
                return <ArrowRight className="h-4 w-4" />;
        }
    };

    const statusStyles = {
        pending: {
            bg: 'bg-[var(--color-warning)]/10',
            text: 'text-[var(--color-warning)]',
        },
        completed: {
            bg: 'bg-[var(--color-success)]/10',
            text: 'text-[var(--color-success)]',
        },
        failed: {
            bg: 'bg-[var(--color-error)]/10',
            text: 'text-[var(--color-error)]',
        },
    };

    const typeStyles = {
        credit: 'text-[var(--color-success)]',
        debit: 'text-[var(--color-error)]',
        transfer: 'text-[var(--color-primary)]',
        payment: 'text-[var(--color-text-primary)]',
    };

    return (
        <div
            onClick={() => onClick?.(id)}
            className={cn(
                'group flex items-center justify-between rounded-lg border border-transparent p-4 transition-all duration-[var(--transition-fast)]',
                'cursor-pointer hover:border-[var(--color-border)] hover:bg-[var(--color-background)]',
                className,
            )}
        >
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        type === 'credit' || type === 'transfer'
                            ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                            : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
                    )}
                >
                    {getIcon()}
                </div>
                <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                        {description}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        {merchant || category || type}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className={cn('font-semibold', typeStyles[type])}>
                        {type === 'credit' || type === 'transfer' ? '+' : '-'}
                        {formatAmount(amount, currency)}
                    </p>
                    <div className="flex items-center justify-end gap-2">
                        <span
                            className={cn(
                                'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                                statusStyles[status].bg,
                                statusStyles[status].text,
                            )}
                        >
                            {status}
                        </span>
                    </div>
                </div>
                <p className="min-w-[80px] text-right text-sm text-[var(--color-text-muted)]">
                    {formatDate(date)}
                </p>
            </div>
        </div>
    );
};

export { TransactionRow };
