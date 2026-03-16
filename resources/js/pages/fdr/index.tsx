import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    TrendingUp: LucideIcons.TrendingUp,
    PiggyBank: LucideIcons.PiggyBank,
    Lock: LucideIcons.Lock,
    ChevronRight: LucideIcons.ChevronRight,
    Plus: LucideIcons.Plus,
    Calendar: LucideIcons.Calendar,
    DollarSign: LucideIcons.DollarSign,
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
    description: string;
    status: string;
    compounding: 'monthly' | 'quarterly' | 'annually';
    calculator: {
        maturityAmount: number;
        interestEarned: number;
        effectiveYield: number;
    };
}

interface FdrSubscription {
    id: number;
    plan: FdrPlan;
    deposit_amount: number;
    start_date: string;
    maturity_date: string;
    interest_earned: number;
    status: string;
}

interface PageProps {
    plans: FdrPlan[];
    mySubscriptions: FdrSubscription[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export default function FdrIndex({ plans, mySubscriptions }: PageProps) {
    const [selectedPlan, setSelectedPlan] = useState<FdrPlan | null>(plans[0] || null);
    const [depositAmount, setDepositAmount] = useState(plans[0]?.min_amount || 1000);
    const [showCalculator, setShowCalculator] = useState(false);

    const { data, setData, post, processing } = useForm({
        plan_id: plans[0]?.id,
        account_id: '',
        deposit_amount: plans[0]?.min_amount || 1000,
        start_date: new Date().toISOString().split('T')[0],
    });

    const calculateProjection = () => {
        if (!selectedPlan) return null;
        const months = selectedPlan.duration_months;
        const rate = selectedPlan.interest_rate / 100;
        const n = 12; 
        const amount = depositAmount * Math.pow(1 + rate/n, n * months/12);
        const interest = amount - depositAmount;
        return {
            totalDeposited: depositAmount,
            interest,
            maturityAmount: amount,
            effectiveYield: ((amount - depositAmount) / depositAmount) * 100,
        };
    };

    const projection = calculateProjection();

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPlan) {
            setData('plan_id', selectedPlan.id);
            setData('deposit_amount', depositAmount);
        }
        post('/fdr/subscribe');
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
                                <Icons.ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Fixed Deposit (FDR)</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Secure your funds with guaranteed returns</p>
                        </div>
                    </div>
                </motion.div>

                {mySubscriptions.length > 0 && (
                    <motion.div variants={fadeUp}>
                        <h2 className="text-lg font-semibold mb-4">My FDR Accounts</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mySubscriptions.map((subscription) => (
                                <Link key={subscription.id} href={`/fdr/${subscription.id}`}>
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
                                                    <span className="text-zinc-500">Deposit</span>
                                                    <span className="font-medium">{formatCurrency(subscription.deposit_amount)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-500">Interest Earned</span>
                                                    <span className="text-emerald-600">+{formatCurrency(subscription.interest_earned)}</span>
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
                                <Icons.TrendingUp className="w-4 h-4 mr-2" />
                                Calculator
                            </Button>
                    </div>

                    {showCalculator && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>FDR Calculator</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Deposit Amount</Label>
                                            <Input
                                                type="number"
                                                value={depositAmount}
                                                onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
                                                min={selectedPlan?.min_amount || 100}
                                                max={selectedPlan?.max_amount || 100000}
                                            />
                                        </div>
                                        <div>
                                            <Label>Plan: {selectedPlan?.name}</Label>
                                            <p className="text-sm text-zinc-500">{selectedPlan?.duration_months} months | {selectedPlan?.compounding}</p>
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
                                    setDepositAmount(plan.min_amount);
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
                                            <Icons.ChevronRight className="w-4 h-4 text-zinc-400" />
                                            <span>{plan.duration_months} Months</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Icons.PiggyBank className="w-4 h-4 text-zinc-400" />
                                            <span>Min: {formatCurrency(plan.min_amount)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Icons.TrendingUp className="w-4 h-4 text-zinc-400" />
                                            <span>Max: {formatCurrency(plan.max_amount)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                                            <Icons.Lock className="w-4 h-4" />
                                            <span>Compounding: {plan.compounding}</span>
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
                                            <Label>Deposit Amount</Label>
                                            <Input
                                                type="number"
                                                value={depositAmount}
                                                onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
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
                                            <span>Deposit Amount</span>
                                            <span>{formatCurrency(depositAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Duration</span>
                                            <span>{selectedPlan.duration_months} months</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Interest Rate</span>
                                            <span>{selectedPlan.interest_rate}% p.a.</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Compounding</span>
                                            <span className="capitalize">{selectedPlan.compounding}</span>
                                        </div>
                                        {projection && (
                                            <>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span>Total Interest</span>
                                                    <span className="text-emerald-600">+{formatCurrency(projection.interest)}</span>
                                                </div>
                                                <div className="flex justify-between font-medium border-t border-zinc-200 dark:border-zinc-700 pt-2">
                                                    <span>Maturity Value</span>
                                                    <span className="text-emerald-600">{formatCurrency(projection.maturityAmount)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {processing ? 'Processing...' : 'Open FD Account'}
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
