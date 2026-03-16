import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    PiggyBank, 
    ArrowLeft, 
    TrendingUp,
    ChevronRight,
    Lock,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';

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
    description: string;
    status: string;
    calculator: {
        monthlyAmount: number;
        months: number;
        totalDeposited: number;
        totalInterest: number;
        maturityAmount: number;
        effectiveYield: number;
        maturityDate: string;
    };
}

interface DpsSubscription {
    id: number;
    plan: DpsPlan;
    monthly_amount: number;
    start_date: string;
    maturity_date: string;
    total_deposited: number;
    interest_earned: number;
    status: string;
}

interface PageProps {
    plans: DpsPlan[];
    mySubscriptions: DpsSubscription[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export default function DpsIndex({ plans, mySubscriptions }: PageProps) {
    const [selectedPlan, setSelectedPlan] = useState<DpsPlan | null>(plans[0] || null);
    const [monthlyAmount, setMonthlyAmount] = useState(1000);
    const [showCalculator, setShowCalculator] = useState(false);

    const { data, setData, post, processing } = useForm({
        plan_id: plans[0]?.id,
        account_id: '',
        monthly_amount: 1000,
        start_date: new Date().toISOString().split('T')[0],
    });

    const calculateProjection = () => {
        if (!selectedPlan) return null;
        const months = selectedPlan.duration_months;
        const rate = selectedPlan.interest_rate / 100;
        const totalDeposited = monthlyAmount * months;
        const interest = monthlyAmount * rate * months * (months + 1) / 24;
        return {
            totalDeposited,
            interest,
            maturityAmount: totalDeposited + interest,
        };
    };

    const projection = calculateProjection();

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPlan) {
            setData('plan_id', selectedPlan.id);
            setData('monthly_amount', monthlyAmount);
        }
        post('/dps/subscribe');
    };

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
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">DPS (Deposit Pension Scheme)</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Save regularly and earn guaranteed interest</p>
                        </div>
                    </div>
                </motion.div>

                {mySubscriptions.length > 0 && (
                    <motion.div variants={fadeUp}>
                        <h2 className="text-lg font-semibold mb-4">My DPS Accounts</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mySubscriptions.map((subscription) => (
                                <Link key={subscription.id} href={`/dps/${subscription.id}`}>
                                    <Card className="hover:border-indigo-500 transition-colors cursor-pointer">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">{subscription.plan.name}</CardTitle>
                                                <Badge variant="secondary">{subscription.status}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-500">Monthly</span>
                                                    <span className="font-medium">{formatCurrency(subscription.monthly_amount)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-500">Deposited</span>
                                                    <span>{formatCurrency(subscription.total_deposited)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-500">Interest Earned</span>
                                                    <span className="text-emerald-600">{formatCurrency(subscription.interest_earned)}</span>
                                                </div>
                                                <div className="pt-2 border-t">
                                                    <p className="text-xs text-zinc-500">Maturity: {subscription.maturity_date}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Available Plans</h2>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowCalculator(!showCalculator)}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Calculator
                            </Button>
                    </div>

                    {showCalculator && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>DPS Calculator</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Monthly Deposit</Label>
                                            <Input
                                                type="number"
                                                value={monthlyAmount}
                                                onChange={(e) => setMonthlyAmount(parseInt(e.target.value) || 0)}
                                                min={selectedPlan?.min_amount || 100}
                                                max={selectedPlan?.max_amount || 10000}
                                            />
                                        </div>
                                        <div>
                                            <Label>Plan: {selectedPlan?.name}</Label>
                                            <p className="text-sm text-zinc-500">{selectedPlan?.duration_months} months</p>
                                        </div>
                                    </div>
                                    {projection && (
                                        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Total Deposited</span>
                                                <span className="font-medium">{formatCurrency(projection.totalDeposited)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Interest Earned</span>
                                                <span className="font-medium text-emerald-600">+{formatCurrency(projection.interest)}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-indigo-200 dark:border-indigo-800 pt-3 font-bold">
                                                <span>Maturity Amount</span>
                                                <span className="text-indigo-600">{formatCurrency(projection.maturityAmount)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <Card 
                                key={plan.id} 
                                className={`cursor-pointer transition-all ${
                                    selectedPlan?.id === plan.id 
                                        ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                                        : 'hover:border-zinc-300'
                                }`}
                                onClick={() => {
                                    setSelectedPlan(plan);
                                    setMonthlyAmount(plan.min_amount);
                                }}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                                        <Badge className="bg-emerald-100 text-emerald-700">
                                            {plan.interest_rate}% p.a.
                                        </Badge>
                                    </div>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                                            <span>{plan.duration_months} Months</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <PiggyBank className="w-4 h-4 text-zinc-400" />
                                            <span>Min: {formatCurrency(plan.min_amount)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <TrendingUp className="w-4 h-4 text-zinc-400" />
                                            <span>Max: {formatCurrency(plan.max_amount)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                                            <Lock className="w-4 h-4" />
                                            <span>Effective Yield: {plan.calculator.effectiveYield}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {selectedPlan && (
                    <motion.div variants={fadeUp}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscribe to {selectedPlan.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label>Monthly Amount</Label>
                                            <Input
                                                type="number"
                                                value={monthlyAmount}
                                                onChange={(e) => setMonthlyAmount(parseInt(e.target.value) || 0)}
                                                min={selectedPlan.min_amount}
                                                max={selectedPlan.max_amount}
                                            />
                                        </div>
                                        <div>
                                            <Label>Start Date</Label>
                                            <Input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Monthly Deposit</span>
                                            <span>{formatCurrency(monthlyAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Duration</span>
                                            <span>{selectedPlan.duration_months} months</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Interest Rate</span>
                                            <span>{selectedPlan.interest_rate}% p.a.</span>
                                        </div>
                                        {projection && (
                                            <>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span>Total Deposited</span>
                                                    <span>{formatCurrency(projection.totalDeposited)}</span>
                                                </div>
                                                <div className="flex justify-between font-medium border-t border-zinc-200 dark:border-zinc-700 pt-2">
                                                    <span>Maturity Value</span>
                                                    <span className="text-emerald-600">{formatCurrency(projection.maturityAmount)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {processing ? 'Processing...' : 'Subscribe Now'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </motion.div>
        </UserLayout>
    );
}
