import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

interface Currency {
    code: string;
    name: string;
    symbol: string;
}

const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

const expirationOptions = [
    { value: '3d', label: '3 Days' },
    { value: '7d', label: '7 Days' },
    { value: '14d', label: '14 Days' },
    { value: '30d', label: '30 Days' },
    { value: '60d', label: '60 Days' },
];

interface PageProps {
    userCurrency?: string;
}

export default function NewRequest({ userCurrency = 'USD' }: PageProps) {
    const [recipientType, setRecipientType] = useState<'email' | 'phone'>('email');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        recipient: '',
        currency: userCurrency,
        amount: '',
        note: '',
        expiration: '7d',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/requests', {
            onSuccess: () => setShowSuccess(true),
            onError: () => setShowError(true),
        });
    };

    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    if (showSuccess) {
        return (
            <UserLayout>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center min-h-[60vh]"
                >
                    <div className="text-center max-w-md">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4"
                        >
                            <LucideIcons.CheckCircle className="w-10 h-10 text-emerald-500" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Request Sent!</h2>
                        <p className="text-zinc-400 mb-6">
                            Your payment request for {formatCurrency(parseFloat(data.amount || '0'), data.currency)} has been sent to {data.recipient}
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Link href="/requests/incoming">
                                <Button variant="outline">View Requests</Button>
                            </Link>
                            <Link href="/requests/new">
                                <Button>LucideIcons.Send Another</Button>
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
                variants={stagger}
                className="space-y-6 max-w-3xl mx-auto"
            >
                <motion.div variants={fadeUp}>
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <LucideIcons.ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">LucideIcons.Send Payment Request</h1>
                            <p className="text-zinc-400">Request money from another user</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-900/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LucideIcons.Send className="h-5 w-5 text-indigo-400" />
                                Request Details
                            </CardTitle>
                            <CardDescription>
                                Enter the recipient and amount details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <Label className="text-zinc-300">Recipient Contact</Label>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setRecipientType('email')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-all ${
                                                recipientType === 'email'
                                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                                                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                            }`}
                                        >
                                            <LucideIcons.Mail className="h-4 w-4" />
                                            Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRecipientType('phone')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border transition-all ${
                                                recipientType === 'phone'
                                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                                                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                            }`}
                                        >
                                            <LucideIcons.Phone className="h-4 w-4" />
                                            LucideIcons.Phone
                                        </button>
                                    </div>

                                    <div>
                                        <Label htmlFor="recipient" className="text-zinc-400">
                                            {recipientType === 'email' ? 'Email Address' : 'LucideIcons.Phone Number'}
                                        </Label>
                                        <div className="relative mt-1.5">
                                            {recipientType === 'email' ? (
                                                <LucideIcons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            ) : (
                                                <LucideIcons.Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            )}
                                            <Input
                                                id="recipient"
                                                type={recipientType === 'email' ? 'email' : 'tel'}
                                                value={data.recipient}
                                                onChange={(e) => setData('recipient', e.target.value)}
                                                placeholder={recipientType === 'email' ? 'recipient@example.com' : '+1 (555) 000-0000'}
                                                className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                                            />
                                        </div>
                                        {errors.recipient && (
                                            <p className="text-rose-400 text-sm mt-1 flex items-center gap-1">
                                                <LucideIcons.AlertCircle className="h-3 w-3" />
                                                {errors.recipient}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="amount" className="text-zinc-400">Amount</Label>
                                        <div className="relative mt-1.5">
                                            <LucideIcons.DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                placeholder="0.00"
                                                className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                                            />
                                        </div>
                                        {errors.amount && (
                                            <p className="text-rose-400 text-sm mt-1 flex items-center gap-1">
                                                <LucideIcons.AlertCircle className="h-3 w-3" />
                                                {errors.amount}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="currency" className="text-zinc-400">Currency</Label>
                                        <div className="mt-1.5">
                                            <Select 
                                                value={data.currency} 
                                                onValueChange={(value) => setData('currency', value)}
                                            >
                                                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                                    {currencies.map((currency) => (
                                                        <SelectItem 
                                                            key={currency.code} 
                                                            value={currency.code}
                                                            className="text-white focus:bg-zinc-700 focus:text-white"
                                                        >
                                                            {currency.code} - {currency.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="note" className="text-zinc-400">Note / Message (Optional)</Label>
                                    <div className="relative mt-1.5">
                                        <LucideIcons.MessageSquare className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                        <Textarea
                                            id="note"
                                            value={data.note}
                                            onChange={(e) => setData('note', e.target.value)}
                                            placeholder="Add a message for the recipient..."
                                            rows={3}
                                            className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="expiration" className="text-zinc-400">Request Expiration</Label>
                                    <div className="relative mt-1.5">
                                        <Select 
                                            value={data.expiration} 
                                            onValueChange={(value) => setData('expiration', value)}
                                        >
                                            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                                {expirationOptions.map((option) => (
                                                    <SelectItem 
                                                        key={option.value} 
                                                        value={option.value}
                                                        className="text-white focus:bg-zinc-700 focus:text-white"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <p className="text-zinc-500 text-xs mt-1.5 flex items-center gap-1">
                                        <LucideIcons.Clock className="h-3 w-3" />
                                        Request will expire if not paid within the selected time
                                    </p>
                                </div>

                                {data.amount && data.recipient && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-4"
                                    >
                                        <h4 className="text-sm font-medium text-zinc-300 mb-3">Request Summary</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">To:</span>
                                                <span className="text-white">{data.recipient}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Amount:</span>
                                                <span className="text-white font-semibold">
                                                    {formatCurrency(parseFloat(data.amount || '0'), data.currency)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Expires:</span>
                                                <span className="text-white">
                                                    {expirationOptions.find(o => o.value === data.expiration)?.label}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Link href="/dashboard" className="flex-1">
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button 
                                        type="submit" 
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                LucideIcons.Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <LucideIcons.Send className="h-4 w-4" />
                                                LucideIcons.Send Request
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-900/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-zinc-400">Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-zinc-500 space-y-2">
                            <p>• Make sure the recipient's email or phone number is correct</p>
                            <p>• Add a clear note to help the recipient understand the request</p>
                            <p>• Requests automatically expire if not paid within the selected time</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
