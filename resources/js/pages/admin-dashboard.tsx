import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { admin } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Users,
    DollarSign,
    Activity,
    TrendingUp,
    AlertTriangle,
    Shield,
    BarChart3,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Admin',
        href: admin(),
    },
];

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                    <p
                        className={`text-xs ${trendUp ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {trend}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount / 100);
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

interface PageProps {
    stats?: {
        total_users: number;
        total_accounts: number;
        total_transactions: number;
        total_payments: number;
        total_volume: number;
        pending_payments: number;
        failed_payments: number;
    };
    recentTransactions?: Array<{
        id: number;
        transaction_number: string;
        type: string;
        amount: number;
        status: string;
        created_at: string;
        entries: Array<{
            account: string;
            entry_type: string;
            amount: number;
        }>;
    }>;
    recentAuditLogs?: Array<{
        id: number;
        action: string;
        user?: string;
        entity_type?: string;
        entity_id?: number;
        ip_address?: string;
        created_at: string;
    }>;
    accountTypes?: Array<{
        name: string;
        count: number;
    }>;
}

export default function AdminDashboard() {
    const props = usePage().props as unknown as PageProps;
    const stats = props.stats || {
        total_users: 0,
        total_accounts: 0,
        total_transactions: 0,
        total_payments: 0,
        total_volume: 0,
        pending_payments: 0,
        failed_payments: 0,
    };
    const recentTransactions = props.recentTransactions || [];
    const recentAuditLogs = props.recentAuditLogs || [];
    const accountTypes = props.accountTypes || [];

    const getStatusBadge = (status: string) => {
        const config: Record<
            string,
            {
                variant: 'default' | 'secondary' | 'destructive' | 'outline';
                icon: React.ElementType;
            }
        > = {
            completed: { variant: 'default', icon: CheckCircle },
            pending: { variant: 'secondary', icon: Clock },
            failed: { variant: 'destructive', icon: XCircle },
            reversed: { variant: 'outline', icon: AlertTriangle },
        };
        const { variant, icon: Icon } = config[status] || {
            variant: 'outline',
            icon: Clock,
        };
        return (
            <Badge variant={variant} className="gap-1">
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        System overview and audit logs
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value={stats.total_users}
                        icon={Users}
                    />
                    <StatCard
                        title="Total Accounts"
                        value={stats.total_accounts}
                        icon={CreditCard}
                    />
                    <StatCard
                        title="Transactions"
                        value={stats.total_transactions}
                        icon={Activity}
                    />
                    <StatCard
                        title="Total Volume"
                        value={formatCurrency(stats.total_volume)}
                        icon={DollarSign}
                        trend="+12%"
                        trendUp
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {stats.pending_payments}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Awaiting processing
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Failed Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-500">
                                {stats.failed_payments}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Require attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Transaction</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTransactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center text-muted-foreground"
                                            >
                                                No transactions yet
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentTransactions.map((tx) => (
                                            <TableRow key={tx.id}>
                                                <TableCell className="font-mono text-xs">
                                                    {tx.transaction_number}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {tx.type}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(tx.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(tx.status)}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formatDate(tx.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Types</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {accountTypes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No account types
                                    </p>
                                ) : (
                                    accountTypes.map((type) => (
                                        <div
                                            key={type.name}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-sm">
                                                {type.name}
                                            </span>
                                            <Badge variant="secondary">
                                                {type.count}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Recent Audit Logs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Action</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Entity</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentAuditLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-muted-foreground"
                                        >
                                            No audit logs yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentAuditLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {log.user || 'System'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {log.entity_type &&
                                                log.entity_id
                                                    ? `${log.entity_type} #${log.entity_id}`
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {log.ip_address || '-'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(log.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
