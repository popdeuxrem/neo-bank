import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Wallet, 
    CreditCard, 
    Building2, 
    Bitcoin,
    ArrowLeft,
    Lock,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface WithdrawalMethod {
    id: number;
    name: string;
    type: string;
    currencies: string[];
    minAmount: number;
    maxAmount: number;
    fee: { type: string; value: number };
    processingTime: string;
}

interface Wallet {
    balance: number;
    currency: string;
}

interface Withdrawal {
    id: number;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
}

interface PageProps {
    methods: WithdrawalMethod[];
    wallet: Wallet;
    recentWithdrawals: Withdrawal[];
}

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

export default function WalletWithdraw({ methods, wallet, recentWithdrawals }: PageProps) {
    const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(methods[0] || null);
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [showPasscode, setShowPasscode] = useState(false);
    const [passcode, setPasscode] = useState('');

    const { data, setData, post, processing } = useForm({
        method_id: methods[0]?.id,
        amount: '',
        currency: 'USD',
        account_details: {} as Record<string, string>,
        passcode: '',
    });

    const calculateFee = () => {
        if (!selectedMethod || !amount) return 0;
        const fee = selectedMethod.fee;
        if (fee.type === 'percentage') {
            return (parseFloat(amount) * fee.value) / 100;
        }
        return fee.value;
    };

    const calculateNet = () => {
        if (!amount) return 0;
        return parseFloat(amount) - calculateFee();
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
        if (value && parseFloat(value) > wallet.balance) {
            // Handle insufficient balance warning
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!showPasscode) {
            setShowPasscode(true);
            return;
        }
        if (selectedMethod) {
            setData('method_id', selectedMethod.id);
        }
        setData('amount', amount);
        setData('currency', currency);
        setData('passcode', passcode);
        post('/wallet/withdraw');
    };

    const getMethodIcon = (type: string) => {
        switch (type) {
            case 'bank': return <Building2 className="h-6 w-6" />;
            case 'paypal': return <CreditCard className="h-6 w-6" />;
            case 'crypto': return <Bitcoin className="h-6 w-6" />;
            default: return <Wallet className="h-6 w-6" />;
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
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/wallet">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Withdraw</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Withdraw funds from your wallet</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={fadeUp} className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-emerald-600">
                                    {formatCurrency(wallet.balance, wallet.currency)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Select Withdrawal Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                                    {methods.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method)}
                                            className={`rounded-lg border-2 p-4 text-center transition-all ${
                                                selectedMethod?.id === method.id
                                                    ? 'border-indigo-500 bg-indigo-500/5'
                                                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                                            }`}
                                        >
                                            <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                                                selectedMethod?.id === method.id
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-zinc-100 dark:bg-zinc-800'
                                            }`}>
                                                {getMethodIcon(method.type)}
                                            </div>
                                            <p className="font-medium">{method.name}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{method.processingTime}</p>
                                        </button>
                                    ))}
                                </div>

                                {selectedMethod && (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor="amount">Amount</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={amount}
                                                    onChange={(e) => handleAmountChange(e.target.value)}
                                                    min={selectedMethod.minAmount}
                                                    max={selectedMethod.maxAmount}
                                                />
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    Min: {formatCurrency(selectedMethod.minAmount)} • Max: {formatCurrency(selectedMethod.maxAmount)}
                                                </p>
                                                {amount && parseFloat(amount) > wallet.balance && (
                                                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Insufficient balance
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="currency">Currency</Label>
                                                <select
                                                    id="currency"
                                                    className="w-full h-10 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2"
                                                    value={currency}
                                                    onChange={(e) => setCurrency(e.target.value)}
                                                >
                                                    {selectedMethod.currencies.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {selectedMethod.type === 'bank' && (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <Label htmlFor="bankName">Bank Name</Label>
                                                    <Input id="bankName" placeholder="Bank name" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="accountNumber">Account Number</Label>
                                                    <Input id="accountNumber" placeholder="Account number" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="routingNumber">Routing Number</Label>
                                                    <Input id="routingNumber" placeholder="Routing number" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                                                    <Input id="accountHolder" placeholder="Name on account" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedMethod.type === 'paypal' && (
                                            <div>
                                                <Label htmlFor="paypalEmail">PayPal Email</Label>
                                                <Input id="paypalEmail" type="email" placeholder="your@email.com" />
                                            </div>
                                        )}

                                        {selectedMethod.type === 'crypto' && (
                                            <div>
                                                <Label htmlFor="cryptoAddress">Wallet Address</Label>
                                                <Input id="cryptoAddress" placeholder="0x..." />
                                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                    ⚠️ Ensure the address supports {currency}
                                                </p>
                                            </div>
                                        )}

                                        {showPasscode && (
                                            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4">
                                                <Label htmlFor="passcode">Enter Passcode</Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Lock className="h-5 w-5 text-zinc-400" />
                                                    <Input
                                                        id="passcode"
                                                        type="password"
                                                        placeholder="••••"
                                                        value={passcode}
                                                        onChange={(e) => setPasscode(e.target.value)}
                                                        maxLength={6}
                                                        className="font-mono text-center tracking-widest"
                                                    />
                                                </div>
                                                <p className="text-xs text-zinc-500 mt-2">
                                                    Required for withdrawals
                                                </p>
                                            </div>
                                        )}

                                        {amount && (
                                            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Amount:</span>
                                                    <span>{formatCurrency(parseFloat(amount), currency)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Fee:</span>
                                                    <span>- {formatCurrency(calculateFee(), currency)}</span>
                                                </div>
                                                <div className="flex justify-between font-medium border-t border-zinc-200 dark:border-zinc-700 mt-2 pt-2">
                                                    <span>You will receive:</span>
                                                    <span>{formatCurrency(calculateNet(), currency)}</span>
                                                </div>
                                            </div>
                                        )}

                                        <Button 
                                            type="submit" 
                                            className="w-full" 
                                            disabled={!!processing || !amount || !!(amount && parseFloat(amount) > wallet.balance)}
                                        >
                                            {processing ? 'Processing...' : showPasscode ? 'Confirm Withdrawal' : 'Continue'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Withdrawals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentWithdrawals.length === 0 ? (
                                    <p className="text-center text-zinc-500 py-4">No recent withdrawals</p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentWithdrawals.map((withdrawal) => (
                                            <div key={withdrawal.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                                <div>
                                                    <p className="font-medium">{formatCurrency(withdrawal.amount, withdrawal.currency)}</p>
                                                    <p className="text-xs text-zinc-500">
                                                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" className={
                                                    withdrawal.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    withdrawal.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-zinc-100 text-zinc-700'
                                                }>
                                                    {withdrawal.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </UserLayout>
    );
}
