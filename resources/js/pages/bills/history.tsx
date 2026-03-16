import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    Zap: LucideIcons.Zap,
    Droplets: LucideIcons.Droplets,
    Flame: LucideIcons.Flame,
    Wifi: LucideIcons.Wifi,
    Smartphone: LucideIcons.Smartphone,
    Tv: LucideIcons.Tv,
    Shield: LucideIcons.Shield,
    Landmark: LucideIcons.Landmark,
    Bus: LucideIcons.Bus,
    MoreHorizontal: LucideIcons.MoreHorizontal,
    ArrowLeft: LucideIcons.ArrowLeft,
    Search: LucideIcons.Search,
    Filter: LucideIcons.Filter,
    Download: LucideIcons.Download,
    Calendar: LucideIcons.Calendar,
    Check: LucideIcons.CheckCircle2,
};

const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'electricity', name: 'Electricity' },
    { id: 'water', name: 'Water' },
    { id: 'gas', name: 'Gas' },
    { id: 'internet', name: 'Internet' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'tv', name: 'TV' },
    { id: 'insurance', name: 'Insurance' },
    { id: 'government', name: 'Government' },
    { id: 'transport', name: 'Transport' },
];

const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'paid', name: 'Paid' },
    { id: 'pending', name: 'Pending' },
    { id: 'failed', name: 'Failed' },
];

interface BillPayment {
    id: string;
    name: string;
    category: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'failed';
    reference: string;
    accountNumber: string;
}

const billHistory: BillPayment[] = [
    { id: '1', name: 'Con Edison', category: 'Electricity', amount: 189.45, date: '2026-03-15', status: 'paid', reference: 'BILL-2026-0315-001', accountNumber: '****4521' },
    { id: '2', name: 'Verizon Wireless', category: 'Mobile', amount: 89.99, date: '2026-03-11', status: 'paid', reference: 'BILL-2026-0311-002', accountNumber: '****8902' },
    { id: '3', name: 'Netflix', category: 'TV', amount: 15.99, date: '2026-03-11', status: 'paid', reference: 'BILL-2026-0311-003', accountNumber: '****4567' },
    { id: '4', name: 'AT&T Internet', category: 'Internet', amount: 79.99, date: '2026-03-10', status: 'paid', reference: 'BILL-2026-0310-004', accountNumber: '****3456' },
    { id: '5', name: 'State Farm Insurance', category: 'Insurance', amount: 245.00, date: '2026-02-15', status: 'paid', reference: 'BILL-2026-0215-005', accountNumber: '****7890' },
    { id: '6', name: 'Con Edison', category: 'Electricity', amount: 175.32, date: '2026-02-14', status: 'paid', reference: 'BILL-2026-0214-006', accountNumber: '****4521' },
    { id: '7', name: 'Verizon Wireless', category: 'Mobile', amount: 89.99, date: '2026-01-28', status: 'paid', reference: 'BILL-2026-0128-007', accountNumber: '****8902' },
    { id: '8', name: 'NYC Department of Tax', category: 'Government', amount: 1250.00, date: '2026-01-25', status: 'paid', reference: 'BILL-2026-0125-008', accountNumber: '****1234' },
    { id: '9', name: 'AT&T Internet', category: 'Internet', amount: 79.99, date: '2026-01-20', status: 'paid', reference: 'BILL-2026-0120-009', accountNumber: '****3456' },
    { id: '10', name: 'Con Edison', category: 'Electricity', amount: 198.50, date: '2026-01-15', status: 'paid', reference: 'BILL-2026-0115-010', accountNumber: '****4521' },
    { id: '11', name: 'Spotify', category: 'TV', amount: 9.99, date: '2026-01-10', status: 'paid', reference: 'BILL-2026-0110-011', accountNumber: '****5678' },
    { id: '12', name: 'State Farm Insurance', category: 'Insurance', amount: 245.00, date: '2025-12-15', status: 'paid', reference: 'BILL-2025-1215-012', accountNumber: '****7890' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function BillsHistory() {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const getCategoryIcon = (categoryName: string) => {
        const cat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        if (!cat) return Icons.Zap;
        
        const iconMap: Record<string, any> = {
            'electricity': Icons.Zap,
            'water': Icons.Droplets,
            'gas': Icons.Flame,
            'internet': Icons.Wifi,
            'mobile': Icons.Smartphone,
            'tv': Icons.Tv,
            'insurance': Icons.Shield,
            'government': Icons.Landmark,
            'transport': Icons.Bus,
        };
        return iconMap[cat.id] || Icons.MoreHorizontal;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const filteredBills = billHistory.filter(bill => {
        const matchesCategory = categoryFilter === 'all' || bill.category.toLowerCase() === categoryFilter;
        const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
        const matchesSearch = searchQuery === '' || 
            bill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.reference.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDateFrom = !dateFrom || bill.date >= dateFrom;
        const matchesDateTo = !dateTo || bill.date <= dateTo;
        
        return matchesCategory && matchesStatus && matchesSearch && matchesDateFrom && matchesDateTo;
    });

    const totalPaid = filteredBills
        .filter(b => b.status === 'paid')
        .reduce((sum, b) => sum + b.amount, 0);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">Paid</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">Pending</Badge>;
            case 'failed':
                return <Badge variant="secondary" className="bg-rose-500/20 text-rose-400">Failed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
                    <Link href="/bills">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                            <Icons.ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Bill History</h1>
                        <p className="text-zinc-400">View and manage your past bill payments</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <Icons.Check className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Total Paid</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(totalPaid)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                    <Icons.Calendar className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Transactions</p>
                                    <p className="text-2xl font-bold text-white">{filteredBills.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <Icons.Filter className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Filtered</p>
                                    <p className="text-2xl font-bold text-white">{filteredBills.length} of {billHistory.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                <div className="flex flex-1 gap-4">
                                    <div className="relative flex-1 max-w-xs">
                                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <Input
                                            placeholder="Search bills..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-[180px] bg-zinc-800/50 border-white/10 text-white">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-white/10">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id} className="text-white">
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[150px] bg-zinc-800/50 border-white/10 text-white">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-white/10">
                                            {statusOptions.map((status) => (
                                                <SelectItem key={status.id} value={status.id} className="text-white">
                                                    {status.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="bg-zinc-800/50 border-white/10 text-white w-[140px]"
                                    />
                                    <span className="text-zinc-500 self-center">to</span>
                                    <Input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="bg-zinc-800/50 border-white/10 text-white w-[140px]"
                                    />
                                    <Button variant="outline" className="border-white/10 text-zinc-400 hover:text-white">
                                        <Icons.Download className="w-4 h-4 mr-2" /> Export
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Biller</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Category</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Account</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Amount</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Reference</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBills.map((bill) => {
                                            const Icon = getCategoryIcon(bill.category);
                                            return (
                                                <tr key={bill.id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="py-3 px-4">
                                                        <span className="text-sm text-white">{formatDate(bill.date)}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="w-4 h-4 text-zinc-400" />
                                                            <span className="text-sm font-medium text-white">{bill.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-sm text-zinc-400">{bill.category}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-sm text-zinc-400 font-mono">{bill.accountNumber}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-sm font-medium text-white">{formatCurrency(bill.amount)}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {getStatusBadge(bill.status)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs text-zinc-500 font-mono">{bill.reference}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {filteredBills.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-zinc-500">No bills found matching your filters</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                <p className="text-sm text-zinc-500">
                                    Showing {filteredBills.length} of {billHistory.length} transactions
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="border-white/10 text-zinc-400">
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm" className="border-white/10 text-zinc-400">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
