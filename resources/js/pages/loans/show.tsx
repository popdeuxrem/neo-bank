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
    Banknote: LucideIcons.Banknote,
    TrendingUp: LucideIcons.TrendingUp,
    DollarSign: LucideIcons.DollarSign,
    Calendar: LucideIcons.Calendar,
    Clock: LucideIcons.Clock,
    Activity: LucideIcons.Activity,
    FileText: LucideIcons.FileText,
    Download: LucideIcons.Download,
    CreditCard: LucideIcons.CreditCard,
    CheckCircle: LucideIcons.CheckCircle,
    AlertCircle: LucideIcons.AlertCircle,
} as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface Installment {
    installment: number;
    date: string;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
    status: 'paid' | 'pending' | 'upcoming';
}

interface Loan {
    id: number;
    product_name: string;
    principal_amount: number;
    interest_rate: number;
    emi_amount: number;
    tenure_months: number;
    start_date: string;
    end_date: string;
    total_paid: number;
    total_outstanding: number;
    installments_paid: number;
    installments_remaining: number;
    next_payment_date: string;
    next_payment_amount: number;
    status: 'active' | 'completed' | 'defaulted' | 'pending';
    purpose: string;
    processing_fee: number;
    installments: Installment[];
}

interface PageProps {
    loan: Loan;
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
        case 'completed': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        case 'defaulted': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        default: return 'bg-zinc-500/10 text-zinc-400';
    }
};

const getInstallmentStatusColor = (status: string) => {
    switch (status) {
        case 'paid': return 'text-emerald-600';
        case 'pending': return 'text-amber-600';
        case 'upcoming': return 'text-zinc-500';
        default: return 'text-zinc-500';
    }
};

export default function LoanShow({ loan }: PageProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'payments'>('overview');

    const progressPercentage = (loan.installments_paid / (loan.installments_paid + loan.installments_remaining)) * 100;
    const totalInterest = (loan.emi_amount * loan.tenure_months) - loan.principal_amount;

    const chartData = loan.installments.slice(0, 12).map(inst => ({
        month: `M${inst.installment}`,
        principal: inst.principal,
        interest: inst.interest,
        balance: inst.balance
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
                        <Link href="/loans/mine">
                            <Button variant="ghost" size="icon">
                                <Icons.ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{loan.product_name}</h1>
                                <Badge className={getStatusColor(loan.status)}>
                                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                </Badge>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400">Loan #{loan.id}</p>
                        </div>
                        <Button variant="outline">
                            <Icons.Download className="w-4 h-4 mr-2" />
                            Statement
                        </Button>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500">Principal Amount</p>
                                        <p className="text-2xl font-bold">{formatCurrency(loan.principal_amount)}</p>
                                    </div>
                                    <Icons.DollarSign className="h-8 w-8 text-indigo-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500">Monthly EMI</p>
                                        <p className="text-2xl font-bold text-indigo-400">{formatCurrency(loan.emi_amount)}</p>
                                    </div>
                                    <Icons.Calendar className="h-8 w-8 text-emerald-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500">Total Interest</p>
                                        <p className="text-2xl font-bold text-rose-400">+{formatCurrency(totalInterest)}</p>
                                    </div>
                                    <Icons.TrendingUp className="h-8 w-8 text-rose-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500">Outstanding</p>
                                        <p className="text-2xl font-bold text-amber-400">{formatCurrency(loan.total_outstanding)}</p>
                                    </div>
                                    <Icons.Banknote className="h-8 w-8 text-amber-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Repayment Progress</CardTitle>
                                <span className="text-sm text-zinc-500">
                                    {loan.installments_paid} of {loan.installments_paid + loan.installments_remaining} installments
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">{progressPercentage.toFixed(1)}% Complete</span>
                                    <span className="text-zinc-500">Ends: {formatDate(loan.end_date)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Loan Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Product Name</span>
                                        <span>{loan.product_name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Interest Rate</span>
                                        <span>{loan.interest_rate}% APR</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Start Date</span>
                                        <span>{formatDate(loan.start_date)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">End Date</span>
                                        <span>{formatDate(loan.end_date)}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Tenure</span>
                                        <span>{loan.tenure_months} months</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Purpose</span>
                                        <span className="capitalize">{loan.purpose}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Processing Fee</span>
                                        <span>{formatCurrency(loan.processing_fee)}</span>
                                    </div>
                                    {loan.status === 'active' && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-500">Next Payment</span>
                                            <span className="text-amber-600">{formatCurrency(loan.next_payment_amount)} on {formatDate(loan.next_payment_date)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="flex gap-2 mb-4">
                        {(['overview', 'schedule', 'payments'] as const).map((tab) => (
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
                                <CardTitle>Repayment Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Area type="monotone" dataKey="balance" stroke="#6366f1" fillOpacity={1} fill="url(#colorBalance)" name="Balance" />
                                        <Area type="monotone" dataKey="principal" stroke="#10b981" fill="transparent" name="Principal" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'schedule' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Amortization Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3">#</th>
                                                <th className="text-left py-3">Date</th>
                                                <th className="text-right py-3">EMI</th>
                                                <th className="text-right py-3">Principal</th>
                                                <th className="text-right py-3">Interest</th>
                                                <th className="text-right py-3">Balance</th>
                                                <th className="text-center py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loan.installments.slice(0, 24).map((inst) => (
                                                <tr key={inst.installment} className="border-b border-zinc-100 dark:border-zinc-700">
                                                    <td className="py-3">{inst.installment}</td>
                                                    <td className="py-3">{formatDate(inst.date)}</td>
                                                    <td className="text-right">{formatCurrency(inst.emi)}</td>
                                                    <td className="text-right text-indigo-600">+{formatCurrency(inst.principal)}</td>
                                                    <td className="text-right text-rose-600">+{formatCurrency(inst.interest)}</td>
                                                    <td className="text-right font-medium">{formatCurrency(inst.balance)}</td>
                                                    <td className="text-center">
                                                        <Badge variant="outline" className={getInstallmentStatusColor(inst.status)}>
                                                            {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'payments' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4">
                                        <p className="text-sm text-zinc-500">Total Paid</p>
                                        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(loan.total_paid)}</p>
                                    </div>
                                    <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
                                        <p className="text-sm text-zinc-500">Outstanding</p>
                                        <p className="text-2xl font-bold text-amber-400">{formatCurrency(loan.total_outstanding)}</p>
                                    </div>
                                    <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4">
                                        <p className="text-sm text-zinc-500">Installments Made</p>
                                        <p className="text-2xl font-bold text-indigo-400">{loan.installments_paid}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Icons.CreditCard className="w-4 h-4 mr-2" />
                                        Make Payment
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Icons.FileText className="w-4 h-4 mr-2" />
                                        Download Receipt
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Icons.CheckCircle className="w-4 h-4 mr-2" />
                                        View Certificate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
