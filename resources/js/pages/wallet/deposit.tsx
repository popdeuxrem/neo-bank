import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Wallet, 
    CreditCard, 
    Building2, 
    Bitcoin,
    ArrowLeft,
    Clock,
    CheckCircle,
    Upload,
    Copy,
    QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface DepositMethod {
    id: number;
    name: string;
    type: string;
    currencies: string[];
    minAmount: number;
    maxAmount: number;
    fee: { type: string; value: number };
    processingTime: string;
    instructions?: string;
}

interface Deposit {
    id: number;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
}

interface PageProps {
    methods: DepositMethod[];
    recentDeposits: Deposit[];
}

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

export default function WalletDeposit({ methods, recentDeposits }: PageProps) {
    const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(methods[0] || null);
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing } = useForm({
        method_id: methods[0]?.id,
        amount: '',
        currency: 'USD',
        proof: null as File | null,
        reference: '',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedMethod) {
            setData('method_id', selectedMethod.id);
        }
        setData('amount', amount);
        setData('currency', currency);
        post('/wallet/deposit');
    };

    const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getMethodIcon = (type: string) => {
        switch (type) {
            case 'automatic': return <CreditCard className="h-6 w-6" />;
            case 'manual': return <Building2 className="h-6 w-6" />;
            case 'crypto': return <Bitcoin className="h-6 w-6" />;
            default: return <Wallet className="h-6 w-6" />;
        }
    };

    const mockCryptoAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f4F2E1';

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
                            <h1 className="text-2xl font-bold">Add Funds</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Deposit money to your wallet</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={fadeUp} className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Deposit Method</CardTitle>
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
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    min={selectedMethod.minAmount}
                                                    max={selectedMethod.maxAmount}
                                                />
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    Min: {formatCurrency(selectedMethod.minAmount)} • Max: {formatCurrency(selectedMethod.maxAmount)}
                                                </p>
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

                                        {selectedMethod.type === 'manual' && (
                                            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4 space-y-3">
                                                <p className="font-medium">Bank Details</p>
                                                <div className="grid gap-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Bank Name:</span>
                                                        <span className="font-mono">Magnetiq Bank NA</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Account Number:</span>
                                                        <span className="font-mono">****4829</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Routing Number:</span>
                                                        <span className="font-mono">021000021</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">SWIFT:</span>
                                                        <span className="font-mono">MGNTUS33</span>
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <Label htmlFor="reference">Payment Reference</Label>
                                                    <Input
                                                        id="reference"
                                                        placeholder="Enter your payment reference"
                                                        value={data.reference}
                                                        onChange={(e) => setData('reference', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="proof">Upload Proof of Payment</Label>
                                                    <div className="mt-1 flex items-center justify-center w-full">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload className="w-8 h-8 mb-2 text-zinc-400" />
                                                                <p className="text-sm text-zinc-500">Click to upload receipt</p>
                                                            </div>
                                                            <input type="file" className="hidden" accept="image/*,.pdf" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedMethod.type === 'crypto' && (
                                            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4 space-y-4">
                                                <p className="font-medium">Send {currency} to this address</p>
                                                <div className="flex items-center gap-2">
                                                    <code className="flex-1 p-3 bg-white dark:bg-zinc-900 rounded-lg font-mono text-sm break-all">
                                                        {mockCryptoAddress}
                                                    </code>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => copyAddress(mockCryptoAddress)}
                                                    >
                                                        {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                <div className="flex justify-center">
                                                    <div className="bg-white p-4 rounded-lg">
                                                        <QrCode className="w-32 h-32" />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                                    ⚠️ Only send {currency} to this address. Other currencies may be lost.
                                                </p>
                                            </div>
                                        )}

                                        {amount && (
                                            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Amount:</span>
                                                    <span>{formatCurrency(parseFloat(amount), currency)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Fee:</span>
                                                    <span>- {formatCurrency(calculateFee(), currency)}</span>
                                                </div>
                                                <div className="flex justify-between font-medium border-t border-indigo-200 dark:border-indigo-800 mt-2 pt-2">
                                                    <span>You will receive:</span>
                                                    <span>{formatCurrency(calculateNet(), currency)}</span>
                                                </div>
                                            </div>
                                        )}

                                        <Button type="submit" className="w-full" disabled={processing || !amount}>
                                            {processing ? 'Processing...' : 'Continue'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Deposits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentDeposits.length === 0 ? (
                                    <p className="text-center text-zinc-500 py-4">No recent deposits</p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentDeposits.map((deposit) => (
                                            <div key={deposit.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                                <div>
                                                    <p className="font-medium">{formatCurrency(deposit.amount, deposit.currency)}</p>
                                                    <p className="text-xs text-zinc-500">
                                                        {new Date(deposit.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" className={
                                                    deposit.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    deposit.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-zinc-100 text-zinc-700'
                                                }>
                                                    {deposit.status}
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
