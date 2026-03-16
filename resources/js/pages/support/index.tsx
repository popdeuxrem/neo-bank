import { Search, HelpCircle, MessageCircle, FileText, AlertTriangle, ChevronRight, Plus, Clock } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';

const tickets = [
    { id: '1', subject: 'Cannot complete wire transfer', category: 'Payments', status: 'open', created: '2026-03-12', lastReply: '2 hours ago' },
    { id: '2', subject: 'Card not working abroad', category: 'Cards', status: 'closed', created: '2026-03-10', lastReply: '2 days ago' },
    { id: '3', subject: 'Question about fees', category: 'Account', status: 'open', created: '2026-03-08', lastReply: '1 day ago' },
];

const topics = [
    { icon: HelpCircle, label: 'Sending Money', count: 12 },
    { icon: MessageCircle, label: 'Account Issues', count: 8 },
    { icon: FileText, label: 'Card Problems', count: 15 },
    { icon: AlertTriangle, label: 'Verification Help', count: 6 },
];

export default function Support() {
    const [activeTab, setActiveTab] = useState('open');

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                    <h1 className="mb-4 text-2xl font-bold text-white">How can we help?</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            className="w-full rounded-xl border border-white/10 bg-zinc-800 py-3 pl-10 pr-4 text-white placeholder-zinc-500"
                        />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {topics.map((topic) => (
                            <button key={topic.label} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10">
                                <topic.icon className="mr-2 inline h-4 w-4" />
                                {topic.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {topics.map((topic) => (
                        <div key={topic.label} className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl transition-all hover:border-white/20">
                            <topic.icon className="mb-3 h-8 w-8 text-indigo-400" />
                            <h3 className="font-medium text-white">{topic.label}</h3>
                            <p className="mt-1 text-sm text-zinc-500">{topic.count} articles</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">My Tickets</h2>
                        <Button className="bg-indigo-500 hover:bg-indigo-600">
                            <Plus className="mr-2 h-4 w-4" /> New Ticket
                        </Button>
                    </div>
                    <div className="mb-4 flex gap-1">
                        {['open', 'closed', 'all'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    activeTab === tab ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-2">
                        {tickets.filter(t => activeTab === 'all' || t.status === activeTab).map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-zinc-800/30 p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                        ticket.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                        <MessageCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{ticket.subject}</p>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span>{ticket.category}</span>
                                            <span>•</span>
                                            <span>{ticket.lastReply}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={ticket.status === 'open' ? 'secondary' : 'default'} className={ticket.status === 'open' ? 'bg-amber-500/20 text-amber-400' : ''}>
                                    {ticket.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
