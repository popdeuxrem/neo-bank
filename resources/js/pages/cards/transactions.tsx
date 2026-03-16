import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    Search: LucideIcons.Search,
    Filter: LucideIcons.Filter,
    Download: LucideIcons.Download,
    ArrowUpRight: LucideIcons.ArrowUpRight,
    ArrowDownLeft: LucideIcons.ArrowDownLeft,
    Calendar: LucideIcons.Calendar,
    CreditCard: LucideIcons.CreditCard,
    X: LucideIcons.X,
    Check: LucideIcons.Check,
    Clock: LucideIcons.Clock,
    XCircle: LucideIcons.XCircle,
    RefreshCw: LucideIcons.RefreshCw,
    FileText: LucideIcons.FileText,
    ChevronDown: LucideIcons.ChevronDown,
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

interface Transaction {
    id: string;
    cardId: string;
    cardName: string;
    merchant: string;
    merchantLogo?: string;
    amount: number;
    currency: string;
    date: string;
    time: string;
    type: 'debit' | 'credit';
    category: string;
    status: 'completed' | 'pending' | 'declined';
    location?: string;
}

const mockTransactions: Transaction[] = [
    { id: '1', cardId: '1', cardName: 'Primary Card', merchant: 'Amazon', amount: 89.99, currency: 'USD', date: '2026-03-15', time: '14:32', type: 'debit', category: 'Shopping', status: 'completed', location: 'New York, US' },
    { id: '2', cardId: '1', cardName: 'Primary Card', merchant: 'Netflix', amount: 15.99, currency: 'USD', date: '2026-03-14', time: '09:15', type: 'debit', category: 'Entertainment', status: 'completed', location: 'Online' },
    { id: '3', cardId: '1', cardName: 'Primary Card', merchant: 'Refund - Amazon', amount: -45.00, currency: 'USD', date: '2026-03-13', time: '16:48', type: 'credit', category: 'Refund', status: 'completed', location: 'Online' },
    { id: '4', cardId: '1', cardName: 'Primary Card', merchant: 'Uber', amount: 24.50, currency: 'USD', date: '2026-03-12', time: '22:11', type: 'debit', category: 'Transport', status: 'pending', location: 'San Francisco, US' },
    { id: '5', cardId: '2', cardName: 'Travel Card', merchant: 'Airbnb', amount: 350.00, currency: 'USD', date: '2026-03-11', time: '11:23', type: 'debit', category: 'Travel', status: 'completed', location: 'London, UK' },
    { id: '6', cardId: '1', cardName: 'Primary Card', merchant: 'Apple Store', amount: 1299.00, currency: 'USD', date: '2026-03-10', time: '18:45', type: 'debit', category: 'Shopping', status: 'declined', location: 'Online' },
    { id: '7', cardId: '2', cardName: 'Travel Card', merchant: 'British Airways', amount: 520.00, currency: 'USD', date: '2026-03-09', time: '10:30', type: 'debit', category: 'Travel', status: 'completed', location: 'Online' },
    { id: '8', cardId: '1', cardName: 'Primary Card', merchant: 'Whole Foods', amount: 67.43, currency: 'USD', date: '2026-03-08', time: '12:15', type: 'debit', category: 'Groceries', status: 'completed', location: 'New York, US' },
    { id: '9', cardId: '1', cardName: 'Primary Card', merchant: 'Spotify', amount: 9.99, currency: 'USD', date: '2026-03-07', time: '08:00', type: 'debit', category: 'Entertainment', status: 'completed', location: 'Online' },
    { id: '10', cardId: '2', cardName: 'Travel Card', merchant: 'Hotel Marriott', amount: 280.00, currency: 'USD', date: '2026-03-06', time: '15:20', type: 'debit', category: 'Travel', status: 'completed', location: 'Paris, France' },
];

const categories = ['All', 'Shopping', 'Entertainment', 'Transport', 'Travel', 'Groceries', 'Dining', 'Refund'];
const statuses = ['All', 'completed', 'pending', 'declined'];

