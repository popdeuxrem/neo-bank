import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';

interface LeaderboardEntry {
    rank: number;
    name: string;
    email: string;
    referrals: number;
    earnings: number;
    isCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Alex Thompson', email: 'alex@example.com', referrals: 156, earnings: 2450 },
    { rank: 2, name: 'Maria Garcia', email: 'maria@example.com', referrals: 134, earnings: 2180 },
    { rank: 3, name: 'James Wilson', email: 'james.w@example.com', referrals: 98, earnings: 1620 },
    { rank: 4, name: 'Sophie Chen', email: 'sophie@example.com', referrals: 87, earnings: 1455 },
    { rank: 5, name: 'Michael Brown', email: 'mbrown@example.com', referrals: 76, earnings: 1280 },
    { rank: 6, name: 'Emma Davis', email: 'emma.d@example.com', referrals: 68, earnings: 1120 },
    { rank: 7, name: 'Robert Taylor', email: 'rtaylor@example.com', referrals: 54, earnings: 890 },
    { rank: 8, name: 'Lisa Anderson', email: 'lisa.a@example.com', referrals: 51, earnings: 845 },
    { rank: 9, name: 'David Martinez', email: 'dmartinez@example.com', referrals: 47, earnings: 775 },
    { rank: 10, name: 'Jennifer White', email: 'jwhite@example.com', referrals: 43, earnings: 710 },
    { rank: 11, name: 'You', email: 'john@example.com', referrals: 38, earnings: 625, isCurrentUser: true },
    { rank: 12, name: 'Kevin Lee', email: 'klee@example.com', referrals: 35, earnings: 580 },
    { rank: 13, name: 'Sarah Johnson', email: 'sjohnson@example.com', referrals: 32, earnings: 535 },
    { rank: 14, name: 'Thomas Clark', email: 'tclark@example.com', referrals: 28, earnings: 460 },
    { rank: 15, name: 'Amy Robinson', email: 'arobinson@example.com', referrals: 25, earnings: 415 },
];

const getRankBadge = (rank: number) => {
    switch (rank) {
        case 1:
            return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500"><LucideIcons.Trophy className="h-4 w-4 text-white" /></div>;
        case 2:
            return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-400"><LucideIcons.Medal className="h-4 w-4 text-white" /></div>;
        case 3:
            return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700"><LucideIcons.Medal className="h-4 w-4 text-white" /></div>;
        default:
            return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">{rank}</div>;
    }
};

export default function ReferralsLeaderboard() {
    const currentUserRank = mockLeaderboard.find(e => e.isCurrentUser)?.rank || 0;
    const topThree = mockLeaderboard.slice(0, 3);
    const restOfLeaderboard = mockLeaderboard.slice(3);

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                <LucideIcons.Trophy className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Your Rank</p>
                                <p className="text-xl font-bold text-white">#{currentUserRank}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                                <LucideIcons.Users className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Your Referrals</p>
                                <p className="text-xl font-bold text-white">38</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                <LucideIcons.DollarSign className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Your Earnings</p>
                                <p className="text-xl font-bold text-white">$625</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <h2 className="mb-6 text-lg font-semibold text-white">Top Referrers</h2>

                    <div className="mb-8 grid gap-4 md:grid-cols-3">
                        {topThree.map((entry, index) => (
                            <motion.div
                                key={entry.rank}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className={`relative rounded-xl border p-4 ${
                                    entry.rank === 1 
                                        ? 'border-amber-500/30 bg-amber-500/10' 
                                        : entry.rank === 2 
                                        ? 'border-zinc-400/30 bg-zinc-400/10' 
                                        : 'border-amber-700/30 bg-amber-700/10'
                                }`}
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    {getRankBadge(entry.rank)}
                                    {entry.rank === 1 && (
                                        <LucideIcons.Crown className="h-5 w-5 text-amber-400" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-white">{entry.name}</p>
                                    <p className="text-xs text-zinc-500">{entry.email}</p>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-500">Referrals</p>
                                        <p className="font-bold text-white">{entry.referrals}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-500">Earned</p>
                                        <p className="font-bold text-emerald-400">${entry.earnings}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-zinc-500">Rank</th>
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-zinc-500">User</th>
                                    <th className="pb-3 text-right text-xs font-medium uppercase text-zinc-500">Referrals</th>
                                    <th className="pb-3 text-right text-xs font-medium uppercase text-zinc-500">Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {restOfLeaderboard.map((entry, index) => (
                                    <motion.tr
                                        key={entry.rank}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 + index * 0.05 }}
                                        className={`group ${entry.isCurrentUser ? 'bg-indigo-500/10' : ''}`}
                                    >
                                        <td className="py-3">
                                            {getRankBadge(entry.rank)}
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${entry.isCurrentUser ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-zinc-400'}`}>
                                                    {entry.name[0]}
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${entry.isCurrentUser ? 'text-indigo-400' : 'text-white'}`}>
                                                        {entry.name}
                                                        {entry.isCurrentUser && <Badge className="ml-2 bg-indigo-500/20 text-indigo-400 text-[10px]">You</Badge>}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">{entry.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-right">
                                            <span className="font-medium text-white">{entry.referrals}</span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <span className="font-medium text-emerald-400">${entry.earnings}</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <h2 className="mb-4 text-lg font-semibold text-white">How to Climb the Leaderboard</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                                <LucideIcons.UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">Refer More Friends</h3>
                                <p className="text-sm text-zinc-400">Each verified referral adds to your count</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                                <LucideIcons.Share className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">Share Your Link</h3>
                                <p className="text-sm text-zinc-400">Share on social media and emails</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                                <LucideIcons.Gift className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">Earn Bonus Rewards</h3>
                                <p className="text-sm text-zinc-400">Reach milestones for extra bonuses</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
}
