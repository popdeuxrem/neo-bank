import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from '@/components/ui/dialog';
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

interface Request {
    id: number;
    from: {
        name: string;
        email: string;
        avatar?: string;
    };
    amount: number;
    currency: string;
    note: string;
    status: 'pending' | 'paid' | 'declined' | 'expired';
    created_at: string;
    expires_at: string;
}

interface Account {
    id: number;
    name: string;
    balance: number;
    currency: string;
}

interface PageProps {
    requests: Request[];
    accounts: Account[];
}

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Less than an hour';
};

export default function IncomingRequests({ requests, accounts }: PageProps) {
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [showPayDialog, setShowPayDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const payForm = useForm({
        request_id: '',
        account_id: accounts[0]?.id?.toString() || '',
    });

    const declineForm = useForm({
        request_id: '',
        reason: '',
    });

    const pendingRequests = requests.filter(r => r.status === 'pending');

    const filteredRequests = filterStatus === 'all' 
        ? pendingRequests 
        : pendingRequests.filter(r => r.status === filterStatus);

    const handlePay = (request: Request) => {
        setSelectedRequest(request);
        setShowPayDialog(true);
    };

    const handleDecline = (request: Request) => {
        setSelectedRequest(request);
        setShowDeclineDialog(true);
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        
        payForm.post(`/requests/${selectedRequest.id}/pay`, {
            onSuccess: () => {
                setShowPayDialog(false);
                setSelectedRequest(null);
            }
        });
    };

    const submitDecline = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        
        declineForm.post(`/requests/${selectedRequest.id}/decline`, {
            onSuccess: () => {
                setShowDeclineDialog(false);
                setSelectedRequest(null);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">Pending</Badge>;
            case 'paid':
                return <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Paid</Badge>;
            case 'declined':
                return <Badge className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30">Declined</Badge>;
            case 'expired':
                return <Badge className="bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30">Expired</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <UserLayout>
            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={stagger}
                className="space-y-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="icon">
                                    <LucideIcons.ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Incoming Requests</h1>
                                <p className="text-zinc-400">Payment requests from other users</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-indigo-500/50 text-indigo-400">
                            {pendingRequests.length} pending
                        </Badge>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-900/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Requests</CardTitle>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700">
                                        <SelectValue placeholder="Filter" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700">
                                        <SelectItem value="all" className="text-white focus:bg-zinc-700">All Pending</SelectItem>
                                        <SelectItem value="pending" className="text-white focus:bg-zinc-700">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredRequests.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                        <LucideIcons.Inbox className="h-8 w-8 text-zinc-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1">No pending requests</h3>
                                    <p className="text-zinc-400 text-sm">You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredRequests.map((request) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between p-4 rounded-xl border border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-indigo-400">
                                                        {request.from.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{request.from.name}</p>
                                                    <p className="text-sm text-zinc-400">{request.from.email}</p>
                                                    {request.note && (
                                                        <p className="text-sm text-zinc-500 mt-1 italic">"{request.note}"</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-white">
                                                        {formatCurrency(request.amount, request.currency)}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                                        <LucideIcons.Clock className="h-3 w-3" />
                                                        <span>Expires in {getTimeRemaining(request.expires_at)}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handlePay(request)}
                                                        className="bg-emerald-600 hover:bg-emerald-700"
                                                    >
                                                        <LucideIcons.CheckCircle className="h-4 w-4 mr-1" />
                                                        Pay
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDecline(request)}
                                                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                                                    >
                                                        <LucideIcons.XCircle className="h-4 w-4 mr-1" />
                                                        Decline
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {requests.filter(r => r.status !== 'pending').length > 0 && (
                    <motion.div variants={fadeUp}>
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-900/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-zinc-400">History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {requests.filter(r => r.status !== 'pending').slice(0, 5).map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex items-center justify-between py-2 border-b border-zinc-700/50 last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-zinc-300">
                                                        {request.from.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{request.from.name}</p>
                                                    <p className="text-xs text-zinc-500">{formatDate(request.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-white">
                                                    {formatCurrency(request.amount, request.currency)}
                                                </span>
                                                {getStatusBadge(request.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </motion.div>

            <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
                <DialogContent className="bg-zinc-900 border-zinc-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Pay Request</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Pay {formatCurrency(selectedRequest?.amount || 0, selectedRequest?.currency)} to {selectedRequest?.from.name}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitPayment}>
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-zinc-800 p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">From:</span>
                                    <span className="text-white">{selectedRequest?.from.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Amount:</span>
                                    <span className="text-white font-semibold">
                                        {formatCurrency(selectedRequest?.amount || 0, selectedRequest?.currency)}
                                    </span>
                                </div>
                                {selectedRequest?.note && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">Note:</span>
                                        <span className="text-white">{selectedRequest.note}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label className="text-sm text-zinc-400">Pay from account</label>
                                <Select 
                                    value={payForm.data.account_id.toString()} 
                                    onValueChange={(value) => payForm.setData('account_id', value)}
                                >
                                    <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white">
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700">
                                        {accounts.map((account) => (
                                            <SelectItem 
                                                key={account.id} 
                                                value={account.id.toString()}
                                                className="text-white focus:bg-zinc-700"
                                            >
                                                {account.name} - {formatCurrency(account.balance, account.currency)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowPayDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-emerald-600 hover:bg-emerald-700"
                                disabled={payForm.processing}
                            >
                                {payForm.processing ? 'Processing...' : 'Confirm Payment'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                <DialogContent className="bg-zinc-900 border-zinc-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Decline Request</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Are you sure you want to decline this request?
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitDecline}>
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-zinc-800 p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">From:</span>
                                    <span className="text-white">{selectedRequest?.from.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Amount:</span>
                                    <span className="text-white font-semibold">
                                        {formatCurrency(selectedRequest?.amount || 0, selectedRequest?.currency)}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-sm text-zinc-400">Reason (optional)</label>
                                <Input
                                    value={declineForm.data.reason}
                                    onChange={(e) => declineForm.setData('reason', e.target.value)}
                                    placeholder="Why are you declining this request?"
                                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowDeclineDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="destructive"
                                disabled={declineForm.processing}
                            >
                                {declineForm.processing ? 'Processing...' : 'Decline Request'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </UserLayout>
    );
}
