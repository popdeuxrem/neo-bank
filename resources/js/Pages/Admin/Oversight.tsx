import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Shield,
    AlertTriangle,
    User,
    FileText,
    CheckCircle2,
    XCircle,
    Eye,
    RefreshCw,
    Block,
    Unlock,
    Search,
    Bell,
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import AppLayout from '@/layouts/app-layout';
import { HealthMonitor } from '@/components/admin/HealthMonitor';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Oversight',
        href: '/admin/oversight',
    },
];

interface PendingDocument {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    document_type: string;
    document_type_label: string;
    file_name: string;
    file_path?: string;
    status: string;
    created_at: string;
}

interface FlaggedTransaction {
    id: number;
    transaction_number: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    created_at: string;
    user_id: number;
    user_name: string;
    user_email: string;
    fraud_score?: number;
    fraud_reason: string;
    flagged_at: string;
}

interface Stats {
    pending_kyc_count: number;
    flagged_transactions_count: number;
    total_users: number;
    active_users: number;
}

function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-muted ${className}`}
        />
    );
}

function KYCQueueSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function FraudAlertsSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="mt-3 flex gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Oversight({
    pendingDocuments: initialDocuments,
    flaggedTransactions: initialTransactions,
    stats: initialStats,
}: {
    pendingDocuments?: PendingDocument[];
    flaggedTransactions?: FlaggedTransaction[];
    stats?: Stats;
}) {
    const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>(initialDocuments || []);
    const [flaggedTransactions, setFlaggedTransactions] = useState<FlaggedTransaction[]>(initialTransactions || []);
    const [stats, setStats] = useState<Stats>(initialStats || { pending_kyc_count: 0, flagged_transactions_count: 0, total_users: 0, active_users: 0 });
    const [loading, setLoading] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<PendingDocument | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [lastDocumentId, setLastDocumentId] = useState(0);
    const [lastTransactionId, setLastTransactionId] = useState(0);

    useEffect(() => {
        if (pendingDocuments.length > 0) {
            setLastDocumentId(Math.max(...pendingDocuments.map((d) => d.id)));
        }
        if (flaggedTransactions.length > 0) {
            setLastTransactionId(Math.max(...flaggedTransactions.map((t) => t.id)));
        }
    }, [pendingDocuments, flaggedTransactions]);

    // Poll for real-time updates
    useEffect(() => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(
                    `/admin/oversight/updates?last_document_id=${lastDocumentId}&last_transaction_id=${lastTransactionId}`,
                );
                const data = await response.json();

                if (data.new_documents?.length > 0) {
                    toast.success(`${data.new_documents.length} new KYC document(s) uploaded`);
                    setPendingDocuments((prev) => [...data.new_documents, ...prev]);
                    setStats((prev) => ({ ...prev, pending_kyc_count: prev.pending_kyc_count + data.new_documents.length }));
                }

                if (data.new_transactions?.length > 0) {
                    toast.warning(`${data.new_transactions.length} new flagged transaction(s)`);
                    setFlaggedTransactions((prev) => [...data.new_transactions, ...prev]);
                    setStats((prev) => ({ ...prev, flagged_transactions_count: prev.flagged_transactions_count + data.new_transactions.length }));
                }
            } catch (error) {
                console.error('Failed to poll updates:', error);
            }
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(pollInterval);
    }, [lastDocumentId, lastTransactionId]);

    const refreshData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/admin/oversight', {
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
            });
            const data = await response.json();
            setPendingDocuments(data.props.pendingDocuments || []);
            setFlaggedTransactions(data.props.flaggedTransactions || []);
            setStats(data.props.stats || stats);
        } catch (error) {
            console.error('Failed to refresh:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveKYC = async (documentId: number) => {
        try {
            const response = await fetch(`/admin/oversight/kyc/${documentId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                toast.success('KYC document approved');
                setPendingDocuments((prev) => prev.filter((d) => d.id !== documentId));
                setStats((prev) => ({ ...prev, pending_kyc_count: prev.pending_kyc_count - 1 }));
            } else {
                toast.error('Failed to approve document');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const handleRejectKYC = async () => {
        if (!selectedDocument || !rejectReason.trim()) return;

        try {
            const response = await fetch(`/admin/oversight/kyc/${selectedDocument.id}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ reason: rejectReason }),
            });

            if (response.ok) {
                toast.success('KYC document rejected. User notified.');
                setPendingDocuments((prev) => prev.filter((d) => d.id !== selectedDocument.id));
                setStats((prev) => ({ ...prev, pending_kyc_count: prev.pending_kyc_count - 1 }));
                setShowRejectModal(false);
                setSelectedDocument(null);
                setRejectReason('');
            } else {
                toast.error('Failed to reject document');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const handleResolveFraud = async (transactionId: number, action: 'approve' | 'reject') => {
        try {
            const response = await fetch(`/admin/oversight/fraud/${transactionId}/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ action, notes: '' }),
            });

            if (response.ok) {
                toast.success(action === 'approve' ? 'Transaction approved and processed' : 'Transaction voided');
                setFlaggedTransactions((prev) => prev.filter((t) => t.id !== transactionId));
                setStats((prev) => ({ ...prev, flagged_transactions_count: prev.flagged_transactions_count - 1 }));
            } else {
                toast.error('Failed to resolve transaction');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const handleBlockUser = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(`/admin/oversight/user/${selectedUser.id}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                toast.success(`User ${selectedUser.name} has been blocked`);
                setShowBlockModal(false);
                setSelectedUser(null);
            } else {
                toast.error('Failed to block user');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount / 100);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Oversight | Magnetiq" />
            
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
                        <p className="text-muted-foreground">Real-time KYC and fraud monitoring</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={refreshData}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Health Monitor Sidebar */}
                <div className="mb-4 w-full lg:mb-0 lg:w-80">
                    <HealthMonitor />
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pending KYC</p>
                                <p className="text-2xl font-bold">{stats.pending_kyc_count}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-red-100 p-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Flagged Transactions</p>
                                <p className="text-2xl font-bold">{stats.flagged_transactions_count}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2">
                                <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{stats.total_users}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-purple-100 p-2">
                                <CheckCircle2 className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Users</p>
                                <p className="text-2xl font-bold">{stats.active_users}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* KYC Queue */}
                    <div className="rounded-lg border bg-card">
                        <div className="flex items-center gap-2 border-b p-4">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h2 className="font-semibold">KYC Verification Queue</h2>
                            <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                {pendingDocuments.length}
                            </span>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto p-4">
                            {loading ? (
                                <KYCQueueSkeleton />
                            ) : pendingDocuments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                                    <p>All caught up! No pending documents.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingDocuments.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="rounded-lg border bg-muted/50 p-4 transition-colors hover:bg-muted"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-full bg-blue-100 p-2">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{doc.user_name}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{doc.user_email}</p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="rounded bg-muted px-2 py-0.5 text-xs">
                                                            {doc.document_type_label}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(doc.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => setSelectedDocument(doc)}
                                                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleApproveKYC(doc.id)}
                                                    className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                                                >
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDocument(doc);
                                                        setShowRejectModal(true);
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    <XCircle className="h-3 w-3" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fraud Alerts */}
                    <div className="rounded-lg border bg-card">
                        <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 p-4">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h2 className="font-semibold text-red-900">Fraud Alerts</h2>
                            <span className="ml-auto rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium text-red-700">
                                {flaggedTransactions.length}
                            </span>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto p-4">
                            {loading ? (
                                <FraudAlertsSkeleton />
                            ) : flaggedTransactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <Shield className="h-12 w-12 text-green-500 mb-4" />
                                    <p>No flagged transactions. All clear!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {flaggedTransactions.map((txn) => (
                                        <div
                                            key={txn.id}
                                            className="rounded-lg border border-red-200 bg-red-50 p-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-full bg-red-100 p-2">
                                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-mono text-sm font-medium">{txn.transaction_number}</p>
                                                            {txn.fraud_score && (
                                                                <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                                                                    txn.fraud_score > 80 ? 'bg-red-200 text-red-800' :
                                                                    txn.fraud_score > 50 ? 'bg-yellow-200 text-yellow-800' :
                                                                    'bg-blue-200 text-blue-800'
                                                                }`}>
                                                                    {txn.fraud_score}% risk
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-red-700">{txn.fraud_reason}</p>
                                                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span>{txn.user_name}</span>
                                                            <span>{formatDate(txn.flagged_at)}</span>
                                                        </div>
                                                        <p className="mt-1 font-bold text-red-900">
                                                            {formatCurrency(txn.amount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => handleResolveFraud(txn.id, 'approve')}
                                                    className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                                                >
                                                    <Unlock className="h-3 w-3" />
                                                    Release Funds
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser({ id: txn.user_id, name: txn.user_name });
                                                        setShowBlockModal(true);
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                                                >
                                                    <Block className="h-3 w-3" />
                                                    Block Account
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject KYC Modal */}
            {showRejectModal && selectedDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                        <h3 className="text-lg font-semibold">Reject KYC Document</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            You are rejecting the document for <strong>{selectedDocument.user_name}</strong>.
                            Please provide a reason that will be sent to the user.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason (min 10 characters)..."
                            className="mt-4 w-full rounded-md border px-3 py-2 text-sm min-h-[100px]"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedDocument(null);
                                    setRejectReason('');
                                }}
                                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectKYC}
                                disabled={rejectReason.trim().length < 10}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                Reject Document
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block User Modal */}
            {showBlockModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-red-600">Block User Account</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Are you sure you want to block <strong>{selectedUser.name}</strong>?
                            This action will prevent them from accessing their account.
                        </p>
                        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                            This action cannot be easily undone. The user will need to contact support to restore their account.
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowBlockModal(false);
                                    setSelectedUser(null);
                                }}
                                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBlockUser}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Block Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
