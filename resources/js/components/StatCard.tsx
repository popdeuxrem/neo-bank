import type { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: 'default' | 'success' | 'warning' | 'error';
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = 'default',
    className,
}) => {
    const variantStyles = {
        default: {
            iconBg: 'bg-[var(--color-primary)]/10',
            iconColor: 'text-[var(--color-primary)]',
        },
        success: {
            iconBg: 'bg-[var(--color-success)]/10',
            iconColor: 'text-[var(--color-success)]',
        },
        warning: {
            iconBg: 'bg-[var(--color-warning)]/10',
            iconColor: 'text-[var(--color-warning)]',
        },
        error: {
            iconBg: 'bg-[var(--color-error)]/10',
            iconColor: 'text-[var(--color-error)]',
        },
    };

    const styles = variantStyles[variant];

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-lg)]',
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div
                            className={cn(
                                'mt-2 flex items-center gap-1 text-sm font-medium',
                                trend.isPositive
                                    ? 'text-[var(--color-success)]'
                                    : 'text-[var(--color-error)]',
                            )}
                        >
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                            <span className="font-normal text-[var(--color-text-muted)]">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)]',
                            styles.iconBg,
                        )}
                    >
                        <Icon className={cn('h-6 w-6', styles.iconColor)} />
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
};

export { StatCard };
