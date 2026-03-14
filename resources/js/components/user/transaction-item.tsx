import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, Eye, Expand } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Transaction } from '@/lib/fake-data';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any, color: string }> = {
    completed: { variant: 'default', icon: CheckCircle2, color: 'text-emerald-400' },
    pending: { variant: 'secondary', icon: Clock, color: 'text-amber-400' },
    failed: { variant: 'destructive', icon: XCircle, color: 'text-rose-400' },
    flagged: { variant: 'destructive', icon: AlertCircle, color: 'text-rose-400' },
    reversed: { variant: 'outline', icon: RefreshCw, color: 'text-zinc-400' },
};

const typeColors: Record<string, string> = {
    credit: 'bg-emerald-500/20 text-emerald-400',
    debit: 'bg-rose-500/20 text-rose-400',
    transfer: 'bg-blue-500/20 text-blue-400',
};

interface TransactionItemProps {
    transaction: Transaction;
    index?: number;
    showAccount?: boolean;
    onViewDetails?: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, index = 0, showAccount = false, onViewDetails }: TransactionItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isNegative = transaction.type === 'debit' || (transaction.amount < 0);
    
    const formatAmount = (amount: number) => {
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: transaction.currency || 'USD',
        }).format(Math.abs(amount));
        return isNegative ? `-${formatted}` : `+${formatted}`;
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    };

    const StatusIcon = statusConfig[transaction.status]?.icon || Clock;
    const statusColor = statusConfig[transaction.status]?.color || 'text-zinc-400';

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: index * 0.05 }}
            className={`group relative flex items-center justify-between rounded-xl border border-transparent bg-zinc-900/50 p-3 transition-all duration-200 hover:border-white/10 hover:bg-zinc-800/50 ${isExpanded ? 'bg-zinc-800/50' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex flex-1 items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white/5">
                    <AvatarFallback className={`text-sm font-medium ${isNegative ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {getInitials(transaction.merchant)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="truncate font-medium text-white">{transaction.merchant}</span>
                        <Badge variant="outline" className="border-white/10 text-[10px] text-zinc-400">
                            {transaction.category}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>{formatTime(transaction.timestamp)}</span>
                        {showAccount && transaction.accountName && (
                            <>
                                <span>•</span>
                                <span>{transaction.accountName}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className={`font-mono font-semibold ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {formatAmount(transaction.amount)}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                        <StatusIcon className={`h-3 w-3 ${statusColor}`} />
                        <span className={`text-[10px] capitalize ${statusColor}`}>
                            {transaction.status}
                        </span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails?.(transaction);
                    }}
                >
                    <Eye className="h-4 w-4 text-zinc-400" />
                </Button>

                <ChevronRight className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            </div>

            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 w-full rounded-lg bg-black/20 p-3"
                >
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-zinc-500">Transaction ID</span>
                            <p className="font-mono text-zinc-300">{transaction.id}</p>
                        </div>
                        {transaction.reference && (
                            <div>
                                <span className="text-zinc-500">Reference</span>
                                <p className="font-mono text-zinc-300">{transaction.reference}</p>
                            </div>
                        )}
                        <div className="col-span-2">
                            <span className="text-zinc-500">Description</span>
                            <p className="text-zinc-300">{transaction.description}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

export function TransactionItemSkeleton() {
    return (
        <div className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10" />
                <div>
                    <div className="h-4 w-32 rounded bg-white/10" />
                    <div className="mt-1 h-3 w-20 rounded bg-white/10" />
                </div>
            </div>
            <div className="text-right">
                <div className="h-4 w-20 rounded bg-white/10" />
                <div className="mt-1 h-3 w-12 rounded bg-white/10" />
            </div>
        </div>
    );
}
