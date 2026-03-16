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
    TrendingUp: LucideIcons.TrendingUp,
    PiggyBank: LucideIcons.PiggyBank,
    DollarSign: LucideIcons.DollarSign,
    Calendar: LucideIcons.Calendar,
    Info: LucideIcons.Info,
} as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface FdrPlan {
    id: number;
    name: string;
    interest_rate: number;
    min_amount: number;
    max_amount: number;
    duration_months: number;
    compounding: 'monthly' | 'quarterly' | 'annually';
}

interface PageProps {
    plans: FdrPlan[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];

export default function FdrCalculator({ plans }: PageProps) {
    const [depositAmount, setDepositAmount] = useState(10000);
    const [selectedPlanId, setSelectedPlanId] = useState<number>(plans[0]?.id || 1);
    const [duration, setDuration] = useState(12);
    const [compounding, setCompounding] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
    const [compareMode, setCompareMode] = useState(false);
    const [comparePlans, setComparePlans] = useState<number[]>([]);

    const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
    
    const calculateProjection = (amount: number, months: number, rate: number, freq: string) => {
        const r = rate / 100;
        let n = 12;
        if (freq === 'quarterly') n = 4;
        else if (freq === 'annually') n = 1;
        
        const maturityAmount = amount * Math.pow(1 + r/n, n * months/12);
        const interest = maturityAmount - amount;
        const effectiveYield = ((maturityAmount - amount) / amount) * 100;
        
        return {
            totalDeposited: amount,
            interest,
            maturityAmount,
            effectiveYield,
            rate,
            months,
            compounding: freq
        };
    };

    const projection = calculateProjection(depositAmount, duration, selectedPlan?.interest_rate || 8, compounding);

    const generateGrowthData = () => {
        const data = [];
        const r = (selectedPlan?.interest_rate || 8) / 100;
        let n = compounding === 'monthly' ? 12 : compounding === 'quarterly' ? 4 : 1;
        
        for (let month = 3; month <= duration; month += 3) {
            const amount = depositAmount * Math.pow(1 + r/n, n * month/12);
            data.push({
                month: `Month ${month}`,
                principal: depositAmount,
                interest: amount - depositAmount,
                total: amount
            });
        }
        return data;
    };

    const growthData = generateGrowthData();

    const generateInterestSchedule = () => {
        const schedule = [];
        const r = (selectedPlan?.interest_rate || 8) / 100;
        let n = compounding === 'monthly' ? 12 : compounding === 'quarterly' ? 4 : 1;
        let cumulativeInterest = 0;
        
        for (let month = 1; month <= Math.min(duration, 12); month++) {
            const currentValue = depositAmount * Math.pow(1 + r/n, n * month/12);
            const interest = currentValue - depositAmount;
            cumulativeInterest = interest;
            schedule.push({
                month,
                interest: interest,
                cumulativeInterest,
                totalValue: currentValue
            });
        }
        return schedule;
    };

    const interestSchedule = generateInterestSchedule();

    const comparePlansData = comparePlans.map(planId => {
        const plan = plans.find(p => p.id === planId);
        if (!plan) return null;
        const proj = calculateProjection(depositAmount, plan.duration_months, plan.interest_rate, plan.compounding);
        return { ...plan, ...proj };
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
                        <Link href="/fdr">
                            <Button variant="ghost" size="icon">
                                <Icons.ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">FDR Calculator</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Calculate your Fixed Deposit returns with compounding</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.PiggyBank className="w-5 h-5 text-indigo-400" />
                                    Calculator
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <Label>Deposit Amount</Label>
                                        <Input
                                            type="number"
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
                                            min={100}
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
                                                {[3, 6, 9, 12, 18, 24, 36, 48, 60].map((m) => (
                                                    <SelectItem key={m} value={m.toString()}>
                                                        {m} months ({m/12} years)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Compounding</Label>
                                        <Select value={compounding} onValueChange={(v: any) => setCompounding(v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                                <SelectItem value="annually">Annually</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {selectedPlan && (
                                    <div className="flex flex-wrap gap-2">
                                        {plans.map((plan) => (
                                            <Button
                                                key={plan.id}
                                                variant={selectedPlanId === plan.id ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedPlanId(plan.id);
                                                    setDuration(plan.duration_months);
                                                    setCompounding(plan.compounding);
                                                }}
                                            >
                                                {plan.name} - {plan.interest_rate}%
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4">
                                        <p className="text-sm text-zinc-500">Deposit</p>
                                        <p className="text-xl font-bold">{formatCurrency(projection.totalDeposited)}</p>
                                    </div>
                                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4">
                                        <p className="text-sm text-zinc-500">Interest Earned</p>
                                        <p className="text-xl font-bold text-emerald-600">+{formatCurrency(projection.interest)}</p>
                                    </div>
                                    <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4">
                                        <p className="text-sm text-zinc-500">Maturity Value</p>
                                        <p className="text-xl font-bold text-indigo-600">{formatCurrency(projection.maturityAmount)}</p>
                                    </div>
                                    <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
                                        <p className="text-sm text-zinc-500">Effective Yield</p>
                                        <p className="text-xl font-bold text-amber-600">{projection.effectiveYield.toFixed(2)}%</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h4 className="font-medium mb-4">Growth Projection</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={growthData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Area type="monotone" dataKey="principal" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Principal" />
                                            <Area type="monotone" dataKey="interest" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Interest" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h4 className="font-medium mb-4">Interest Calculation (First 12 Months)</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2">Month</th>
                                                    <th className="text-right py-2">Interest</th>
                                                    <th className="text-right py-2">Cumulative</th>
                                                    <th className="text-right py-2">Total Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {interestSchedule.map((row) => (
                                                    <tr key={row.month} className="border-b border-zinc-100 dark:border-zinc-700">
                                                        <td className="py-2">{row.month}</td>
                                                        <td className="text-right text-emerald-600">+{formatCurrency(row.interest)}</td>
                                                        <td className="text-right">{formatCurrency(row.cumulativeInterest)}</td>
                                                        <td className="text-right font-medium">{formatCurrency(row.totalValue)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {compareMode && comparePlansData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Plan Comparison</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={comparePlansData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Legend />
                                            <Bar dataKey="totalDeposited" name="Deposit" fill="#6366f1" />
                                            <Bar dataKey="interest" name="Interest" fill="#10b981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        {comparePlansData.map((plan: any, idx: number) => (
                                            <div key={idx} className="rounded-lg border p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">{plan.name}</h4>
                                                    <Badge style={{ backgroundColor: COLORS[idx % COLORS.length] + '20', color: COLORS[idx % COLORS.length] }}>
                                                        {plan.interest_rate}% APR
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Duration</span>
                                                        <span>{plan.months} months</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Maturity</span>
                                                        <span className="font-medium">{formatCurrency(plan.maturityAmount)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-emerald-600">
                                                        <span>Interest</span>
                                                        <span>+{formatCurrency(plan.interest)}</span>
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
                                    <span className="text-zinc-500">Deposit Amount</span>
                                    <span>{formatCurrency(depositAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Duration</span>
                                    <span>{duration} months ({duration/12} years)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Interest Rate</span>
                                    <span>{selectedPlan?.interest_rate || 8}% p.a.</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Compounding</span>
                                    <span className="capitalize">{compounding}</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Total Interest</span>
                                        <span className="font-medium text-emerald-600">+{formatCurrency(projection.interest)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                        <span>Maturity Value</span>
                                        <span className="text-indigo-600">{formatCurrency(projection.maturityAmount)}</span>
                                    </div>
                                </div>
                                <Button className="w-full" onClick={() => setCompareMode(!compareMode)}>
                                    {compareMode ? 'Hide Comparison' : 'Compare Plans'}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Compare Plans</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {plans.map((plan) => (
                                    <Button
                                        key={plan.id}
                                        variant={comparePlans.includes(plan.id) ? "default" : "outline"}
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            if (comparePlans.includes(plan.id)) {
                                                setComparePlans(comparePlans.filter(id => id !== plan.id));
                                            } else if (comparePlans.length < 3) {
                                                setComparePlans([...comparePlans, plan.id]);
                                            }
                                        }}
                                        disabled={!comparePlans.includes(plan.id) && comparePlans.length >= 3}
                                    >
                                        <Icons.TrendingUp className="w-4 h-4 mr-2" />
                                        {plan.name} ({plan.interest_rate}%)
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
                                            Longer durations and more frequent compounding result in higher returns. Consider reinvesting your matured FD.
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
