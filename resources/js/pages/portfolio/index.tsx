import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Link } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Tier {
    name: string;
    level: 'free' | 'pro' | 'business' | 'elite';
    color: string;
    gradient: string;
    benefits: string[];
    nextTier?: string;
    progressToNext: number;
    requiredPoints: number;
    currentPoints: number;
}

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
    progress?: number;
    maxProgress?: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface EarningsData {
    source: string;
    amount: number;
    percentage: number;
    icon: string;
    trend: number;
}

const tiers: Tier[] = [
    {
        name: 'Free',
        level: 'free',
        color: 'text-zinc-400',
        gradient: 'from-zinc-500 to-zinc-600',
        benefits: [
            'Basic banking features',
            '2 free transfers/month',
            'Standard support',
        ],
        progressToNext: 75,
        requiredPoints: 1000,
        currentPoints: 750,
    },
    {
        name: 'Pro',
        level: 'pro',
        color: 'text-indigo-400',
        gradient: 'from-indigo-500 to-purple-500',
        benefits: [
            'Unlimited transfers',
            'Priority support',
            '2% cashback on purchases',
            'Higher withdrawal limits',
        ],
        nextTier: 'Business',
        progressToNext: 45,
        requiredPoints: 5000,
        currentPoints: 2250,
    },
    {
        name: 'Business',
        level: 'business',
        color: 'text-amber-400',
        gradient: 'from-amber-500 to-orange-500',
        benefits: [
            'All Pro benefits',
            '5% cashback on purchases',
            'Business analytics',
            'Dedicated account manager',
        ],
        nextTier: 'Elite',
        progressToNext: 20,
        requiredPoints: 25000,
        currentPoints: 5000,
    },
    {
        name: 'Elite',
        level: 'elite',
        color: 'text-rose-400',
        gradient: 'from-rose-500 to-pink-600',
        benefits: [
            'All Business benefits',
            '10% cashback on purchases',
            'Exclusive events access',
            'VIP concierge service',
        ],
        progressToNext: 100,
        requiredPoints: 100000,
        currentPoints: 5000,
    },
];

const badges: Badge[] = [
    {
        id: 'b1',
        name: 'First Deposit',
        description: 'Make your first deposit',
        icon: 'Wallet',
        earned: true,
        earnedDate: '2024-01-15',
        rarity: 'common',
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
    },
    {
        id: 'b3',
        name: 'Referral Master',
        description: 'Refer 5 friends who sign up',
        icon: 'Star',
        earned: true,
        earnedDate: '2024-03-10',
        progress: 5,
        maxProgress: 5,
        rarity: 'epic',
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
    },
    {
        id: 'b5',
        name: 'Transaction Pro',
        description: 'Complete 500 transactions',
        icon: 'TrendingUp',
        earned: false,
        progress: 387,
        maxProgress: 500,
        rarity: 'epic',
    },
    {
        id: 'b6',
        name: 'Elite Member',
        description: 'Reach Elite tier status',
        icon: 'Crown',
        earned: false,
        progress: 45,
        maxProgress: 100,
        rarity: 'legendary',
    },
    {
        id: 'b7',
        name: 'Perfect Month',
        description: 'No declined transactions in a month',
        icon: 'Check',
        earned: false,
        progress: 12,
        maxProgress: 30,
        rarity: 'rare',
    },
    {
        id: 'b8',
        name: 'Early Bird',
        description: 'Use Neo Bank for 1 year',
        icon: 'Star',
        earned: false,
        progress: 8,
        maxProgress: 12,
        rarity: 'common',
    },
];

