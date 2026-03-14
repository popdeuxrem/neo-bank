import { useState } from 'react';
import { motion } from 'framer-motion';
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
    BarChart,
    Bar,
    LineChart,
    Line,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';
import { fakeSpendingCategories, fakeChartData } from '@/lib/fake-data';

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function Analytics() {
    const [period, setPeriod] = useState('month');

    const chartData = fakeChartData.slice(-30);
    const spendingData = fakeSpendingCategories;

    const monthlyData = [
        { month: 'Jan', income: 12000, expenses: 8000 },
        { month: 'Feb', income: 15000, expenses: 9000 },
        { month: 'Mar', income: 11000, expenses: 15000 },
        { month: 'Apr', income: 20000, expenses: 7000 },
        { month: 'May', income: 22000, expenses: 8000 },
        { month: 'Jun', income: 18000, expenses: 11000 },
    ];

    const kpis = [
        { label: 'Total Income', value: 98000, change: 12.5, icon: TrendingUp, color: 'text-emerald-400' },
        { label: 'Total Expenses', value: 56000, change: -8.2, icon: TrendingDown, color: 'text-rose-400' },
        { label: 'Net Savings', value: 42000, change: 15.3, icon: PiggyBank, color: 'text-indigo-400' },
        { label: 'Savings Rate', value: 42.8, change: 3.2, icon: Percent, color: 'text-cyan-400', isPercent: true },
    ];

    const topMerchants = [
        { name: 'WeWork', spent: 450, count: 3, sparkline: [100, 150, 120, 180, 200, 450] },
        { name: 'AWS', spent: 1249, count: 1, sparkline: [1249, 1100, 1300, 1200, 1150, 1249] },
        { name: 'Amazon', spent: 890, count: 12, sparkline: [50, 120, 80, 200, 150, 890] },
        { name: 'Whole Foods', spent: 567, count: 8, sparkline: [80, 60, 90, 120, 100, 567] },
    ];

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Financial Analytics</h1>
                        <p className="text-sm text-zinc-400">Track your spending and savings</p>
                    </div>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {kpis.map((kpi) => (
                        <div key={kpi.label} className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-zinc-500">{kpi.label}</p>
                                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                            </div>
                            <p className="mt-1 text-2xl font-bold text-white">
                                {kpi.isPercent ? `${kpi.value}%` : formatCurrency(kpi.value)}
                            </p>
                            <p className={`text-xs ${kpi.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {kpi.change >= 0 ? '+' : ''}{kpi.change}% from last period
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h2 className="mb-4 text-lg font-semibold text-white">Income vs Expenses</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                                    <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        formatter={(value: any) => formatCurrency(value)}
                                    />
                                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h2 className="mb-4 text-lg font-semibold text-white">Spending Trend</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="date" tickFormatter={(v) => new Date(v).getDate().toString()} stroke="#71717a" fontSize={12} />
                                    <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        formatter={(value: any) => formatCurrency(value)}
                                    />
                                    <Area type="monotone" dataKey="outflow" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h2 className="mb-4 text-lg font-semibold text-white">Spending by Category</h2>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={spendingData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={2}
                                        dataKey="amount"
                                    >
                                        {spendingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {spendingData.map((cat, index) => (
                                <div key={cat.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                        <span className="text-zinc-400">{cat.category}</span>
                                    </div>
                                    <span className="text-white">{formatCurrency(cat.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl lg:col-span-2">
                        <h2 className="mb-4 text-lg font-semibold text-white">Top Merchants</h2>
                        <div className="space-y-4">
                            {topMerchants.map((merchant) => (
                                <div key={merchant.name} className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                                            <DollarSign className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{merchant.name}</p>
                                            <p className="text-xs text-zinc-500">{merchant.count} transactions</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-white">{formatCurrency(merchant.spent)}</p>
                                        <div className="h-8 w-20">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={merchant.sparkline.map((v, i) => ({ x: i, y: v }))}>
                                                    <Line type="monotone" dataKey="y" stroke="#6366f1" strokeWidth={2} dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
