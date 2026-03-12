import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { accounts } from '@/routes/accounts';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CreditCard, Wallet, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Accounts',
        href: accounts(),
    },
];

interface Account {
    id: number;
    owner: string;
    type: string;
    balance: number;
    status: string;
    accountNumber: string;
}

const mockAccounts: Account[] = [
    {
        id: 1,
        owner: 'John Doe',
        type: 'Checking',
        balance: 12500.0,
        status: 'Active',
        accountNumber: '****4521',
    },
    {
        id: 2,
        owner: 'John Doe',
        type: 'Savings',
        balance: 45000.0,
        status: 'Active',
        accountNumber: '****7832',
    },
    {
        id: 3,
        owner: 'John Doe',
        type: 'Investment',
        balance: 125000.0,
        status: 'Active',
        accountNumber: '****9014',
    },
    {
        id: 4,
        owner: 'Jane Smith',
        type: 'Checking',
        balance: 5200.0,
        status: 'Pending',
        accountNumber: '****2156',
    },
];

export default function Accounts() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Accounts</h1>
                    <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                        Open New Account
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Balance
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $182,700.00
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +2.5% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Accounts
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4</div>
                            <p className="text-xs text-muted-foreground">
                                3 checking, 1 savings
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting approval
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Investments
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$125,000</div>
                            <p className="text-xs text-muted-foreground">
                                +8.2% YTD
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            ID
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Account Number
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Owner
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Type
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Balance
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Status
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {mockAccounts.map((account) => (
                                        <tr
                                            key={account.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle">
                                                {account.id}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {account.accountNumber}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {account.owner}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {account.type}
                                            </td>
                                            <td className="p-4 align-middle">
                                                $
                                                {account.balance.toLocaleString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge
                                                    variant={
                                                        account.status ===
                                                        'Active'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {account.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <button className="text-sm hover:underline">
                                                    View Details
                                                </button>
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
