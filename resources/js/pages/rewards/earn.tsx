import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

interface EarnMethod {
    id: string;
    title: string;
    description: string;
    multiplier: string;
    points: string;
    icon: keyof typeof LucideIcons;
    available: boolean;
}

interface TransactionExample {
    description: string;
    amount: string;
    pointsEarned: string;
}

const earnMethods: EarnMethod[] = [
    { 
        id: '1', 
        title: 'Card Purchases', 
        description: 'Earn points on every purchase with your Neo Bank card', 
        multiplier: '1x - 5x',
        points: '1-5 pts/$1',
        icon: 'CreditCard',
        available: true
    },
    { 
        id: '2', 
        title: 'Refer Friends', 
        description: 'Invite friends and earn bonus points for each successful referral', 
        multiplier: '500 pts',
        points: '500 pts/ref',
        icon: 'UserPlus',
        available: true
    },
    { 
        id: '3', 
        title: 'Monthly Transactions', 
        description: 'Get bonus points for maintaining account activity', 
        multiplier: '200 pts',
        points: 'Up to 200 pts/mo',
        icon: 'TrendingUp',
        available: true
    },
    { 
        id: '4', 
        title: 'Complete Surveys', 
        description: 'Share your feedback and earn points for your opinions', 
        multiplier: '50-200 pts',
        points: '50-200 pts/survey',
        icon: 'FileText',
        available: true
    },
    { 
        id: '5', 
        title: 'Online Shopping', 
        description: 'Shop with partner retailers and earn bonus points', 
        multiplier: '2x - 10x',
        points: '2-10 pts/$1',
        icon: 'ShoppingBag',
        available: true
    },
    { 
        id: '6', 
        title: 'International Transfers', 
        description: 'Earn points on outgoing international wire transfers', 
        multiplier: '3x',
        points: '3 pts/$1',
        icon: 'Globe',
        available: true
    },
];

const transactionExamples: TransactionExample[] = [
    { description: 'Grocery Store', amount: '$150.00', pointsEarned: '150 pts (1x)' },
    { description: 'Restaurant', amount: '$85.00', pointsEarned: '170 pts (2x)' },
    { description: 'Gas Station', amount: '$60.00', pointsEarned: '60 pts (1x)' },
    { description: 'Streaming Services', amount: '$45.00', pointsEarned: '225 pts (5x)' },
    { description: 'Electronics', amount: '$200.00', pointsEarned: '400 pts (2x)' },
    { description: 'Coffee Shop', amount: '$12.50', pointsEarned: '25 pts (2x)' },
];

const tierBenefits = [
    { tier: 'Free', multiplier: '1x', bonus: '0%', color: 'bg-zinc-500' },
    { tier: 'Pro', multiplier: '2x', bonus: '10%', color: 'bg-indigo-500' },
    { tier: 'Business', multiplier: '3x', bonus: '25%', color: 'bg-amber-500' },
];

export default function EarnPoints() {
    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">Earn Points</h1>
                        <p className="mt-1 text-zinc-400">Discover all the ways to earn reward points</p>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 dark:bg-black/50">
                        <h2 className="mb-4 text-lg font-semibold text-white">Your Tier Bonuses</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {tierBenefits.map((tier) => (
                                <div
                                    key={tier.tier}
                                    className={`rounded-lg border border-white/10 p-4 ${
                                        tier.tier === 'Pro' ? 'bg-indigo-500/10' : 'bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                                        <span className="font-medium text-white">{tier.tier}</span>
                                    </div>
                                    <div className="mt-3 flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-white">{tier.multiplier}</span>
                                        <span className="text-sm text-zinc-400">base points</span>
                                    </div>
                                    <p className="mt-1 text-sm text-emerald-400">+{tier.bonus} bonus</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-zinc-500">
                            Upgrade your tier to earn more points on every transaction
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 dark:bg-black/50">
                        <h2 className="mb-4 text-lg font-semibold text-white">Ways to Earn</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {earnMethods.map((method) => {
                                const IconComponent = LucideIcons[method.icon];
                                return (
                                    <div
                                        key={method.id}
                                        className="group relative rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
                                                {IconComponent && <IconComponent className="h-6 w-6 text-indigo-400" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-white">{method.title}</h3>
                                                    {method.available && (
                                                        <LucideIcons.CheckCircle className="h-4 w-4 text-emerald-400" />
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-zinc-400">{method.description}</p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-indigo-400">{method.multiplier}</span>
                                                    <span className="text-sm text-emerald-400">{method.points}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 dark:bg-black/50">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Points by Transaction</h2>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <LucideIcons.Zap className="h-4 w-4 text-amber-400" />
                                <span>Example calculations</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-400">Transaction</th>
                                        <th className="pb-3 text-left text-sm font-medium text-zinc-400">Amount</th>
                                        <th className="pb-3 text-right text-sm font-medium text-zinc-400">Points Earned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactionExamples.map((example, idx) => (
                                        <tr key={idx} className="border-b border-white/5">
                                            <td className="py-3 text-sm text-white">{example.description}</td>
                                            <td className="py-3 text-sm text-zinc-400">{example.amount}</td>
                                            <td className="py-3 text-right text-sm font-medium text-emerald-400">
                                                {example.pointsEarned}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-600/10 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                                <LucideIcons.Gift className="h-6 w-6 text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">Refer Friends & Earn 500 Points</h3>
                                <p className="mt-1 text-sm text-zinc-400">
                                    Share your referral link with friends. When they sign up and complete their first transaction, you'll both receive 500 bonus points!
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <Link href="/referrals">
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
                                            Get Referral Link
                                            <LucideIcons.ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
