import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

interface PointsTransaction {
    id: string;
    description: string;
    points: number;
    type: 'earned' | 'redeemed';
    date: string;
    status: 'completed' | 'pending';
}

interface EarnMethod {
    id: string;
    title: string;
    description: string;
    multiplier: string;
    icon: keyof typeof LucideIcons;
}

interface RedeemOption {
    id: string;
    title: string;
    description: string;
    pointsRequired: number;
    value: string;
    type: 'cash' | 'fee_credit' | 'premium';
}

const mockPointsBalance = 12500;
const mockPointsValue = 125;

const earnMethods: EarnMethod[] = [
    { id: '1', title: 'Purchase with Card', description: 'Earn points on every purchase', multiplier: '1x - 5x', icon: 'CreditCard' },
    { id: '2', title: 'Refer Friends', description: 'Bonus points for each referral', multiplier: '500 pts', icon: 'UserPlus' },
    { id: '3', title: 'Monthly Transactions', description: 'Points for account activity', multiplier: 'Up to 200 pts', icon: 'TrendingUp' },
    { id: '4', title: 'Complete Surveys', description: 'Share feedback and earn', multiplier: '50 - 200 pts', icon: 'FileText' },
];

const redeemOptions: RedeemOption[] = [
    { id: '1', title: 'Cash Back', description: 'Convert points to account balance', pointsRequired: 1000, value: '$10', type: 'cash' },
    { id: '2', title: 'Fee Credit', description: 'Waive banking fees', pointsRequired: 2500, value: '$25', type: 'fee_credit' },
    { id: '3', title: 'Premium Membership', description: 'Upgrade to Pro tier', pointsRequired: 10000, value: '$100 value', type: 'premium' },
];

const recentTransactions: PointsTransaction[] = [
    { id: 'txn_1', description: 'Card Purchase - Amazon', points: 125, type: 'earned', date: '2026-03-14', status: 'completed' },
    { id: 'txn_2', description: 'Referral Bonus', points: 500, type: 'earned', date: '2026-03-12', status: 'completed' },
    { id: 'txn_3', description: 'Redeemed for Cash Back', points: -500, type: 'redeemed', date: '2026-03-10', status: 'completed' },
    { id: 'txn_4', description: 'Card Purchase - Starbucks', points: 25, type: 'earned', date: '2026-03-09', status: 'completed' },
    { id: 'txn_5', description: 'Monthly Activity Bonus', points: 150, type: 'earned', date: '2026-03-01', status: 'completed' },
];

export default function RewardsIndex() {
    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent p-6 shadow-2xl shadow-amber-500/10">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                                <div className="relative z-10">
                                    <div className="mb-2 flex items-center gap-2">
                                        <LucideIcons.Star className="h-5 w-5 text-amber-400" />
                                        <span className="text-sm font-medium text-amber-300">Available Points</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-white">{mockPointsBalance.toLocaleString()}</span>
                                        <span className="text-lg text-amber-300">pts</span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-sm text-amber-200/70">
                                        <LucideIcons.DollarSign className="h-4 w-4" />
                                        <span>Worth approximately ${mockPointsValue} in rewards</span>
                                    </div>
                                    <div className="mt-6 flex gap-3">
                                        <Link href="/rewards/earn">
                                            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
                                                Earn More Points
                                            </Button>
                                        </Link>
                                        <Link href="/rewards/redeem">
                                            <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                                                Redeem Points
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 dark:bg-black/50">
                                <h3 className="mb-3 text-sm font-medium text-zinc-400">Quick Redeem</h3>
                                <div className="space-y-3">
                                    {redeemOptions.slice(0, 2).map((option) => (
                                        <Link
                                            key={option.id}
                                            href="/rewards/redeem"
                                            className="flex items-center justify-between rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-white">{option.title}</p>
                                                <p className="text-xs text-zinc-400">{option.pointsRequired} pts</p>
                                            </div>
                                            <LucideIcons.ChevronRight className="h-4 w-4 text-zinc-500" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 dark:bg-black/50">
                                <h3 className="mb-3 text-sm font-medium text-zinc-400">Points History</h3>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">This month</span>
                                    <span className="font-medium text-emerald-400">+800 pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 dark:bg-black/50">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Ways to Earn</h2>
                            <Link href="/rewards/earn" className="text-sm text-indigo-400 hover:text-indigo-300">
                                View all
                            </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {earnMethods.map((method) => {
                                const IconComponent = LucideIcons[method.icon];
                                return (
                                    <div
                                        key={method.id}
                                        className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                                    >
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                                            {IconComponent && <IconComponent className="h-5 w-5 text-indigo-400" />}
                                        </div>
                                        <h3 className="font-medium text-white">{method.title}</h3>
                                        <p className="mt-1 text-xs text-zinc-400">{method.description}</p>
                                        <p className="mt-2 text-sm font-medium text-emerald-400">{method.multiplier}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 dark:bg-black/50">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Redeem Options</h2>
                            <Link href="/rewards/redeem" className="text-sm text-indigo-400 hover:text-indigo-300">
                                View all
                            </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {redeemOptions.map((option) => (
                                <Link
                                    key={option.id}
                                    href="/rewards/redeem"
                                    className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                                >
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                        {option.type === 'cash' && <LucideIcons.DollarSign className="h-5 w-5 text-amber-400" />}
                                        {option.type === 'fee_credit' && <LucideIcons.CreditCard className="h-5 w-5 text-amber-400" />}
                                        {option.type === 'premium' && <LucideIcons.Star className="h-5 w-5 text-amber-400" />}
                                    </div>
                                    <h3 className="font-medium text-white group-hover:text-amber-300">{option.title}</h3>
                                    <p className="mt-1 text-xs text-zinc-400">{option.description}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm font-medium text-amber-400">{option.pointsRequired} pts</span>
                                        <LucideIcons.ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 dark:bg-black/50">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Recent Points Activity</h2>
                            <Link href="/rewards/history" className="text-sm text-indigo-400 hover:text-indigo-300">
                                View all
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-zinc-400">Description</TableHead>
                                        <TableHead className="text-zinc-400">Date</TableHead>
                                        <TableHead className="text-zinc-400">Status</TableHead>
                                        <TableHead className="text-right text-zinc-400">Points</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTransactions.map((txn) => (
                                        <TableRow key={txn.id} className="border-white/5 hover:bg-white/5">
                                            <TableCell className="font-medium text-white">{txn.description}</TableCell>
                                            <TableCell className="text-zinc-400">
                                                <div className="flex items-center gap-1">
                                                    <LucideIcons.Clock className="h-3 w-3" />
                                                    {txn.date}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    txn.status === 'completed'
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : 'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                    {txn.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className={`text-right font-medium ${
                                                txn.type === 'earned' ? 'text-emerald-400' : 'text-rose-400'
                                            }`}>
                                                {txn.points > 0 ? '+' : ''}{txn.points} pts
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
