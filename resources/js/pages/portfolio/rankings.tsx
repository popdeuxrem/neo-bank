import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Badge } from '@/components/ui/badge';

interface RankingEntry {
    rank: number;
    name: string;
    avatar?: string;
    tier: 'free' | 'pro' | 'business' | 'elite';
    points: number;
    country: string;
    isCurrentUser: boolean;
}

const generateRankings = (): RankingEntry[] => {
    const tiers: Array<'free' | 'pro' | 'business' | 'elite'> = ['free', 'pro', 'business', 'elite'];
    const countries = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'France', 'Japan', 'Brazil', 'India', 'Singapore'];
    const names = [
        'Alex Morgan', 'Jordan Lee', 'Taylor Swift', 'Casey Johnson', 'Riley Chen',
        'Morgan Davis', 'Jamie Wilson', 'Quinn Adams', 'Avery Thompson', 'Blake Martinez',
        'Sam Rodriguez', 'Drew Jackson', 'Skyler White', 'Parker Brown', 'Reese Anderson',
        'Charlie Kim', 'Hayden Taylor', 'Emerson Clark', 'Finley Moore', 'Dakota Evans',
    ];

    const rankings: RankingEntry[] = [];
    for (let i = 0; i < 100; i++) {
        const isCurrentUser = i === 24;
        rankings.push({
            rank: i + 1,
            name: isCurrentUser ? 'You' : names[i % names.length],
            tier: tiers[Math.floor(Math.random() * tiers.length)],
            points: Math.round((100 - i) * 1000 + Math.random() * 500),
            country: countries[Math.floor(Math.random() * countries.length)],
            isCurrentUser,
        });
    }
    return rankings;
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.03 } }
};

const getTierColor = (tier: string) => {
    switch (tier) {
        case 'elite':
            return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
        case 'business':
            return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
        case 'pro':
            return 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30';
        default:
            return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
    }
};

const getTierBadge = (tier: string) => {
    switch (tier) {
        case 'elite':
            return 'bg-gradient-to-r from-rose-500 to-pink-600 text-white';
        case 'business':
            return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
        case 'pro':
            return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
        default:
            return 'bg-zinc-600 text-zinc-200';
    }
};

const getRankBadge = (rank: number) => {
    if (rank === 1) {
        return (
            <div className="flex items-center gap-1 text-amber-400">
                <LucideIcons.Crown className="h-4 w-4" />
                <span className="font-bold">1st</span>
            </div>
        );
    }
    if (rank === 2) {
        return (
            <div className="flex items-center gap-1 text-zinc-300">
                <LucideIcons.Medal className="h-4 w-4" />
                <span className="font-bold">2nd</span>
            </div>
        );
    }
    if (rank === 3) {
        return (
            <div className="flex items-center gap-1 text-orange-400">
                <LucideIcons.Medal className="h-4 w-4" />
                <span className="font-bold">3rd</span>
            </div>
        );
    }
    return <span className="font-medium text-zinc-400">#{rank}</span>;
};

