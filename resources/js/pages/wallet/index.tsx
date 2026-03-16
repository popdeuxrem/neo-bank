import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Wallet, 
    ArrowUpRight, 
    ArrowDownLeft, 
    CreditCard, 
    TrendingUp,
    Clock,
    ChevronRight,
    Plus,
    Minus
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface WalletData {
    id: number;
    balance: number;
    currency: string;
    status: string;
}

interface Transaction {
    id: number;
    type: string;
    amount: number;
    currency: string;
    description: string;
    status: string;
    createdAt: string;
}

interface Currency {
    code: string;
    balance: number;
    symbol: string;
}

interface PageProps {
    wallet: WalletData;
    transactions: Transaction[];
    currencies: Currency[];
}

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function WalletIndex({ wallet, transactions, currencies }: PageProps) {
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]?.code || 'USD');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'pending': return 'bg-amber-500';
            case 'frozen': return 'bg-rose-500';
            default: return 'bg-zinc-500';
        }
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'credit': return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />;
            case 'debit': return <ArrowUpRight className="h-4 w-4 text-rose-500" />;
            default: return <TrendingUp className="h-4 w-4 text-indigo-500" />;
        }
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
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-0 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-500/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-indigo-100">
                                    <Wallet className="h-4 w-4" />
                                    Total Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {formatCurrency(wallet.balance, wallet.currency)}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${getStatusColor(wallet.status)}`} />
                                    <span className="text-xs text-indigo-100 capitalize">{wallet.status}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    Add Funds
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <Link href="/wallet/deposit">
                                    <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                                        <Plus className="h-4 w-4" />
                                        Deposit Money
                                    </Button>
                                </Link>
                                <Link href="/wallet/withdraw">
                                    <Button variant="outline" className="w-full gap-2">
                                        <Minus className="h-4 w-4" />
                                        Withdraw
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Link href="/payments/local" className="w-full">
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Send Money
                                    </Button>
                                </Link>
                                <Link href="/bills" className="w-full">
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <Clock className="h-4 w-4" />
                                        Pay Bills
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card className="border border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg">Currency Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {currencies.map((currency) => (
                                    <button
                                        key={currency.code}
                                        onClick={() => setSelectedCurrency(currency.code)}
                                        className={`rounded-lg border p-4 text-left transition-all ${
                                            selectedCurrency === currency.code
                                                ? 'border-indigo-500 bg-indigo-500/5'
                                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{currency.code}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {currency.symbol}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 text-2xl font-bold">
                                            {formatCurrency(currency.balance, currency.code)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card className="border border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Recent Transactions</CardTitle>
                            <Link href="/transactions">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {transactions.length === 0 ? (
                                <div className="py-8 text-center text-zinc-500">
                                    <Wallet className="mx-auto h-12 w-12 opacity-20" />
                                    <p className="mt-2">No transactions yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {transactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                    {getTransactionIcon(transaction.type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{transaction.description}</p>
                                                    <p className="text-sm text-zinc-500">
                                                        {formatDate(transaction.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${
                                                    transaction.type === 'credit' 
                                                        ? 'text-emerald-600' 
                                                        : 'text-rose-600'
                                                }`}>
                                                    {transaction.type === 'credit' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount, transaction.currency)}
                                                </p>
                                                <Badge 
                                                    variant="secondary" 
                                                    className={`text-xs ${
                                                        transaction.status === 'completed' 
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                            : transaction.status === 'pending'
                                                            ? 'bg-amb:bg-amber-900/30 dark:text-amber-400'
                                                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    {transaction.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
