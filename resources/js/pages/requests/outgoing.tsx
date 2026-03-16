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
    to: {
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
    };
    amount: number;
    currency: string;
    note: string;
    status: 'pending' | 'paid' | 'declined' | 'expired' | 'cancelled';
    created_at: string;
    expires_at: string;
    paid_at?: string;
}

interface PageProps {
    requests: Request[];
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

export default function OutgoingRequests({ requests }: PageProps) {
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const cancelForm = useForm({
        request_id: '',
    });

    const pendingRequests = requests.filter(r => r.status === 'pending');

    const filteredRequests = filterStatus === 'all' 
        ? requests 
        : requests.filter(r => r.status === filterStatus);

    const handleCancel = (request: Request) => {
        setSelectedRequest(request);
        setShowCancelDialog(true);
    };

    const submitCancel = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        
        cancelForm.post(`/requests/${selectedRequest.id}/cancel`, {
            onSuccess: () => {
                setShowCancelDialog(false);
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
            case 'cancelled':
                return <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Cancelled</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <LucideIcons.Clock className="h-4 w-4 text-amber-400" />;
            case 'paid':
                return <LucideIcons.CheckCircle className="h-4 w-4 text-emerald-400" />;
            case 'declined':
                return <LucideIcons.XCircle className="h-4 w-4 text-rose-400" />;
            case 'expired':
                return <LucideIcons.TimerOff className="h-4 w-4 text-zinc-400" />;
            case 'cancelled':
                return <LucideIcons.Cancel className="h-4 w-4 text-blue-400" />;
            default:
                return null;
        }
    };

    const statusStats = {
        pending: requests.filter(r => r.status === 'pending').length,
        paid: requests.filter(r => r.status === 'paid').length,
        declined: requests.filter(r => r.status === 'declined').length,
        expired: requests.filter(r => r.status === 'expired').length,
        total: requests.length,
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
                                <h1 className="text-2xl font-bold text-white">Outgoing Requests</h1>
                                <p className="text-zinc-400">Payment requests you've sent</p>
                            </div>
                        </div>
                        <Link href="/requests/new">
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <LucideIcons.Plus className="h-4 w-4 mr-2" />
                                New Request
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-zinc-700 bg-zinc-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-400">Pending</p>
                                        <p className="text-2xl font-bold text-amber-400">{statusStats.pending}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <LucideIcons.Clock className="h-5 w-5 text-amber-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-zinc-700 bg-zinc-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-400">Paid</p>
                                        <p className="text-2xl font-bold text-emerald-400">{statusStats.paid}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <LucideIcons.CheckCircle className="h-5 w-5 text-emerald-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-zinc-700 bg-zinc-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-400">Declined</p>
                                        <p className="text-2xl font-bold text-rose-400">{statusStats.declined}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                                        <LucideIcons.XCircle className="h-5 w-5 text-rose-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-zinc-700 bg-zinc-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-400">Total</p>
                                        <p className="text-2xl font-bold text-white">{statusStats.total}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <LucideIcons.FileText className="h-5 w-5 text-indigo-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-900/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">All Requests</CardTitle>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700">
                                        <SelectValue placeholder="Filter" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700">
                                        <SelectItem value="all" className="text-white focus:bg-zinc-700">All Requests</SelectItem>
                                        <SelectItem value="pending" className="text-white focus:bg-zinc-700">Pending</SelectItem>
                                        <SelectItem value="paid" className="text-white focus:bg-zinc-700">Paid</SelectItem>
                                        <SelectItem value="declined" className="text-white focus:bg-zinc-700">Declined</SelectItem>
                                        <SelectItem value="expired" className="text-white focus:bg-zinc-700">Expired</SelectItem>
                                        <SelectItem value="cancelled" className="text-white focus:bg-zinc-700">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredRequests.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                        <LucideIcons.Send className="h-8 w-8 text-zinc-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1">No requests found</h3>
                                    <p className="text-zinc-400 text-sm">You haven't sent any payment requests yet</p>
                                    <Link href="/requests/new" className="mt-4 inline-block">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                                            Send Your First Request
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredRequests.map((request) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between p-4 rounded-xl border border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                                                    {getStatusIcon(request.status)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{request.to.name}</p>
                                                    <p className="text-sm text-zinc-400">{request.to.email}</p>
                                                    {request.note && (
                                                        <p className="text-sm text-zinc-500 mt-1 italic max-w-md truncate">"{request.note}"</p>
                                                    )}
                                                    <p className="text-xs text-zinc-500 mt-1">
                                                        Created {formatDate(request.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-white">
                                                        {formatCurrency(request.amount, request.currency)}
                                                    </p>
                                                    {request.status === 'pending' && (
                                                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                                            <LucideIcons.Clock className="h-3 w-3" />
                                                            <span>Expires in {getTimeRemaining(request.expires_at)}</span>
                                                        </div>
                                                    )}
                                                    {request.status === 'paid' && request.paid_at && (
                                                        <p className="text-xs text-zinc-500 mt-1">
                                                            Paid {formatDate(request.paid_at)}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(request.status)}
                                                    {request.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleCancel(request)}
                                                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                                        >
                                                            <LucideIcons.X className="h-4 w-4 mr-1" />
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent className="bg-zinc-900 border-zinc-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Cancel Request</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Are you sure you want to cancel this payment request?
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCancel}>
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-zinc-800 p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">To:</span>
                                    <span className="text-white">{selectedRequest?.to.name}</span>
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
                            
                            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
                                <p className="text-sm text-amber-200">
                                    This action cannot be undone. The recipient will no longer be able to pay this request.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowCancelDialog(false)}
                            >
                                Keep Request
                            </Button>
                            <Button 
                                type="submit" 
                                variant="destructive"
                                disabled={cancelForm.processing}
                            >
                                {cancelForm.processing ? 'Cancelling...' : 'Cancel Request'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </UserLayout>
    );
}
