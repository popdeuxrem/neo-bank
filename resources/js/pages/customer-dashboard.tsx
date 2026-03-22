'use client';

import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import UserLayout from '@/layouts/user-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Icons = LucideIcons as Record<string, React.ComponentType<{ className?: string }>>;

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

interface Tier {
    name: string;
    level: string;
    color: string;
    gradient: string;
    points: number;
    benefits: string[];
}

interface RewardPoint {
    id: string;
    type: 'earned' | 'redeemed';
    amount: number;
    description: string;
    date: string;
}

interface ReferralNode {
    id: string;
    name: string;
    level: number;
    status: 'active' | 'inactive';
    joinedDate: string;
    children?: ReferralNode[];
}

const tiers: Tier[] = [
    { name: 'Free', level: 'free', color: 'text-zinc-400', gradient: 'from-zinc-500 to-zinc-600', points: 0, benefits: ['Basic banking', '2 free transfers/month'] },
    { name: 'Pro', level: 'pro', color: 'text-indigo-400', gradient: 'from-indigo-500 to-purple-500', points: 1000, benefits: ['5 free transfers/month', 'Priority support', '2% APY'] },
    { name: 'Business', level: 'business', color: 'text-amber-400', gradient: 'from-amber-500 to-orange-500', points: 5000, benefits: ['Unlimited transfers', '24/7 support', '5% APY', 'Free wire transfers'] },
];

const rewardPoints: RewardPoint[] = [
    { id: '1', type: 'earned', amount: 150, description: 'Card purchase reward', date: '2026-03-20' },
    { id: '2', type: 'redeemed', amount: -500, description: 'Monthly subscription', date: '2026-03-18' },
    { id: '3', type: 'earned', amount: 200, description: 'Referral bonus', date: '2026-03-15' },
    { id: '4', type: 'earned', amount: 75, description: 'Transaction bonus', date: '2026-03-12' },
];

const mockReferralTree: ReferralNode = {
    id: 'root',
    name: 'You',
    level: 0,
    status: 'active',
    joinedDate: '2024-01-15',
    children: [
        { id: '1', name: 'John S.', level: 1, status: 'active', joinedDate: '2025-03-10', children: [
            { id: '1-1', name: 'Alice M.', level: 2, status: 'active', joinedDate: '2025-08-15' },
            { id: '1-2', name: 'Bob K.', level: 2, status: 'active', joinedDate: '2025-09-20' },
        ]},
        { id: '2', name: 'Sarah M.', level: 1, status: 'active', joinedDate: '2025-04-05', children: [
            { id: '2-1', name: 'Emma W.', level: 2, status: 'inactive', joinedDate: '2025-11-12' },
        ]},
    ],
};

const recentTransfers = [
    { id: '1', to: 'John S.', amount: 500, date: '2026-03-20', status: 'completed' },
    { id: '2', to: 'Sarah M.', amount: 250, date: '2026-03-18', status: 'completed' },
    { id: '3', to: 'Wire Transfer', amount: 5000, date: '2026-03-15', status: 'pending' },
];

