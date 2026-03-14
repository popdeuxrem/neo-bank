import { motion } from 'framer-motion';
import { Send, PlusCircle, Receipt, RefreshCw, HandCoins, FileDown, ArrowUpRight, Wallet, CreditCard, Sparkles, Building } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

interface QuickAction {
    id: string;
    label: string;
    icon: any;
    color: string;
    bgColor: string;
    href?: string;
    action?: () => void;
}

const quickActions: QuickAction[] = [
    { id: 'send', label: 'Send Money', icon: Send, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', href: '/payments' },
    { id: 'add', label: 'Add Funds', icon: PlusCircle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', href: '/payments' },
    { id: 'pay', label: 'Pay Bill', icon: Receipt, color: 'text-violet-400', bgColor: 'bg-violet-500/20', href: '/payments' },
    { id: 'convert', label: 'Convert Currency', icon: RefreshCw, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', href: '/payments' },
    { id: 'request', label: 'Request Money', icon: HandCoins, color: 'text-amber-400', bgColor: 'bg-amber-500/20', href: '/payments' },
    { id: 'statement', label: 'Statement', icon: FileDown, color: 'text-zinc-400', bgColor: 'bg-zinc-500/20', href: '/statements' },
];

interface QuickActionTileProps {
    action: QuickAction;
    index?: number;
    onClick?: () => void;
}

export function QuickActionTile({ action, index = 0, onClick }: QuickActionTileProps) {
    const Icon = action.icon;

    return (
        <motion.button
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-white/5 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-white/10 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
        >
            <div className={`relative flex h-12 w-12 items-center justify-center rounded-full ${action.bgColor} transition-transform duration-200 group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${action.color}`} />
            </div>
            <span className="text-xs font-medium text-zinc-400 transition-colors group-hover:text-white">
                {action.label}
            </span>
        </motion.button>
    );
}

interface QuickActionsPanelProps {
    onAction?: (actionId: string) => void;
}

export function QuickActionsPanel({ onAction }: QuickActionsPanelProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
                <QuickActionTile
                    key={action.id}
                    action={action}
                    index={index}
                    onClick={() => onAction?.(action.id)}
                />
            ))}
        </div>
    );
}

export function ScheduledPaymentsList({ payments = [] }: { payments?: Array<{ id: string; recipientName: string; amount: number; currency: string; scheduledDate: string; status: string }> }) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    };

    if (payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Wallet className="mb-2 h-8 w-8 text-zinc-600" />
                <p className="text-sm text-zinc-500">No scheduled payments</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {payments.map((payment) => (
                <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/30 p-3"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
                            <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{payment.recipientName}</p>
                            <p className="text-xs text-zinc-500">{formatDate(payment.scheduledDate)}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-sm font-medium text-white">
                            {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        <span className="text-[10px] capitalize text-amber-400">{payment.status}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function UpcomingBillsList({ bills = [] }: { bills?: Array<{ id: string; name: string; amount: number; currency: string; dueDate: string; status: string }> }) {
    const formatDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { text: 'Overdue', color: 'text-rose-400 bg-rose-500/20' };
        if (diffDays === 0) return { text: 'Due today', color: 'text-amber-400 bg-amber-500/20' };
        if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-amber-400 bg-amber-500/20' };
        return { text: `${diffDays} days`, color: 'text-zinc-400 bg-zinc-500/20' };
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    };

    if (bills.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Receipt className="mb-2 h-8 w-8 text-zinc-600" />
                <p className="text-sm text-zinc-500">No upcoming bills</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {bills.map((bill) => {
                const dueInfo = formatDate(bill.dueDate);
                return (
                    <div
                        key={bill.id}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/30 p-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
                                <Building className="h-4 w-4 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{bill.name}</p>
                                <p className="text-xs text-zinc-500">
                                    {new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-sm font-medium text-white">
                                {formatCurrency(bill.amount, bill.currency)}
                            </p>
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${dueInfo.color}`}>
                                {dueInfo.text}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
