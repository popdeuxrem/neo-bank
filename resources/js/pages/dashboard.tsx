import { Head } from '@inertiajs/react';
import {
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Wallet,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Send,
    RefreshCw,
    FileText,
    Download,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/Toast';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface Transaction {
    id: string;
    transaction_number: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    created_at: string;
}

interface Account {
    id: string;
    account_number: string;
    name: string;
    balance: number;
    available_balance: number;
}

interface ChartDataPoint {
    name: string;
    balance: number;
    income: number;
    expense: number;
}

interface SpendingCategory {
    name: string;
    value: number;
}

interface Statement {
    id: number;
    account_id: number;
    period: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    created_at: string;
    file_path?: string;
}

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
    });
};

const getStatusBadge = (status: string) => {
    const statusConfig: Record<
        string,
        {
            variant: 'default' | 'secondary' | 'destructive' | 'outline';
            icon: React.ElementType;
        }
    > = {
        pending: { variant: 'secondary', icon: Clock },
        completed: { variant: 'default', icon: CheckCircle2 },
        failed: { variant: 'destructive', icon: XCircle },
        flagged: { variant: 'destructive', icon: AlertCircle },
        reversed: { variant: 'outline', icon: RefreshCw },
    };

    const config = statusConfig[status] || { variant: 'outline', icon: Clock };
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

const getTransactionIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
        deposit: ArrowDownLeft,
        withdrawal: ArrowUpRight,
        transfer: Send,
        payment: CreditCard,
        fee: Wallet,
        interest: TrendingUp,
    };

    return icons[type] || CreditCard;
};

const chartData: ChartDataPoint[] = [
    { name: 'Jan', balance: 4500000, income: 1200000, expense: 800000 },
    { name: 'Feb', balance: 5200000, income: 1500000, expense: 900000 },
    { name: 'Mar', balance: 4800000, income: 1100000, expense: 1500000 },
    { name: 'Apr', balance: 6100000, income: 2000000, expense: 700000 },
    { name: 'May', balance: 7500000, income: 2200000, expense: 800000 },
    { name: 'Jun', balance: 8200000, income: 1800000, expense: 1100000 },
];

