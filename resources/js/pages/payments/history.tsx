import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Download,
    FileText,
    ChevronUp,
    ChevronDown,
    RefreshCw,
    Check,
    X,
    Clock,
    ArrowRight,
    Eye,
    MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';
import { fakePayments, Payment } from '@/lib/fake-data';

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

type TabType = 'all' | 'sent' | 'received' | 'pending' | 'failed';
type SortField = 'date' | 'amount' | 'recipient';
type SortDirection = 'asc' | 'desc';

const statusConfig = {
    completed: { label: 'Completed', class: 'bg-emerald-500/20 text-emerald-400', icon: Check },
    pending: { label: 'Pending', class: 'bg-amber-500/20 text-amber-400', icon: Clock },
    failed: { label: 'Failed', class: 'bg-rose-500/20 text-rose-400', icon: X },
    cancelled: { label: 'Cancelled', class: 'bg-zinc-500/20 text-zinc-400', icon: X },
};

const typeConfig = {
    domestic: { label: 'Domestic', class: 'bg-blue-500/20 text-blue-400' },
    international: { label: 'International', class: 'bg-purple-500/20 text-purple-400' },
};

export default function PaymentHistory() {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [dateRange, setDateRange] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const filteredPayments = useMemo(() => {
        let result = [...fakePayments];

        if (activeTab === 'sent') {
            result = result.filter(p => p.status !== 'cancelled');
        } else if (activeTab === 'received') {
            result = result.filter(p => p.status !== 'cancelled');
        } else if (activeTab !== 'all') {
            result = result.filter(p => p.status === activeTab);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.recipientName.toLowerCase().includes(query) ||
                p.reference.toLowerCase().includes(query) ||
                p.recipientBank.toLowerCase().includes(query)
            );
        }

        if (dateRange !== 'all') {
            const now = new Date();
            const range = parseInt(dateRange);
            const startDate = new Date(now.getTime() - range * 24 * 60 * 60 * 1000);
            result = result.filter(p => new Date(p.createdAt) >= startDate);
        }

        result.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'date':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'amount':
                    comparison = a.amount - b.amount;
                    break;
                case 'recipient':
                    comparison = a.recipientName.localeCompare(b.recipientName);
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [activeTab, searchQuery, sortField, sortDirection, dateRange]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const handleRepeatPayment = (payment: Payment) => {
        toast.info(`Repeating payment to ${payment.recipientName}`);
    };

    const handleExport = (format: 'csv' | 'pdf') => {
        toast.success(`Exporting ${format.toUpperCase()}...`);
        setShowExportMenu(false);
    };

    const tabs: { value: TabType; label: string; count: number }[] = [
        { value: 'all', label: 'All', count: fakePayments.length },
        { value: 'sent', label: 'Sent', count: fakePayments.filter(p => p.status !== 'cancelled').length },
        { value: 'received', label: 'Received', count: fakePayments.filter(p => p.status !== 'cancelled').length },
        { value: 'pending', label: 'Pending', count: fakePayments.filter(p => p.status === 'pending').length },
        { value: 'failed', label: 'Failed', count: fakePayments.filter(p => p.status === 'failed').length },
    ];

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        );
    };

    const totalSent = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalReceived = filteredPayments.reduce((sum, p) => sum + (p.recipientReceives || p.amount), 0);

    return (
        <UserLayout>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-4 md:grid-cols-3"
                >
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                        <p className="text-sm text-zinc-400">Total Sent</p>
                        <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalSent)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                        <p className="text-sm text-zinc-400">Total Received</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalReceived)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                        <p className="text-sm text-zinc-400">Pending</p>
                        <p className="text-2xl font-bold text-amber-400 mt-1">
                            {formatCurrency(fakePayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex gap-1 flex-wrap">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setActiveTab(tab.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            activeTab === tab.value
                                                ? 'bg-indigo-500/20 text-indigo-400'
                                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                                        }`}
                                    >
                                        {tab.label}
                                        <span className="ml-2 text-xs opacity-60">({tab.count})</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        placeholder="Search payments..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 w-64 border-white/10 bg-zinc-800"
                                    />
                                </div>
                                <Select value={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger className="w-40 border-white/10 bg-zinc-800">
                                        <SelectValue placeholder="Date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Time</SelectItem>
                                        <SelectItem value="7">Last 7 Days</SelectItem>
                                        <SelectItem value="30">Last 30 Days</SelectItem>
                                        <SelectItem value="90">Last 90 Days</SelectItem>
                                        <SelectItem value="365">Last Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        className="border-white/10 bg-zinc-800"
                                        onClick={() => setShowExportMenu(!showExportMenu)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                    <AnimatePresence>
                                        {showExportMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-40 rounded-xl border border-white/10 bg-zinc-800 p-2 shadow-xl z-10"
                                            >
                                                <button
                                                    onClick={() => handleExport('csv')}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Export CSV
                                                </button>
                                                <button
                                                    onClick={() => handleExport('pdf')}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Export PDF
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left pb-4 pr-4">
                                        <button
                                            onClick={() => handleSort('date')}
                                            className="flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white"
                                        >
                                            Date & Time
                                            <SortIcon field="date" />
                                        </button>
                                    </th>
                                    <th className="text-left pb-4 pr-4">
                                        <button
                                            onClick={() => handleSort('recipient')}
                                            className="flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white"
                                        >
                                            Recipient
                                            <SortIcon field="recipient" />
                                        </button>
                                    </th>
                                    <th className="text-left pb-4 pr-4">
                                        <span className="text-sm font-medium text-zinc-400">Type</span>
                                    </th>
                                    <th className="text-left pb-4 pr-4">
                                        <span className="text-sm font-medium text-zinc-400">Status</span>
                                    </th>
                                    <th className="text-left pb-4 pr-4">
                                        <button
                                            onClick={() => handleSort('amount')}
                                            className="flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white"
                                        >
                                            Amount
                                            <SortIcon field="amount" />
                                        </button>
                                    </th>
                                    <th className="text-left pb-4 pr-4">
                                        <span className="text-sm font-medium text-zinc-400">Reference</span>
                                    </th>
                                    <th className="text-right pb-4">
                                        <span className="text-sm font-medium text-zinc-400">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment, index) => {
                                    const StatusIcon = statusConfig[payment.status].icon;
                                    return (
                                        <motion.tr
                                            key={payment.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <p className="text-sm text-white">{formatDate(payment.createdAt)}</p>
                                                    <p className="text-xs text-zinc-500">{formatDateTime(payment.createdAt)}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{payment.recipientName}</p>
                                                    <p className="text-xs text-zinc-500">{payment.recipientBank}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <Badge className={typeConfig[payment.type].class}>
                                                    {typeConfig[payment.type].label}
                                                </Badge>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <Badge className={statusConfig[payment.status].class}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {statusConfig[payment.status].label}
                                                </Badge>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <p className="text-sm font-mono font-medium text-white">
                                                        {formatCurrency(payment.amount, payment.currency)}
                                                    </p>
                                                    {payment.type === 'international' && payment.exchangeRate && (
                                                        <p className="text-xs text-zinc-500">
                                                            @ {payment.exchangeRate} = {formatCurrency(payment.recipientReceives || 0)}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className="text-sm font-mono text-zinc-400">{payment.reference}</span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-zinc-400 hover:text-white"
                                                        onClick={() => setSelectedPayment(payment)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {payment.status === 'completed' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-zinc-400 hover:text-white"
                                                            onClick={() => handleRepeatPayment(payment)}
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredPayments.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-zinc-400">No payments found</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedPayment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedPayment(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Payment Details</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-zinc-400 hover:text-white"
                                    onClick={() => setSelectedPayment(null)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between py-3 border-b border-white/5">
                                    <span className="text-zinc-400">Reference</span>
                                    <span className="font-mono text-white">{selectedPayment.reference}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-white/5">
                                    <span className="text-zinc-400">Status</span>
                                    <Badge className={statusConfig[selectedPayment.status].class}>
                                        {statusConfig[selectedPayment.status].label}
                                    </Badge>
                                </div>
                                <div className="flex justify-between py-3 border-b border-white/5">
                                    <span className="text-zinc-400">Recipient</span>
                                    <span className="text-white">{selectedPayment.recipientName}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-white/5">
                                    <span className="text-zinc-400">Bank</span>
                                    <span className="text-white">{selectedPayment.recipientBank}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-white/5">
                                    <span className="text-zinc-400">Account</span>
                                    <span className="font-mono text-white">{selectedPayment.recipientAccount}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-white/5">
                                    <span className="text-zinc-400">Type</span>
                                    <Badge className={typeConfig[selectedPayment.type].class}>
                                        {typeConfig[selectedPayment.type].label}
                                    </Badge>
                                </div>
                                <div className="flex justify-between py-3 border-b border-white/5">
                                    <span className="text-zinc-400">Amount</span>
                                    <span className="font-mono font-bold text-white">
                                        {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                                    </span>
                                </div>
                                {selectedPayment.fee > 0 && (
                                    <div className="flex justify-between py-3 border-b border-white/5">
                                        <span className="text-zinc-400">Fee</span>
                                        <span className="text-white">{formatCurrency(selectedPayment.fee)}</span>
                                    </div>
                                )}
                                {selectedPayment.type === 'international' && (
                                    <>
                                        <div className="flex justify-between py-3 border-b border-white/5">
                                            <span className="text-zinc-400">Exchange Rate</span>
                                            <span className="text-white">{selectedPayment.exchangeRate}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-white/5">
                                            <span className="text-zinc-400">Recipient Receives</span>
                                            <span className="font-mono text-emerald-400">
                                                {formatCurrency(selectedPayment.recipientReceives || 0)}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between py-3">
                                    <span className="text-zinc-400">Date</span>
                                    <span className="text-white">{formatDateTime(selectedPayment.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-white/10"
                                    onClick={() => setSelectedPayment(null)}
                                >
                                    Close
                                </Button>
                                {selectedPayment.status === 'completed' && (
                                    <Button
                                        className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                        onClick={() => {
                                            handleRepeatPayment(selectedPayment);
                                            setSelectedPayment(null);
                                        }}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Repeat Payment
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </UserLayout>
    );
}