export default function CardTransactions() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCard, setSelectedCard] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Math.abs(amount));
    };

    const filteredTransactions = mockTransactions.filter(tx => {
        const matchesSearch = tx.merchant.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCard = selectedCard === 'all' || tx.cardId === selectedCard;
        const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All' || tx.status === selectedStatus;
        
        let matchesDate = true;
        if (dateRange.start && tx.date < dateRange.start) matchesDate = false;
        if (dateRange.end && tx.date > dateRange.end) matchesDate = false;

        return matchesSearch && matchesCard && matchesCategory && matchesStatus && matchesDate;
    });

    const totalSpent = filteredTransactions
        .filter(tx => tx.type === 'debit' && tx.status === 'completed')
        .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalRefunds = filteredTransactions
        .filter(tx => tx.type === 'credit')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <Icons.Check className="h-4 w-4 text-emerald-400" />;
            case 'pending': return <Icons.Clock className="h-4 w-4 text-amber-400" />;
            case 'declined': return <Icons.XCircle className="h-4 w-4 text-rose-400" />;
            default: return null;
        }
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Time', 'Merchant', 'Category', 'Amount', 'Status', 'Card'];
        const rows = filteredTransactions.map(tx => [
            tx.date,
            tx.time,
            tx.merchant,
            tx.category,
            tx.type === 'debit' ? -tx.amount : tx.amount,
            tx.status,
            tx.cardName
        ]);
        
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'card-transactions.csv';
        a.click();
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
                    <div className="mb-6">
                        <Button variant="ghost" size="sm" asChild className="mb-4 text-zinc-400">
                            <Link href="/cards">
                                <Icons.ArrowLeft className="mr-2 h-4 w-4" /> Back to Cards
                            </Link>
                        </Button>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Card Transactions</h1>
                                <p className="text-sm text-zinc-400">View and manage all your card transactions</p>
                            </div>
                            <Button variant="outline" className="border-white/10" onClick={exportToCSV}>
                                <Icons.Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <p className="text-sm text-zinc-400">Total Spent</p>
                            <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(totalSpent)}</p>
                            <p className="mt-1 text-xs text-zinc-500">{filteredTransactions.filter(t => t.status === 'completed').length} transactions</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <p className="text-sm text-zinc-400">Total Refunds</p>
                            <p className="mt-1 text-2xl font-bold text-emerald-400">{formatCurrency(totalRefunds)}</p>
                            <p className="mt-1 text-xs text-zinc-500">{filteredTransactions.filter(t => t.type === 'credit').length} refunds</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <p className="text-sm text-zinc-400">Pending</p>
                            <p className="mt-1 text-2xl font-bold text-amber-400">
                                {formatCurrency(filteredTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0))}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">{filteredTransactions.filter(t => t.status === 'pending').length} pending</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1">
                                <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border-white/10 bg-white/5 pl-9 text-white"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={selectedCard} onValueChange={setSelectedCard}>
                                    <SelectTrigger className="w-40 border-white/10 bg-white/5">
                                        <SelectValue placeholder="Select Card" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-zinc-900">
                                        <SelectItem value="all">All Cards</SelectItem>
                                        <SelectItem value="1">Primary Card</SelectItem>
                                        <SelectItem value="2">Travel Card</SelectItem>
                                        <SelectItem value="3">Shopping Card</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    className="border-white/10"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Icons.Filter className="mr-2 h-4 w-4" /> Filters
                                </Button>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4 md:flex-row">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-40 border-white/10 bg-white/5">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-zinc-900">
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-40 border-white/10 bg-white/5">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-zinc-900">
                                        {statuses.map(status => (
                                            <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="w-36 border-white/10 bg-white/5 text-white"
                                    />
                                    <span className="text-zinc-500">to</span>
                                    <Input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="w-36 border-white/10 bg-white/5 text-white"
                                    />
                                </div>
                                {(selectedCategory !== 'All' || selectedStatus !== 'All' || dateRange.start || dateRange.end) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedCategory('All');
                                            setSelectedStatus('All');
                                            setDateRange({ start: '', end: '' });
                                        }}
                                        className="text-zinc-400"
                                    >
                                        <Icons.X className="mr-1 h-4 w-4" /> Clear
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Merchant</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Card</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Amount</th>
                                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((tx) => (
                                            <tr 
                                                key={tx.id} 
                                                className="cursor-pointer transition-colors hover:bg-white/5"
                                                onClick={() => setSelectedTransaction(tx)}
                                            >
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tx.type === 'debit' ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
                                                            {tx.type === 'debit' ? (
                                                                <Icons.ArrowUpRight className="h-4 w-4 text-rose-400" />
                                                            ) : (
                                                                <Icons.ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">{tx.date}</p>
                                                            <p className="text-xs text-zinc-500">{tx.time}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-white">{tx.merchant}</p>
                                                        <p className="text-xs text-zinc-500">{tx.location}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="secondary" className="bg-white/10 text-zinc-300">
                                                        {tx.category}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-zinc-300">{tx.cardName}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`font-medium ${tx.type === 'debit' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                        {tx.type === 'debit' ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {getStatusIcon(tx.status)}
                                                        <span className={`text-sm capitalize ${
                                                            tx.status === 'completed' ? 'text-emerald-400' :
                                                            tx.status === 'pending' ? 'text-amber-400' : 'text-rose-400'
                                                        }`}>
                                                            {tx.status}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Icons.FileText className="h-12 w-12 text-zinc-600" />
                                                    <p>No transactions found</p>
                                                    <p className="text-sm">Try adjusting your filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {selectedTransaction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedTransaction(null)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(null)}>
                                    <Icons.X className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${selectedTransaction.type === 'debit' ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
                                        {selectedTransaction.type === 'debit' ? (
                                            <Icons.ArrowUpRight className="h-6 w-6 text-rose-400" />
                                        ) : (
                                            <Icons.ArrowDownLeft className="h-6 w-6 text-emerald-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-white">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</p>
                                        <p className={`text-sm ${selectedTransaction.type === 'debit' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {selectedTransaction.type === 'debit' ? 'Debit' : 'Credit'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-lg bg-white/5 p-4">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Merchant</span>
                                        <span className="font-medium text-white">{selectedTransaction.merchant}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Date & Time</span>
                                        <span className="font-medium text-white">{selectedTransaction.date} at {selectedTransaction.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Category</span>
                                        <span className="font-medium text-white">{selectedTransaction.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Card</span>
                                        <span className="font-medium text-white">{selectedTransaction.cardName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Location</span>
                                        <span className="font-medium text-white">{selectedTransaction.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Status</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(selectedTransaction.status)}
                                            <span className="font-medium capitalize text-white">{selectedTransaction.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Transaction ID</span>
                                        <span className="font-mono text-sm text-zinc-300">{selectedTransaction.id}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </UserLayout>
    );
}
