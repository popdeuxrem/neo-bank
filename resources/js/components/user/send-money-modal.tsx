import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, ArrowLeft, Building, User, Hash, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import type { Account } from '@/lib/fake-data';

const slideIn = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as any } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

interface SendMoneyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts?: Account[];
    presetRecipient?: { name: string; account: string; bank: string };
}

interface Recipient {
    id: string;
    name: string;
    account: string;
    bank: string;
    avatar?: string;
}

const savedRecipients: Recipient[] = [
    { id: '1', name: 'Sarah Johnson', account: '****5678', bank: 'Chase Bank' },
    { id: '2', name: 'Michael Chen', account: '****9012', bank: 'Bank of America' },
    { id: '3', name: 'Emma Watson', account: '****3456', bank: 'Barclays UK' },
];

export function SendMoneyModal({ open, onOpenChange, accounts = [], presetRecipient }: SendMoneyModalProps) {
    const [step, setStep] = useState(presetRecipient ? 2 : 1);
    const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(presetRecipient ? { ...presetRecipient, id: 'preset' } : null);
    const [formData, setFormData] = useState({
        recipientName: presetRecipient?.name || '',
        accountNumber: presetRecipient?.account || '',
        routingNumber: '',
        bankName: '',
        paymentType: 'ach',
        saveRecipient: true,
    });
    const [amountData, setAmountData] = useState({
        fromAccount: accounts[0]?.id || '',
        amount: '',
        memo: '',
        isInternational: false,
        toCurrency: 'USD',
    });
    const [reviewData, setReviewData] = useState({
        fee: 0,
        exchangeRate: 1,
        recipientReceives: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    };

    const handleRecipientSelect = (recipient: Recipient) => {
        setSelectedRecipient(recipient);
        setFormData({
            ...formData,
            recipientName: recipient.name,
            accountNumber: recipient.account,
            bankName: recipient.bank,
        });
        setStep(2);
    };

    const handleAmountNext = () => {
        const amount = parseFloat(amountData.amount) || 0;
        const fee = amountData.isInternational ? Math.max(15, amount * 0.01) : 0;
        const rate = amountData.toCurrency === 'GBP' ? 0.78 : amountData.toCurrency === 'EUR' ? 0.92 : 1;
        
        setReviewData({
            fee,
            exchangeRate: rate,
            recipientReceives: amount - fee,
        });
        setStep(3);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsComplete(true);
        toast.success('Payment sent successfully!');
    };

    const resetForm = () => {
        setStep(presetRecipient ? 2 : 1);
        setSelectedRecipient(presetRecipient ? { ...presetRecipient, id: 'preset' } : null);
        setFormData({ recipientName: '', accountNumber: '', routingNumber: '', bankName: '', paymentType: 'ach', saveRecipient: true });
        setAmountData({ fromAccount: accounts[0]?.id || '', amount: '', memo: '', isInternational: false, toCurrency: 'USD' });
        setIsComplete(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => onOpenChange(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-white/10 p-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-white">Send Money</h2>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((s) => (
                                        <div
                                            key={s}
                                            className={`h-1.5 w-6 rounded-full transition-colors ${
                                                s <= (isComplete ? 4 : step) ? 'bg-indigo-500' : 'bg-white/10'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white"
                                onClick={() => onOpenChange(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="p-4">
                            {isComplete ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center py-8 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20"
                                    >
                                        <Check className="h-8 w-8 text-emerald-400" />
                                    </motion.div>
                                    <h3 className="mb-2 text-xl font-bold text-white">Payment Sent!</h3>
                                    <p className="mb-6 text-sm text-zinc-400">
                                        Your payment of {formatCurrency(parseFloat(amountData.amount) || 0)} has been sent.
                                    </p>
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={resetForm}>
                                            Send Another
                                        </Button>
                                        <Button onClick={() => onOpenChange(false)}>
                                            View Transaction
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div key="step1" {...slideIn} className="space-y-4">
                                            <div className="mb-4">
                                                <h3 className="text-sm font-medium text-zinc-400">Saved Recipients</h3>
                                            </div>
                                            {savedRecipients.map((recipient) => (
                                                <button
                                                    key={recipient.id}
                                                    onClick={() => handleRecipientSelect(recipient)}
                                                    className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-zinc-800/50 p-3 text-left transition-all hover:border-white/10 hover:bg-zinc-800"
                                                >
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                                        {recipient.name[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-white">{recipient.name}</p>
                                                        <p className="text-xs text-zinc-500">{recipient.bank} • {recipient.account}</p>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-zinc-500" />
                                                </button>
                                            ))}

                                            <div className="relative flex items-center py-4">
                                                <div className="flex-1 border-t border-white/10" />
                                                <span className="px-3 text-xs text-zinc-500">or</span>
                                                <div className="flex-1 border-t border-white/10" />
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-zinc-400">Recipient Name</Label>
                                                    <Input
                                                        value={formData.recipientName}
                                                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                                        placeholder="Enter recipient name"
                                                        className="border-white/10 bg-zinc-800 text-white"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <Label className="text-zinc-400">Account Number</Label>
                                                        <Input
                                                            value={formData.accountNumber}
                                                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                            placeholder="Account number"
                                                            className="border-white/10 bg-zinc-800 text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-zinc-400">Routing Number</Label>
                                                        <Input
                                                            value={formData.routingNumber}
                                                            onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                                                            placeholder="Routing #"
                                                            className="border-white/10 bg-zinc-800 text-white"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-zinc-400">Bank Name</Label>
                                                    <Input
                                                        value={formData.bankName}
                                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                                        placeholder="Bank name"
                                                        className="border-white/10 bg-zinc-800 text-white"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="saveRecipient"
                                                        checked={formData.saveRecipient}
                                                        onCheckedChange={(checked) => setFormData({ ...formData, saveRecipient: checked as boolean })}
                                                    />
                                                    <Label htmlFor="saveRecipient" className="text-sm text-zinc-400">
                                                        Save recipient for future
                                                    </Label>
                                                </div>
                                            </div>

                                            <Button className="w-full" onClick={() => setStep(2)} disabled={!formData.recipientName}>
                                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div key="step2" {...slideIn} className="space-y-4">
                                            <div className="mb-4 flex items-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
                                                    <ArrowLeft className="h-4 w-4" />
                                                </Button>
                                                <h3 className="text-sm font-medium text-zinc-400">Enter Amount</h3>
                                            </div>

                                            <div>
                                                <Label className="text-zinc-400">From Account</Label>
                                                <Select value={amountData.fromAccount} onValueChange={(v) => setAmountData({ ...amountData, fromAccount: v })}>
                                                    <SelectTrigger className="border-white/10 bg-zinc-800 text-white">
                                                        <SelectValue placeholder="Select account" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {accounts.map((acc) => (
                                                            <SelectItem key={acc.id} value={acc.id}>
                                                                {acc.name} - {formatCurrency(acc.balance)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="text-zinc-400">Amount</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                                    <Input
                                                        type="number"
                                                        value={amountData.amount}
                                                        onChange={(e) => setAmountData({ ...amountData, amount: e.target.value })}
                                                        placeholder="0.00"
                                                        className="border-white/10 bg-zinc-800 pl-8 text-xl font-bold text-white"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-zinc-400">Memo (Optional)</Label>
                                                <Input
                                                    value={amountData.memo}
                                                    onChange={(e) => setAmountData({ ...amountData, memo: e.target.value })}
                                                    placeholder="What's this for?"
                                                    className="border-white/10 bg-zinc-800 text-white"
                                                />
                                            </div>

                                            {amountData.isInternational && (
                                                <div className="rounded-lg bg-indigo-500/10 p-3">
                                                    <p className="text-xs text-indigo-400">
                                                        Exchange rate: 1 USD = {reviewData.exchangeRate} {amountData.toCurrency}
                                                    </p>
                                                    <p className="text-xs text-indigo-400">
                                                        Recipient receives: {formatCurrency((parseFloat(amountData.amount) || 0) * reviewData.exchangeRate, amountData.toCurrency)}
                                                    </p>
                                                </div>
                                            )}

                                            <Button className="w-full" onClick={handleAmountNext} disabled={!amountData.amount}>
                                                Review Payment <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div key="step3" {...slideIn} className="space-y-4">
                                            <div className="mb-4 flex items-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => setStep(2)}>
                                                    <ArrowLeft className="h-4 w-4" />
                                                </Button>
                                                <h3 className="text-sm font-medium text-zinc-400">Review & Confirm</h3>
                                            </div>

                                            <div className="rounded-xl border border-white/10 bg-zinc-800/50 p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-sm text-zinc-400">Sending to</span>
                                                    <span className="font-medium text-white">{formData.recipientName}</span>
                                                </div>
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-sm text-zinc-400">Amount</span>
                                                    <span className="font-mono font-bold text-white">{formatCurrency(parseFloat(amountData.amount) || 0)}</span>
                                                </div>
                                                {reviewData.fee > 0 && (
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <span className="text-sm text-zinc-400">Fee</span>
                                                        <span className="font-mono text-white">{formatCurrency(reviewData.fee)}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                                    <span className="text-sm font-medium text-white">Total</span>
                                                    <span className="font-mono text-lg font-bold text-white">
                                                        {formatCurrency((parseFloat(amountData.amount) || 0) + reviewData.fee)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Checkbox id="terms" />
                                                <Label htmlFor="terms" className="text-sm text-zinc-400">
                                                    I confirm this transaction is correct
                                                </Label>
                                            </div>

                                            <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>Processing...</>
                                                ) : (
                                                    <>Confirm & Send <ArrowRight className="ml-2 h-4 w-4" /></>
                                                )}
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
