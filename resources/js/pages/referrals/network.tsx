import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';

interface NetworkNode {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    joinedDate: string;
    status: 'active' | 'inactive';
    children?: NetworkNode[];
}

const mockNetwork: NetworkNode = {
    id: 'root',
    name: 'You',
    level: 0,
    joinedDate: '2024-01-15',
    status: 'active',
    children: [
        {
            id: '1',
            name: 'John S.',
            level: 1,
            joinedDate: '2025-03-10',
            status: 'active',
            children: [
                {
                    id: '1-1',
                    name: 'Alice M.',
                    level: 2,
                    joinedDate: '2025-08-15',
                    status: 'active',
                    children: [
                        { id: '1-1-1', name: 'Bob K.', level: 3, joinedDate: '2026-01-05', status: 'active' },
                        { id: '1-1-2', name: 'Carol D.', level: 3, joinedDate: '2026-02-10', status: 'inactive' },
                    ]
                },
                {
                    id: '1-2',
                    name: 'David L.',
                    level: 2,
                    joinedDate: '2025-09-20',
                    status: 'active',
                }
            ]
        },
        {
            id: '2',
            name: 'Sarah M.',
            level: 1,
            joinedDate: '2025-04-05',
            status: 'active',
            children: [
                { id: '2-1', name: 'Emma W.', level: 2, joinedDate: '2025-11-12', status: 'active' },
                { id: '2-2', name: 'Frank H.', level: 2, joinedDate: '2025-12-01', status: 'active' },
            ]
        },
        {
            id: '3',
            name: 'Mike R.',
            level: 1,
            joinedDate: '2025-05-18',
            status: 'active',
            children: [
                {
                    id: '3-1',
                    name: 'Grace T.',
                    level: 2,
                    joinedDate: '2026-01-20',
                    status: 'active',
                    children: [
                        { id: '3-1-1', name: 'Henry P.', level: 3, joinedDate: '2026-03-01', status: 'active' },
                    ]
                },
            ]
        },
        {
            id: '4',
            name: 'Emily K.',
            level: 1,
            joinedDate: '2025-06-22',
            status: 'inactive',
        },
    ]
};

const levelColors: Record<number, { bg: string; text: string; border: string }> = {
    0: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500' },
    1: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500' },
    2: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500' },
    3: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500' },
};

function NetworkTreeNode({ node, depth = 0 }: { node: NetworkNode; depth?: number }) {
    const [expanded, setExpanded] = useState(depth < 2);
    const hasChildren = node.children && node.children.length > 0;
    const colors = levelColors[node.level] || levelColors[3];

    return (
        <div className="flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: depth * 0.1 }}
                className="relative z-10"
            >
                <button
                    onClick={() => hasChildren && setExpanded(!expanded)}
                    disabled={!hasChildren}
                    className={`group flex flex-col items-center gap-2`}
                >
                    <div className={`relative rounded-full border-2 ${colors.border} bg-zinc-900 p-1 transition-transform group-hover:scale-110 ${!hasChildren ? 'cursor-default' : 'cursor-pointer'}`}>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.bg}`}>
                            <span className={`text-lg font-bold ${colors.text}`}>{node.name[0]}</span>
                        </div>
                        {node.status === 'inactive' && (
                            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-600">
                                <LucideIcons.X className="h-2.5 w-2.5 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-white">{node.name}</p>
                        {node.level > 0 && (
                            <Badge className={`${colors.bg} ${colors.text} text-[10px]`}>
                                L{node.level}
                            </Badge>
                        )}
                    </div>
                </button>
            </motion.div>

            <AnimatePresence>
                {hasChildren && expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <div className="h-6 w-px bg-zinc-700" />
                        <div className="flex gap-4 pt-2">
                            {node.children!.map((child, index) => (
                                <div key={child.id} className="flex flex-col items-center">
                                    {index > 0 && <div className="absolute top-0 h-6 w-px -translate-x-full bg-zinc-700" style={{ position: 'absolute', left: '50%', width: 'calc(50% + 12px)', transform: 'translateX(-100%)' }} />}
                                    <div className="h-6 w-px bg-zinc-700" />
                                    <NetworkTreeNode node={child} depth={depth + 1} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {hasChildren && !expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    className="mt-2 flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-400 hover:bg-white/20"
                >
                    <LucideIcons.ChevronDown className="h-3 w-3" />
                    {node.children?.length} more
                </button>
            )}
        </div>
    );
}

export default function ReferralsNetwork() {
    const [expanded, setExpanded] = useState(true);

    const countNetwork = (node: NetworkNode): { total: number; byLevel: Record<number, number> } => {
        const byLevel: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
        let total = 0;

        const traverse = (n: NetworkNode) => {
            if (n.level > 0) {
                total++;
                byLevel[n.level] = (byLevel[n.level] || 0) + 1;
            }
            n.children?.forEach(traverse);
        };

        traverse(node);
        return { total, byLevel };
    };

    const networkStats = countNetwork(mockNetwork);
    const totalCommissions = networkStats.byLevel[1] * 25 + networkStats.byLevel[2] * 10 + networkStats.byLevel[3] * 5;

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
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                                <LucideIcons.Users className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Total in Network</p>
                                <p className="text-xl font-bold text-white">{networkStats.total}</p>
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                <LucideIcons.UserPlus className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Level 1 Referrals</p>
                                <p className="text-xl font-bold text-white">{networkStats.byLevel[1]}</p>
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                <LucideIcons.DollarSign className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Total Commissions</p>
                                <p className="text-xl font-bold text-white">${totalCommissions}</p>
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
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Your Referral Network</h2>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? (
                                <>
                                    <LucideIcons.ChevronUp className="mr-2 h-4 w-4" /> Collapse All
                                </>
                            ) : (
                                <>
                                    <LucideIcons.ChevronDown className="mr-2 h-4 w-4" /> Expand All
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="overflow-x-auto pb-4">
                        <div className="flex min-w-max justify-center">
                            <NetworkTreeNode node={mockNetwork} />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-indigo-500" />
                            <span className="text-xs text-zinc-400">You</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-zinc-400">Level 1 ($25)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-xs text-zinc-400">Level 2 ($10)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-violet-500" />
                            <span className="text-xs text-zinc-400">Level 3 ($5)</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <h2 className="mb-4 text-lg font-semibold text-white">How Network Commissions Work</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl bg-emerald-500/10 p-4">
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                <span className="font-bold text-emerald-400">L1</span>
                            </div>
                            <h3 className="mb-1 font-medium text-white">Level 1</h3>
                            <p className="text-sm text-zinc-400">Direct referrals who verify their account</p>
                            <p className="mt-2 text-lg font-bold text-emerald-400">$25 per referral</p>
                        </div>
                        <div className="rounded-xl bg-blue-500/10 p-4">
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                                <span className="font-bold text-blue-400">L2</span>
                            </div>
                            <h3 className="mb-1 font-medium text-white">Level 2</h3>
                            <p className="text-sm text-zinc-400">Referrals of your Level 1 referrals</p>
                            <p className="mt-2 text-lg font-bold text-blue-400">$10 per referral</p>
                        </div>
                        <div className="rounded-xl bg-violet-500/10 p-4">
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                                <span className="font-bold text-violet-400">L3</span>
                            </div>
                            <h3 className="mb-1 font-medium text-white">Level 3</h3>
                            <p className="text-sm text-zinc-400">Referrals of your Level 2 referrals</p>
                            <p className="mt-2 text-lg font-bold text-violet-400">$5 per referral</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
}
