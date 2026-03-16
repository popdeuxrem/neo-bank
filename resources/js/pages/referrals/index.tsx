import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';

interface Referral {
    id: string;
    name: string;
    email: string;
    status: 'invited' | 'signed_up' | 'verified' | 'reward_paid';
    date: string;
    reward: number | null;
    level: 1 | 2 | 3;
}

interface Commission {
    id: string;
    referralName: string;
    referralEmail: string;
    amount: number;
    level: 1 | 2 | 3;
    status: 'pending' | 'paid';
    date: string;
}

const mockReferrals: Referral[] = [
    { id: '1', name: 'John S.', email: 'john@example.com', status: 'verified', date: '2026-03-10', reward: 25, level: 1 },
    { id: '2', name: 'Sarah M.', email: 'sarah@example.com', status: 'verified', date: '2026-03-08', reward: 25, level: 1 },
    { id: '3', name: 'Mike R.', email: 'mike@example.com', status: 'signed_up', date: '2026-03-05', reward: null, level: 1 },
    { id: '4', name: 'Emily K.', email: 'emily@example.com', status: 'verified', date: '2026-02-20', reward: 25, level: 1 },
    { id: '5', name: 'David L.', email: 'david@example.com', status: 'reward_paid', date: '2026-02-15', reward: 25, level: 1 },
    { id: '6', name: 'Lisa W.', email: 'lisa@example.com', status: 'verified', date: '2026-02-10', reward: null, level: 2 },
    { id: '7', name: 'Tom H.', email: 'tom@example.com', status: 'verified', date: '2026-02-05', reward: null, level: 2 },
    { id: '8', name: 'Anna B.', email: 'anna@example.com', status: 'signed_up', date: '2026-01-28', reward: null, level: 3 },
    { id: '9', name: 'Chris P.', email: 'chris@example.com', status: 'verified', date: '2026-01-20', reward: null, level: 3 },
    { id: '10', name: 'Kate M.', email: 'kate@example.com', status: 'invited', date: '2026-01-15', reward: null, level: 3 },
];

const mockCommissions: Commission[] = [
    { id: '1', referralName: 'John S.', referralEmail: 'john@example.com', amount: 25, level: 1, status: 'paid', date: '2026-03-10' },
    { id: '2', referralName: 'Sarah M.', referralEmail: 'sarah@example.com', amount: 25, level: 1, status: 'paid', date: '2026-03-08' },
    { id: '3', referralName: 'Emily K.', referralEmail: 'emily@example.com', amount: 25, level: 1, status: 'paid', date: '2026-02-20' },
    { id: '4', referralName: 'David L.', referralEmail: 'david@example.com', amount: 25, level: 1, status: 'paid', date: '2026-02-15' },
    { id: '5', referralName: 'Lisa W.', referralEmail: 'lisa@example.com', amount: 10, level: 2, status: 'paid', date: '2026-02-10' },
    { id: '6', referralName: 'Tom H.', referralEmail: 'tom@example.com', amount: 10, level: 2, status: 'pending', date: '2026-02-05' },
    { id: '7', referralName: 'Anna B.', referralEmail: 'anna@example.com', amount: 5, level: 3, status: 'pending', date: '2026-01-28' },
    { id: '8', referralName: 'Chris P.', referralEmail: 'chris@example.com', amount: 5, level: 3, status: 'paid', date: '2026-01-20' },
];

const levelColors = {
    1: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    2: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    3: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
};

