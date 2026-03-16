import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    Search: LucideIcons.Search,
    Filter: LucideIcons.Filter,
    Download: LucideIcons.Download,
    ArrowLeft: LucideIcons.ArrowLeft,
    Landmark: LucideIcons.Landmark,
    Globe: LucideIcons.Globe,
    Clock: LucideIcons.Clock,
    CheckCircle: LucideIcons.CheckCircle,
    XCircle: LucideIcons.XCircle,
    AlertCircle: LucideIcons.AlertCircle,
    ChevronRight: LucideIcons.ChevronRight,
    Send: LucideIcons.Send,
};

const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'completed', name: 'Completed' },
    { id: 'pending', name: 'Pending' },
    { id: 'failed', name: 'Failed' },
    { id: 'cancelled', name: 'Cancelled' },
];

const typeOptions = [
    { id: 'all', name: 'All Types' },
    { id: 'wire', name: 'Wire' },
    { id: 'swift', name: 'SWIFT' },
];

interface WireTransfer {
    id: string;
    type: 'wire' | 'swift';
    recipientName: string;
    recipientBank: string;
    recipientCountry: string;
    amount: number;
    currency: string;
    fee: number;
    status: 'completed' | 'pending' | 'failed' | 'cancelled';
    createdAt: string;
    completedAt?: string;
    reference: string;
    swiftCode?: string;
}