export default function PortfolioRankings() {
    const [filter, setFilter] = useState<'global' | 'country' | 'tier'>('global');
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedTier, setSelectedTier] = useState<string>('all');
    const rankings = generateRankings();

    const filteredRankings = rankings.filter((entry) => {
        if (filter === 'country' && selectedCountry !== 'all' && entry.country !== selectedCountry) {
            return false;
        }
        if (filter === 'tier' && selectedTier !== 'all' && entry.tier !== selectedTier) {
            return false;
        }
        return true;
    });

    const currentUser = rankings.find((r) => r.isCurrentUser);
    const countries = [...new Set(rankings.map((r) => r.country))];
    const tiers: Array<'free' | 'pro' | 'business' | 'elite'> = ['free', 'pro', 'business', 'elite'];

    const formatPoints = (points: number) => {
        if (points >= 1000000) {
            return `${(points / 1000000).toFixed(1)}M`;
        }
        if (points >= 1000) {
            return `${(points / 1000).toFixed(1)}K`;
        }
        return points.toString();
    };

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
                        <div className="lg:col-span-1 space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h3 className="mb-4 text-lg font-semibold text-white">Your Rank</h3>
                                {currentUser && (
                                    <div className="text-center">
                                        <div className="mb-2 text-5xl font-bold text-white">
                                            #{currentUser.rank}
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            {formatPoints(currentUser.points)} points
                                        </p>
                                        <div className="mt-4 flex justify-center gap-2">
                                            <Badge className={getTierBadge(currentUser.tier)}>
                                                {currentUser.tier.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h3 className="mb-4 text-lg font-semibold text-white">Filter By</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-400">View</label>
                                        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
                                            {(['global', 'country', 'tier'] as const).map((f) => (
                                                <button
                                                    key={f}
                                                    onClick={() => setFilter(f)}
                                                    className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                                                        filter === f
                                                            ? 'bg-indigo-500 text-white'
                                                            : 'text-zinc-400 hover:text-white'
                                                    }`}
                                                >
                                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {filter === 'country' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-400">Country</label>
                                            <select
                                                value={selectedCountry}
                                                onChange={(e) => setSelectedCountry(e.target.value)}
                                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                                            >
                                                <option value="all">All Countries</option>
                                                {countries.map((country) => (
                                                    <option key={country} value={country}>
                                                        {country}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {filter === 'tier' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-400">Tier</label>
                                            <select
                                                value={selectedTier}
                                                onChange={(e) => setSelectedTier(e.target.value)}
                                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                                            >
                                                <option value="all">All Tiers</option>
                                                {tiers.map((tier) => (
                                                    <option key={tier} value={tier}>
                                                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h3 className="mb-4 text-lg font-semibold text-white">Top 3</h3>
                                <div className="space-y-3">
                                    {filteredRankings.slice(0, 3).map((entry, index) => (
                                        <div
                                            key={entry.rank}
                                            className={`flex items-center gap-3 rounded-xl p-3 ${
                                                index === 0
                                                    ? 'bg-amber-500/10 border border-amber-500/20'
                                                    : index === 1
                                                    ? 'bg-zinc-500/10 border border-zinc-500/20'
                                                    : 'bg-orange-500/10 border border-orange-500/20'
                                            }`}
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                                                {index === 0 ? (
                                                    <LucideIcons.Crown className="h-4 w-4 text-amber-400" />
                                                ) : index === 1 ? (
                                                    <LucideIcons.Medal className="h-4 w-4 text-zinc-300" />
                                                ) : (
                                                    <LucideIcons.Medal className="h-4 w-4 text-orange-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm font-medium text-white">{entry.name}</p>
                                                <p className="text-xs text-zinc-500">{formatPoints(entry.points)} pts</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">
                                        {filter === 'global'
                                            ? 'Global Leaderboard'
                                            : filter === 'country'
                                            ? `${selectedCountry} Rankings`
                                            : `${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier Rankings`}
                                    </h3>
                                    <Badge className="bg-indigo-500/20 text-indigo-400">
                                        {filteredRankings.length} users
                                    </Badge>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                    Rank
                                                </th>
                                                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                    User
                                                </th>
                                                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                    Tier
                                                </th>
                                                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                    Points
                                                </th>
                                                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                    Country
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRankings.map((entry, index) => (
                                                <motion.tr
                                                    key={entry.rank}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.01 }}
                                                    className={`border-b border-white/5 transition-colors ${
                                                        entry.isCurrentUser
                                                            ? 'bg-indigo-500/10'
                                                            : 'hover:bg-white/5'
                                                    }`}
                                                >
                                                    <td className="py-4 pr-4">
                                                        <div className="flex items-center justify-center w-10">
                                                            {getRankBadge(entry.rank)}
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-medium text-white">
                                                                {entry.name.split(' ').map((n) => n[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`font-medium ${entry.isCurrentUser ? 'text-indigo-400' : 'text-white'}`}>
                                                                        {entry.name}
                                                                    </span>
                                                                    {entry.isCurrentUser && (
                                                                        <Badge className="bg-indigo-500/20 text-indigo-400 text-[10px]">You</Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <Badge className={`${getTierBadge(entry.tier)} text-[10px]`}>
                                                            {entry.tier.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="font-mono font-medium text-white">
                                                            {formatPoints(entry.points)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-2 text-zinc-400">
                                                            <LucideIcons.Globe className="h-4 w-4" />
                                                            <span className="text-sm">{entry.country}</span>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
