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
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    Banknote: LucideIcons.Banknote,
    TrendingUp: LucideIcons.TrendingUp,
    Calculator: LucideIcons.Calculator,
    DollarSign: LucideIcons.DollarSign,
    Info: LucideIcons.Info,
} as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface LoanPlan {
    id: number;
    name: string;
    interest_rate: number;
    min_amount: number;
    max_amount: number;
    duration_options: number[];
    processing_fee: number;
}

interface PageProps {
    plans: LoanPlan[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];

export default function LoansCalculator({ plans }: PageProps) {
    const [amount, setAmount] = useState(10000);
    const [duration, setDuration] = useState(24);
    const [interestRate, setInterestRate] = useState(plans[0]?.interest_rate || 12);
    const [processingFee, setProcessingFee] = useState(plans[0]?.processing_fee || 2);
    const [compareMode, setCompareMode] = useState(false);
    const [compareDurations, setCompareDurations] = useState<number[]>([]);

    const calculateEmi = (principal: number, months: number, rate: number) => {
        if (!principal || !months || !rate) return null;
        const monthlyRate = rate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        const processingFeeAmount = (principal * processingFee) / 100;
        
        return {
            emi: isNaN(emi) ? principal / months : emi,
            totalPayment: isNaN(totalPayment) ? principal : totalPayment,
            totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
            processingFee: processingFeeAmount,
            totalCost: totalPayment + processingFeeAmount,
            principal,
            rate,
            months
        };
    };

    const result = calculateEmi(amount, duration, interestRate);

    const generateAmortizationData = () => {
        if (!result) return [];
        const data = [];
        let balance = amount;
        const monthlyRate = interestRate / 12 / 100;
        
        for (let month = 1; month <= Math.min(duration, 12); month++) {
            const interest = balance * monthlyRate;
            const principal = result.emi - interest;
            balance -= principal;
            data.push({
                month,
                principal,
                interest,
                balance: Math.max(0, balance)
            });
        }
        return data;
    };

    const amortizationData = generateAmortizationData();

    const chartData = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1) * (duration / 12);
        const progress = month / duration;
        return {
            month: `M${Math.round(month)}`,
            principal: amount * progress * 0.7,
            interest: (result?.totalInterest || 0) * progress,
        };
    });

    const compareData = compareDurations.map(months => {
        const calc = calculateEmi(amount, months, interestRate);
        return { months, ...calc };
    }).filter(Boolean);

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
                        <div>
                            <h1 className="text-2xl font-bold">Loan Calculator</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Calculate your loan EMI and amortization</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.Calculator className="w-5 h-5 text-indigo-400" />
                                    Calculator
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <Label>Loan Amount</Label>
                                        <Input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                            min={1000}
                                            max={1000000}
                                        />
                                    </div>
                                    <div>
                                        <Label>Duration (Months)</Label>
                                        <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 120].map((m) => (
                                                    <SelectItem key={m} value={m.toString()}>
                                                        {m} months ({m/12} years)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Interest Rate (% APR)</Label>
                                        <Input
                                            type="number"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                                            step={0.1}
                                            min={1}
                                            max={30}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {plans.slice(0, 4).map((plan) => (
                                        <Button
                                            key={plan.id}
                                            variant={interestRate === plan.interest_rate ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => {
                                                setInterestRate(plan.interest_rate);
                                                setProcessingFee(plan.processing_fee);
                                            }}
                                        >
                                            {plan.name} - {plan.interest_rate}%
                                        </Button>
                                    ))}
                                </div>

                                {result && (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4">
                                            <p className="text-sm text-zinc-500">Loan Amount</p>
                                            <p className="text-xl font-bold">{formatCurrency(result.principal)}</p>
                                        </div>
                                        <div className="rounded-lg bg-rose-50 dark:bg-rose-900/20 p-4">
                                            <p className="text-sm text-zinc-500">Total Interest</p>
                                            <p className="text-xl font-bold text-rose-600">+{formatCurrency(result.totalInterest)}</p>
                                        </div>
                                        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4">
                                            <p className="text-sm text-zinc-500">Monthly EMI</p>
                                            <p className="text-xl font-bold text-indigo-600">{formatCurrency(result.emi)}</p>
                                        </div>
                                        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
                                            <p className="text-sm text-zinc-500">Processing Fee</p>
                                            <p className="text-xl font-bold text-amber-600">{formatCurrency(result.processingFee)}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-lg border p-4">
                                    <h4 className="font-medium mb-4">Amortization Schedule (First 12 Months)</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={amortizationData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Legend />
                                            <Area type="monotone" dataKey="principal" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Principal" />
                                            <Area type="monotone" dataKey="interest" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Interest" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h4 className="font-medium mb-4">EMI Breakdown</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2">Month</th>
                                                    <th className="text-right py-2">EMI</th>
                                                    <th className="text-right py-2">Principal</th>
                                                    <th className="text-right py-2">Interest</th>
                                                    <th className="text-right py-2">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {amortizationData.map((row) => (
                                                    <tr key={row.month} className="border-b border-zinc-100 dark:border-zinc-700">
                                                        <td className="py-2">{row.month}</td>
                                                        <td className="text-right">{formatCurrency(result?.emi || 0)}</td>
                                                        <td className="text-right text-indigo-600">{formatCurrency(row.principal)}</td>
                                                        <td className="text-right text-rose-600">{formatCurrency(row.interest)}</td>
                                                        <td className="text-right">{formatCurrency(row.balance)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {compareMode && compareData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Duration Comparison</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={compareData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="months" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Legend />
                                            <Bar dataKey="totalInterest" name="Total Interest" fill="#f59e0b" />
                                            <Bar dataKey="processingFee" name="Processing Fee" fill="#8b5cf6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                                        {compareData.map((item: any, idx: number) => (
                                            <div key={idx} className="rounded-lg border p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">{item.months} months</h4>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">EMI</span>
                                                        <span className="font-medium">{formatCurrency(item.emi)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Total Interest</span>
                                                        <span className="text-rose-600">+{formatCurrency(item.totalInterest)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold">
                                                        <span>Total Cost</span>
                                                        <span>{formatCurrency(item.totalCost)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>

                    <motion.div variants={fadeUp} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Loan Amount</span>
                                    <span>{formatCurrency(amount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Duration</span>
                                    <span>{duration} months ({duration/12} years)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Interest Rate</span>
                                    <span>{interestRate}% APR</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Processing Fee</span>
                                    <span>{processingFee}%</span>
                                </div>
                                {result && (
                                    <>
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-500">Monthly EMI</span>
                                                <span className="font-bold text-indigo-600">{formatCurrency(result.emi)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-2">
                                                <span className="text-zinc-500">Total Interest</span>
                                                <span className="text-rose-600">+{formatCurrency(result.totalInterest)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-2">
                                                <span className="text-zinc-500">Processing Fee</span>
                                                <span>{formatCurrency(result.processingFee)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                                <span>Total Payment</span>
                                                <span>{formatCurrency(result.totalCost)}</span>
                                            </div>
                                        </div>
                                        <Button className="w-full" onClick={() => setCompareMode(!compareMode)}>
                                            {compareMode ? 'Hide Comparison' : 'Compare Durations'}
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Compare Durations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[12, 24, 36, 48, 60].map((m) => (
                                    <Button
                                        key={m}
                                        variant={compareDurations.includes(m) ? "default" : "outline"}
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            if (compareDurations.includes(m)) {
                                                setCompareDurations(compareDurations.filter(d => d !== m));
                                            } else if (compareDurations.length < 3) {
                                                setCompareDurations([...compareDurations, m]);
                                            }
                                        }}
                                        disabled={!compareDurations.includes(m) && compareDurations.length >= 3}
                                    >
                                        <Icons.TrendingUp className="w-4 h-4 mr-2" />
                                        {m} months
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Icons.Info className="w-5 h-5 text-indigo-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-indigo-800 dark:text-indigo-200">Pro Tip</h4>
                                        <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">
                                            Shorter loan durations mean less interest but higher EMIs. Choose what fits your budget.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </UserLayout>
    );
}