const spendingData: SpendingCategory[] = [
    { name: 'Shopping', value: 350000 },
    { name: 'Food', value: 280000 },
    { name: 'Transport', value: 180000 },
    { name: 'Entertainment', value: 150000 },
    { name: 'Bills', value: 220000 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const mockTransactions: Transaction[] = [
    {
        id: '1',
        transaction_number: 'TXN-20260101-ABC123',
        type: 'deposit',
        amount: 500000,
        status: 'completed',
        description: 'Salary Deposit',
        created_at: '2026-01-15T10:30:00Z',
    },
    {
        id: '2',
        transaction_number: 'TXN-20260102-DEF456',
        type: 'payment',
        amount: -125000,
        status: 'completed',
        description: 'Amazon Purchase',
        created_at: '2026-01-14T15:45:00Z',
    },
    {
        id: '3',
        transaction_number: 'TXN-20260103-GHI789',
        type: 'transfer',
        amount: -50000,
        status: 'pending',
        description: 'Transfer to John',
        created_at: '2026-01-13T09:00:00Z',
    },
    {
        id: '4',
        transaction_number: 'TXN-20260104-JKL012',
        type: 'withdrawal',
        amount: -100000,
        status: 'completed',
        description: 'ATM Withdrawal',
        created_at: '2026-01-12T14:20:00Z',
    },
    {
        id: '5',
        transaction_number: 'TXN-20260105-MNO345',
        type: 'payment',
        amount: -89000,
        status: 'flagged',
        description: 'Unusual Activity',
        created_at: '2026-01-11T11:10:00Z',
    },
];

const mockAccounts: Account[] = [
    {
        id: '1',
        account_number: '10000001',
        name: 'Primary Checking',
        balance: 8250000,
        available_balance: 8250000,
    },
    {
        id: '2',
        account_number: '10000002',
        name: 'Savings Account',
        balance: 15000000,
        available_balance: 15000000,
    },
];

export default function Dashboard() {
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isStatementOpen, setIsStatementOpen] = useState(false);
    const [transferForm, setTransferForm] = useState({
        amount: '',
        toAccount: '',
        description: '',
    });
    const [statementForm, setStatementForm] = useState({
        account_id: '',
        period: '',
    });
    const [statements, setStatements] = useState<Statement[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [balance, setBalance] = useState(23250000);

    useEffect(() => {
        const channel = window.Echo?.private('user.' + window.user?.id);

        if (channel) {
            channel.listen('.transaction.completed', (data: Transaction) => {
                setBalance((prev) => prev + data.amount);
            });
        }

        return () => {
            channel?.stopListening('.transaction.completed');
        };
    }, []);

    // Fetch statements on mount
    useEffect(() => {
        fetchStatements();
    }, []);

    const fetchStatements = async () => {
        try {
            const response = await fetch('/api/statements', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            setStatements(data.statements || []);
        } catch (error) {
            console.error('Failed to fetch statements:', error);
        }
    };

    const generateStatement = async () => {
        if (!statementForm.account_id || !statementForm.period) {
            toast.error('Please select an account and period');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/statements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    account_id: statementForm.account_id,
                    period: statementForm.period,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Your statement is being generated and will be ready in a moment.');
                setIsStatementOpen(false);
                setStatementForm({ account_id: '', period: '' });
                
                // Refresh statements list
                setTimeout(fetchStatements, 2000);
            } else {
                toast.error(data.message || 'Failed to generate statement');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadStatement = async (statement: Statement) => {
        try {
            const response = await fetch(`/api/statements/${statement.id}/download`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `statement-${statement.period}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to download statement');
            }
        } catch {
            toast.error('An error occurred while downloading');
        }
    };

    const getCurrentPeriod = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const getAvailablePeriods = () => {
        const periods = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            periods.push({
                value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
                label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            });
        }
        return periods;
    };

    const totalIncome = 9800000;
    const totalExpense = 5600000;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Wealth Overview
                        </h1>
                        <p className="text-muted-foreground">
                            Welcome back, here's your financial summary
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isStatementOpen} onOpenChange={setIsStatementOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    Download Statement
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Generate Account Statement</DialogTitle>
                                    <DialogDescription>
                                        Download a PDF statement for a specific period
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="statement-account">Account</Label>
                                        <Select
                                            value={statementForm.account_id}
                                            onValueChange={(value) => setStatementForm({ ...statementForm, account_id: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockAccounts.map((account) => (
                                                    <SelectItem key={account.id} value={account.id}>
                                                        {account.name} - **** {account.account_number.slice(-4)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="statement-period">Period</Label>
                                        <Select
                                            value={statementForm.period}
                                            onValueChange={(value) => setStatementForm({ ...statementForm, period: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailablePeriods().map((period) => (
                                                    <SelectItem key={period.value} value={period.value}>
                                                        {period.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsStatementOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={generateStatement} disabled={isGenerating}>
                                        {isGenerating ? 'Generating...' : 'Generate PDF'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Send className="h-4 w-4" />
                                    Transfer
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Transfer Funds</DialogTitle>
                                    <DialogDescription>
                                        Send money to another account securely
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">Amount (USD)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={transferForm.amount}
                                            onChange={(e) =>
                                                setTransferForm({
                                                    ...transferForm,
                                                    amount: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="toAccount">
                                            To Account
                                        </Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10000001">
                                                    Primary Checking - ****1001
                                                </SelectItem>
                                                <SelectItem value="10000002">
                                                    Savings - ****1002
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            placeholder="What's this for?"
                                            value={transferForm.description}
                                            onChange={(e) =>
                                                setTransferForm({
                                                    ...transferForm,
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsTransferOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        onClick={() => setIsTransferOpen(false)}
                                    >
                                        Transfer Funds
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {statements.length > 0 && (
                    <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Recent Statements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {statements.slice(0, 5).map((statement) => (
                                    <Button
                                        key={statement.id}
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                        onClick={() => statement.status === 'completed' && downloadStatement(statement)}
                                        disabled={statement.status !== 'completed'}
                                    >
                                        <Download className="h-3 w-3" />
                                        {statement.period}
                                        {statement.status === 'completed' && (
                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        )}
                                        {statement.status === 'processing' && (
                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">
                                Total Balance
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-emerald-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(balance)}
                            </div>
                            <p className="text-xs text-emerald-100">
                                +2.5% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Income
                            </CardTitle>
                            <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(totalIncome)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Expenses
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(totalExpense)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Net Worth
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(balance - totalExpense)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Available
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Balance Trend</CardTitle>
                            <CardDescription>
                                Your account balance over the past 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="stroke-muted"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            className="text-xs"
                                        />
                                        <YAxis
                                            className="text-xs"
                                            tickFormatter={(value) =>
                                                `$${value / 1000000}M`
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value) =>
                                                formatCurrency(Number(value))
                                            }
                                            contentStyle={{
                                                backgroundColor:
                                                    'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="balance"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{
                                                fill: 'hsl(var(--primary))',
                                                strokeWidth: 2,
                                            }}
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expense"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Spending by Category</CardTitle>
                            <CardDescription>
                                This month's expenses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={spendingData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {spendingData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) =>
                                                formatCurrency(Number(value))
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {spendingData.map((category, index) => (
                                    <div
                                        key={category.name}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[index],
                                                }}
                                            />
                                            <span>{category.name}</span>
                                        </div>
                                        <span className="font-medium">
                                            {formatCurrency(category.value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Accounts</CardTitle>
                            <CardDescription>
                                Your linked accounts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 p-2">
                                                <CreditCard className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {account.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    ****
                                                    {account.account_number.slice(
                                                        -4,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">
                                                {formatCurrency(
                                                    account.balance,
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Available
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>
                                Your latest activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockTransactions.map((transaction) => {
                                    const Icon = getTransactionIcon(
                                        transaction.type,
                                    );
                                    const isNegative = transaction.amount < 0;

                                    return (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`rounded-full p-2 ${
                                                        isNegative
                                                            ? 'bg-rose-100 dark:bg-rose-900/20'
                                                            : 'bg-emerald-100 dark:bg-emerald-900/20'
                                                    }`}
                                                >
                                                    <Icon
                                                        className={`h-4 w-4 ${
                                                            isNegative
                                                                ? 'text-rose-600'
                                                                : 'text-emerald-600'
                                                        }`}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {
                                                            transaction.description
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(
                                                            transaction.created_at,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`font-medium ${
                                                        isNegative
                                                            ? 'text-rose-600'
                                                            : 'text-emerald-600'
                                                    }`}
                                                >
                                                    {isNegative ? '-' : '+'}
                                                    {formatCurrency(
                                                        Math.abs(
                                                            transaction.amount,
                                                        ),
                                                    )}
                                                </span>
                                                {getStatusBadge(
                                                    transaction.status,
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
