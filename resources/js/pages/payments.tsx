import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    ArrowRight,
    ArrowLeft,
    Check,
    X,
    Building,
    RefreshCw,
} from 'lucide-react';
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
import { fakeAccounts, fakePayments } from '@/lib/fake-data';
import { toast } from 'sonner';

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export default function Payments() {
    const [step, setStep] = useState(1);
    const [accounts] = useState(fakeAccounts);
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        recipientName: '',
        accountNumber: '',
        routingNumber: '',
        bankName: '',
    });
    const [amountData, setAmountData] = useState({
        fromAccount: accounts[0]?.id || '',
        amount: '',
        memo: '',
    });
    const [isComplete, setIsComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const recipients = [
        { id: '1', name: 'Sarah Johnson', account: '****5678', bank: 'Chase Bank' },
        { id: '2', name: 'Michael Chen', account: '****9012', bank: 'Bank of America' },
        { id: '3', name: 'Emma Watson', account: '****3456', bank: 'Barclays UK' },
    ];

    const filteredPayments = activeTab === 'all' ? fakePayments : fakePayments.filter(p => p.status === activeTab);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsComplete(true);
        toast.success('Payment sent successfully!');
    };

    const resetForm = () => {
        setStep(1);
        setSelectedRecipient(null);
        setFormData({ recipientName: '', accountNumber: '', routingNumber: '', bankName: '' });
        setAmountData({ fromAccount: accounts[0]?.id || '', amount: '', memo: '' });
        setIsComplete(false);
    };

    return (
        <UserLayout>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <div className="mb-6 flex items-center gap-2">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                        step >= s ? 'bg-indigo-500 text-white' : 'bg-white/10 text-zinc-500'
                                    }`}>
                                        {step > s ? <Check className="h-4 w-4" /> : s}
                                    </div>
                                    {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-indigo-500' : 'bg-white/10'}`}></div>}
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {!isComplete ? (
                                <>
                                    {step === 1 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            <h2 className="text-lg font-semibold text-white">Select Recipient</h2>
                                            <div className="space-y-2">
                                                {recipients.map((r) => (
                                                    <button
                                                        key={r.id}
                                                        onClick={() => { setSelectedRecipient(r.id); setFormData({ ...formData, recipientName: r.name, accountNumber: r.account, bankName: r.bank }); }}
                                                        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                                                            selectedRecipient === r.id
                                                                ? 'border-indigo-500 bg-indigo-500/10'
                                                                : 'border-white/10 hover:border-white/20'
                                                        }`}
                                                    >
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                                            {r.name[0]}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-white">{r.name}</p>
                                                            <p className="text-xs text-zinc-500">{r.bank} • {r.account}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative flex items-center py-4">
                                                <div className="flex-1 border-t border-white/10" />
                                                <span className="px-3 text-xs text-zinc-500">or enter manually</span>
                                                <div className="flex-1 border-t border-white/10" />
                                            </div>
                                            <div className="grid gap-3">
                                                <Input
                                                    placeholder="Recipient Name"
                                                    value={formData.recipientName}
                                                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                                    className="border-white/10 bg-zinc-800"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input
                                                        placeholder="Account Number"
                                                        value={formData.accountNumber}
                                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                        className="border-white/10 bg-zinc-800"
                                                    />
                                                    <Input
                                                        placeholder="Routing Number"
                                                        value={formData.routingNumber}
                                                        onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                                                        className="border-white/10 bg-zinc-800"
                                                    />
                                                </div>
                                            </div>
                                            <Button className="w-full bg-indigo-500 hover:bg-indigo-600" onClick={handleNext} disabled={!formData.recipientName}>
                                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            <h2 className="text-lg font-semibold text-white">Enter Amount</h2>
                                            <div>
                                                <Label className="text-zinc-400">From Account</Label>
                                                <Select value={amountData.fromAccount} onValueChange={(v) => setAmountData({ ...amountData, fromAccount: v })}>
                                                    <SelectTrigger className="border-white/10 bg-zinc-800">
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
                                                        className="border-white/10 bg-zinc-800 pl-8 text-2xl font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-zinc-400">Memo (Optional)</Label>
                                                <Input
                                                    value={amountData.memo}
                                                    onChange={(e) => setAmountData({ ...amountData, memo: e.target.value })}
                                                    placeholder="What's this for?"
                                                    className="border-white/10 bg-zinc-800"
                                                />
                                            </div>
                                            <Button className="w-full bg-indigo-500 hover:bg-indigo-600" onClick={handleNext} disabled={!amountData.amount}>
                                                Review <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" className="w-full text-zinc-400" onClick={() => setStep(1)}>
                                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                            </Button>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            <h2 className="text-lg font-semibold text-white">Review & Confirm</h2>
                                            <div className="rounded-xl border border-white/10 bg-zinc-800/50 p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-sm text-zinc-400">To</span>
                                                    <span className="font-medium text-white">{formData.recipientName}</span>
                                                </div>
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-sm text-zinc-400">From</span>
                                                    <span className="font-medium text-white">{accounts.find(a => a.id === amountData.fromAccount)?.name}</span>
                                                </div>
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-sm text-zinc-400">Amount</span>
                                                    <span className="font-mono text-xl font-bold text-white">{formatCurrency(parseFloat(amountData.amount) || 0)}</span>
                                                </div>
                                                {amountData.memo && (
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <span className="text-sm text-zinc-400">Memo</span>
                                                        <span className="text-white">{amountData.memo}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Button className="w-full bg-indigo-500 hover:bg-indigo-600" onClick={handleSubmit} disabled={isSubmitting}>
                                                {isSubmitting ? 'Processing...' : 'Confirm & Send'}
                                            </Button>
                                            <Button variant="ghost" className="w-full text-zinc-400" onClick={() => setStep(2)}>
                                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                            </Button>
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                                        <Check className="h-8 w-8 text-emerald-400" />
                                    </motion.div>
                                    <h3 className="mb-2 text-xl font-bold text-white">Payment Sent!</h3>
                                    <p className="mb-6 text-sm text-zinc-400">
                                        {formatCurrency(parseFloat(amountData.amount) || 0)} sent to {formData.recipientName}
                                    </p>
                                    <div className="flex justify-center gap-3">
                                        <Button variant="outline" onClick={resetForm}>Send Another</Button>
                                        <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={() => { setIsComplete(false); setStep(1); }}>Done</Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h2 className="mb-4 text-lg font-semibold text-white">Payment History</h2>
                        <div className="mb-4 flex gap-1">
                            {['all', 'completed', 'pending', 'failed'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                                        activeTab === tab ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredPayments.slice(0, 10).map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-zinc-800/30 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                            payment.status === 'completed' ? 'bg-emerald-500/20' :
                                            payment.status === 'pending' ? 'bg-amber-500/20' : 'bg-rose-500/20'
                                        }`}>
                                            {payment.status === 'completed' ? <Check className="h-4 w-4 text-emerald-400" /> :
                                             payment.status === 'pending' ? <RefreshCw className="h-4 w-4 text-amber-400" /> :
                                             <X className="h-4 w-4 text-rose-400" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{payment.recipientName}</p>
                                            <p className="text-xs text-zinc-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm font-medium text-white">-{formatCurrency(payment.amount)}</p>
                                        <p className="text-xs capitalize text-zinc-500">{payment.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
