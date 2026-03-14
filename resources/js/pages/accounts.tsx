import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Wallet,
    TrendingUp,
    Plus,
    Copy,
    Eye,
    Send,
    FileText,
    MoreHorizontal,
    X,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';
import { AccountCard } from '@/components/user/account-card';
import { TransactionItem } from '@/components/user/transaction-item';
import { fakeAccounts, getTransactionsByAccountId, getTotalBalance } from '@/lib/fake-data';
import { toast } from 'sonner';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export default function Accounts() {
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
    const accounts = fakeAccounts;
    const totalBalance = getTotalBalance();

    const selected = accounts.find(a => a.id === selectedAccount);
    const accountTransactions = selectedAccount ? getTransactionsByAccountId(selectedAccount).slice(0, 10) : [];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Accounts</h1>
                        <p className="text-sm text-zinc-400">{accounts.length} accounts • Total {formatCurrency(totalBalance)}</p>
                    </div>
                    <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={() => setIsNewAccountOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Open New Account
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                <Wallet className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Total Balance</p>
                                <p className="text-lg font-bold text-white">{formatCurrency(totalBalance)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                                <Building2 className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Active Accounts</p>
                                <p className="text-lg font-bold text-white">{accounts.filter(a => a.status === 'active').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                                <TrendingUp className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">YTD Interest</p>
                                <p className="text-lg font-bold text-white">$1,245.00</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                                <TrendingUp className="h-5 w-5 text-violet-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Total Invested</p>
                                <p className="text-lg font-bold text-white">$45,000</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-white">Account Cards</h2>
                        <div className="grid gap-4">
                            {accounts.map((account, index) => (
                                <motion.div
                                    key={account.id}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeUp}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div
                                        onClick={() => setSelectedAccount(account.id)}
                                        className={`cursor-pointer rounded-2xl border bg-zinc-900/50 p-5 backdrop-blur-xl transition-all hover:border-white/20 ${
                                            selectedAccount === account.id ? 'border-indigo-500/50' : 'border-white/10'
                                        }`}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`rounded-lg p-2 ${
                                                    account.type === 'checking' ? 'bg-indigo-500/20' :
                                                    account.type === 'savings' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                                                }`}>
                                                    <Wallet className={`h-4 w-4 ${
                                                        account.type === 'checking' ? 'text-indigo-400' :
                                                        account.type === 'savings' ? 'text-emerald-400' : 'text-blue-400'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">{account.name}</h3>
                                                    <p className="text-xs text-zinc-500">•••• {account.mask}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                                                {account.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xs text-zinc-500">{account.currency}</p>
                                                <p className="text-xl font-bold text-white">{formatCurrency(account.balance, account.currency)}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={(e) => { e.stopPropagation(); copyToClipboard(account.accountNumber); }}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" onClick={(e) => { e.stopPropagation(); setSelectedAccount(account.id); }}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-white">Account Details</h2>
                        {selected ? (
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                                        <p className="text-sm text-zinc-400">{selected.type} • {selected.currency}</p>
                                    </div>
                                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                                        {selected.status}
                                    </Badge>
                                </div>

                                <div className="mb-6 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-400">Available Balance</span>
                                        <span className="font-medium text-white">{formatCurrency(selected.availableBalance || selected.balance, selected.currency)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-400">Account Number</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-white">{selected.accountNumber}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(selected.accountNumber)}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-400">Routing Number</span>
                                        <span className="font-mono text-white">{selected.routingNumber}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-400">Institution</span>
                                        <span className="text-white">{selected.institution}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600">
                                        <Send className="mr-2 h-4 w-4" /> Send
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-white/10">
                                        <FileText className="mr-2 h-4 w-4" /> Statement
                                    </Button>
                                </div>

                                <div className="mt-6">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="font-medium text-white">Recent Transactions</h4>
                                        <Button variant="ghost" size="sm" className="text-zinc-400">
                                            View all <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {accountTransactions.slice(0, 5).map((tx, index) => (
                                            <TransactionItem key={tx.id} transaction={tx} index={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/50 p-6 text-center">
                                <Wallet className="mb-2 h-8 w-8 text-zinc-600" />
                                <p className="text-sm text-zinc-500">Select an account to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isNewAccountOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsNewAccountOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Open New Account</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsNewAccountOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400">Account Type</Label>
                                    <Select>
                                        <SelectTrigger className="border-white/10 bg-zinc-800">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="checking">Checking Account</SelectItem>
                                            <SelectItem value="savings">High-Yield Savings</SelectItem>
                                            <SelectItem value="forex-eur">EUR Account</SelectItem>
                                            <SelectItem value="forex-gbp">GBP Account</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-zinc-400">Account Nickname</Label>
                                    <Input placeholder="My Account" className="border-white/10 bg-zinc-800" />
                                </div>
                                <div>
                                    <Label className="text-zinc-400">Purpose</Label>
                                    <Select>
                                        <SelectTrigger className="border-white/10 bg-zinc-800">
                                            <SelectValue placeholder="Select purpose" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="personal">Personal</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="savings-goal">Savings Goal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                                    Open Account
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </UserLayout>
    );
}
