import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';
import { fakeAccounts } from '@/lib/fake-data';

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

interface ScheduledPayment {
    id: string;
    recipientName: string;
    recipientAccount: string;
    bankName: string;
    amount: number;
    currency: string;
    frequency: 'once' | 'weekly' | 'monthly' | 'quarterly';
    nextDate: string;
    status: 'active' | 'paused' | 'completed';
    executions: Array<{
        date: string;
        status: 'completed' | 'failed' | 'pending';
    }>;
}

const initialScheduledPayments: ScheduledPayment[] = [
    {
        id: 'sch_001',
        recipientName: 'Chase Mortgage',
        recipientAccount: '****4521',
        bankName: 'Chase Bank',
        amount: 2450.00,
        currency: 'USD',
        frequency: 'monthly',
        nextDate: '2026-04-01T09:00:00Z',
        status: 'active',
        executions: [
            { date: '2026-03-01T09:00:00Z', status: 'completed' },
            { date: '2026-02-01T09:00:00Z', status: 'completed' },
            { date: '2026-01-01T09:00:00Z', status: 'completed' },
        ],
    },
    {
        id: 'sch_002',
        recipientName: 'Con Edison',
        recipientAccount: '****7832',
        bankName: 'Con Edison',
        amount: 195.00,
        currency: 'USD',
        frequency: 'monthly',
        nextDate: '2026-03-25T08:00:00Z',
        status: 'active',
        executions: [
            { date: '2026-02-25T08:00:00Z', status: 'completed' },
            { date: '2026-01-25T08:00:00Z', status: 'completed' },
        ],
    },
    {
        id: 'sch_003',
        recipientName: 'Equinox Gym',
        recipientAccount: '****1234',
        bankName: 'Chase Bank',
        amount: 149.00,
        currency: 'USD',
        frequency: 'monthly',
        nextDate: '2026-04-15T06:00:00Z',
        status: 'paused',
        executions: [
            { date: '2026-02-15T06:00:00Z', status: 'completed' },
        ],
    },
    {
        id: 'sch_004',
        recipientName: 'Netflix Subscription',
        recipientAccount: '****5678',
        bankName: 'Bank of America',
        amount: 15.99,
        currency: 'USD',
        frequency: 'monthly',
        nextDate: '2026-03-20T10:00:00Z',
        status: 'active',
        executions: [
            { date: '2026-02-20T10:00:00Z', status: 'completed' },
            { date: '2026-01-20T10:00:00Z', status: 'completed' },
        ],
    },
    {
        id: 'sch_005',
        recipientName: 'Landlord - Rent',
        recipientAccount: '****9012',
        bankName: 'Wells Fargo',
        amount: 2800.00,
        currency: 'USD',
        frequency: 'monthly',
        nextDate: '2026-04-01T09:00:00Z',
        status: 'active',
        executions: [
            { date: '2026-03-01T09:00:00Z', status: 'completed' },
            { date: '2026-02-01T09:00:00Z', status: 'completed' },
            { date: '2026-01-01T09:00:00Z', status: 'completed' },
        ],
    },
];

const frequencyLabels = {
    once: 'One Time',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
};

const statusConfig = {
    active: { label: 'Active', class: 'bg-emerald-500/20 text-emerald-400', icon: Check },
    paused: { label: 'Paused', class: 'bg-amber-500/20 text-amber-400', icon: Pause },
    completed: { label: 'Completed', class: 'bg-blue-500/20 text-blue-400', icon: Check },
};