const earningsData: EarningsData[] = [
    {
        source: 'Interest Income',
        amount: 1247.50,
        percentage: 35,
        icon: 'PiggyBank',
        trend: 5.2,
    },
    {
        source: 'Cashback Rewards',
        amount: 892.30,
        percentage: 25,
        icon: 'CreditCard',
        trend: 12.8,
    },
    {
        source: 'Referral Commissions',
        amount: 534.00,
        percentage: 15,
        icon: 'Star',
        trend: -3.5,
    },
    {
        source: 'APY Bonus',
        amount: 445.20,
        percentage: 12,
        icon: 'TrendingUp',
        trend: 8.1,
    },
    {
        source: 'Tier Benefits',
        amount: 356.00,
        percentage: 10,
        icon: 'Crown',
        trend: 0,
    },
    {
        source: 'Other',
        amount: 89.50,
        percentage: 3,
        icon: 'Gem',
        trend: 2.1,
    },
];

const globalRank = {
    rank: 247,
    totalUsers: 125430,
    country: 'United States',
    countryRank: 42,
    tierRank: 12,
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const getTierIcon = (level: string) => {
    switch (level) {
        case 'free':
            return <LucideIcons.Star className="h-5 w-5" />;
        case 'pro':
            return <LucideIcons.Gem className="h-5 w-5" />;
        case 'business':
            return <LucideIcons.Crown className="h-5 w-5" />;
        case 'elite':
            return <LucideIcons.Trophy className="h-5 w-5" />;
        default:
            return <LucideIcons.Star className="h-5 w-5" />;
    }
};

const getBadgeIcon = (icon: string) => {
    const icons: Record<string, any> = {
        Wallet: LucideIcons.Wallet, CreditCard: LucideIcons.CreditCard, Star: LucideIcons.Star,
        PiggyBank: LucideIcons.PiggyBank, TrendingUp: LucideIcons.TrendingUp,
        Crown: LucideIcons.Crown, Check: LucideIcons.Check, Gem: LucideIcons.Gem,
    };
    const IconComponent = icons[icon] || LucideIcons.Star;
    return <IconComponent className="h-6 w-6" />;
};

const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case 'common':
            return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
        case 'rare':
            return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        case 'epic':
            return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
        case 'legendary':
            return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
        default:
            return 'text-zinc-400 bg-zinc-500/20';
    }
};

const currentTier = tiers[1];
const earnedBadges = badges.filter(b => b.earned);
const lockedBadges = badges.filter(b => !b.earned);

