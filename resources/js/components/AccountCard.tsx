import * as React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard, TrendingUp, Wallet, Building2 } from 'lucide-react';

interface AccountCardProps {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment';
    balance: number;
    currency?: string;
    last4?: string;
    isDefault?: boolean;
    onSelect?: (id: string) => void;
    className?: string;
}

const AccountCard: React.FC<AccountCardProps> = ({
    id,
    name,
    type,
    balance,
    currency = 'USD',
    last4,
    isDefault = false,
    onSelect,
    className,
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const typeConfig = {
        checking: {
            icon: CreditCard,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-500/20 to-blue-600/10',
        },
        savings: {
            icon: Wallet,
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-500/20 to-green-600/10',
        },
        credit: {
            icon: CreditCard,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-500/20 to-purple-600/10',
        },
        investment: {
            icon: TrendingUp,
            gradient: 'from-orange-500 to-orange-600',
            bgGradient: 'from-orange-500/20 to-orange-600/10',
        },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    const formatBalance = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    return (
        <div
            onClick={() => onSelect?.(id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'group relative overflow-hidden rounded-[var(--radius-md)] p-6 transition-all duration-[var(--transition-base)]',
                'border border-[var(--color-border)] bg-[var(--color-surface)] bg-gradient-to-br',
                'cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-xl)]',
                className,
            )}
        >
            <div
                className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300',
                    config.bgGradient,
                    isHovered && 'opacity-100',
                )}
            />

            <div className="relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br',
                                config.gradient,
                            )}
                        >
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-[var(--color-text-primary)]">
                                {name}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)] capitalize">
                                {type}
                            </p>
                        </div>
                    </div>
                    {isDefault && (
                        <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
                            Default
                        </span>
                    )}
                </div>

                <div className="mt-6">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Balance
                    </p>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                        {formatBalance(balance)}
                    </p>
                </div>

                {last4 && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-[var(--color-text-muted)]/30" />
                            <span className="h-2 w-2 rounded-full bg-[var(--color-text-muted)]/30" />
                            <span className="h-2 w-2 rounded-full bg-[var(--color-text-muted)]/30" />
                            <span className="h-2 w-2 rounded-full bg-[var(--color-text-muted)]" />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-text-muted)]">
                            •••• {last4}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export { AccountCard };
