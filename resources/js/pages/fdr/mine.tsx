import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
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
    Target: LucideIcons.Target,
} as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface FdrSubscription {
    id: number;
    plan_name: string;
    plan_id: number;
    deposit_amount: number;
    start_date: string;
    maturity_date: string;
    interest_earned: number;
    projected_maturity: number;
    status: 'active' | 'matured' | 'cancelled';
    current_value: number;
    interest_rate: number;
    duration_months: number;
    days_remaining: number;
}

interface PageProps {
    subscriptions: FdrSubscription[];
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

export default function FdrMine({ subscriptions }: PageProps) {
    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    const totalDeposited = subscriptions.reduce((sum, s) => sum + s.deposit_amount, 0);
    const totalInterest = subscriptions.reduce((sum, s) => sum + s.interest_earned, 0);
    const totalValue = subscriptions.reduce((sum, s) => sum + s.current_value, 0);

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
                            <h1 className="text-2xl font-bold">My FDR Accounts</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Manage your Fixed Deposit Receipts</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Active FDR</p>
                                        <p className="text-3xl font-bold text-emerald-400">{activeCount}</p>
                                    </div>
                                    <div className="rounded-full bg-emerald-500/20 p-3">
                                        <Icons.PiggyBank className="h-6 w-6 text-emerald-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Deposited</p>
                                        <p className="text-3xl font-bold text-indigo-400">{formatCurrency(totalDeposited)}</p>
                                    </div>
                                    <div className="rounded-full bg-indigo-500/20 p-3">
                                        <Icons.DollarSign className="h-6 w-6 text-indigo-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Interest Earned</p>
                                        <p className="text-3xl font-bold text-amber-400">{formatCurrency(totalInterest)}</p>
                                    </div>
                                    <div className="rounded-full bg-amber-500/20 p-3">
                                        <Icons.TrendingUp className="h-6 w-6 text-amber-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Current Value</p>
                                        <p className="text-3xl font-bold text-violet-400">{formatCurrency(totalValue)}</p>
                                    </div>
                                    <div className="rounded-full bg-violet-500/20 p-3">
                                        <Icons.Activity className="h-6 w-6 text-violet-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">FDR Accounts</h2>
                        <Link href="/fdr">
                            <Button variant="outline" size="sm">
                                <Icons.PiggyBank className="w-4 h-4 mr-2" />
                                New FDR
                            </Button>
                        </Link>
                    </div>

                    {subscriptions.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Icons.PiggyBank className="h-12 w-12 text-zinc-400 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No FDR Accounts</h3>
                                <p className="text-zinc-500 text-center mb-4">Start investing with our Fixed Deposit plans</p>
                                <Link href="/fdr">
                                    <Button>View Plans</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {subscriptions.map((subscription) => (
                                <Link key={subscription.id} href={`/fdr/${subscription.id}`}>
                                    <Card className="hover:border-indigo-500/50 transition-all cursor-pointer h-full">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">{subscription.plan_name}</CardTitle>
                                                <Badge className={getStatusColor(subscription.status)}>
                                                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <Icons.DollarSign className="w-4 h-4" />
                                                        <span>{formatCurrency(subscription.deposit_amount)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <Icons.Calendar className="w-4 h-4" />
                                                        <span>{subscription.duration_months} months</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                                        <Icons.TrendingUp className="w-4 h-4" />
                                                        <span>{subscription.interest_rate}%</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">Current Value</span>
                                                        <span className="font-medium">{formatCurrency(subscription.current_value)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">Interest Earned</span>
                                                        <span className="text-emerald-600">+{formatCurrency(subscription.interest_earned)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span>Projected Maturity</span>
                                                        <span className="text-indigo-400">{formatCurrency(subscription.projected_maturity)}</span>
                                                    </div>
                                                </div>

                                                {subscription.status === 'active' && (
                                                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                                        <Icons.Clock className="w-4 h-4" />
                                                        <span>{subscription.days_remaining} days remaining</span>
                                                    </div>
                                                )}

                                                <div className="text-xs text-zinc-500">
                                                    Started: {formatDate(subscription.start_date)} | Maturity: {formatDate(subscription.maturity_date)}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icons.Target className="w-5 h-5 text-indigo-400" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <Link href="/fdr/calculator" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.TrendingUp className="w-4 h-4 mr-2" />
                                    Calculator
                                </Button>
                            </Link>
                            <Link href="/dps/mine" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.PiggyBank className="w-4 h-4 mr-2" />
                                    View DPS
                                </Button>
                            </Link>
                            <Link href="/loans/mine" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.DollarSign className="w-4 h-4 mr-2" />
                                    View Loans
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
