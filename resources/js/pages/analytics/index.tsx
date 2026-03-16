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
} from 'recharts';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    TrendingUp: LucideIcons.TrendingUp,
    TrendingDown: LucideIcons.TrendingDown,
    PiggyBank: LucideIcons.PiggyBank,
    Percent: LucideIcons.Percent,
    DollarSign: LucideIcons.DollarSign,
    ShoppingBag: LucideIcons.ShoppingBag,
    Building2: LucideIcons.Building2,
    Laptop: LucideIcons.Laptop,
    ShoppingCart: LucideIcons.ShoppingCart,
    Utensils: LucideIcons.Utensils,
    Tv: LucideIcons.Tv,
    Zap: LucideIcons.Zap,
    CreditCard: LucideIcons.CreditCard,
};

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const monthlyData = [
    { month: 'Jan', income: 12000, expenses: 8000 },
    { month: 'Feb', income: 15000, expenses: 9000 },
    { month: 'Mar', income: 11000, expenses: 15000 },
    { month: 'Apr', income: 20000, expenses: 7000 },
    { month: 'May', income: 22000, expenses: 8000 },
    { month: 'Jun', income: 18000, expenses: 11000 },
    { month: 'Jul', income: 25000, expenses: 9500 },
    { month: 'Aug', income: 21000, expenses: 8500 },
    { month: 'Sep', income: 19500, expenses: 7800 },
    { month: 'Oct', income: 23000, expenses: 10200 },
    { month: 'Nov', income: 26500, expenses: 11500 },
    { month: 'Dec', income: 28000, expenses: 13000 },
];

const generateSpendingTrend = () => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 300) + 50 + (i % 7 === 0 ? 150 : 0),
        });
    }
    return data;
};

const spendingData = [
    { name: 'Housing', value: 2450, color: '#6366f1' },
    { name: 'Food & Dining', value: 892, color: '#10b981' },
    { name: 'Transportation', value: 450, color: '#8b5cf6' },
    { name: 'Shopping', value: 678, color: '#f59e0b' },
    { name: 'Entertainment', value: 320, color: '#ec4899' },
    { name: 'Utilities', value: 280, color: '#06b6d4' },
];

const topMerchants = [
    { name: 'WeWork', category: 'Office', spent: 2450, count: 3, icon: Icons.Building2 },
    { name: 'AWS', category: 'Technology', spent: 1249, count: 1, icon: Icons.Laptop },
    { name: 'Amazon', category: 'Shopping', spent: 890, count: 12, icon: Icons.ShoppingCart },
    { name: 'Whole Foods', category: 'Groceries', spent: 567, count: 8, icon: Icons.Utensils },
    { name: 'Netflix', category: 'Entertainment', spent: 45, count: 1, icon: Icons.Tv },
];

const kpis = [
    { label: 'Total Income', value: 219000, change: 12.5, icon: Icons.TrendingUp, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { label: 'Total Expenses', value: 109800, change: -8.2, icon: Icons.TrendingDown, color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
    { label: 'Net Savings', value: 109200, change: 15.3, icon: Icons.PiggyBank, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
    { label: 'Savings Rate', value: 49.8, change: 3.2, icon: Icons.Percent, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', isPercent: true },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AnalyticsIndex() {
    const [period, setPeriod] = useState('year');
    const spendingTrend = generateSpendingTrend();

    return (
        <UserLayout>
            <motion.div 
                initial="hidden"
                animate="show"
                variants={container}
                className="space-y-6"
            >
                <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Financial Analytics</h1>
                        <p className="text-sm text-zinc-400">Track your spending and savings patterns</p>
                    </div>
                    <div className="flex gap-2">
                        {['month', 'quarter', 'year'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                    period === p
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                }`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((kpi) => (
                        <div
                            key={kpi.label}
                            className="group rounded-xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-lg hover:shadow-indigo-500/5"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{kpi.label}</p>
                                <div className={`rounded-lg p-2 ${kpi.bgColor}`}>
                                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                                </div>
                            </div>
                            <p className="mt-3 text-2xl font-bold text-white">
                                {kpi.isPercent ? `${kpi.value}%` : formatCurrency(kpi.value)}
                            </p>
                            <div className="mt-2 flex items-center gap-1">
                                <span className={`text-xs font-medium ${kpi.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                                </span>
                                <span className="text-xs text-zinc-500">vs last period</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Income vs Expenses</h2>
                            <span className="text-xs text-zinc-500">Last 12 months</span>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} barGap={4}>
                                    <defs>
                                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                                        </linearGradient>
                                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke="#71717a" 
                                        fontSize={11} 
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="#71717a" 
                                        fontSize={11} 
                                        tickFormatter={(v) => `$${v / 1000}k`}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ 
                                            backgroundColor: '#18181b', 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                        }}
                                        labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}
                                        formatter={(value: any) => [formatCurrency(value)]}
                                    />
                                    <Bar 
                                        dataKey="income" 
                                        fill="url(#incomeGradient)" 
                                        radius={[6, 6, 0, 0]} 
                                        name="Income"
                                        maxBarSize={32}
                                    />
                                    <Bar 
                                        dataKey="expenses" 
                                        fill="url(#expenseGradient)" 
                                        radius={[6, 6, 0, 0]} 
                                        name="Expenses"
                                        maxBarSize={32}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                <span className="text-xs text-zinc-400">Income</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-rose-500" />
                                <span className="text-xs text-zinc-400">Expenses</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Spending Trend</h2>
                            <span className="text-xs text-zinc-500">Last 30 days</span>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={spendingTrend}>
                                    <defs>
                                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={(v) => new Date(v).getDate().toString()} 
                                        stroke="#71717a" 
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={4}
                                    />
                                    <YAxis 
                                        stroke="#71717a" 
                                        fontSize={11} 
                                        tickFormatter={(v) => `$${v}`}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ 
                                            backgroundColor: '#18181b', 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                        }}
                                        labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}
                                        formatter={(value: any) => [formatCurrency(value)]}
                                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#f43f5e" 
                                        strokeWidth={2} 
                                        fillOpacity={1} 
                                        fill="url(#colorSpend)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Spending by Category</h2>
                            <span className="text-xs text-zinc-500">This month</span>
                        </div>
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={spendingData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {spendingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#18181b', 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                        }}
                                        formatter={(value: any) => formatCurrency(value)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-3">
                            {spendingData.map((cat, index) => (
                                <div key={cat.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-sm text-zinc-400">{cat.name}</span>
                                    </div>
                                    <span className="text-sm font-medium text-white">{formatCurrency(cat.value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Top Merchants</h2>
                            <span className="text-xs text-zinc-500">This month</span>
                        </div>
                        <div className="space-y-3">
                            {topMerchants.map((merchant, index) => (
                                <motion.div
                                    key={merchant.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group flex items-center justify-between rounded-xl bg-zinc-800/30 p-4 transition-all hover:bg-zinc-800/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-white/10">
                                            <merchant.icon className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{merchant.name}</p>
                                            <p className="text-xs text-zinc-500">{merchant.category} • {merchant.count} transactions</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-white">{formatCurrency(merchant.spent)}</p>
                                        <p className="text-xs text-emerald-400">Monthly total</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
