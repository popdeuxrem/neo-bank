import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    Building: LucideIcons.Building,
    User: LucideIcons.User,
    MapPin: LucideIcons.MapPin,
    Globe: LucideIcons.Globe,
    Wallet: LucideIcons.Wallet,
    FileText: LucideIcons.FileText,
    Upload: LucideIcons.Upload,
    Lock: LucideIcons.Lock,
    AlertCircle: LucideIcons.AlertCircle,
    Check: LucideIcons.CheckCircle2,
    Send: LucideIcons.Send,
    Shield: LucideIcons.Shield,
};

const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
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

export default function NewWireTransfer() {
    const [formData, setFormData] = useState({
        fromAccount: '',
        recipientName: '',
        recipientAddress: '',
        recipientCity: '',
        recipientCountry: '',
        bankName: '',
        bankAddress: '',
        swiftCode: '',
        iban: '',
        correspondentBank: '',
        correspondentSwift: '',
        amount: '',
        currency: 'USD',
        purpose: '',
        reference: '',
    });
    const [document, setDocument] = useState<File | null>(null);
    const [passcode, setPasscode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const selectedAccount = fakeAccounts.find(a => a.id === formData.fromAccount);
    const amount = parseFloat(formData.amount) || 0;
    const fee = amount > 10000 ? 35 : amount > 1000 ? 25 : 15;
    const requiresDocument = amount > 10000;

    const formatCurrency = (val: number, curr: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(val);
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }
            setDocument(file);
            toast.success('Document uploaded successfully');
        }
    };

    const handleSubmit = async () => {
        if (requiresDocument && !document) {
            toast.error('Document required for transfers over $10,000');
            return;
        }
        if (!passcode) {
            toast.error('Please enter your passcode');
            return;
        }
        
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setStep(3);
        toast.success('Wire transfer initiated successfully');
    };

    if (step === 3) {
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
                            <h3 className="mb-2 text-2xl font-bold text-white">Transfer Initiated</h3>
                            <p className="mb-6 text-sm text-zinc-400">
                                Your wire transfer of {formatCurrency(amount, formData.currency)} to {formData.recipientName} has been initiated. Reference: WIR-{Date.now().toString().slice(-8)}
                            </p>
                            <div className="rounded-lg bg-zinc-800/50 p-4 mb-6">
                                <p className="text-xs text-zinc-500 mb-2">Estimated Processing Time</p>
                                <p className="text-sm font-medium text-white">1-2 business days</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 border-white/10 text-zinc-300" onClick={() => {
                                    setStep(1);
                                    setFormData({
                                        fromAccount: '', recipientName: '', recipientAddress: '', recipientCity: '',
                                        recipientCountry: '', bankName: '', bankAddress: '', swiftCode: '',
                                        iban: '', correspondentBank: '', correspondentSwift: '', amount: '',
                                        currency: 'USD', purpose: '', reference: ''
                                    });
                                    setPasscode('');
                                    setDocument(null);
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
                        <h1 className="text-2xl font-bold text-white">New Wire Transfer</h1>
                        <p className="text-zinc-400">Send money internationally via wire transfer</p>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.Wallet className="w-5 h-5 text-indigo-400" />
                                    From Account
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400">Source Account</Label>
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
                                    Recipient Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-zinc-400">Recipient Name</Label>
                                        <Input
                                            value={formData.recipientName}
                                            onChange={(e) => updateField('recipientName', e.target.value)}
                                            placeholder="Full name as per bank records"
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
                                <div>
                                    <Label className="text-zinc-400">Address</Label>
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
                                        <Label className="text-zinc-400">Reference/Memo</Label>
                                        <Input
                                            value={formData.reference}
                                            onChange={(e) => updateField('reference', e.target.value)}
                                            placeholder="Payment reference"
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
                                    Bank Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                    <Label className="text-zinc-400">Bank Address</Label>
                                    <Input
                                        value={formData.bankAddress}
                                        onChange={(e) => updateField('bankAddress', e.target.value)}
                                        placeholder="Bank branch address"
                                        className="border-white/10 bg-zinc-800 text-white"
                                    />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-zinc-400">SWIFT/BIC Code</Label>
                                        <Input
                                            value={formData.swiftCode}
                                            onChange={(e) => updateField('swiftCode', e.target.value.toUpperCase())}
                                            placeholder="XXXXUS33"
                                            className="border-white/10 bg-zinc-800 text-white font-mono"
                                            maxLength={11}
                                        />
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
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.Globe className="w-5 h-5 text-indigo-400" />
                                    Correspondent Bank (Optional)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="text-zinc-400">Correspondent Bank Name</Label>
                                        <Input
                                            value={formData.correspondentBank}
                                            onChange={(e) => updateField('correspondentBank', e.target.value)}
                                            placeholder="Intermediary bank"
                                            className="border-white/10 bg-zinc-800 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Correspondent SWIFT</Label>
                                        <Input
                                            value={formData.correspondentSwift}
                                            onChange={(e) => updateField('correspondentSwift', e.target.value.toUpperCase())}
                                            placeholder="SWIFT code"
                                            className="border-white/10 bg-zinc-800 text-white font-mono"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.Send className="w-5 h-5 text-indigo-400" />
                                    Transfer Details
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
                                {requiresDocument && (
                                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                                        <div className="flex items-start gap-3">
                                            <Icons.AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-amber-400">Document Required</p>
                                                <p className="text-xs text-zinc-400 mt-1">For transfers over $10,000, please upload supporting documentation</p>
                                                <div className="mt-3">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <Input
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                            onChange={handleDocumentUpload}
                                                            className="hidden"
                                                        />
                                                        <Button type="button" variant="outline" size="sm" className="border-white/10 text-zinc-300" asChild>
                                                            <span>
                                                                <Icons.Upload className="w-4 h-4 mr-2" />
                                                                {document ? document.name : 'Upload Document'}
                                                            </span>
                                                        </Button>
                                                    </label>
                                                    {document && (
                                                        <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                                            <Icons.Check className="w-3 h-3" /> Document uploaded
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Icons.Lock className="w-5 h-5 text-indigo-400" />
                                    Confirmation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400">Enter your passcode to confirm</Label>
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
                                    disabled={isSubmitting || !formData.fromAccount || !formData.recipientName || !formData.amount || !passcode}
                                >
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>Confirm Transfer <Icons.Send className="ml-2 h-4 w-4" /></>
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
                                <div className="border-t border-white/10 pt-4 flex justify-between">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-white font-bold text-lg">{formatCurrency(amount + fee, formData.currency)}</span>
                                </div>
                                <div className="rounded-lg bg-indigo-500/10 p-4">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <Icons.Shield className="w-4 h-4" />
                                        <span className="text-sm font-medium">Secure Transfer</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-1">Your transfer is protected with bank-level encryption</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white text-sm">Transfer Times</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Same Currency</span>
                                        <span className="text-white">1-2 business days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Cross Currency</span>
                                        <span className="text-white">2-4 business days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Cut-off Time</span>
                                        <span className="text-white">4:00 PM EST</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </UserLayout>
    );
}
