import { motion } from 'framer-motion';
import { BookOpen, Calculator, FileText, Download, Search, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserLayout from '@/layouts/user-layout';
import { fakeLedgerEntries } from '@/lib/fake-data';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Ledger() {
    const [search, setSearch] = useState('');
    const entries = fakeLedgerEntries;

    const totalDebits = entries.reduce((sum, entry) => 
        sum + entry.debits.reduce((s, d) => s + d.amount, 0), 0);
    const totalCredits = entries.reduce((sum, entry) => 
        sum + entry.credits.reduce((s, c) => s + c.amount, 0), 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const filteredEntries = entries.filter(entry => 
        entry.description.toLowerCase().includes(search.toLowerCase()) ||
        entry.entryNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">General Ledger</h1>
                        <p className="text-sm text-zinc-400">View all journal entries and account transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-white/10">
                            <FileText className="mr-2 h-4 w-4" /> Generate Report
                        </Button>
                        <Button variant="outline" className="border-white/10">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500">Total Debits</p>
                            <Calculator className="h-4 w-4 text-indigo-400" />
                        </div>
                        <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(totalDebits)}</p>
                        <p className="text-xs text-zinc-500">Current period</p>
                    </motion.div>
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500">Total Credits</p>
                            <Calculator className="h-4 w-4 text-emerald-400" />
                        </div>
                        <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(totalCredits)}</p>
                        <p className="text-xs text-zinc-500">Current period</p>
                    </motion.div>
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="rounded-xl border border-white/10 bg-zinc-900/50 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500">Net Balance</p>
                            <BookOpen className="h-4 w-4 text-violet-400" />
                        </div>
                        <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(totalDebits - totalCredits)}</p>
                        <p className="text-xs text-emerald-400">Balanced</p>
                    </motion.div>
                </div>

                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl"
                >
                    <div className="border-b border-white/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    placeholder="Search entries..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border-white/10 bg-zinc-800 pl-10"
                                />
                            </div>
                            <Button variant="outline" className="border-white/10">
                                <Filter className="mr-2 h-4 w-4" /> Filters
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 text-left text-sm text-zinc-500">
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Entry #</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Account</th>
                                    <th className="p-4 text-right">Debit</th>
                                    <th className="p-4 text-right">Credit</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEntries.map((entry) => (
                                    <motion.tr 
                                        key={entry.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeUp}
                                        className="border-b border-white/5 hover:bg-white/5"
                                    >
                                        <td className="p-4 text-zinc-400">{entry.date}</td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="border-white/10 font-mono">
                                                {entry.entryNumber}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-white">{entry.description}</td>
                                        <td className="p-4 text-zinc-400">
                                            <div className="space-y-1">
                                                {entry.debits.map((d, i) => (
                                                    <div key={i} className="text-xs">{d.accountName}</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="space-y-1">
                                                {entry.debits.map((d, i) => (
                                                    <div key={i} className="font-mono text-white">{formatCurrency(d.amount)}</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="space-y-1">
                                                {entry.credits.map((c, i) => (
                                                    <div key={i} className="font-mono text-white">{formatCurrency(c.amount)}</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={`${
                                                entry.status === 'posted' ? 'bg-emerald-500/20 text-emerald-400' :
                                                entry.status === 'draft' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-rose-500/20 text-rose-400'
                                            }`}>
                                                {entry.status}
                                            </Badge>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t border-white/10 bg-white/5">
                                <tr>
                                    <td className="p-4 font-medium text-zinc-400" colSpan={4}>Total</td>
                                    <td className="p-4 text-right font-mono font-medium text-white">{formatCurrency(totalDebits)}</td>
                                    <td className="p-4 text-right font-mono font-medium text-white">{formatCurrency(totalCredits)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
}