export default function CustomerDashboard() {
    const { theme, toggleTheme } = useTheme();
    const [transferAmount, setTransferAmount] = useState('');
    const [transferFrom, setTransferFrom] = useState('');
    const [transferTo, setTransferTo] = useState('');
    const [transferType, setTransferType] = useState<'internal' | 'wire'>('internal');

    const currentTier = tiers[1];
    const totalPoints = 12500;

    const handleTransfer = () => {
        if (!transferAmount || !transferFrom || !transferTo) return;
        router.post('/transfers', {
            from: transferFrom,
            to: transferTo,
            amount: transferAmount,
            type: transferType,
        });
    };

    const ReferralNodeComponent = ({ node, isLast = false }: { node: ReferralNode; isLast?: boolean }) => (
        <div className="flex flex-col items-center">
            <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${node.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                <div className={`h-2 w-2 rounded-full ${node.status === 'active' ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                <span className="text-sm font-medium">{node.name}</span>
            </div>
            {node.children && node.children.length > 0 && (
                <div className="flex gap-4 mt-4">
                    {node.children.map((child, idx) => (
                        <div key={child.id} className="relative">
                            {idx > 0 && <div className="absolute -top-4 left-1/2 w-px h-4 bg-zinc-700" />}
                            <ReferralNodeComponent node={child} isLast={idx === node.children!.length - 1} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-6"
            >
                <motion.div variants={fadeUp} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage your portfolio, rewards, and transfers</p>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full"
                    >
                        {theme === 'dark' ? <Icons.Sun className="h-5 w-5" /> : <Icons.Moon className="h-5 w-5" />}
                    </Button>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
                        <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-violet-600/5 dark:from-indigo-600/20 dark:to-violet-600/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium text-slate-700 dark:text-slate-200">Portfolio Tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${currentTier.gradient}`}>
                                            <Icons.Crown className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{currentTier.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{totalPoints.toLocaleString()} points</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={`bg-gradient-to-r ${currentTier.gradient} text-white`}>{currentTier.level.toUpperCase()}</Badge>
                                        <p className="mt-1 text-xs text-slate-500">{tiers[2].points - totalPoints} points to Business</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-zinc-900/50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-medium text-slate-700 dark:text-slate-200">Transfer Funds</CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={transferType === 'internal' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setTransferType('internal')}
                                        >
                                            Internal
                                        </Button>
                                        <Button
                                            variant={transferType === 'wire' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setTransferType('wire')}
                                        >
                                            Wire/SWIFT
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">From Account</Label>
                                        <Select value={transferFrom} onValueChange={setTransferFrom}>
                                            <SelectTrigger className="bg-white dark:bg-zinc-800">
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="main">Main Wallet - $12,450</SelectItem>
                                                <SelectItem value="savings">Savings - $5,200</SelectItem>
                                                <SelectItem value="portfolio">Portfolio - $25,000</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 dark:text-slate-300">
                                            {transferType === 'internal' ? 'To Account/Email' : 'Recipient Account'}
                                        </Label>
                                        <Input
                                            placeholder={transferType === 'internal' ? 'email@example.com' : 'Account number'}
                                            value={transferTo}
                                            onChange={(e) => setTransferTo(e.target.value)}
                                            className="bg-white dark:bg-zinc-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Amount</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={transferAmount}
                                            onChange={(e) => setTransferAmount(e.target.value)}
                                            className="pl-7 bg-white dark:bg-zinc-800"
                                        />
                                    </div>
                                </div>
                                <Button className="w-full" onClick={handleTransfer} disabled={!transferAmount || !transferFrom || !transferTo}>
                                    <Icons.Send className="mr-2 h-4 w-4" />
                                    {transferType === 'internal' ? 'Transfer Funds' : 'Initiate Wire Transfer'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-zinc-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium text-slate-700 dark:text-slate-200">Multi-Level Referral Tree</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center overflow-x-auto py-4">
                                    <ReferralNodeComponent node={mockReferralTree} />
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <Button variant="outline" asChild>
                                        <Link href="/referrals/network">
                                            <Icons.GitBranch className="mr-2 h-4 w-4" />
                                            View Full Network
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeUp} className="space-y-6">
                        <Card className="bg-white dark:bg-zinc-900/50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-medium text-slate-700 dark:text-slate-200">Reward Points</CardTitle>
                                    <Badge variant="outline" className="text-emerald-500">{totalPoints.toLocaleString()} pts</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {rewardPoints.map((point) => (
                                    <div key={point.id} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-zinc-800/50 p-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{point.description}</p>
                                            <p className="text-xs text-slate-500">{point.date}</p>
                                        </div>
                                        <span className={`font-semibold ${point.type === 'earned' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {point.type === 'earned' ? '+' : ''}{point.amount}
                                        </span>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full mt-2" asChild>
                                    <Link href="/rewards">
                                        <Icons.Star className="mr-2 h-4 w-4" />
                                        View All Rewards
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-zinc-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium text-slate-700 dark:text-slate-200">Recent Transfers</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentTransfers.map((transfer) => (
                                    <div key={transfer.id} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-zinc-800/50 p-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{transfer.to}</p>
                                            <p className="text-xs text-slate-500">{transfer.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-700 dark:text-slate-200">${transfer.amount.toLocaleString()}</p>
                                            <Badge variant={transfer.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                                                {transfer.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full mt-2" asChild>
                                    <Link href="/transfers">
                                        <Icons.ArrowRightLeft className="mr-2 h-4 w-4" />
                                        View All Transfers
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Icons.Gift className="h-6 w-6" />
                                    <div>
                                        <p className="font-semibold">Refer Friends & Earn</p>
                                        <p className="text-sm text-indigo-200">Get 500 points per referral</p>
                                    </div>
                                </div>
                                <Button variant="secondary" className="w-full" asChild>
                                    <Link href="/referrals">
                                        <Icons.UserPlus className="mr-2 h-4 w-4" />
                                        Start Referring
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </UserLayout>
    );
}
