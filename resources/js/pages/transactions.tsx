import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Download,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionItem } from '@/components/user/transaction-item';
import UserLayout from '@/layouts/user-layout';
import { fakeTransactions, fakeAccounts } from '@/lib/fake-data';

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export default function Transactions() {
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [activeTab, setActiveTab] = useState('all');

    const transactions = fakeTransactions;
    const accounts = fakeAccounts;

    const filteredTransactions = transactions.filter(t => {
        if (selectedAccount !== 'all' && t.accountId !== selectedAccount) {
return false;
}

        if (search && !t.merchant.toLowerCase().includes(search.toLowerCase())) {
return false;
}

        if (activeTab !== 'all' && t.status !== activeTab) {
return false;
}

        return true;
    });

    const totalIn = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Transactions</h1>
                        <p className="text-sm text-zinc-400">{filteredTransactions.length} transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-white/10">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button variant="outline" className="border-white/10" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="mr-2 h-4 w-4" /> Filters
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-emerald-500/10 p-4">
                        <p className="text-xs text-emerald-400">Total In</p>
                        <p className="text-xl font-bold text-emerald-400">+{formatCurrency(totalIn)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-rose-500/10 p-4">
                        <p className="text-xs text-rose-400">Total Out</p>
                        <p className="text-xl font-bold text-rose-400">-{formatCurrency(totalOut)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-indigo-500/10 p-4">
                        <p className="text-xs text-indigo-400">Net Change</p>
                        <p className="text-xl font-bold text-indigo-400">{formatCurrency(totalIn - totalOut)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-800/50 p-4">
                        <p className="text-xs text-zinc-400">Transaction Count</p>
                        <p className="text-xl font-bold text-white">{transactions.length}</p>
                    </div>
                </div>

                {showFilters && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-xs text-zinc-400">Account</label>
                                <select
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white"
                                >
                                    <option value="all">All Accounts</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs text-zinc-400">Status</label>
                                <select
                                    value={activeTab}
                                    onChange={(e) => setActiveTab(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                    <div className="border-b border-white/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    placeholder="Search transactions..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border-white/10 bg-zinc-800 pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {filteredTransactions.slice(0, 20).map((transaction, index) => (
                            <TransactionItem key={transaction.id} transaction={transaction} index={index} showAccount />
                        ))}
                    </div>

                    {filteredTransactions.length === 0 && (
                        <div className="py-12 text-center text-zinc-500">
                            No transactions found
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