export default function ScheduledPayments() {
    const [payments, setPayments] = useState<ScheduledPayment[]>(initialScheduledPayments);
    const [showNewForm, setShowNewForm] = useState(false);
    const [editingPayment, setEditingPayment] = useState<ScheduledPayment | null>(null);
    const [view, setView] = useState<'upcoming' | 'history'>('upcoming');
    const [countdowns, setCountdowns] = useState<Record<string, string>>({});

    const [newPayment, setNewPayment] = useState({
        recipientName: '',
        recipientAccount: '',
        bankName: '',
        amount: '',
        currency: 'USD',
        frequency: 'monthly' as const,
        startDate: '',
    });

    useEffect(() => {
        const updateCountdowns = () => {
            const newCountdowns: Record<string, string> = {};
            payments.forEach(p => {
                if (p.status === 'active') {
                    const diff = new Date(p.nextDate).getTime() - new Date().getTime();
                    if (diff > 0) {
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        newCountdowns[p.id] = `${days}d ${hours}h`;
                    } else {
                        newCountdowns[p.id] = 'Due today';
                    }
                }
            });
            setCountdowns(newCountdowns);
        };

        updateCountdowns();
        const interval = setInterval(updateCountdowns, 60000);
        return () => clearInterval(interval);
    }, [payments]);

    const handleCreatePayment = () => {
        if (!newPayment.recipientName || !newPayment.amount || !newPayment.startDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        const payment: ScheduledPayment = {
            id: `sch_${Date.now()}`,
            recipientName: newPayment.recipientName,
            recipientAccount: newPayment.recipientAccount || '****' + Math.random().toString().slice(2, 6),
            bankName: newPayment.bankName || 'Unknown Bank',
            amount: parseFloat(newPayment.amount),
            currency: newPayment.currency,
            frequency: newPayment.frequency,
            nextDate: new Date(newPayment.startDate).toISOString(),
            status: 'active',
            executions: [],
        };

        setPayments([payment, ...payments]);
        setShowNewForm(false);
        setNewPayment({
            recipientName: '',
            recipientAccount: '',
            bankName: '',
            amount: '',
            currency: 'USD',
            frequency: 'monthly',
            startDate: '',
        });
        toast.success('Scheduled payment created successfully');
    };

    const handleTogglePause = (payment: ScheduledPayment) => {
        setPayments(payments.map(p =>
            p.id === payment.id
                ? { ...p, status: p.status === 'active' ? 'paused' : 'active' }
                : p
        ));
        toast.info(payment.status === 'active' ? 'Payment paused' : 'Payment resumed');
    };

    const handleDelete = (payment: ScheduledPayment) => {
        setPayments(payments.filter(p => p.id !== payment.id));
        toast.success('Scheduled payment deleted');
    };

    const handleEdit = (payment: ScheduledPayment) => {
        setEditingPayment(payment);
    };

    const handleSaveEdit = () => {
        if (!editingPayment) return;

        setPayments(payments.map(p =>
            p.id === editingPayment.id ? editingPayment : p
        ));
        setEditingPayment(null);
        toast.success('Scheduled payment updated');
    };

    const activePayments = payments.filter(p => p.status !== 'completed');
    const completedPayments = payments.filter(p => p.executions.some(e => e.status === 'completed') && p.status === 'completed');

    const totalMonthly = activePayments
        .filter(p => p.frequency === 'monthly')
        .reduce((sum, p) => sum + p.amount, 0);

    const upcomingThisMonth = activePayments.filter(p => {
        const nextDate = new Date(p.nextDate);
        const now = new Date();
        return nextDate.getMonth() === now.getMonth() && nextDate.getFullYear() === now.getFullYear();
    });

    return (
        <UserLayout>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-4 md:grid-cols-3"
                >
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                        <p className="text-sm text-zinc-400">Active Schedules</p>
                        <p className="text-2xl font-bold text-white mt-1">{activePayments.filter(p => p.status === 'active').length}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                        <p className="text-sm text-zinc-400">Monthly Total</p>
                        <p className="text-2xl font-bold text-indigo-400 mt-1">{formatCurrency(totalMonthly)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                        <p className="text-sm text-zinc-400">Due This Month</p>
                        <p className="text-2xl font-bold text-amber-400 mt-1">{upcomingThisMonth.length}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('upcoming')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    view === 'upcoming'
                                        ? 'bg-indigo-500/20 text-indigo-400'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                Upcoming ({activePayments.length})
                            </button>
                            <button
                                onClick={() => setView('history')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    view === 'history'
                                        ? 'bg-indigo-500/20 text-indigo-400'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                Past Executions
                            </button>
                        </div>
                        <Button
                            className="bg-indigo-500 hover:bg-indigo-600"
                            onClick={() => setShowNewForm(true)}
                        >
                            <LucideIcons.Plus className="h-4 w-4 mr-2" />
                            New Scheduled Payment
                        </Button>
                    </div>

                    <AnimatePresence mode="wait">
                        {view === 'upcoming' ? (
                            <motion.div
                                key="upcoming"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                {activePayments.map((payment, index) => {
                                    const StatusIcon = statusConfig[payment.status].icon;
                                    return (
                                        <motion.div
                                            key={payment.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-800/30 p-4 hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
                                                    <LucideIcons.Calendar className="h-6 w-6 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-white">{payment.recipientName}</p>
                                                        <Badge className={statusConfig[payment.status].class}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusConfig[payment.status].label}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-zinc-400">
                                                        {frequencyLabels[payment.frequency]} • Next: {formatDate(payment.nextDate)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="font-mono font-bold text-white">
                                                        {formatCurrency(payment.amount, payment.currency)}
                                                    </p>
                                                    {payment.status === 'active' && countdowns[payment.id] && (
                                                        <p className="text-sm text-amber-400">
                                                            <LucideIcons.Clock className="inline h-3 w-3 mr-1" />
                                                            {countdowns[payment.id]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-zinc-400 hover:text-white"
                                                        onClick={() => handleEdit(payment)}
                                                    >
                                                        <LucideIcons.Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-zinc-400 hover:text-white"
                                                        onClick={() => handleTogglePause(payment)}
                                                    >
                                                        {payment.status === 'active' ? (
                                                            <LucideIcons.Pause className="h-4 w-4" />
                                                        ) : (
                                                            <LucideIcons.Play className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-rose-400 hover:text-rose-300"
                                                        onClick={() => handleDelete(payment)}
                                                    >
                                                        <LucideIcons.Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {activePayments.length === 0 && (
                                    <div className="py-12 text-center">
                                        <LucideIcons.Calendar className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                        <p className="text-zinc-400">No scheduled payments</p>
                                        <Button
                                            variant="outline"
                                            className="mt-4 border-white/10"
                                            onClick={() => setShowNewForm(true)}
                                        >
                                            Create your first scheduled payment
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                {payments.flatMap(p =>
                                    p.executions.map((exec, idx) => (
                                        <div
                                            key={`${p.id}-${idx}`}
                                            className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-800/20 p-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                    exec.status === 'completed' ? 'bg-emerald-500/20' :
                                                    exec.status === 'failed' ? 'bg-rose-500/20' : 'bg-amber-500/20'
                                                }`}>
                                                    {exec.status === 'completed' ? (
                                                        <LucideIcons.Check className="h-5 w-5 text-emerald-400" />
                                                    ) : exec.status === 'failed' ? (
                                                        <LucideIcons.X className="h-5 w-5 text-rose-400" />
                                                    ) : (
                                                        <LucideIcons.Clock className="h-5 w-5 text-amber-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{p.recipientName}</p>
                                                    <p className="text-sm text-zinc-400">{formatDate(exec.date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-mono text-white">{formatCurrency(p.amount, p.currency)}</p>
                                                <Badge className={
                                                    exec.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    exec.status === 'failed' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                                                }>
                                                    {exec.status.charAt(0).toUpperCase() + exec.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {payments.every(p => p.executions.length === 0) && (
                                    <div className="py-12 text-center">
                                        <p className="text-zinc-400">No execution history</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <AnimatePresence>
                {showNewForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowNewForm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">New Scheduled Payment</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-zinc-400 hover:text-white"
                                    onClick={() => setShowNewForm(false)}
                                >
                                    <LucideIcons.X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400">Recipient Name</Label>
                                    <Input
                                        placeholder="Name or company"
                                        value={newPayment.recipientName}
                                        onChange={(e) => setNewPayment({ ...newPayment, recipientName: e.target.value })}
                                        className="border-white/10 bg-zinc-800"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Account Number</Label>
                                        <Input
                                            placeholder="Account number"
                                            value={newPayment.recipientAccount}
                                            onChange={(e) => setNewPayment({ ...newPayment, recipientAccount: e.target.value })}
                                            className="border-white/10 bg-zinc-800"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Bank Name</Label>
                                        <Input
                                            placeholder="Bank name"
                                            value={newPayment.bankName}
                                            onChange={(e) => setNewPayment({ ...newPayment, bankName: e.target.value })}
                                            className="border-white/10 bg-zinc-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <Label className="text-zinc-400">Currency</Label>
                                        <Select value={newPayment.currency} onValueChange={(v) => setNewPayment({ ...newPayment, currency: v })}>
                                            <SelectTrigger className="border-white/10 bg-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-zinc-400">Amount</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={newPayment.amount}
                                            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                                            className="border-white/10 bg-zinc-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Frequency</Label>
                                        <Select value={newPayment.frequency} onValueChange={(v: any) => setNewPayment({ ...newPayment, frequency: v })}>
                                            <SelectTrigger className="border-white/10 bg-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="once">One Time</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Start Date</Label>
                                        <Input
                                            type="date"
                                            value={newPayment.startDate}
                                            onChange={(e) => setNewPayment({ ...newPayment, startDate: e.target.value })}
                                            className="border-white/10 bg-zinc-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-white/10"
                                    onClick={() => setShowNewForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                    onClick={handleCreatePayment}
                                >
                                    <LucideIcons.Send className="h-4 w-4 mr-2" />
                                    Create Schedule
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingPayment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setEditingPayment(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Edit Scheduled Payment</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-zinc-400 hover:text-white"
                                    onClick={() => setEditingPayment(null)}
                                >
                                    <LucideIcons.X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400">Recipient Name</Label>
                                    <Input
                                        value={editingPayment.recipientName}
                                        onChange={(e) => setEditingPayment({ ...editingPayment, recipientName: e.target.value })}
                                        className="border-white/10 bg-zinc-800"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Amount</Label>
                                        <Input
                                            type="number"
                                            value={editingPayment.amount}
                                            onChange={(e) => setEditingPayment({ ...editingPayment, amount: parseFloat(e.target.value) })}
                                            className="border-white/10 bg-zinc-800"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Frequency</Label>
                                        <Select value={editingPayment.frequency} onValueChange={(v: any) => setEditingPayment({ ...editingPayment, frequency: v })}>
                                            <SelectTrigger className="border-white/10 bg-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="once">One Time</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-zinc-400">Next Payment Date</Label>
                                    <Input
                                        type="date"
                                        value={editingPayment.nextDate.split('T')[0]}
                                        onChange={(e) => setEditingPayment({ ...editingPayment, nextDate: new Date(e.target.value).toISOString() })}
                                        className="border-white/10 bg-zinc-800"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-white/10"
                                    onClick={() => setEditingPayment(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                    onClick={handleSaveEdit}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </UserLayout>
    );
}
