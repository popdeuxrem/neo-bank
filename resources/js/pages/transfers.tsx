import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { TransactionItem } from '@/components/user/transaction-item';
import UserLayout from '@/layouts/user-layout';
import { fakeAccounts, getTransactionsByAccountId } from '@/lib/fake-data';

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export default function Transfers() {
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const accounts = fakeAccounts;
    const fromAcc = accounts.find(a => a.id === fromAccount);
    const toAcc = accounts.find(a => a.id === toAccount);

    const handleSwap = () => {
        const temp = fromAccount;
        setFromAccount(toAccount);
        setToAccount(temp);
    };

    const handleTransfer = async () => {
        if (!fromAccount || !toAccount || !amount) {
return;
}
        
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsComplete(true);
        toast.success('Transfer completed successfully!');
    };

    const recentTransfers = getTransactionsByAccountId(accounts[0]?.id || '').slice(0, 5);

    return (
        <UserLayout>
            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h1 className="mb-6 text-2xl font-bold text-white">Internal Transfer</h1>
                        
                        {!isComplete ? (
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-zinc-400">From Account</Label>
                                    <Select value={fromAccount} onValueChange={setFromAccount}>
                                        <SelectTrigger className="border-white/10 bg-zinc-800">
                                            <SelectValue placeholder="Select source account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((acc) => (
                                                <SelectItem key={acc.id} value={acc.id} disabled={acc.id === toAccount}>
                                                    {acc.name} - {formatCurrency(acc.balance, acc.currency)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fromAcc && (
                                        <p className="mt-2 text-sm text-zinc-500">Available: {formatCurrency(fromAcc.balance, fromAcc.currency)}</p>
                                    )}
                                </div>

                                <div className="flex justify-center">
                                    <Button variant="ghost" size="icon" className="rounded-full border border-white/10" onClick={handleSwap}>
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div>
                                    <Label className="text-zinc-400">To Account</Label>
                                    <Select value={toAccount} onValueChange={setToAccount}>
                                        <SelectTrigger className="border-white/10 bg-zinc-800">
                                            <SelectValue placeholder="Select destination account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((acc) => (
                                                <SelectItem key={acc.id} value={acc.id} disabled={acc.id === fromAccount}>
                                                    {acc.name} - {formatCurrency(acc.balance, acc.currency)}
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
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="border-white/10 bg-zinc-800 pl-8 text-2xl font-bold"
                                        />
                                    </div>
                                    {fromAcc && (
                                        <div className="mt-2 flex items-center justify-between text-sm">
                                            <span className="text-zinc-500">Available</span>
                                            <span className="text-white">{formatCurrency(fromAcc.balance, fromAcc.currency)}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-zinc-400">Memo (Optional)</Label>
                                    <Input
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                        placeholder="What's this for?"
                                        className="border-white/10 bg-zinc-800"
                                    />
                                </div>

                                <Button 
                                    className="w-full bg-indigo-500 hover:bg-indigo-600" 
                                    onClick={handleTransfer}
                                    disabled={!fromAccount || !toAccount || !amount || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>Transfer Now <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                                    <Check className="h-8 w-8 text-emerald-400" />
                                </motion.div>
                                <h3 className="mb-2 text-xl font-bold text-white">Transfer Complete!</h3>
                                <p className="mb-6 text-sm text-zinc-400">
                                    {formatCurrency(parseFloat(amount) || 0)} transferred from {fromAcc?.name} to {toAcc?.name}
                                </p>
                                <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={() => {
 setIsComplete(false); setAmount(''); setMemo(''); 
}}>
                                    Transfer Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                        <h2 className="mb-4 text-lg font-semibold text-white">Recent Transfers</h2>
                        <div className="space-y-2">
                            {recentTransfers.map((tx, index) => (
                                <TransactionItem key={tx.id} transaction={tx} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
