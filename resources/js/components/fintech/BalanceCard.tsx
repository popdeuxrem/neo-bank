import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    MoreHorizontal,
} from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
    balance: number;
    currency?: string;
    accountName?: string;
    accountType?: string;
    className?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    currency = 'USD',
    accountName = 'Primary Account',
    accountType = 'Checking',
    className,
}) => {
    const formatBalance = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                'relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f35] to-[#0d1117] p-6 text-white',
                className,
            )}
        >
            {/* Card visual elements */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[var(--color-primary)]/20 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[var(--color-primary-light)]/10 blur-xl" />

            <div className="relative">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-white/60">{accountName}</p>
                        <p className="text-xs text-white/40">{accountType}</p>
                    </div>
                    <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-[#c4b5fd] to-[#8b5cf6]">
                        <span className="text-xs font-bold text-white">N</span>
                    </div>
                </div>

                <p className="mb-1 text-sm text-white/60">Available Balance</p>
                <p className="text-3xl font-bold">{formatBalance(balance)}</p>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10 text-xs">
                            ••••
                        </div>
                        <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10 text-xs">
                            ••••
                        </div>
                    </div>
                    <p className="text-sm text-white/60">Expires 12/28</p>
                </div>
            </div>
        </motion.div>
    );
};

export default BalanceCard;
