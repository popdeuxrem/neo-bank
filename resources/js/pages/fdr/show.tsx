import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    TrendingUp: LucideIcons.TrendingUp,
    PiggyBank: LucideIcons.PiggyBank,
    DollarSign: LucideIcons.DollarSign,
    Calendar: LucideIcons.Calendar,
    Clock: LucideIcons.Clock,
    Activity: LucideIcons.Activity,
    FileText: LucideIcons.FileText,
    Download: LucideIcons.Download,
    CreditCard: LucideIcons.CreditCard,
    RefreshCw: LucideIcons.RefreshCw,
} as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface InterestSchedule {
    month: number;
    interest: number;
    cumulativeInterest: number;
    totalValue: number;
}

interface FdrAccount {
    id: number;
    plan_name: string;
    plan_id: number;
    deposit_amount: number;
    start_date: string;
    maturity_date: string;
    interest_earned: number;
    projected_maturity: number;
    current_value: number;
    status: 'active' | 'matured' | 'cancelled';
    interest_rate: number;
    duration_months: number;
    days_remaining: number;
    compounding: 'monthly' | 'quarterly' | 'annually';
    progress_percentage: number;
    interest_schedule: InterestSchedule[];
}

interface PageProps {
    account: FdrAccount;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'matured': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        default: return 'bg-zinc-500/10 text-zinc-400';
    }
};

export default function FdrShow({ account }: PageProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'options'>('overview');

    const chartData = account.interest_schedule.slice(0, 12).map(inst => ({
        month: `M${inst.month}`,
        interest: inst.interest,
        cumulativeInterest: inst.cumulativeInterest,
        totalValue: inst.totalValue
    }));

    return (
        <UserLayout>
            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={stagger}
                className="space-y-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/fdr/mine">
                            <Button variant="ghost" size="icon">
                                <Icons.ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{account.plan_name}</h1>
                                <Badge className={getStatusColor(account.status)}>
                                    {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                                </Badge>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400">FDR Account #{account.id}</p>
                        </div>
                        <Button variant="outline">
                            <Icons.Download className="w-4 h-4 mr-2" />
                            Certificate
                        </Button>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500">Deposit Amount</p>
                                        <p className="text-2xl font-bold">{formatCurrency(account.deposit_amount)}</p>
                                    </div>
                                    <Icons.DollarSign className="h-8 w-8 text-indigo-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500">Current Value</p>
                                        <p className="text-2xl font-bold text-indigo-400">{formatCurrency(account.current_value)}</p>
                                    </div>
                                    <Icons.Activity className="h-8 w-8 text-emerald-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500">Interest Earned</p>
                                        <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(account.interest_earned)}</p>
                                    </div>
                                    <Icons.TrendingUp className="h-8 w-8 text-emerald-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500">Maturity Value</p>
                                        <p className="text-2xl font-bold text-amber-400">{formatCurrency(account.projected_maturity)}</p>
                                    </div>
                                    <Icons.PiggyBank className="h-8 w-8 text-amber-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Time Progress</CardTitle>
                                <span className="text-sm text-zinc-500">
                                    {account.days_remaining} days remaining
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${account.progress_percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">{account.progress_percentage}% Complete</span>
                                    <span className="text-zinc-500">Maturity: {formatDate(account.maturity_date)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Plan Name</span>
                                        <span>{account.plan_name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Interest Rate</span>
                                        <span>{account.interest_rate}% p.a.</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Start Date</span>
                                        <span>{formatDate(account.start_date)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Maturity Date</span>
                                        <span>{formatDate(account.maturity_date)}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Duration</span>
                                        <span>{account.duration_months} months</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Compounding</span>
                                        <span className="capitalize">{account.compounding}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Days Remaining</span>
                                        <span className="text-amber-600">{account.days_remaining} days</span>
                                    </div>
                                    {account.status === 'matured' && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-500">Status</span>
                                            <Badge className={getStatusColor(account.status)}>Matured</Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="flex gap-2 mb-4">
                        {(['overview', 'schedule', 'options'] as const).map((tab) => (
                            <Button
                                key={tab}
                                variant={activeTab === tab ? "default" : "outline"}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Growth Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Area type="monotone" dataKey="totalValue" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" name="Total Value" />
                                        <Area type="monotone" dataKey="cumulativeInterest" stroke="#10b981" fill="transparent" name="Interest" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'schedule' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Interest Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3">Month</th>
                                                <th className="text-right py-3">Interest</th>
                                                <th className="text-right py-3">Cumulative Interest</th>
                                                <th className="text-right py-3">Total Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {account.interest_schedule.slice(0, 24).map((inst) => (
                                                <tr key={inst.month} className="border-b border-zinc-100 dark:border-zinc-700">
                                                    <td className="py-3">{inst.month}</td>
                                                    <td className="text-right text-emerald-600">+{formatCurrency(inst.interest)}</td>
                                                    <td className="text-right">{formatCurrency(inst.cumulativeInterest)}</td>
                                                    <td className="text-right font-medium">{formatCurrency(inst.totalValue)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'options' && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Total Days Elapsed</span>
                                        <span className="font-medium">{account.duration_months * 30 - account.days_remaining} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Average Monthly Interest</span>
                                        <span className="font-medium text-emerald-400">
                                            {formatCurrency(account.interest_earned / Math.max((account.duration_months * 30 - account.days_remaining) / 30, 1))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Total Interest</span>
                                        <span className="font-medium text-emerald-400">{formatCurrency(account.interest_earned)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Projected Final Amount</span>
                                        <span className="font-medium text-indigo-400">{formatCurrency(account.projected_maturity)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Icons.Download className="w-4 h-4 mr-2" />
                                        Download Certificate
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Icons.RefreshCw className="w-4 h-4 mr-2" />
                                        Renew/Transfer
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Icons.FileText className="w-4 h-4 mr-2" />
                                        View Statement
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Icons.CreditCard className="w-4 h-4 mr-2" />
                                        Withdraw Interest
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
