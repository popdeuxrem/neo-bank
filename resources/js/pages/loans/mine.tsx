import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
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
    CreditCard: LucideIcons.CreditCard,
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
    end_date: string;
    total_paid: number;
    total_outstanding: number;
    installments_paid: number;
    installments_remaining: number;
    status: 'active' | 'completed' | 'defaulted' | 'pending';
    next_payment_date: string;
    next_payment_amount: number;
    purpose: string;
}

interface PageProps {
    loans: Loan[];
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

export default function LoansMine({ loans }: PageProps) {
    const activeLoans = loans.filter(l => l.status === 'active');
    const totalOutstanding = loans.reduce((sum, l) => sum + l.total_outstanding, 0);
    const totalEmi = activeLoans.reduce((sum, l) => sum + l.emi_amount, 0);

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
                            <h1 className="text-2xl font-bold">My Loans</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Manage your loan accounts</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Active Loans</p>
                                        <p className="text-3xl font-bold text-emerald-400">{activeLoans.length}</p>
                                    </div>
                                    <div className="rounded-full bg-emerald-500/20 p-3">
                                        <Icons.Banknote className="h-6 w-6 text-emerald-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border-rose-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Outstanding</p>
                                        <p className="text-3xl font-bold text-rose-400">{formatCurrency(totalOutstanding)}</p>
                                    </div>
                                    <div className="rounded-full bg-rose-500/20 p-3">
                                        <Icons.DollarSign className="h-6 w-6 text-rose-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Monthly EMI</p>
                                        <p className="text-3xl font-bold text-indigo-400">{formatCurrency(totalEmi)}</p>
                                    </div>
                                    <div className="rounded-full bg-indigo-500/20 p-3">
                                        <Icons.Calendar className="h-6 w-6 text-indigo-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Loan Accounts</h2>
                        <Link href="/loans/apply">
                            <Button>
                                <Icons.Banknote className="w-4 h-4 mr-2" />
                                Apply for Loan
                            </Button>
                        </Link>
                    </div>

                    {loans.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Icons.Banknote className="h-12 w-12 text-zinc-400 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No Loans</h3>
                                <p className="text-zinc-500 text-center mb-4">You don't have any active loans yet</p>
                                <Link href="/loans/apply">
                                    <Button>Apply Now</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {loans.map((loan) => (
                                <Link key={loan.id} href={`/loans/${loan.id}`}>
                                    <Card className="hover:border-indigo-500/50 transition-all cursor-pointer h-full">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">{loan.product_name}</CardTitle>
                                                <Badge className={getStatusColor(loan.status)}>
                                                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <Icons.DollarSign className="w-4 h-4" />
                                                        <span>{formatCurrency(loan.principal_amount)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                                        <Icons.Calendar className="w-4 h-4" />
                                                        <span>{loan.tenure_months} months</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">EMI Amount</span>
                                                        <span className="font-medium">{formatCurrency(loan.emi_amount)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">Total Paid</span>
                                                        <span>{formatCurrency(loan.total_paid)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">Outstanding</span>
                                                        <span className="text-rose-600">{formatCurrency(loan.total_outstanding)}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-1.5 text-zinc-500">
                                                            <Icons.Activity className="w-4 h-4" />
                                                            <span>Progress</span>
                                                        </div>
                                                        <span>{loan.installments_paid}/{loan.installments_remaining + loan.installments_paid}</span>
                                                    </div>
                                                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(loan.installments_paid / (loan.installments_paid + loan.installments_remaining)) * 100}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                                        />
                                                    </div>
                                                </div>

                                                {loan.status === 'active' && (
                                                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                                        <Icons.Clock className="w-4 h-4" />
                                                        <span>Next: {formatCurrency(loan.next_payment_amount)} on {formatDate(loan.next_payment_date)}</span>
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
                                <Icons.FileText className="w-5 h-5 text-indigo-400" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <Link href="/loans/calculator" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.TrendingUp className="w-4 h-4 mr-2" />
                                    Loan Calculator
                                </Button>
                            </Link>
                            <Link href="/loans/emi" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.Calendar className="w-4 h-4 mr-2" />
                                    EMI Schedule
                                </Button>
                            </Link>
                            <Link href="/dps/mine" className="flex-1 min-w-[200px]">
                                <Button variant="outline" className="w-full justify-start">
                                    <Icons.Banknote className="w-4 h-4 mr-2" />
                                    View DPS
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
