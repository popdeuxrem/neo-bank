import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    ArrowLeft, 
    Search, 
    User, 
    Building2,
    CheckCircle,
    ChevronRight,
    Clock,
    Shield,
    Wallet
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

interface Account {
    id: number;
    name: string;
    number: string;
    balance: number;
    currency: string;
    type: string;
}

interface SavedRecipient {
    id: number;
    name: string;
    account_number: string;
    bank_name: string;
}

interface TransferFees {
    flat: number;
    percentage: number;
    min: number;
    max: number;
}

interface PageProps {
    accounts: Account[];
    savedRecipients: SavedRecipient[];
    transferFees: TransferFees;
    dailyLimitRemaining: number;
}

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

export default function PaymentsLocal({ 
    accounts, 
    savedRecipients, 
    transferFees,
    dailyLimitRemaining 
}: PageProps) {
    const [step, setStep] = useState(1);
    const [selectedRecipient, setSelectedRecipient] = useState<SavedRecipient | null>(null);
    const [isNewRecipient, setIsNewRecipient] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        account_id: accounts[0]?.id || '',
        recipient_name: '',
        account_number: '',
        routing_number: '',
        bank_name: '',
        amount: '',
        currency: 'USD',
        memo: '',
        save_recipient: false,
        passcode: '',
    });

    const calculateFee = () => {
        if (!data.amount) return 0;
        const amount = parseFloat(data.amount);
        const calculated = transferFees.flat + (amount * transferFees.percentage);
        return Math.max(calculated, transferFees.min);
    };

    const calculateTotal = () => {
        if (!data.amount) return 0;
        return parseFloat(data.amount) + calculateFee();
    };

    const handleRecipientSelect = (recipient: SavedRecipient) => {
        setSelectedRecipient(recipient);
        setIsNewRecipient(false);
        setData({
            ...data,
            recipient_name: recipient.name,
            account_number: recipient.account_number,
            bank_name: recipient.bank_name,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 4) {
            setStep(step + 1);
            return;
        }
        post('/payments/local', {
            onSuccess: () => setShowSuccess(true),
        });
    };

    const recipientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        // Filter saved recipients
    };

    const steps = [
        { num: 1, title: 'Recipient' },
        { num: 2, title: 'Amount' },
        { num: 3, title: 'Review' },
        { num: 4, title: 'Confirm' },
    ];

    if (showSuccess) {
        return (
            <UserLayout>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center min-h-[60vh]"
                >
                    <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Payment Sent!</h2>
                        <p className="text-zinc-500 mb-6">
                            {formatCurrency(parseFloat(data.amount))} has been sent to {data.recipient_name}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link href="/payments/history">
                                <Button variant="outline">View Details</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button>Back to Dashboard</Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={fadeUp}
                className="space-y-6"
            >
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/payments">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Send Money</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Local Transfer</p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-8">
                    {steps.map((s, i) => (
                        <div key={s.num} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium ${
                                step >= s.num 
                                    ? 'bg-indigo-500 text-white' 
                                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                            }`}>
                                {s.num}
                            </div>
                            <span className={`ml-2 text-sm ${
                                step >= s.num ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'
                            }`}>
                                {s.title}
                            </span>
                            {i < steps.length - 1 && (
                                <ChevronRight className="w-4 h-4 mx-2 text-zinc-300" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit}>
                                    {step === 1 && (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                                <Input 
                                                    placeholder="Search saved recipients..." 
                                                    className="pl-10"
                                                    onChange={recipientSearch}
                                                />
                                            </div>

                                            {savedRecipients.length > 0 && (
                                                <div className="space-y-2">
                                                    <Label>Saved Recipients</Label>
                                                    {savedRecipients.map((recipient) => (
                                                        <button
                                                            key={recipient.id}
                                                            type="button"
                                                            onClick={() => handleRecipientSelect(recipient)}
                                                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                                                selectedRecipient?.id === recipient.id
                                                                    ? 'border-indigo-500 bg-indigo-500/5'
                                                                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                                                            }`}
                                                        >
                                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                                <User className="w-5 h-5 text-indigo-500" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-medium">{recipient.name}</p>
                                                                <p className="text-xs text-zinc-500">{recipient.bank_name} •••• {recipient.account_number.slice(-4)}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="text-center py-4">
                                                <Button 
                                                    type="button"
                                                    variant="ghost" 
                                                    onClick={() => {
                                                        setIsNewRecipient(true);
                                                        setSelectedRecipient(null);
                                                        setData({
                                                            ...data,
                                                            recipient_name: '',
                                                            account_number: '',
                                                            routing_number: '',
                                                            bank_name: '',
                                                        });
                                                    }}
                                                >
                                                    + Add New Recipient
                                                </Button>
                                            </div>

                                            {isNewRecipient && (
                                                <div className="space-y-4 pt-4 border-t">
                                                    <div>
                                                        <Label>Recipient Name</Label>
                                                        <Input
                                                            value={data.recipient_name}
                                                            onChange={(e) => setData('recipient_name', e.target.value)}
                                                            placeholder="Full name"
                                                        />
                                                    </div>
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div>
                                                            <Label>Account Number</Label>
                                                            <Input
                                                                value={data.account_number}
                                                                onChange={(e) => setData('account_number', e.target.value)}
                                                                placeholder="Account number"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Routing Number</Label>
                                                            <Input
                                                                value={data.routing_number}
                                                                onChange={(e) => setData('routing_number', e.target.value)}
                                                                placeholder="Routing number"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Bank Name</Label>
                                                        <Input
                                                            value={data.bank_name}
                                                            onChange={(e) => setData('bank_name', e.target.value)}
                                                            placeholder="Bank name"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="save_recipient"
                                                            checked={data.save_recipient}
                                                            onChange={(e) => setData('save_recipient', e.target.checked)}
                                                            className="rounded"
                                                        />
                                                        <Label htmlFor="save_recipient" className="text-sm font-normal">
                                                            Save recipient for future transfers
                                                        </Label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-4">
                                            <div>
                                                <Label>From Account</Label>
                                                <select
                                                    className="w-full h-10 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2"
                                                    value={data.account_id}
                                                    onChange={(e) => setData('account_id', e.target.value)}
                                                >
                                                    {accounts.map((account) => (
                                                        <option key={account.id} value={account.id}>
                                                            {account.name} - {formatCurrency(account.balance)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label>Amount</Label>
                                                <Input
                                                    type="number"
                                                    value={data.amount}
                                                    onChange={(e) => setData('amount', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <Label>Currency</Label>
                                                <select
                                                    className="w-full h-10 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2"
                                                    value={data.currency}
                                                    onChange={(e) => setData('currency', e.target.value)}
                                                >
                                                    <option value="USD">USD - US Dollar</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label>Memo (Optional)</Label>
                                                <Input
                                                    value={data.memo}
                                                    onChange={(e) => setData('memo', e.target.value)}
                                                    placeholder="What's this for?"
                                                />
                                            </div>

                                            {data.amount && (
                                                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-4 space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">Transfer Fee:</span>
                                                        <span>{formatCurrency(calculateFee())}</span>
                                                    </div>
                                                    <div className="flex justify-between font-medium border-t border-zinc-200 dark:border-zinc-700 pt-2">
                                                        <span>Total Debit:</span>
                                                        <span>{formatCurrency(calculateTotal())}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                                <Shield className="w-4 h-4" />
                                                <span>Daily limit remaining: {formatCurrency(dailyLimitRemaining)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-4">
                                            <h3 className="font-medium">Review Transfer Details</h3>
                                            
                                            <div className="rounded-lg border p-4 space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">To:</span>
                                                    <span className="font-medium">{data.recipient_name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Account:</span>
                                                    <span className="font-mono">••••{data.account_number.slice(-4)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Bank:</span>
                                                    <span>{data.bank_name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Amount:</span>
                                                    <span>{formatCurrency(parseFloat(data.amount) || 0)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-500">Fee:</span>
                                                    <span>{formatCurrency(calculateFee())}</span>
                                                </div>
                                                <div className="flex justify-between font-medium border-t border-zinc-200 pt-2">
                                                    <span>Total:</span>
                                                    <span>{formatCurrency(calculateTotal())}</span>
                                                </div>
                                                {data.memo && (
                                                    <div className="flex justify-between pt-2">
                                                        <span className="text-zinc-500">Memo:</span>
                                                        <span>{data.memo}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {step === 4 && (
                                        <div className="space-y-4">
                                            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Shield className="w-5 h-5 text-indigo-500" />
                                                    <span className="font-medium">Confirm with Passcode</span>
                                                </div>
                                                <Label>Enter your 6-digit passcode</Label>
                                                <Input
                                                    type="password"
                                                    value={data.passcode}
                                                    onChange={(e) => setData('passcode', e.target.value)}
                                                    maxLength={6}
                                                    className="font-mono text-center tracking-widest text-lg mt-2"
                                                    placeholder="••••••"
                                                />
                                                {errors.passcode && (
                                                    <p className="text-rose-500 text-sm mt-2">{errors.passcode}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-6">
                                        {step > 1 && (
                                            <Button 
                                                type="button"
                                                variant="outline" 
                                                onClick={() => setStep(step - 1)}
                                            >
                                                Back
                                            </Button>
                                        )}
                                        <Button 
                                            type="submit" 
                                            className="flex-1"
                                            disabled={processing}
                                        >
                                            {processing 
                                                ? 'Processing...' 
                                                : step === 4 
                                                    ? 'Confirm & Send' 
                                                    : 'Continue'
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Transfer Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Recipient</span>
                                    <span className="font-medium truncate max-w-[120px]">
                                        {data.recipient_name || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Amount</span>
                                    <span className="font-medium">
                                        {data.amount ? formatCurrency(parseFloat(data.amount)) : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Fee</span>
                                    <span>{formatCurrency(calculateFee())}</span>
                                </div>
                                <div className="flex justify-between font-medium border-t pt-3">
                                    <span>Total</span>
                                    <span>{formatCurrency(calculateTotal())}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </UserLayout>
    );
}
