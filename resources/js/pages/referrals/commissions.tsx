import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';

interface Commission {
    id: string;
    referralName: string;
    referralEmail: string;
    amount: number;
    level: 1 | 2 | 3;
    status: 'pending' | 'paid' | 'cancelled';
    date: string;
    paidDate?: string;
}

const mockCommissions: Commission[] = [
    { id: '1', referralName: 'John S.', referralEmail: 'john@example.com', amount: 25, level: 1, status: 'paid', date: '2026-03-10', paidDate: '2026-03-11' },
    { id: '2', referralName: 'Sarah M.', referralEmail: 'sarah@example.com', amount: 25, level: 1, status: 'paid', date: '2026-03-08', paidDate: '2026-03-09' },
    { id: '3', referralName: 'Mike R.', referralEmail: 'mike@example.com', amount: 25, level: 1, status: 'pending', date: '2026-03-15' },
    { id: '4', referralName: 'Emily K.', referralEmail: 'emily@example.com', amount: 25, level: 1, status: 'paid', date: '2026-02-20', paidDate: '2026-02-21' },
    { id: '5', referralName: 'David L.', referralEmail: 'david@example.com', amount: 25, level: 1, status: 'paid', date: '2026-02-15', paidDate: '2026-02-16' },
    { id: '6', referralName: 'Lisa W.', referralEmail: 'lisa@example.com', amount: 10, level: 2, status: 'paid', date: '2026-02-10', paidDate: '2026-02-11' },
    { id: '7', referralName: 'Tom H.', referralEmail: 'tom@example.com', amount: 10, level: 2, status: 'pending', date: '2026-03-12' },
    { id: '8', referralName: 'Anna B.', referralEmail: 'anna@example.com', amount: 5, level: 3, status: 'pending', date: '2026-03-14' },
    { id: '9', referralName: 'Chris P.', referralEmail: 'chris@example.com', amount: 5, level: 3, status: 'paid', date: '2026-01-20', paidDate: '2026-01-21' },
    { id: '10', referralName: 'Kate M.', referralEmail: 'kate@example.com', amount: 5, level: 3, status: 'paid', date: '2026-01-15', paidDate: '2026-01-16' },
    { id: '11', referralName: 'James R.', referralEmail: 'james@example.com', amount: 10, level: 2, status: 'paid', date: '2026-01-10', paidDate: '2026-01-11' },
    { id: '12', referralName: 'Nina S.', referralEmail: 'nina@example.com', amount: 25, level: 1, status: 'cancelled', date: '2026-01-05' },
];

const levelColors: Record<number, { bg: string; text: string }> = {
    1: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    2: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    3: { bg: 'bg-violet-500/20', text: 'text-violet-400' },
};

export default function ReferralsCommissions() {
    const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const filteredCommissions = mockCommissions.filter(c => {
        const levelMatch = filterLevel === 'all' || c.level === filterLevel;
        const statusMatch = filterStatus === 'all' || c.status === filterStatus;
        return levelMatch && statusMatch;
    });

    const totalEarned = mockCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
    const totalPending = mockCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
    const availableBalance = totalPending;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-emerald-500/20 text-emerald-400"><LucideIcons.CheckCircle className="mr-1 h-3 w-3" /> Paid</Badge>;
            case 'pending':
                return <Badge className="bg-amber-500/20 text-amber-400"><LucideIcons.Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
            case 'cancelled':
                return <Badge className="bg-zinc-500/20 text-zinc-400"><LucideIcons.XCircle className="mr-1 h-3 w-3" /> Cancelled</Badge>;
            default:
                return null;
        }
    };

    const handleWithdraw = () => {
        toast.success('Withdrawal request submitted! Funds will arrive in 3-5 business days.');
        setShowWithdrawModal(false);
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                    <LucideIcons.DollarSign className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-400">Total Earned</p>
                                    <p className="text-xl font-bold text-emerald-400">${totalEarned}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                    <LucideIcons.Clock className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-amber-400">Pending</p>
                                    <p className="text-xl font-bold text-amber-400">${totalPending}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                                    <LucideIcons.Wallet className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Available to Withdraw</p>
                                    <p className="text-xl font-bold text-white">${availableBalance}</p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="bg-indigo-500 hover:bg-indigo-600"
                                onClick={() => setShowWithdrawModal(true)}
                                disabled={availableBalance === 0}
                            >
                                Withdraw
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl"
                >
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-white">Commission History</h2>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400">Level:</span>
                                <select
                                    className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-sm text-white"
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                >
                                    <option value="all">All Levels</option>
                                    <option value={1}>Level 1</option>
                                    <option value={2}>Level 2</option>
                                    <option value={3}>Level 3</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400">Status:</span>
                                <select
                                    className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-sm text-white"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-zinc-500">Referral</th>
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-zinc-500">Level</th>
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-zinc-500">Date</th>
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-zinc-500">Status</th>
                                    <th className="pb-3 text-right text-xs font-medium uppercase text-zinc-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCommissions.map((commission) => (
                                    <motion.tr
                                        key={commission.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-400">
                                                    {commission.referralName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{commission.referralName}</p>
                                                    <p className="text-xs text-zinc-500">{commission.referralEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <Badge className={`${levelColors[commission.level].bg} ${levelColors[commission.level].text}`}>
                                                Level {commission.level}
                                            </Badge>
                                        </td>
                                        <td className="py-4">
                                            <div>
                                                <p className="text-sm text-white">{commission.date}</p>
                                                {commission.paidDate && (
                                                    <p className="text-xs text-zinc-500">Paid: {commission.paidDate}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            {getStatusBadge(commission.status)}
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`font-medium ${commission.status === 'cancelled' ? 'text-zinc-500 line-through' : commission.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                {commission.status === 'cancelled' ? '-' : '+'}${commission.amount}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCommissions.length === 0 && (
                        <div className="py-12 text-center">
                            <LucideIcons.Search className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
                            <p className="text-zinc-400">No commissions found</p>
                        </div>
                    )}
                </motion.div>

                <AnimatePresence>
                    {showWithdrawModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowWithdrawModal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Withdraw Funds</h3>
                                    <button
                                        onClick={() => setShowWithdrawModal(false)}
                                        className="text-zinc-400 hover:text-white"
                                    >
                                        <LucideIcons.X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mb-6 rounded-xl bg-zinc-800/50 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Available Balance</span>
                                        <span className="text-xl font-bold text-white">${availableBalance}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-zinc-300">Withdraw Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                        <input
                                            type="number"
                                            defaultValue={availableBalance}
                                            className="w-full rounded-lg border border-white/10 bg-zinc-800 py-2.5 pl-8 pr-4 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-zinc-300">Withdraw to</label>
                                    <select className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none">
                                        <option>Primary Checking ****4521</option>
                                        <option>High-Yield Savings ****7832</option>
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-white/10"
                                        onClick={() => setShowWithdrawModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                        onClick={handleWithdraw}
                                    >
                                        Withdraw ${availableBalance}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </UserLayout>
    );
}