export default function Portfolio() {
    const totalEarnings = earningsData.reduce((sum, e) => sum + e.amount, 0);

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
                        <div className="lg:col-span-2 space-y-6">
                            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent p-6 shadow-2xl shadow-indigo-500/10">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                                
                                <div className="relative z-10">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${currentTier.gradient}`}>
                                                {getTierIcon(currentTier.level)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-2xl font-bold text-white">{currentTier.name}</h2>
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <Badge className={`bg-gradient-to-r ${currentTier.gradient} border-0 text-white text-xs`}>
                                                            {currentTier.level.toUpperCase()}
                                                        </Badge>
                                                    </motion.div>
                                                </div>
                                                <p className="text-sm text-zinc-400">{currentTier.currentPoints.toLocaleString()} / {currentTier.requiredPoints.toLocaleString()} points</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {currentTier.nextTier && (
                                        <div className="mt-6">
                                            <div className="mb-2 flex items-center justify-between text-sm">
                                                <span className="text-zinc-400">Progress to {currentTier.nextTier}</span>
                                                <span className="font-medium text-white">{currentTier.progressToNext}%</span>
                                            </div>
                                            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                                                <motion.div
                                                    className={`h-full rounded-full bg-gradient-to-r ${currentTier.gradient}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${currentTier.progressToNext}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-zinc-500">
                                                {(currentTier.requiredPoints - currentTier.currentPoints).toLocaleString()} points until {currentTier.nextTier}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/50 dark:bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Benefits</h3>
                                    <Badge className="bg-indigo-500/20 text-indigo-400">{currentTier.benefits.length} benefits</Badge>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {currentTier.benefits.map((benefit, index) => (
                                        <motion.div
                                            key={benefit}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-3"
                                        >
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                                                <LucideIcons.Check className="h-3 w-3 text-emerald-400" />
                                            </div>
                                            <span className="text-sm text-emerald-100">{benefit}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center gap-2">
                                    <LucideIcons.Trophy className="h-5 w-5 text-amber-400" />
                                    <h3 className="text-lg font-semibold text-white">Global Rank</h3>
                                </div>
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="mb-2 text-5xl font-bold text-white"
                                    >
                                        #{globalRank.rank.toLocaleString()}
                                    </motion.div>
                                    <p className="text-sm text-zinc-400">of {globalRank.totalUsers.toLocaleString()} users</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-white/5 p-3 text-center">
                                        <div className="text-lg font-semibold text-white">#{globalRank.countryRank}</div>
                                        <div className="text-xs text-zinc-500">{globalRank.country}</div>
                                    </div>
                                    <div className="rounded-xl bg-white/5 p-3 text-center">
                                        <div className="text-lg font-semibold text-white">#{globalRank.tierRank}</div>
                                        <div className="text-xs text-zinc-500">{currentTier.name} Tier</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Badge Cabinet</h3>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/portfolio/badges">View all</Link>
                                    </Button>
                                </div>
                                <div className="mb-4 flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                                            <LucideIcons.Check className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <span className="text-sm text-zinc-400">Earned: <span className="font-medium text-white">{earnedBadges.length}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-500/20">
                                            <LucideIcons.Lock className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <span className="text-sm text-zinc-400">Locked: <span className="font-medium text-white">{lockedBadges.length}</span></span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {badges.slice(0, 8).map((badge, index) => (
                                        <motion.div
                                            key={badge.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`relative flex aspect-square items-center justify-center rounded-xl ${
                                                badge.earned 
                                                    ? getRarityColor(badge.rarity)
                                                    : 'bg-zinc-800/50 text-zinc-600'
                                            }`}
                                            title={badge.name}
                                        >
                                            {badge.earned ? getBadgeIcon(badge.icon) : <LucideIcons.Lock className="h-4 w-4" />}
                                            {!badge.earned && badge.progress !== undefined && (
                                                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-indigo-500 text-[8px]" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Portfolio Earnings</h3>
                                <p className="text-sm text-zinc-400">Your total earnings breakdown</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{formatCurrency(totalEarnings)}</div>
                                <div className="text-sm text-emerald-400">All time earnings</div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {earningsData.map((item, index) => (
                                <motion.div
                                    key={item.source}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 rounded-xl bg-white/5 p-4"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                                        {getBadgeIcon(item.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-white">{item.source}</span>
                                            <div className="flex items-center gap-2">
                                                {item.trend !== 0 && (
                                                    <div className={`flex items-center gap-1 text-xs ${item.trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {item.trend > 0 ? <LucideIcons.ArrowUpRight className="h-3 w-3" /> : <LucideIcons.ArrowDownRight className="h-3 w-3" />}
                                                        {Math.abs(item.trend)}%
                                                    </div>
                                                )}
                                                <span className="font-semibold text-white">{formatCurrency(item.amount)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-1 h-1.5 rounded-full bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-indigo-500"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">All Tiers</h3>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/portfolio/rankings">View Rankings</Link>
                            </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {tiers.map((tier, index) => (
                                <motion.div
                                    key={tier.level}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative rounded-xl border p-4 ${
                                        tier.level === currentTier.level
                                            ? 'border-indigo-500/50 bg-indigo-500/10'
                                            : 'border-white/10 bg-white/5'
                                    }`}
                                >
                                    {tier.level === currentTier.level && (
                                        <div className="absolute -top-2 -right-2">
                                            <Badge className="bg-indigo-500 text-white text-[10px]">CURRENT</Badge>
                                        </div>
                                    )}
                                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tier.gradient}`}>
                                        {getTierIcon(tier.level)}
                                    </div>
                                    <h4 className={`font-semibold ${tier.color}`}>{tier.name}</h4>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {tier.requiredPoints.toLocaleString()} points required
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
