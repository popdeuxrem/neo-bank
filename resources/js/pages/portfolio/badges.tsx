import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BadgeData {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
    progress?: number;
    maxProgress?: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    requirement: string;
    reward: string;
}

const badges: BadgeData[] = [
    {
        id: 'b1',
        name: 'First Deposit',
        description: 'Make your first deposit',
        icon: 'Wallet',
        earned: true,
        earnedDate: '2024-01-15',
        progress: 100,
        maxProgress: 100,
        rarity: 'common',
        requirement: 'Make your first deposit',
        reward: '100 points',
    },
    {
        id: 'b2',
        name: 'Big Spender',
        description: 'Spend over $10,000 in a month',
        icon: 'CreditCard',
        earned: true,
        earnedDate: '2024-02-20',
        progress: 100,
        maxProgress: 100,
        rarity: 'rare',
        requirement: 'Spend $10,000 in a single month',
        reward: '500 points',
    },
    {
        id: 'b3',
        name: 'Referral Master',
        description: 'Refer 5 friends who sign up',
        icon: 'UserPlus',
        earned: true,
        earnedDate: '2024-03-10',
        progress: 5,
        maxProgress: 5,
        rarity: 'epic',
        requirement: 'Refer 5 friends who complete sign up',
        reward: '1000 points + Pro tier',
    },
    {
        id: 'b4',
        name: 'Savings Champion',
        description: 'Save $50,000 total',
        icon: 'PiggyBank',
        earned: true,
        earnedDate: '2024-04-05',
        progress: 50000,
        maxProgress: 50000,
        rarity: 'rare',
        requirement: 'Accumulate $50,000 in savings',
        reward: '750 points',
    },
    {
        id: 'b5',
        name: 'Transaction Pro',
        description: 'Complete 500 transactions',
        icon: 'Activity',
        earned: false,
        progress: 387,
        maxProgress: 500,
        rarity: 'epic',
        requirement: 'Complete 500 transactions',
        reward: '1500 points',
    },
    {
        id: 'b6',
        name: 'Elite Member',
        description: 'Reach Elite tier status',
        icon: 'Crown',
        earned: false,
        progress: 5,
        maxProgress: 100,
        rarity: 'legendary',
        requirement: 'Reach Elite tier',
        reward: '5000 points + Elite badge',
    },
    {
        id: 'b7',
        name: 'Perfect Month',
        description: 'No declined transactions in a month',
        icon: 'CheckCircle',
        earned: false,
        progress: 12,
        maxProgress: 30,
        rarity: 'rare',
        requirement: 'Go 30 days without a declined transaction',
        reward: '400 points',
    },
    {
        id: 'b8',
        name: 'Early Bird',
        description: 'Use Neo Bank for 1 year',
        icon: 'Calendar',
        earned: false,
        progress: 8,
        maxProgress: 12,
        rarity: 'common',
        requirement: 'Maintain account for 12 months',
        reward: '200 points',
    },
    {
        id: 'b9',
        name: 'Millionaire',
        description: 'Reach $1M in total transactions',
        icon: 'Banknote',
        earned: false,
        progress: 250000,
        maxProgress: 1000000,
        rarity: 'legendary',
        requirement: 'Process $1,000,000 in total transactions',
        reward: '10000 points + Gold card',
    },
    {
        id: 'b10',
        name: 'Quick Saver',
        description: 'Save $10,000 in one month',
        icon: 'TrendingUp',
        earned: false,
        progress: 7500,
        maxProgress: 10000,
        rarity: 'rare',
        requirement: 'Save $10,000 in a single month',
        reward: '600 points',
    },
    {
        id: 'b11',
        name: 'Security Expert',
        description: 'Enable all security features',
        icon: 'Shield',
        earned: true,
        earnedDate: '2024-01-20',
        progress: 100,
        maxProgress: 100,
        rarity: 'common',
        requirement: 'Enable 2FA, biometric login, and security alerts',
        reward: '150 points',
    },
    {
        id: 'b12',
        name: 'Global Citizen',
        description: 'Send money to 10 different countries',
        icon: 'Globe',
        earned: false,
        progress: 4,
        maxProgress: 10,
        rarity: 'epic',
        requirement: 'Send transfers to 10 different countries',
        reward: '800 points',
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

const getBadgeIcon = (icon: string) => {
    const icons: Record<string, any> = {
        Wallet: LucideIcons.Wallet, CreditCard: LucideIcons.CreditCard, UserPlus: LucideIcons.UserPlus,
        PiggyBank: LucideIcons.PiggyBank, Activity: LucideIcons.Activity, Crown: LucideIcons.Crown,
        CheckCircle: LucideIcons.CheckCircle, Calendar: LucideIcons.Calendar, Banknote: LucideIcons.Banknote,
        TrendingUp: LucideIcons.TrendingUp, Shield: LucideIcons.Shield, Globe: LucideIcons.Globe,
    };
    const IconComponent = icons[icon] || LucideIcons.Star;
    return IconComponent;
};

const getRarityStyles = (rarity: string) => {
    switch (rarity) {
        case 'common':
            return {
                bg: 'bg-zinc-500/20 border-zinc-500/30',
                text: 'text-zinc-400',
                glow: 'shadow-zinc-500/20',
                badge: 'bg-zinc-600 text-zinc-200',
            };
        case 'rare':
            return {
                bg: 'bg-blue-500/20 border-blue-500/30',
                text: 'text-blue-400',
                glow: 'shadow-blue-500/20',
                badge: 'bg-blue-600 text-blue-200',
            };
        case 'epic':
            return {
                bg: 'bg-purple-500/20 border-purple-500/30',
                text: 'text-purple-400',
                glow: 'shadow-purple-500/20',
                badge: 'bg-purple-600 text-purple-200',
            };
        case 'legendary':
            return {
                bg: 'bg-amber-500/20 border-amber-500/30',
                text: 'text-amber-400',
                glow: 'shadow-amber-500/20',
                badge: 'bg-amber-600 text-amber-200',
            };
        default:
            return {
                bg: 'bg-zinc-500/20 border-zinc-500/30',
                text: 'text-zinc-400',
                glow: 'shadow-zinc-500/20',
                badge: 'bg-zinc-600 text-zinc-200',
            };
    }
};

export default function PortfolioBadges() {
    const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
    const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

    const earnedBadges = badges.filter(b => b.earned);
    const lockedBadges = badges.filter(b => !b.earned);

    const filteredBadges = filter === 'all' ? badges : filter === 'earned' ? earnedBadges : lockedBadges;

    const totalProgress = Math.round(
        (earnedBadges.reduce((acc, b) => acc + (b.progress || 0), 0) /
        badges.reduce((acc, b) => acc + (b.maxProgress || 1), 0)) * 100
    );

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="grid gap-6 lg:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl lg:col-span-1">
                            <div className="mb-4 text-center">
                                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                                <p className="text-sm text-zinc-400">Badge collection</p>
                            </div>
                            <div className="relative mb-4 flex items-center justify-center">
                                <svg className="h-32 w-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-white/10"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={`${totalProgress * 3.52} 352`}
                                        strokeLinecap="round"
                                        className="text-indigo-500 transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-bold text-white">{earnedBadges.length}</span>
                                    <span className="text-xs text-zinc-400">of {badges.length}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">Common</span>
                                    <span className="text-white">
                                        {badges.filter(b => b.rarity === 'common' && b.earned).length}/{badges.filter(b => b.rarity === 'common').length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">Rare</span>
                                    <span className="text-blue-400">
                                        {badges.filter(b => b.rarity === 'rare' && b.earned).length}/{badges.filter(b => b.rarity === 'rare').length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">Epic</span>
                                    <span className="text-purple-400">
                                        {badges.filter(b => b.rarity === 'epic' && b.earned).length}/{badges.filter(b => b.rarity === 'epic').length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">Legendary</span>
                                    <span className="text-amber-400">
                                        {badges.filter(b => b.rarity === 'legendary' && b.earned).length}/{badges.filter(b => b.rarity === 'legendary').length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl lg:col-span-3">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">All Badges</h3>
                                <div className="flex gap-2">
                                    {(['all', 'earned', 'locked'] as const).map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                                filter === f
                                                    ? 'bg-indigo-500/20 text-indigo-400'
                                                    : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                        >
                                            {f.charAt(0).toUpperCase() + f.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredBadges.map((badge, index) => {
                                    const styles = getRarityStyles(badge.rarity);
                                    const progress = badge.maxProgress ? Math.round((badge.progress || 0) / badge.maxProgress * 100) : 0;
                                    const IconComponent = getBadgeIcon(badge.icon);

                                    return (
                                        <motion.button
                                            key={badge.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelectedBadge(badge)}
                                            className={`relative flex flex-col items-center rounded-xl border p-4 text-left transition-all hover:scale-[1.02] ${
                                                badge.earned
                                                    ? styles.bg
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${
                                                badge.earned ? styles.text : 'text-zinc-600'
                                            }`}>
                                                <IconComponent className="h-7 w-7" />
                                            </div>
                                            <div className="text-center">
                                                <h4 className={`font-semibold ${badge.earned ? styles.text : 'text-zinc-400'}`}>
                                                    {badge.name}
                                                </h4>
                                                <p className="mt-1 text-xs text-zinc-500">{badge.description}</p>
                                            </div>
                                            {!badge.earned && badge.maxProgress && (
                                                <div className="mt-3 w-full">
                                                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                                        <span>Progress</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <div className="mt-1 h-1.5 rounded-full bg-white/10">
                                                        <div
                                                            className="h-full rounded-full bg-indigo-500"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <Badge className={`absolute right-2 top-2 ${styles.badge} text-[10px]`}>
                                                {badge.rarity}
                                            </Badge>
                                            {badge.earned && (
                                                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                                                    <LucideIcons.Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h3 className="mb-4 text-lg font-semibold text-white">Next Badges</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {lockedBadges.slice(0, 3).map((badge) => {
                                const styles = getRarityStyles(badge.rarity);
                                const progress = badge.maxProgress ? Math.round((badge.progress || 0) / badge.maxProgress * 100) : 0;
                                const IconComponent = getBadgeIcon(badge.icon);

                                return (
                                    <div
                                        key={badge.id}
                                        className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.text} bg-white/5`}>
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-white">{badge.name}</h4>
                                            <p className="text-xs text-zinc-500">{badge.reward}</p>
                                            <div className="mt-2 h-1.5 rounded-full bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-indigo-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {selectedBadge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setSelectedBadge(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
                        >
                            <div className={`relative p-6 ${
                                selectedBadge.earned
                                    ? getRarityStyles(selectedBadge.rarity).bg.replace('bg-', 'bg-gradient-to-br from-').replace('/20', '/30').replace('border', 'to-')
                                    : 'bg-white/5'
                            }`}>
                                <button
                                    onClick={() => setSelectedBadge(null)}
                                    className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
                                >
                                    <LucideIcons.X className="h-5 w-5" />
                                </button>
                                <div className="flex flex-col items-center text-center">
                                    <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${
                                        selectedBadge.earned
                                            ? getRarityStyles(selectedBadge.rarity).bg
                                            : 'bg-white/10'
                                    }`}>
                                        {(() => {
                                            const IconComponent = getBadgeIcon(selectedBadge.icon);
                                            return <IconComponent className={`h-10 w-10 ${selectedBadge.earned ? getRarityStyles(selectedBadge.rarity).text : 'text-zinc-500'}`} />;
                                        })()}
                                    </div>
                                    <Badge className={`mb-3 ${getRarityStyles(selectedBadge.rarity).badge}`}>
                                        {selectedBadge.rarity}
                                    </Badge>
                                    <h2 className="text-2xl font-bold text-white">{selectedBadge.name}</h2>
                                    <p className="mt-2 text-zinc-400">{selectedBadge.description}</p>
                                    
                                    {selectedBadge.earned ? (
                                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/20 px-4 py-2">
                                            <LucideIcons.CheckCircle className="h-5 w-5 text-emerald-400" />
                                            <span className="text-sm text-emerald-400">Earned on {new Date(selectedBadge.earnedDate!).toLocaleDateString()}</span>
                                        </div>
                                    ) : (
                                        <div className="mt-4 w-full">
                                            <div className="mb-2 flex items-center justify-between text-sm">
                                                <span className="text-zinc-400">Progress</span>
                                                <span className="text-white">
                                                    {selectedBadge.progress?.toLocaleString()} / {selectedBadge.maxProgress?.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-indigo-500"
                                                    style={{ width: `${(selectedBadge.progress || 0) / (selectedBadge.maxProgress || 1) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <LucideIcons.Target className="h-4 w-4" />
                                            <span className="text-sm">Requirement</span>
                                        </div>
                                        <span className="text-sm text-white">{selectedBadge.requirement}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <LucideIcons.Gift className="h-4 w-4" />
                                            <span className="text-sm">Reward</span>
                                        </div>
                                        <span className="text-sm font-medium text-indigo-400">{selectedBadge.reward}</span>
                                    </div>
                                </div>
                                <Button
                                    className="mt-4 w-full"
                                    onClick={() => setSelectedBadge(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </UserLayout>
    );
}
