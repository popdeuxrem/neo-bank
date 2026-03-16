import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    ArrowLeft,
    ArrowRight,
    Check,
    Upload,
    X,
    Globe,
    Building2,
    Clock,
    Shield,
    FileText,
    Lock,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';
import { fakeAccounts } from '@/lib/fake-data';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'JP', name: 'Japan' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'SG', name: 'Singapore' },
];

const transferPurposes = [
    { value: 'family_support', label: 'Family Support' },
    { value: 'salary_payment', label: 'Salary Payment' },
    { value: 'business_payment', label: 'Business Payment' },
    { value: 'investment', label: 'Investment' },
    { value: 'property_purchase', label: 'Property Purchase' },
    { value: 'education', label: 'Education' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'travel', label: 'Travel' },
    { value: 'other', label: 'Other' },
];

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

const exchangeRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CHF: 0.88,
    CAD: 1.36,
    AUD: 1.53,
    CNY: 7.24,
};

interface SavedRecipient {
    id: string;
    name: string;
    iban: string;
    swift: string;
    bankName: string;
    country: string;
}

const savedRecipients: SavedRecipient[] = [
    { id: '1', name: 'Emma Watson', iban: 'GB82WEST12345698765432', swift: 'WESTGB2L', bankName: 'Barclays Bank UK', country: 'GB' },
    { id: '2', name: 'David Mueller', iban: 'DE89370400440532013000', swift: 'DEUTDEFF', bankName: 'Deutsche Bank', country: 'DE' },
    { id: '3', name: 'Sophie Martin', iban: 'FR7630006000011234567890189', swift: 'BNPAFRPP', bankName: 'BNP Paribas', country: 'FR' },
];

