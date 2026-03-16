import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Send,
    PlusCircle,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { AccountCard } from '@/components/user/account-card';
import { BalanceWidget } from '@/components/user/balance-widget';
import { QuickActionsPanel, ScheduledPaymentsList, UpcomingBillsList } from '@/components/user/quick-action-tile';
import { SendMoneyModal } from '@/components/user/send-money-modal';
import { TransactionItem } from '@/components/user/transaction-item';
import UserLayout from '@/layouts/user-layout';
import {
    fakeAccounts,
    getTotalBalance,
    getRecentTransactions,
    fakeScheduledPayments,
    fakeSpendingCategories,
    fakeChartData,
} from '@/lib/fake-data';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export default function Dashboard() {
    const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
    const accounts = fakeAccounts;
    const transactions = getRecentTransactions(10);
    const totalBalance = getTotalBalance();
    const [selectedPeriod, setSelectedPeriod] = useState('1M');

    const chartData = fakeChartData.slice(-30);
    const spendingData = fakeSpendingCategories;

    const periods = ['1W', '1M', '3M', '6M', '1Y'];

    const upcomingBills = [
        { id: '1', name: 'Chase Mortgage', amount: 2450, currency: 'USD', dueDate: '2026-04-01', status: 'upcoming' },
        { id: '2', name: 'Con Edison', amount: 195, currency: 'USD', dueDate: '2026-03-15', status: 'upcoming' },
        { id: '3', name: 'Verizon', amount: 89, currency: 'USD', dueDate: '2026-03-20', status: 'upcoming' },
    ];

    return (
        <UserLayout>
            <div className="space-y-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="space-y-6"
                >
                    <motion.div variants={fadeUp}>
                        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent p-6 shadow-2xl shadow-indigo-500/10" data-tour="balance">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                            
                            <div className="relative z-10">
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="text-sm font-medium text-indigo-300">Total Net Worth</span>
                                    <Sparkles className="h-4 w-4 text-indigo-400" />
                                </div>
                                <BalanceWidget
                                    balance={totalBalance}
                                    label=""
                                    size="lg"
                                    showTrend
                                    trend={[2.5, 3.1, 2.8, 3.5, 4.2, 3.9]}
                                />
                                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="text-zinc-400">Available:</span>
                                        <span className="font-medium text-white">{formatCurrency(totalBalance - 2500)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-zinc-400">Pending:</span>
                                        <span className="font-medium text-amber-400">{formatCurrency(2500)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-zinc-400">Invested:</span>
                                        <span className="font-medium text-emerald-400">{formatCurrency(45000)}</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={() => setIsSendMoneyOpen(true)}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Money
                                    </Button>
                                    <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => setIsSendMoneyOpen(true)}>
                                        <Send className="mr-2 h-4 w-4" /> Send Money
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Your Accounts</h2>
                            <Button variant="ghost" size="sm" className="text-zinc-400" asChild>
                                <Link href="/accounts">
                                    View all <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-tour="accounts">
                            {accounts.map((account, index) => (
                                <AccountCard 
                                    key={account.id} 
                                    account={account} 
                                    index={index} 
                                    onViewDetails={() => {}} 
                                    onSend={() => setIsSendMoneyOpen(true)} 
                                />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-7">
                        <div className="lg:col-span-4">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl" data-tour="chart">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white">Balance History</h2>
                                    <div className="flex gap-1">
                                        {periods.map((period) => (
                                            <button
                                                key={period}
                                                onClick={() => setSelectedPeriod(period)}
                                                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                                                    selectedPeriod === period
                                                        ? 'bg-indigo-500/20 text-indigo-400'
                                                        : 'text-zinc-500 hover:text-zinc-300'
                                                }`}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(value) => new Date(value).getDate().toString()}
                                                stroke="#71717a"
                                                fontSize={12}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                                stroke="#71717a"
                                                fontSize={12}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#18181b',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                }}
                                                labelStyle={{ color: '#a1a1aa' }}
                                                formatter={(value: any) => [formatCurrency(value), 'Balance']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="balance"
                                                stroke="#6366f1"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorBalance)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Spending by Category</h2>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={spendingData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="amount"
                                            >
                                                {spendingData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#18181b',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                }}
                                                formatter={(value: any) => formatCurrency(value)}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {spendingData.slice(0, 4).map((category, index) => (
                                        <div key={category.category} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                                <span className="text-zinc-400">{category.category}</span>
                                            </div>
                                            <span className="font-medium text-white">{formatCurrency(category.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-5">
                        <div className="lg:col-span-3">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl" data-tour="transactions">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                                    <Button variant="ghost" size="sm" className="text-zinc-400" asChild>
                                        <Link href="/transactions">
                                            View all <ChevronRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {transactions.slice(0, 8).map((transaction, index) => (
                                        <TransactionItem key={transaction.id} transaction={transaction} index={index} showAccount />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl" data-tour="quick-actions">
                                <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
                                <QuickActionsPanel onAction={(actionId) => {
                                    if (actionId === 'send' || actionId === 'add') {
                                        setIsSendMoneyOpen(true);
                                    }
                                }} />
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white">Scheduled Payments</h2>
                                    <Button variant="ghost" size="sm" className="text-zinc-400">
                                        Manage
                                    </Button>
                                </div>
                                <ScheduledPaymentsList payments={fakeScheduledPayments} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Budget Progress</h2>
                                <Button variant="ghost" size="sm" className="text-zinc-400">
                                    Manage
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { category: 'Housing', spent: 2450, limit: 3000, color: 'bg-indigo-500' },
                                    { category: 'Food', spent: 890, limit: 1200, color: 'bg-emerald-500' },
                                    { category: 'Transport', spent: 340, limit: 500, color: 'bg-violet-500' },
                                    { category: 'Entertainment', spent: 180, limit: 200, color: 'bg-amber-500' },
                                ].map((budget) => {
                                    const percent = (budget.spent / budget.limit) * 100;

                                    return (
                                        <div key={budget.category}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="text-zinc-400">{budget.category}</span>
                                                <span className="text-white">
                                                    {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${budget.color} transition-all`}
                                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl md:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Upcoming Bills</h2>
                                <Button variant="ghost" size="sm" className="text-zinc-400">
                                    View all
                                </Button>
                            </div>
                            <UpcomingBillsList bills={upcomingBills} />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <SendMoneyModal open={isSendMoneyOpen} onOpenChange={setIsSendMoneyOpen} accounts={accounts} />
        </UserLayout>
    );
}