export default function ReferralsIndex() {
    const referralCode = 'MAGNETIQ2026';
    const referralLink = 'https://magnetiq.app/ref/MAGNETIQ2026';
    const [showQR, setShowQR] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
            case 'reward_paid':
                return <Badge className="bg-emerald-500/20 text-emerald-400"><LucideIcons.CheckCircle className="mr-1 h-3 w-3" /> Verified</Badge>;
            case 'signed_up':
                return <Badge className="bg-amber-500/20 text-amber-400"><LucideIcons.Clock className="mr-1 h-3 w-3" /> Signed Up</Badge>;
            default:
                return <Badge className="bg-zinc-500/20 text-zinc-400"><LucideIcons.Clock className="mr-1 h-3 w-3" /> Invited</Badge>;
        }
    };

    const levelStats = [
        { level: 1, count: mockReferrals.filter(r => r.level === 1 && r.status === 'verified').length, earnings: mockCommissions.filter(c => c.level === 1 && c.status === 'paid').reduce((sum, c) => sum + c.amount, 0) },
        { level: 2, count: mockReferrals.filter(r => r.level === 2 && r.status === 'verified').length, earnings: mockCommissions.filter(c => c.level === 2 && c.status === 'paid').reduce((sum, c) => sum + c.amount, 0) },
        { level: 3, count: mockReferrals.filter(r => r.level === 3 && r.status === 'verified').length, earnings: mockCommissions.filter(c => c.level === 3 && c.status === 'paid').reduce((sum, c) => sum + c.amount, 0) },
    ];

    const totalEarned = mockCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
    const totalPending = mockCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent p-6 shadow-2xl shadow-indigo-500/10">
                    <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-8">
                        <div className="text-center md:text-left">
                            <LucideIcons.Gift className="mx-auto mb-4 h-12 w-12 text-indigo-400 md:mx-0" />
                            <h1 className="mb-2 text-2xl font-bold text-white">Earn $25 for every friend</h1>
                            <p className="mb-6 text-zinc-400">Share your referral link and earn rewards when they sign up and verify</p>
                            
                            <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">
                                <code className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 font-mono text-lg text-white">
                                    {referralCode}
                                </code>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(referralCode)}>
                                    <LucideIcons.Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
                                <code className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 font-mono text-sm text-zinc-400">
                                    {referralLink.length > 35 ? referralLink.slice(0, 35) + '...' : referralLink}
                                </code>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(referralLink)}>
                                    <LucideIcons.Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex justify-center gap-3 md:justify-start">
                                <Button className="bg-indigo-500 hover:bg-indigo-600">
                                    <LucideIcons.Share className="mr-2 h-4 w-4" /> Share Link
                                </Button>
                                <Button variant="outline" className="border-white/10" onClick={() => setShowQR(!showQR)}>
                                    <LucideIcons.QrCode className="mr-2 h-4 w-4" /> QR Code
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showQR && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="mt-6 rounded-xl border border-white/10 bg-white p-4 md:mt-0"
                                >
                                    <div className="mx-auto grid h-32 w-32 grid-cols-8 gap-0.5">
                                        {Array.from({ length: 64 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-4 w-4 ${Math.random() > 0.5 ? 'bg-zinc-900' : 'bg-white'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-2 text-center text-xs text-zinc-600">Scan to join</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {levelStats.map((stat) => (
                        <motion.div
                            key={stat.level}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: stat.level * 0.1 }}
                            className={`rounded-xl border ${levelColors[stat.level as 1].border} ${levelColors[stat.level as 1].bg} p-4`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${levelColors[stat.level as 1].bg.replace('/20', '/30')}`}>
                                        <span className={`font-bold ${levelColors[stat.level as 1].text}`}>L{stat.level}</span>
                                    </div>
                                    <div>
                                        <p className={`text-xs ${levelColors[stat.level as 1].text}`}>Level {stat.level} Referrals</p>
                                        <p className="text-xl font-bold text-white">{stat.count}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-400">Earnings</p>
                                    <p className={`text-lg font-bold ${levelColors[stat.level as 1].text}`}>${stat.earnings}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                <LucideIcons.DollarSign className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Total Earned</p>
                                <p className="text-xl font-bold text-emerald-400">${totalEarned}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                <LucideIcons.Clock className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Pending</p>
                                <p className="text-xl font-bold text-amber-400">${totalPending}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl"
                >
                    <div className="border-b border-white/10 p-4">
                        <h2 className="font-semibold text-white">Commission History</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {mockCommissions.map((commission) => (
                            <div key={commission.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400">
                                        {commission.referralName[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{commission.referralName}</p>
                                        <p className="text-xs text-zinc-500">{commission.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={`${levelColors[commission.level].bg} ${levelColors[commission.level].text}`}>
                                        Level {commission.level}
                                    </Badge>
                                    <Badge className={commission.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                                        {commission.status === 'paid' ? <LucideIcons.CheckCircle className="mr-1 h-3 w-3" /> : <LucideIcons.Clock className="mr-1 h-3 w-3" />}
                                        {commission.status}
                                    </Badge>
                                    <span className={`font-medium ${commission.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        +${commission.amount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <h2 className="mb-4 text-lg font-semibold text-white">How it works</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">1</div>
                            <h3 className="mb-1 font-medium text-white">Share your link</h3>
                            <p className="text-sm text-zinc-500">Send your unique referral link to friends</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">2</div>
                            <h3 className="mb-1 font-medium text-white">Friend signs up</h3>
                            <p className="text-sm text-zinc-500">They create an account and verify their identity</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">3</div>
                            <h3 className="mb-1 font-medium text-white">Both earn $25</h3>
                            <p className="text-sm text-zinc-500">You get $25 credit and they receive $25 off</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
}