export default function InternationalTransfer() {
    const [step, setStep] = useState(1);
    const [countdown, setCountdown] = useState(300);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState<SavedRecipient | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [exchangeRate, setExchangeRate] = useState(exchangeRates.EUR);

    const { data, setData, post, processing, errors } = useForm({
        fromAccount: fakeAccounts[0]?.id || '',
        recipientName: '',
        recipientCountry: '',
        recipientIban: '',
        recipientSwift: '',
        bankName: '',
        amount: '',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        purpose: '',
        reference: '',
        saveRecipient: false,
        passcode: '',
    });

    useEffect(() => {
        if (step === 2 && countdown > 0) {
            const timer = setInterval(() => setCountdown(c => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [step, countdown]);

    useEffect(() => {
        const rate = exchangeRates[data.fromCurrency] / exchangeRates[data.toCurrency];
        setExchangeRate(rate);
    }, [data.fromCurrency, data.toCurrency]);

    const convertedAmount = data.amount ? parseFloat(data.amount) * exchangeRate : 0;
    const transferFee = data.amount ? Math.max(15, parseFloat(data.amount) * 0.008) : 0;

    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRecipientSelect = (recipient: SavedRecipient) => {
        setSelectedRecipient(recipient);
        setData({
            ...data,
            recipientName: recipient.name,
            recipientIban: recipient.iban,
            recipientSwift: recipient.swift,
            bankName: recipient.bankName,
            recipientCountry: recipient.country,
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }
            setUploadedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
            setCountdown(300);
            return;
        }

        if (!data.passcode) {
            toast.error('Please enter your passcode');
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        setShowSuccess(true);
        toast.success('International transfer initiated successfully!');
    };

    const resetForm = () => {
        setStep(1);
        setShowSuccess(false);
        setSelectedRecipient(null);
        setUploadedFile(null);
        setCountdown(300);
        setData({
            fromAccount: fakeAccounts[0]?.id || '',
            recipientName: '',
            recipientCountry: '',
            recipientIban: '',
            recipientSwift: '',
            bankName: '',
            amount: '',
            fromCurrency: 'USD',
            toCurrency: 'EUR',
            purpose: '',
            reference: '',
            saveRecipient: false,
            passcode: '',
        });
    };

    if (showSuccess) {
        return (
            <UserLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center max-w-md"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="mx-auto w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"
                        >
                            <Check className="w-12 h-12 text-emerald-400" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">Transfer Initiated!</h2>
                        <p className="text-zinc-400 mb-6">
                            Your international transfer of {formatCurrency(parseFloat(data.amount) || 0, data.fromCurrency)} to {data.recipientName} has been initiated.
                        </p>
                        <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 text-left">
                            <div className="flex justify-between mb-2">
                                <span className="text-zinc-400 text-sm">Reference</span>
                                <span className="text-white font-mono">INT-{Date.now().toString().slice(-8)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-zinc-400 text-sm">Estimated arrival</span>
                                <span className="text-white">2-4 business days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400 text-sm">Status</span>
                                <Badge className="bg-amber-500/20 text-amber-400">Processing</Badge>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={resetForm} className="border-white/10">
                                Send Another
                            </Button>
                            <Button className="bg-indigo-500 hover:bg-indigo-600">
                                View Details
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                                            step >= s ? 'bg-indigo-500 text-white' : 'bg-white/10 text-zinc-500'
                                        }`}>
                                            {step > s ? <Check className="h-4 w-4" /> : s}
                                        </div>
                                        {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-indigo-500' : 'bg-white/10'}`}></div>}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-mono">{formatCountdown(countdown)}</span>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h2 className="text-lg font-semibold text-white mb-4">Recipient Details</h2>
                                        <div className="space-y-3 mb-6">
                                            {savedRecipients.map((r) => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => handleRecipientSelect(r)}
                                                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                                                        selectedRecipient?.id === r.id
                                                            ? 'border-indigo-500 bg-indigo-500/10'
                                                            : 'border-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                                        {r.name[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-white">{r.name}</p>
                                                        <p className="text-xs text-zinc-500">{r.bankName} • {countries.find(c => c.code === r.country)?.name}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-white/5 text-zinc-400">
                                                        {r.country}
                                                    </Badge>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative flex items-center py-2">
                                            <div className="flex-1 border-t border-white/10" />
                                            <span className="px-3 text-xs text-zinc-500">or enter manually</span>
                                            <div className="flex-1 border-t border-white/10" />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid gap-3">
                                                <div>
                                                    <Label className="text-zinc-400">Recipient Name</Label>
                                                    <Input
                                                        placeholder="Full name as per bank records"
                                                        value={data.recipientName}
                                                        onChange={(e) => setData({ ...data, recipientName: e.target.value })}
                                                        className="border-white/10 bg-zinc-800"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                <div>
                                                    <Label className="text-zinc-400">Country</Label>
                                                    <Select value={data.recipientCountry} onValueChange={(v) => setData({ ...data, recipientCountry: v })}>
                                                        <SelectTrigger className="border-white/10 bg-zinc-800">
                                                            <SelectValue placeholder="Select country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {countries.map((c) => (
                                                                <SelectItem key={c.code} value={c.code}>
                                                                    {c.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                <div>
                                                    <Label className="text-zinc-400">IBAN</Label>
                                                    <Input
                                                        placeholder="International Bank Account Number"
                                                        value={data.recipientIban}
                                                        onChange={(e) => setData({ ...data, recipientIban: e.target.value.toUpperCase() })}
                                                        className="border-white/10 bg-zinc-800 font-mono"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-zinc-400">SWIFT/BIC Code</Label>
                                                    <Input
                                                        placeholder="XXXXUS33"
                                                        value={data.recipientSwift}
                                                        onChange={(e) => setData({ ...data, recipientSwift: e.target.value.toUpperCase() })}
                                                        className="border-white/10 bg-zinc-800 font-mono"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-zinc-400">Bank Name</Label>
                                                    <Input
                                                        placeholder="Recipient's bank"
                                                        value={data.bankName}
                                                        onChange={(e) => setData({ ...data, bankName: e.target.value })}
                                                        className="border-white/10 bg-zinc-800"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-indigo-500 hover:bg-indigo-600"
                                        onClick={() => setStep(2)}
                                        disabled={!data.recipientName || !data.recipientIban || !data.recipientSwift}
                                    >
                                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h2 className="text-lg font-semibold text-white mb-4">Amount & Purpose</h2>

                                        <div className="grid gap-4 mb-6">
                                            <div>
                                                <Label className="text-zinc-400">From Account</Label>
                                                <Select value={data.fromAccount} onValueChange={(v) => setData({ ...data, fromAccount: v })}>
                                                    <SelectTrigger className="border-white/10 bg-zinc-800">
                                                        <SelectValue placeholder="Select account" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {fakeAccounts.filter(a => a.type !== 'forex').map((acc) => (
                                                            <SelectItem key={acc.id} value={acc.id}>
                                                                {acc.name} - {formatCurrency(acc.balance, acc.currency)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="col-span-1">
                                                <Label className="text-zinc-400">From Currency</Label>
                                                <Select value={data.fromCurrency} onValueChange={(v) => setData({ ...data, fromCurrency: v })}>
                                                    <SelectTrigger className="border-white/10 bg-zinc-800">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currencies.map((c) => (
                                                            <SelectItem key={c.code} value={c.code}>
                                                                {c.symbol} {c.code}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-2">
                                                <Label className="text-zinc-400">Amount</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                                        {currencies.find(c => c.code === data.fromCurrency)?.symbol}
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={data.amount}
                                                        onChange={(e) => setData({ ...data, amount: e.target.value })}
                                                        className="border-white/10 bg-zinc-800 pl-8 text-2xl font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            <div className="col-span-1">
                                                <Label className="text-zinc-400">To Currency</Label>
                                                <Select value={data.toCurrency} onValueChange={(v) => setData({ ...data, toCurrency: v })}>
                                                    <SelectTrigger className="border-white/10 bg-zinc-800">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currencies.map((c) => (
                                                            <SelectItem key={c.code} value={c.code}>
                                                                {c.symbol} {c.code}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-2">
                                                <Label className="text-zinc-400">Recipient Receives</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                                        {currencies.find(c => c.code === data.toCurrency)?.symbol}
                                                    </span>
                                                    <Input
                                                        readOnly
                                                        value={convertedAmount.toFixed(2)}
                                                        className="border-white/10 bg-zinc-800/50 pl-8 text-2xl font-bold text-emerald-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-zinc-800/30 p-4 mb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-zinc-400">Exchange Rate</span>
                                                <span className="text-sm text-white font-mono">1 {data.fromCurrency} = {exchangeRate.toFixed(4)} {data.toCurrency}</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-zinc-400">Transfer Fee</span>
                                                <span className="text-sm text-white">{formatCurrency(transferFee, data.fromCurrency)}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                <span className="text-sm text-zinc-400">Total Debit</span>
                                                <span className="text-lg font-bold text-white">{formatCurrency((parseFloat(data.amount) || 0) + transferFee, data.fromCurrency)}</span>
                                            </div>
                                        </div>

                                        <div className="grid gap-4">
                                            <div>
                                                <Label className="text-zinc-400">Purpose of Transfer</Label>
                                                <Select value={data.purpose} onValueChange={(v) => setData({ ...data, purpose: v })}>
                                                    <SelectTrigger className="border-white/10 bg-zinc-800">
                                                        <SelectValue placeholder="Select purpose" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {transferPurposes.map((p) => (
                                                            <SelectItem key={p.value} value={p.value}>
                                                                {p.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="text-zinc-400">Reference / Memo (Optional)</Label>
                                                <Input
                                                    placeholder="Optional message for recipient"
                                                    value={data.reference}
                                                    onChange={(e) => setData({ ...data, reference: e.target.value })}
                                                    className="border-white/10 bg-zinc-800"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-zinc-400">Supporting Document (Optional)</Label>
                                                <div className="mt-2">
                                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-6 h-6 text-zinc-400 mb-2" />
                                                            <p className="text-sm text-zinc-400">
                                                                {uploadedFile ? uploadedFile.name : 'Click to upload document'}
                                                            </p>
                                                        </div>
                                                        <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 border-white/10" onClick={() => setStep(1)}>
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button
                                            className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                            onClick={() => setStep(3)}
                                            disabled={!data.amount || !data.purpose}
                                        >
                                            Review <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h2 className="text-lg font-semibold text-white mb-4">Review & Confirm</h2>

                                        <div className="rounded-xl border border-white/10 bg-zinc-800/50 p-4 mb-6">
                                            <h3 className="text-sm font-medium text-zinc-400 mb-3">Recipient</h3>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm text-zinc-400">Name</span>
                                                <span className="font-medium text-white">{data.recipientName}</span>
                                            </div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm text-zinc-400">IBAN</span>
                                                <span className="font-mono text-white text-sm">{data.recipientIban}</span>
                                            </div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm text-zinc-400">SWIFT</span>
                                                <span className="font-mono text-white text-sm">{data.recipientSwift}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-zinc-400">Bank</span>
                                                <span className="text-white">{data.bankName}</span>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-zinc-800/50 p-4 mb-6">
                                            <h3 className="text-sm font-medium text-zinc-400 mb-3">Transfer Details</h3>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm text-zinc-400">You Send</span>
                                                <span className="font-mono text-lg font-bold text-white">
                                                    {formatCurrency(parseFloat(data.amount) || 0, data.fromCurrency)}
                                                </span>
                                            </div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm text-zinc-400">Recipient Receives</span>
                                                <span className="font-mono text-lg font-bold text-emerald-400">
                                                    {formatCurrency(convertedAmount, data.toCurrency)}
                                                </span>
                                            </div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm text-zinc-400">Fee</span>
                                                <span className="text-white">{formatCurrency(transferFee, data.fromCurrency)}</span>
                                            </div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm text-zinc-400">Exchange Rate</span>
                                                <span className="text-white text-sm">1 {data.fromCurrency} = {exchangeRate.toFixed(4)} {data.toCurrency}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                <span className="text-sm text-zinc-400">Total Debit</span>
                                                <span className="text-xl font-bold text-white">
                                                    {formatCurrency((parseFloat(data.amount) || 0) + transferFee, data.fromCurrency)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-amber-400">Important Notice</p>
                                                    <p className="text-xs text-zinc-400 mt-1">
                                                        International transfers may take 2-5 business days. Exchange rates are valid for 5 minutes.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-zinc-400">Enter Passcode to Confirm</Label>
                                            <Input
                                                type="password"
                                                maxLength={6}
                                                placeholder="••••••"
                                                value={data.passcode}
                                                onChange={(e) => setData({ ...data, passcode: e.target.value })}
                                                className="border-white/10 bg-zinc-800 text-center text-2xl tracking-widest font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 border-white/10" onClick={() => setStep(2)}>
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button
                                            className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                            onClick={handleSubmit}
                                            disabled={!data.passcode || processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="mr-2 h-4 w-4" /> Confirm Transfer
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Transfer Summary</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                                    <Globe className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Type</p>
                                    <p className="font-medium text-white">International Transfer</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                                    <Clock className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Processing Time</p>
                                    <p className="font-medium text-white">2-4 Business Days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                                    <Shield className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Security</p>
                                    <p className="font-medium text-white">Protected by 256-bit SSL</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
                        <p className="text-sm text-zinc-400 mb-4">
                            Our support team is available 24/7 to assist with your international transfer.
                        </p>
                        <Button variant="outline" className="w-full border-white/10">
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
