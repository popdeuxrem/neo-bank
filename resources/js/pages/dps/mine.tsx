import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    PiggyBank: LucideIcons.PiggyBank,
    ArrowLeft: LucideIcons.ArrowLeft,
    TrendingUp: LucideIcons.TrendingUp,
    Calendar: LucideIcons.Calendar,
    DollarSign: LucideIcons.DollarSign,
    Clock: LucideIcons.Clock,
    ChevronRight: LucideIcons.ChevronRight,
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

interface DpsSubscription {
    id: number;
    plan_name: string;
    plan_id: number;
    monthly_amount: number;
    start_date: string;
    maturity_date: string;
    total_deposited: number;
    interest_earned: number;
    projected_maturity: number;
    status: 'active' | 'matured' | 'cancelled';
    next_payment_date: string;
    progress_percentage: number;
    installments_completed: number;
    total_installments: number;
}

interface PageProps {
    subscriptions: DpsSubscription[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'matured': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        default: return 'bg-zinc-500/10 text-zinc-400';
    }
};

export default function DpsMine({ subscriptions }: PageProps) {
    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    const totalInvested = subscriptions.reduce((sum, s) => sum + s.total_deposited, 0);
    const totalInterest = subscriptions.reduce((sum, s) => sum + s.interest_earned, 0);

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
                            <h1 className="text-2xl font-bold">My DPS Accounts</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Manage your Deposit Pension Scheme accounts</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Active DPS</p>
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
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Invested</p>
                                        <p className="text-3xl font-bold text-indigo-400">{formatCurrency(totalInvested)}</p>
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
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">DPS Accounts</h2>
                        <Link href="/dps">
                            <Button variant="outline" size="sm">
                                <Icons.PiggyBank className="w-4 h-4 mr-2" />
                                New DPS
                            </Button>
                        </Link>
                    </div>

                    {subscriptions.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Icons.PiggyBank className="h-12 w-12 text-zinc-400 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No DPS Accounts</h3>
                                <p className="text-zinc-500 text-center mb-4">Start your savings journey with our Deposit Pension Scheme</p>
                                <Link href="/dps">
                                    <Button>View Plans</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {subscriptions.map((subscription) => (
                                <Link key={subscription.id} href={`/dps/${subscription.id}`}>
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
                                                        <span>{formatCurrency(subscription.monthly_amount)}/mo</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <Icons.Calendar className="w-4 h-4" />
                                                        <span>{subscription.start_date}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">Deposited</span>
                                                        <span className="font-medium">{formatCurrency(subscription.total_deposited)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">Interest Earned</span>
                                                        <span className="text-emerald-600 dark:text-emerald-400">+{formatCurrency(subscription.interest_earned)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span>Projected Maturity</span>
                                                        <span className="text-indigo-400">{formatCurrency(subscription.projected_maturity)}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-1.5 text-zinc-500">
                                                            <Icons.Activity className="w-4 h-4" />
                                                            <span>Progress</span>
                                                        </div>
                                                        <span>{subscription.progress_percentage}%</span>
                                                    </div>
                                                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${subscription.progress_percentage}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-zinc-500">
                                                        {subscription.installments_completed} of {subscription.total_installments} installments completed
                                                    </p>
                                                </div>

                                                {subscription.status === 'active' && (
                                                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                                        <Icons.Clock className="w-4 h-4" />
                                                        <span>Next payment: {subscription.next_payment_date}</span>
                                                    </div>
                                                )}
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
                            <Link href="/dps/calculator" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.TrendingUp className="w-4 h-4 mr-2" />
                                    Calculator
                                </Button>
                            </Link>
                            <Link href="/loans/mine" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.DollarSign className="w-4 h-4 mr-2" />
                                    View Loans
                                </Button>
                            </Link>
                            <Link href="/fdr/mine" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.TrendingUp className="w-4 h-4 mr-2" />
                                    View FDR
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
