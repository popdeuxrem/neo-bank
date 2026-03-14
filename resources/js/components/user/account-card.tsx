import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Send, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Account } from '@/lib/fake-data';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' as any } }
};

const accountGradients: Record<string, string> = {
    checking: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
    savings: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    forex: 'from-blue-500/20 via-blue-500/5 to-transparent',
    crypto: 'from-violet-500/20 via-violet-500/5 to-transparent',
};

const accountBorderColors: Record<string, string> = {
    checking: 'border-indigo-500/30',
    savings: 'border-emerald-500/30',
    forex: 'border-blue-500/30',
    crypto: 'border-violet-500/30',
};

const accountIconColors: Record<string, string> = {
    checking: 'text-indigo-400',
    savings: 'text-emerald-400',
    forex: 'text-blue-400',
    crypto: 'text-violet-400',
};

const currencyFlags: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    BTC: '₿',
};

interface AccountCardProps {
    account: Account;
    index?: number;
    onSend?: (account: Account) => void;
    onViewDetails?: (account: Account) => void;
}

export function AccountCard({ account, index = 0, onSend, onViewDetails }: AccountCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const formatBalance = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: account.currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: index * 0.1 }}
            style={{ perspective: 1000 }}
            className="group relative"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{ rotateX, rotateY }}
                className={`relative overflow-hidden rounded-2xl border ${accountBorderColors[account.type] || 'border-white/10'} bg-zinc-900/80 backdrop-blur-xl p-5 shadow-2xl transition-all duration-300 hover:shadow-2xl`}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${accountGradients[account.type] || 'from-white/5 to-transparent'} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className="relative z-10">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`rounded-lg bg-white/5 p-2 ${accountIconColors[account.type]}`}>
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">{account.name}</h3>
                                <p className="text-xs text-zinc-500">•••• {account.mask || account.accountNumber.slice(-4)}</p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-white">
                            {currencyFlags[account.currency]} {account.currency}
                        </span>
                    </div>

                    <div className="mb-4">
                        <p className="text-2xl font-bold tracking-tight text-white">
                            {formatBalance(account.balance)}
                        </p>
                        <p className="text-xs text-zinc-500">
                            Available: {formatBalance(account.availableBalance || account.balance)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-zinc-500" />
                            <span className="text-xs text-zinc-500">7-day trend</span>
                        </div>
                        <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSend?.(account);
                                }}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDetails?.(account);
                                }}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/40 py-2 backdrop-blur-sm"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-white hover:text-indigo-400"
                                onClick={() => onViewDetails?.(account)}
                            >
                                View Details
                            </Button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export function AccountCardSkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/10" />
                    <div>
                        <div className="h-4 w-24 rounded bg-white/10" />
                        <div className="mt-1 h-3 w-16 rounded bg-white/10" />
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <div className="h-8 w-32 rounded bg-white/10" />
                <div className="mt-1 h-3 w-24 rounded bg-white/10" />
            </div>
        </div>
    );
}
