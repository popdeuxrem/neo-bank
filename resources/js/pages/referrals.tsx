import { useState } from 'react';
import { Copy, Share2, QrCode, Gift, Users, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';
import { toast } from 'sonner';

const referrals = [
    { id: '1', name: 'John S.', status: 'verified', date: '2026-03-10', reward: 25 },
    { id: '2', name: 'Sarah M.', status: 'signed_up', date: '2026-03-08', reward: null },
    { id: '3', name: 'Mike R.', status: 'invited', date: '2026-03-05', reward: null },
    { id: '4', name: 'Emily K.', status: 'verified', date: '2026-02-20', reward: 25 },
    { id: '5', name: 'David L.', status: 'invited', date: '2026-02-15', reward: null },
];

export default function Referrals() {
    const referralCode = 'MAGNETIQ2026';
    const referralLink = 'https://magnetiq.app/ref/MAGNETIQ2026';

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const stats = {
        total: referrals.length,
        verified: referrals.filter(r => r.status === 'verified').length,
        pending: referrals.filter(r => r.status === 'signed_up').length,
        earned: referrals.filter(r => r.reward).reduce((sum, r) => sum + (r.reward || 0), 0),
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return <Badge className="bg-emerald-500/20 text-emerald-400"><CheckCircle className="mr-1 h-3 w-3" /> Verified</Badge>;
            case 'signed_up':
                return <Badge className="bg-amber-500/20 text-amber-400"><Clock className="mr-1 h-3 w-3" /> Signed Up</Badge>;
            default:
                return <Badge className="bg-zinc-500/20 text-zinc-400"><Clock className="mr-1 h-3 w-3" /> Invited</Badge>;
        }
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent p-6 shadow-2xl shadow-indigo-500/10">
                    <div className="text-center">
                        <Gift className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
                        <h1 className="mb-2 text-2xl font-bold text-white">Earn $25 for every friend</h1>
                        <p className="mb-6 text-zinc-400">Share your referral link and earn rewards when they sign up and verify</p>
                        
                        <div className="mb-4 flex items-center justify-center gap-2">
                            <code className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 font-mono text-lg text-white">
                                {referralCode}
                            </code>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(referralCode)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mb-6 flex items-center justify-center gap-2">
                            <code className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 font-mono text-sm text-zinc-400">
                                {referralLink}
                            </code>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(referralLink)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex justify-center gap-3">
                            <Button className="bg-indigo-500 hover:bg-indigo-600">
                                <Share2 className="mr-2 h-4 w-4" /> Share Link
                            </Button>
                            <Button variant="outline" className="border-white/10">
                                <QrCode className="mr-2 h-4 w-4" /> QR Code
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                                <Users className="h-5 w-5 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Total Referrals</p>
                                <p className="text-xl font-bold text-white">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-emerald-500/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-400">Successful</p>
                                <p className="text-xl font-bold text-emerald-400">{stats.verified}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-amber-500/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                <Clock className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-amber-400">Pending</p>
                                <p className="text-xl font-bold text-amber-400">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-indigo-500/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                                <DollarSign className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-400">Total Earned</p>
                                <p className="text-xl font-bold text-indigo-400">${stats.earned}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                    <div className="border-b border-white/10 p-4">
                        <h2 className="font-semibold text-white">Referral History</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {referrals.map((ref) => (
                            <div key={ref.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400">
                                        {ref.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{ref.name}</p>
                                        <p className="text-xs text-zinc-500">{ref.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(ref.status)}
                                    {ref.reward && (
                                        <span className="font-medium text-emerald-400">+${ref.reward}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
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
                </div>
            </div>
        </UserLayout>
    );
}
