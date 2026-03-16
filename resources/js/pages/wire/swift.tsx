import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';
import { fakeAccounts } from '@/lib/fake-data';

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    Building: LucideIcons.Building,
    User: LucideIcons.User,
    Globe: LucideIcons.Globe,
    Wallet: LucideIcons.Wallet,
    Send: LucideIcons.Send,
    Lock: LucideIcons.Lock,
    Search: LucideIcons.Search,
    Check: LucideIcons.CheckCircle2,
    Shield: LucideIcons.Shield,
    AlertCircle: LucideIcons.AlertCircle,
};

const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
];

const purposeOptions = [
    'Salary/Payroll',
    'Business Payment',
    'Investment',
    'Family Support',
    'Education',
    'Medical',
    'Property Payment',
    'Travel',
    'Services',
    'Other',
];

interface SwiftBank {
    code: string;
    name: string;
    city: string;
    country: string;
}

const swiftDatabase: SwiftBank[] = [
    { code: 'CHASUS33', name: 'JP Morgan Chase', city: 'New York', country: 'USA' },
    { code: 'BOFAUS3M', name: 'Bank of America', city: 'Charlotte', country: 'USA' },
    { code: 'CITIUS33', name: 'Citibank', city: 'New York', country: 'USA' },
    { code: 'DEUTDEFF', name: 'Deutsche Bank', city: 'Frankfurt', country: 'Germany' },
    { code: 'BNPAFRPP', name: 'BNP Paribas', city: 'Paris', country: 'France' },
    { code: 'BARCGB22', name: 'Barclays Bank', city: 'London', country: 'UK' },
    { code: 'HSBCGB2L', name: 'HSBC', city: 'London', country: 'UK' },
    { code: 'UBSWCHZH', name: 'UBS', city: 'Zurich', country: 'Switzerland' },
    { code: 'GENODEF1M08', name: 'GLS Bank', city: 'Munich', country: 'Germany' },
    { code: 'ASPKFRPP', name: 'Société Générale', city: 'Paris', country: 'France' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function SwiftTransfer() {
    const [formData, setFormData] = useState({
        fromAccount: '',
        recipientName: '',
        recipientAddress: '',
        recipientCountry: '',
        recipientCity: '',
        bankName: '',
        bankAddress: '',
        swiftCode: '',
        bicCode: '',
        iban: '',
        amount: '',
        currency: 'USD',
        purpose: '',
        urgent: 'false',
    });
    const [passcode, setPasscode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [swiftSearch, setSwiftSearch] = useState('');
    const [showSwiftResults, setShowSwiftResults] = useState(false);

    const selectedAccount = fakeAccounts.find(a => a.id === formData.fromAccount);
    const amount = parseFloat(formData.amount) || 0;
    const isUrgent = formData.urgent === 'true';
    const fee = isUrgent ? (amount > 5000 ? 50 : 35) : (amount > 10000 ? 35 : amount > 1000 ? 25 : 15);

    const formatCurrency = (val: number, curr: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(val);
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSwiftSearch = () => {
        if (swiftSearch.length >= 6) {
            setShowSwiftResults(true);
        } else {
            setShowSwiftResults(false);
        }
    };

    const selectSwiftCode = (bank: SwiftBank) => {
        updateField('swiftCode', bank.code);
        updateField('bankName', bank.name);
        updateField('bankAddress', `${bank.city}, ${bank.country}`);
        setSwiftSearch(bank.code);
        setShowSwiftResults(false);
        toast.success(`SWIFT code ${bank.code} selected`);
    };

    const filteredSwiftBanks = swiftDatabase.filter(bank =>
        bank.code.toLowerCase().includes(swiftSearch.toLowerCase()) ||
        bank.name.toLowerCase().includes(swiftSearch.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!passcode) {
            toast.error('Please enter your passcode');
            return;
        }
        
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setStep(2);
        toast.success('SWIFT transfer initiated successfully');
    };

    if (step === 2) {
        return (
            <UserLayout>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center min-h-[60vh]"
                >
                    <Card className="w-full max-w-md bg-zinc-900/50 border-white/10">
                        <CardContent className="pt-6 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20"
                            >
                                <Icons.Check className="h-10 w-10 text-emerald-400" />
                            </motion.div>
                            <h3 className="mb-2 text-2xl font-bold text-white">SWIFT Transfer Initiated</h3>
                            <p className="mb-6 text-sm text-zinc-400">
                                Your SWIFT transfer of {formatCurrency(amount, formData.currency)} to {formData.recipientName} has been submitted. Reference: SWIFT-{Date.now().toString().slice(-8)}
                            </p>
                            <div className="rounded-lg bg-zinc-800/50 p-4 mb-6 text-left">
                                <p className="text-xs text-zinc-500 mb-2">Transfer Details</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">SWIFT Code</span>
                                        <span className="text-white font-mono">{formData.swiftCode}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Delivery</span>
                                        <span className="text-white">{isUrgent ? 'Urgent (1 day)' : 'Standard (2-4 days)'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 border-white/10 text-zinc-300" onClick={() => {
                                    setStep(1);
                                    setFormData({
                                        fromAccount: '', recipientName: '', recipientAddress: '', recipientCountry: '',
                                        recipientCity: '', bankName: '', bankAddress: '', swiftCode: '', bicCode: '',
                                        iban: '', amount: '', currency: 'USD', purpose: '', urgent: 'false'
                                    });
                                    setPasscode('');
                                }}>
                                    New Transfer
                                </Button>
                                <Link href="/wire/history" className="flex-1">
                                    <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                                        View History
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
                    <Link href="/wire/history">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                            <Icons.ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">SWIFT Transfer</h1>
                        <p className="text-zinc-400">Send money globally via SWIFT network</p>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.Wallet className="w-5 h-5 text-indigo-400" />
                                    Source Account
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400">From Account</Label>
                                    <Select value={formData.fromAccount} onValueChange={(v) => updateField('fromAccount', v)}>
                                        <SelectTrigger className="border-white/10 bg-zinc-800">
                                            <SelectValue placeholder="Select source account" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-white/10">
                                            {fakeAccounts.map((acc) => (
                                                <SelectItem key={acc.id} value={acc.id} className="text-white">
                                                    {acc.name} - {formatCurrency(acc.balance, acc.currency)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedAccount && (
                                        <p className="mt-2 text-sm text-zinc-500">Available: {formatCurrency(selectedAccount.availableBalance, selectedAccount.currency)}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.User className="w-5 h-5 text-indigo-400" />
                                    Beneficiary Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400">Beneficiary Name</Label>
                                    <Input
                                        value={formData.recipientName}
                                        onChange={(e) => updateField('recipientName', e.target.value)}
                                        placeholder="Full legal name"
                                        className="border-white/10 bg-zinc-800 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-zinc-400">Beneficiary Address</Label>
                                    <Input
                                        value={formData.recipientAddress}
                                        onChange={(e) => updateField('recipientAddress', e.target.value)}
                                        placeholder="Street address"
                                        className="border-white/10 bg-zinc-800 text-white"
                                    />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-zinc-400">City</Label>
                                        <Input
                                            value={formData.recipientCity}
                                            onChange={(e) => updateField('recipientCity', e.target.value)}
                                            placeholder="City"
                                            className="border-white/10 bg-zinc-800 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Country</Label>
                                        <Input
                                            value={formData.recipientCountry}
                                            onChange={(e) => updateField('recipientCountry', e.target.value)}
                                            placeholder="Country"
                                            className="border-white/10 bg-zinc-800 text-white"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.Building className="w-5 h-5 text-indigo-400" />
                                    Bank Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Label className="text-zinc-400">SWIFT/BIC Code Lookup</Label>
                                    <div className="relative">
                                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            value={swiftSearch}
                                            onChange={(e) => {
                                                setSwiftSearch(e.target.value);
                                                updateField('swiftCode', e.target.value);
                                                handleSwiftSearch();
                                            }}
                                            placeholder="Search SWIFT code or bank name..."
                                            className="border-white/10 bg-zinc-800 text-white pl-10 font-mono"
                                        />
                                    </div>
                                    {showSwiftResults && filteredSwiftBanks.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-zinc-800 shadow-xl max-h-48 overflow-y-auto">
                                            {filteredSwiftBanks.map((bank) => (
                                                <button
                                                    key={bank.code}
                                                    onClick={() => selectSwiftCode(bank)}
                                                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-white font-mono text-sm">{bank.code}</span>
                                                        <span className="text-zinc-400 text-xs">{bank.country}</span>
                                                    </div>
                                                    <p className="text-zinc-300 text-sm">{bank.name}</p>
                                                    <p className="text-zinc-500 text-xs">{bank.city}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-zinc-400">Beneficiary Bank Name</Label>
                                        <Input
                                            value={formData.bankName}
                                            onChange={(e) => updateField('bankName', e.target.value)}
                                            placeholder="Bank name"
                                            className="border-white/10 bg-zinc-800 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">BIC Code (8-character)</Label>
                                        <Input
                                            value={formData.bicCode}
                                            onChange={(e) => updateField('bicCode', e.target.value.toUpperCase())}
                                            placeholder="XXXXUS33"
                                            className="border-white/10 bg-zinc-800 text-white font-mono"
                                            maxLength={8}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-zinc-400">IBAN</Label>
                                    <Input
                                        value={formData.iban}
                                        onChange={(e) => updateField('iban', e.target.value.toUpperCase())}
                                        placeholder="International Bank Account Number"
                                        className="border-white/10 bg-zinc-800 text-white font-mono"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.Send className="w-5 h-5 text-indigo-400" />
                                    Transfer Amount
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-zinc-400">Amount</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                                {currencies.find(c => c.code === formData.currency)?.symbol || '$'}
                                            </span>
                                            <Input
                                                type="number"
                                                value={formData.amount}
                                                onChange={(e) => updateField('amount', e.target.value)}
                                                placeholder="0.00"
                                                className="border-white/10 bg-zinc-800 text-white text-xl font-bold pl-8"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Currency</Label>
                                        <Select value={formData.currency} onValueChange={(v) => updateField('currency', v)}>
                                            <SelectTrigger className="border-white/10 bg-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-white/10">
                                                {currencies.map((curr) => (
                                                    <SelectItem key={curr.code} value={curr.code} className="text-white">
                                                        {curr.code} - {curr.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-zinc-400">Purpose of Transfer</Label>
                                    <Select value={formData.purpose} onValueChange={(v) => updateField('purpose', v)}>
                                        <SelectTrigger className="border-white/10 bg-zinc-800">
                                            <SelectValue placeholder="Select purpose" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-white/10">
                                            {purposeOptions.map((purpose) => (
                                                <SelectItem key={purpose} value={purpose} className="text-white">
                                                    {purpose}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-zinc-400">Delivery Speed</Label>
                                    <div className="grid gap-3 mt-2">
                                        <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                                            formData.urgent === 'false' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="urgent"
                                                    value="false"
                                                    checked={formData.urgent === 'false'}
                                                    onChange={(e) => updateField('urgent', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                    formData.urgent === 'false' ? 'border-indigo-500' : 'border-zinc-600'
                                                }`}>
                                                    {formData.urgent === 'false' && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">Standard Delivery</p>
                                                    <p className="text-xs text-zinc-400">2-4 business days</p>
                                                </div>
                                            </div>
                                            <span className="text-zinc-400 text-sm">From $15</span>
                                        </label>
                                        <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                                            formData.urgent === 'true' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="urgent"
                                                    value="true"
                                                    checked={formData.urgent === 'true'}
                                                    onChange={(e) => updateField('urgent', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                    formData.urgent === 'true' ? 'border-indigo-500' : 'border-zinc-600'
                                                }`}>
                                                    {formData.urgent === 'true' && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">Urgent Delivery</p>
                                                    <p className="text-xs text-zinc-400">1 business day</p>
                                                </div>
                                            </div>
                                            <span className="text-zinc-400 text-sm">From $35</span>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.Lock className="w-5 h-5 text-indigo-400" />
                                    Confirm Transfer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400">Enter your passcode</Label>
                                    <Input
                                        type="password"
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value)}
                                        placeholder="Enter 6-digit passcode"
                                        className="border-white/10 bg-zinc-800 text-white font-mono text-center tracking-widest"
                                        maxLength={6}
                                    />
                                </div>
                                <Button
                                    className="w-full bg-indigo-500 hover:bg-indigo-600"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !formData.fromAccount || !formData.recipientName || !formData.swiftCode || !formData.amount || !passcode}
                                >
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>Confirm SWIFT Transfer <Icons.Send className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <Card className="bg-zinc-900/50 border-white/10 sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-white">Transfer Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Amount</span>
                                    <span className="text-white font-medium">{formatCurrency(amount, formData.currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Transfer Fee</span>
                                    <span className="text-white font-medium">{formatCurrency(fee, 'USD')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Delivery</span>
                                    <span className="text-white font-medium">{isUrgent ? 'Urgent' : 'Standard'}</span>
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-white font-bold text-lg">{formatCurrency(amount + fee, formData.currency)}</span>
                                </div>
                                <div className="rounded-lg bg-indigo-500/10 p-4">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <Icons.Shield className="w-4 h-4" />
                                        <span className="text-sm font-medium">SWIFT Network</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-1">Your transfer is routed through the secure SWIFT global network</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white text-sm">SWIFT Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="rounded-lg bg-zinc-800/50 p-3">
                                    <p className="text-zinc-400 text-xs mb-1">SWIFT Code Format</p>
                                    <p className="text-white font-mono text-xs">XXXXUS33XXX</p>
                                    <p className="text-zinc-500 text-xs mt-1">Bank(4) Country(2) Location(2) Branch(3)</p>
                                </div>
                                <div className="rounded-lg bg-zinc-800/50 p-3">
                                    <p className="text-zinc-400 text-xs mb-1">Processing Time</p>
                                    <p className="text-white">1-4 business days</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </UserLayout>
    );
}
