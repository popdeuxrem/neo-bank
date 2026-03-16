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
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    Banknote: LucideIcons.Banknote,
    Calendar: LucideIcons.Calendar,
    Download: LucideIcons.Download,
    Printer: LucideIcons.Printer,
    ChevronDown: LucideIcons.ChevronDown,
} as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface Loan {
    id: number;
    product_name: string;
    principal_amount: number;
    interest_rate: number;
    emi_amount: number;
    tenure_months: number;
    start_date: string;
}

interface EmiScheduleItem {
    installment: number;
    date: string;
    opening_balance: number;
    emi: number;
    principal: number;
    interest: number;
    closing_balance: number;
    status: 'paid' | 'pending' | 'upcoming';
}

interface PageProps {
    loans: Loan[];
    selectedLoanId?: number;
    schedule: EmiScheduleItem[];
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

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export default function LoansEmi({ loans, selectedLoanId, schedule }: PageProps) {
    const [loanId, setLoanId] = useState<number>(selectedLoanId || loans[0]?.id || 0);
    
    const selectedLoan = loans.find(l => l.id === loanId) || loans[0];
    
    const totalPrincipal = selectedLoan ? selectedLoan.principal_amount : 0;
    const totalInterest = selectedLoan ? (selectedLoan.emi_amount * selectedLoan.tenure_months) - selectedLoan.principal_amount : 0;
    
    const pieData = [
        { name: 'Principal', value: totalPrincipal },
        { name: 'Interest', value: totalInterest },
    ];

    const chartData = schedule.slice(0, 12).map(item => ({
        month: `M${item.installment}`,
        principal: item.principal,
        interest: item.interest,
        balance: item.closing_balance
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
                        <Link href="/loans">
                            <Button variant="ghost" size="icon">
                                <Icons.ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">EMI Schedule</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">View and download your EMI payment schedule</p>
                        </div>
                        <Button variant="outline">
                            <Icons.Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </motion.div>

                {loans.length > 1 && (
                    <motion.div variants={fadeUp}>
                        <Card>
                            <CardContent className="pt-6">
                                <Label>Select Loan</Label>
                                <Select value={loanId.toString()} onValueChange={(v) => setLoanId(parseInt(v))}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loans.map((loan) => (
                                            <SelectItem key={loan.id} value={loan.id.toString()}>
                                                {loan.product_name} - {formatCurrency(loan.principal_amount)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {selectedLoan && (
                    <>
                        <motion.div variants={fadeUp}>
                            <div className="grid gap-4 md:grid-cols-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-zinc-500">Loan Amount</p>
                                        <p className="text-2xl font-bold">{formatCurrency(selectedLoan.principal_amount)}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-zinc-500">Monthly EMI</p>
                                        <p className="text-2xl font-bold text-indigo-400">{formatCurrency(selectedLoan.emi_amount)}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-zinc-500">Total Interest</p>
                                        <p className="text-2xl font-bold text-rose-400">{formatCurrency(totalInterest)}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-zinc-500">Total Payment</p>
                                        <p className="text-2xl font-bold">{formatCurrency(selectedLoan.emi_amount * selectedLoan.tenure_months)}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="h-[250px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
                                                    <span>Principal</span>
                                                </div>
                                                <span className="font-medium">{formatCurrency(totalPrincipal)}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                                                    <span>Interest</span>
                                                </div>
                                                <span className="font-medium">{formatCurrency(totalInterest)}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                                                <span className="font-medium">Total Payment</span>
                                                <span className="font-bold text-indigo-600">{formatCurrency(totalPrincipal + totalInterest)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Principal vs Interest Chart</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Legend />
                                            <Area type="monotone" dataKey="principal" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Principal" />
                                            <Area type="monotone" dataKey="interest" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Interest" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Complete EMI Schedule</CardTitle>
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
                                                {schedule.map((item) => (
                                                    <tr key={item.installment} className="border-b border-zinc-100 dark:border-zinc-700">
                                                        <td className="py-3">{item.installment}</td>
                                                        <td className="py-3">{formatDate(item.date)}</td>
                                                        <td className="text-right font-medium">{formatCurrency(item.emi)}</td>
                                                        <td className="text-right text-indigo-600">{formatCurrency(item.principal)}</td>
                                                        <td className="text-right text-rose-600">{formatCurrency(item.interest)}</td>
                                                        <td className="text-right">{formatCurrency(item.closing_balance)}</td>
                                                        <td className="text-center">
                                                            <Badge variant="outline" className={
                                                                item.status === 'paid' ? 'text-emerald-600' :
                                                                item.status === 'pending' ? 'text-amber-600' : 'text-zinc-500'
                                                            }>
                                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </UserLayout>
    );
}