const wireHistory: WireTransfer[] = [
    { id: '1', type: 'wire', recipientName: 'Sarah Johnson', recipientBank: 'Barclays Bank', recipientCountry: 'UK', amount: 5000.00, currency: 'GBP', fee: 25, status: 'completed', createdAt: '2026-03-14T10:30:00Z', completedAt: '2026-03-15T14:00:00Z', reference: 'WIR-2026-0314-001', swiftCode: 'BARCGB22' },
    { id: '2', type: 'swift', recipientName: 'Michael Chen', recipientBank: 'Deutsche Bank', recipientCountry: 'Germany', amount: 15000.00, currency: 'EUR', fee: 35, status: 'completed', createdAt: '2026-03-12T09:15:00Z', completedAt: '2026-03-14T11:30:00Z', reference: 'SWIFT-2026-0312-002', swiftCode: 'DEUTDEFF' },
    { id: '3', type: 'wire', recipientName: 'Emma Watson', recipientBank: 'HSBC', recipientCountry: 'UK', amount: 2500.00, currency: 'GBP', fee: 15, status: 'completed', createdAt: '2026-03-10T16:45:00Z', completedAt: '2026-03-12T09:00:00Z', reference: 'WIR-2026-0310-003', swiftCode: 'HSBCGB2L' },
    { id: '4', type: 'swift', recipientName: 'David Mueller', recipientBank: 'UBS', recipientCountry: 'Switzerland', amount: 25000.00, currency: 'CHF', fee: 50, status: 'pending', createdAt: '2026-03-15T08:00:00Z', reference: 'SWIFT-2026-0315-004', swiftCode: 'UBSWCHZH' },
    { id: '5', type: 'wire', recipientName: 'Sophie Martin', recipientBank: 'BNP Paribas', recipientCountry: 'France', amount: 8000.00, currency: 'EUR', fee: 25, status: 'completed', createdAt: '2026-03-08T11:20:00Z', completedAt: '2026-03-10T15:00:00Z', reference: 'WIR-2026-0308-005', swiftCode: 'BNPAFRPP' },
    { id: '6', type: 'swift', recipientName: 'Yuki Tanaka', recipientBank: 'MUFG Bank', recipientCountry: 'Japan', amount: 5000000.00, currency: 'JPY', fee: 50, status: 'failed', createdAt: '2026-03-05T14:30:00Z', reference: 'SWIFT-2026-0305-006', swiftCode: 'MUFGTokyo' },
    { id: '7', type: 'wire', recipientName: 'James Wilson', recipientBank: 'Citibank', recipientCountry: 'USA', amount: 1500.00, currency: 'USD', fee: 15, status: 'completed', createdAt: '2026-03-03T10:00:00Z', completedAt: '2026-03-04T14:00:00Z', reference: 'WIR-2026-0303-007', swiftCode: 'CITIUS33' },
    { id: '8', type: 'swift', recipientName: 'Lisa Anderson', recipientBank: 'Société Générale', recipientCountry: 'France', amount: 12000.00, currency: 'EUR', fee: 35, status: 'cancelled', createdAt: '2026-03-01T09:45:00Z', reference: 'SWIFT-2026-0301-008', swiftCode: 'ASPKFRPP' },
    { id: '9', type: 'wire', recipientName: 'Robert Taylor', recipientBank: 'Bank of America', recipientCountry: 'USA', amount: 3500.00, currency: 'USD', fee: 25, status: 'completed', createdAt: '2026-02-28T13:15:00Z', completedAt: '2026-03-01T10:00:00Z', reference: 'WIR-2026-0228-009', swiftCode: 'BOFAUS3M' },
    { id: '10', type: 'swift', recipientName: 'Anna Schmidt', recipientBank: 'GLS Bank', recipientCountry: 'Germany', amount: 7500.00, currency: 'EUR', fee: 25, status: 'completed', createdAt: '2026-02-25T08:30:00Z', completedAt: '2026-02-27T12:00:00Z', reference: 'SWIFT-2026-0225-010', swiftCode: 'GENODEF1M08' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function WireHistory() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const filteredTransfers = wireHistory.filter(transfer => {
        const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
        const matchesType = typeFilter === 'all' || transfer.type === typeFilter;
        const matchesSearch = searchQuery === '' || 
            transfer.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transfer.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transfer.recipientBank.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDateFrom = !dateFrom || transfer.createdAt.split('T')[0] >= dateFrom;
        const matchesDateTo = !dateTo || transfer.createdAt.split('T')[0] <= dateTo;
        
        return matchesStatus && matchesType && matchesSearch && matchesDateFrom && matchesDateTo;
    });

    const totalSent = filteredTransfers
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalPending = filteredTransfers
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalFees = filteredTransfers
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.fee, 0);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">Completed</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">Pending</Badge>;
            case 'failed':
                return <Badge variant="secondary" className="bg-rose-500/20 text-rose-400">Failed</Badge>;
            case 'cancelled':
                return <Badge variant="secondary" className="bg-zinc-500/20 text-zinc-400">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        return type === 'swift' ? (
            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400">SWIFT</Badge>
        ) : (
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-400">Wire</Badge>
        );
    };

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
            >
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wire/new">
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <Icons.ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Wire History</h1>
                            <p className="text-zinc-400">View and manage your wire transfers</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/wire/new">
                            <Button className="bg-indigo-500 hover:bg-indigo-600">
                                <Icons.Send className="w-4 h-4 mr-2" />
                                New Transfer
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <Icons.CheckCircle className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Total Sent</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(totalSent, 'USD')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <Icons.Clock className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Pending</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(totalPending, 'USD')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                    <Icons.Landmark className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Transactions</p>
                                    <p className="text-2xl font-bold text-white">{filteredTransfers.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <Icons.Globe className="w-6 h-6 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Total Fees</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(totalFees, 'USD')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                <div className="flex flex-1 gap-4 flex-wrap">
                                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <Input
                                            placeholder="Search transfers..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500"
                                        />
                                    </div>
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[140px] bg-zinc-800/50 border-white/10 text-white">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-white/10">
                                            {typeOptions.map((type) => (
                                                <SelectItem key={type.id} value={type.id} className="text-white">
                                                    {type.name}
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
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="bg-zinc-800/50 border-white/10 text-white w-[140px]"
                                    />
                                    <span className="text-zinc-500">to</span>
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
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Type</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Recipient</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Bank</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">SWIFT</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Amount</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Fee</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Reference</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransfers.map((transfer) => (
                                            <tr key={transfer.id} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <span className="text-sm text-white">{formatDate(transfer.createdAt)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getTypeBadge(transfer.type)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm font-medium text-white">{transfer.recipientName}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <span className="text-sm text-white">{transfer.recipientBank}</span>
                                                        <span className="text-xs text-zinc-500 block">{transfer.recipientCountry}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-xs font-mono text-zinc-400">{transfer.swiftCode || '-'}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm font-medium text-white">{formatCurrency(transfer.amount, transfer.currency)}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-zinc-400">{formatCurrency(transfer.fee, 'USD')}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(transfer.status)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-xs text-zinc-500 font-mono">{transfer.reference}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredTransfers.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                                        <Icons.Landmark className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <p className="text-zinc-500">No transfers found matching your filters</p>
                                    <Button 
                                        variant="outline" 
                                        className="mt-4 border-white/10 text-zinc-400"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('all');
                                            setTypeFilter('all');
                                            setDateFrom('');
                                            setDateTo('');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                <p className="text-sm text-zinc-500">
                                    Showing {filteredTransfers.length} of {wireHistory.length} transactions
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
