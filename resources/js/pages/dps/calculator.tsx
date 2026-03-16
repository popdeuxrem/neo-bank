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
    PiggyBank: LucideIcons.PiggyBank,
    TrendingUp: LucideIcons.TrendingUp,
    DollarSign: LucideIcons.DollarSign,
    Calendar: LucideIcons.Calendar,
    Info: LucideIcons.Info,
    RefreshCw: LucideIcons.RefreshCw,
    ChevronDown: LucideIcons.ChevronDown,
} as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface DpsPlan {
    id: number;
    name: string;
    interest_rate: number;
    min_amount: number;
    max_amount: number;
    duration_months: number;
}

interface PageProps {
    plans: DpsPlan[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];

export default function DpsCalculator({ plans }: PageProps) {
    const [monthlyAmount, setMonthlyAmount] = useState(500);
    const [selectedPlanId, setSelectedPlanId] = useState<number>(plans[0]?.id || 1);
    const [duration, setDuration] = useState(60);
    const [compareMode, setCompareMode] = useState(false);
    const [comparePlans, setComparePlans] = useState<number[]>([]);

    const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
    
    const calculateProjection = (amount: number, months: number, rate: number) => {
        const monthlyRate = rate / 100 / 12;
        const totalDeposited = amount * months;
        let interest = 0;
        
        for (let i = 1; i <= months; i++) {
            interest += amount * monthlyRate * i;
        }
        
        const maturityAmount = totalDeposited + interest;
        const effectiveYield = ((maturityAmount - totalDeposited) / totalDeposited) * 100;
        
        return {
            totalDeposited,
            interest,
            maturityAmount,
            effectiveYield,
            monthlyRate
        };
    };

    const projection = calculateProjection(monthlyAmount, duration, selectedPlan?.interest_rate || 8);

    const generateGrowthData = () => {
        const data = [];
        let balance = 0;
        const monthlyRate = (selectedPlan?.interest_rate || 8) / 100 / 12;
        
        for (let month = 1; month <= duration; month += 3) {
            balance = 0;
            for (let i = 1; i <= month; i++) {
                balance += monthlyAmount * (1 + monthlyRate * i);
            }
            data.push({
                month: `Month ${month}`,
                deposited: monthlyAmount * month,
                interest: balance - (monthlyAmount * month),
                total: balance
            });
        }
        return data;
    };

    const growthData = generateGrowthData();

    const generateSchedule = () => {
        const schedule = [];
        const monthlyRate = (selectedPlan?.interest_rate || 8) / 100 / 12;
        let cumulativeDeposit = 0;
        let cumulativeInterest = 0;
        
        for (let month = 1; month <= Math.min(duration, 12); month++) {
            cumulativeDeposit += monthlyAmount;
            const monthInterest = monthlyAmount * monthlyRate * month;
            cumulativeInterest += monthInterest;
            schedule.push({
                month,
                deposit: monthlyAmount,
                interest: monthInterest,
                totalDeposit: cumulativeDeposit,
                totalInterest: cumulativeInterest,
                balance: cumulativeDeposit + cumulativeInterest
            });
        }
        return schedule;
    };

    const schedule = generateSchedule();

    const comparePlansData = comparePlans.map(planId => {
        const plan = plans.find(p => p.id === planId);
        if (!plan) return null;
        const proj = calculateProjection(monthlyAmount, plan.duration_months, plan.interest_rate);
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
                        <Link href="/dps">
                            <Button variant="ghost" size="icon">
                                <Icons.ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">DPS Calculator</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Calculate your Deposit Pension Scheme returns</p>
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
                                        <Label>Monthly Deposit</Label>
                                        <Input
                                            type="number"
                                            value={monthlyAmount}
                                            onChange={(e) => setMonthlyAmount(parseInt(e.target.value) || 0)}
                                            min={100}
                                            max={100000}
                                        />
                                    </div>
                                    <div>
                                        <Label>Duration (Months)</Label>
                                        <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[12, 24, 36, 48, 60, 72, 84, 96, 108, 120].map((m) => (
                                                    <SelectItem key={m} value={m.toString()}>
                                                        {m} months ({m/12} years)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Plan</Label>
                                        <Select value={selectedPlanId.toString()} onValueChange={(v) => setSelectedPlanId(parseInt(v))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {plans.map((plan) => (
                                                    <SelectItem key={plan.id} value={plan.id.toString()}>
                                                        {plan.name} ({plan.interest_rate}%)
                                                    </SelectItem>
                                                ))}
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
                                                onClick={() => setSelectedPlanId(plan.id)}
                                            >
                                                {plan.name} - {plan.interest_rate}%
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4">
                                        <p className="text-sm text-zinc-500">Total Deposited</p>
                                        <p className="text-xl font-bold">{formatCurrency(projection.totalDeposited)}</p>
                                    </div>
                                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4">
                                        <p className="text-sm text-zinc-500">Interest Earned</p>
                                        <p className="text-xl font-bold text-emerald-600">+{formatCurrency(projection.interest)}</p>
                                    </div>
                                    <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4">
                                        <p className="text-sm text-zinc-500">Maturity Amount</p>
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
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                                labelStyle={{ color: '#fff' }}
                                                formatter={(value: number) => formatCurrency(value)}
                                            />
                                            <Area type="monotone" dataKey="deposit" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Deposited" />
                                            <Area type="monotone" dataKey="interest" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Interest" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h4 className="font-medium mb-4">Payment Schedule (First 12 Months)</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2">Month</th>
                                                    <th className="text-right py-2">Deposit</th>
                                                    <th className="text-right py-2">Interest</th>
                                                    <th className="text-right py-2">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {schedule.map((row) => (
                                                    <tr key={row.month} className="border-b border-zinc-100 dark:border-zinc-700">
                                                        <td className="py-2">{row.month}</td>
                                                        <td className="text-right">{formatCurrency(row.deposit)}</td>
                                                        <td className="text-right text-emerald-600">+{formatCurrency(row.interest)}</td>
                                                        <td className="text-right font-medium">{formatCurrency(row.balance)}</td>
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
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                                formatter={(value: number) => formatCurrency(value)}
                                            />
                                            <Legend />
                                            <Bar dataKey="totalDeposited" name="Deposited" fill="#6366f1" />
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
                                                        <span>{plan.duration_months} months</span>
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
                                    <span className="text-zinc-500">Monthly Deposit</span>
                                    <span>{formatCurrency(monthlyAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Duration</span>
                                    <span>{duration} months ({duration/12} years)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Interest Rate</span>
                                    <span>{selectedPlan?.interest_rate || 8}% p.a.</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Total Deposited</span>
                                        <span className="font-medium">{formatCurrency(projection.totalDeposited)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-2">
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
                                            Increasing your monthly deposit by just $100 can significantly boost your maturity amount over time.
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
