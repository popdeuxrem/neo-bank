import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { transactions } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowUpRight,
    ArrowDownLeft,
    ArrowLeftRight,
    Filter,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Transactions',
        href: transactions(),
    },
];

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit' | 'transfer';
    category: string;
    status: string;
}

const mockTransactions: Transaction[] = [
    {
        id: 1,
        date: '2024-03-15',
        description: 'Salary Deposit',
        amount: 5000.0,
        type: 'credit',
        category: 'Income',
        status: 'Completed',
    },
    {
        id: 2,
        date: '2024-03-14',
        description: 'Grocery Store',
        amount: -125.5,
        type: 'debit',
        category: 'Shopping',
        status: 'Completed',
    },
    {
        id: 3,
        date: '2024-03-13',
        description: 'Transfer to Savings',
        amount: -1000.0,
        type: 'transfer',
        category: 'Transfer',
        status: 'Completed',
    },
    {
        id: 4,
        date: '2024-03-12',
        description: 'Electric Bill',
        amount: -89.99,
        type: 'debit',
        category: 'Utilities',
        status: 'Completed',
    },
    {
        id: 5,
        date: '2024-03-11',
        description: 'Restaurant',
        amount: -65.0,
        type: 'debit',
        category: 'Dining',
        status: 'Pending',
    },
    {
        id: 6,
        date: '2024-03-10',
        description: 'Freelance Payment',
        amount: 750.0,
        type: 'credit',
        category: 'Income',
        status: 'Completed',
    },
];

export default function Transactions() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Transactions</h1>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-muted">
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Income
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                $5,750.00
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Expenses
                            </CardTitle>
                            <ArrowDownLeft className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                $1,280.49
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Transfers
                            </CardTitle>
                            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$1,000.00</div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Date
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Description
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Category
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Type
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Amount
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {mockTransactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle">
                                                {transaction.date}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {transaction.description}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {transaction.category}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        transaction.type ===
                                                        'credit'
                                                            ? 'text-green-600'
                                                            : transaction.type ===
                                                                'debit'
                                                              ? 'text-red-600'
                                                              : ''
                                                    }
                                                >
                                                    {transaction.type}
                                                </Badge>
                                            </td>
                                            <td
                                                className={`p-4 align-middle font-medium ${
                                                    transaction.amount > 0
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {transaction.amount > 0
                                                    ? '+'
                                                    : ''}
                                                {transaction.amount.toLocaleString(
                                                    'en-US',
                                                    {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                    },
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge
                                                    variant={
                                                        transaction.status ===
                                                        'Completed'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {transaction.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
