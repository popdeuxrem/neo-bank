import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { admin } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users,
    DollarSign,
    Activity,
    TrendingUp,
    AlertTriangle,
    Shield,
    Settings,
    BarChart3,
    CreditCard,
    Clock,
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

interface UserAccount {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'suspended' | 'pending';
    kycStatus: 'verified' | 'pending' | 'rejected';
    joinedDate: string;
}

const mockUserAccounts: UserAccount[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        kycStatus: 'verified',
        joinedDate: '2024-01-15',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'active',
        kycStatus: 'verified',
        joinedDate: '2024-02-01',
    },
    {
        id: 3,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        status: 'pending',
        kycStatus: 'pending',
        joinedDate: '2024-03-10',
    },
    {
        id: 4,
        name: 'Alice Brown',
        email: 'alice@example.com',
        status: 'suspended',
        kycStatus: 'rejected',
        joinedDate: '2024-02-20',
    },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                        <Button>
                            <Shield className="mr-2 h-4 w-4" />
                            Security
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Transactions
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45,678</div>
                            <p className="text-xs text-muted-foreground">
                                +8% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Volume
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$2.5M</div>
                            <p className="text-xs text-muted-foreground">
                                +15% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Alerts
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">
                                Requires attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Transaction Volume
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                                <p className="text-muted-foreground">
                                    Chart visualization would go here
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                User Growth
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                                <p className="text-muted-foreground">
                                    Chart visualization would go here
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            User
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Email
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Joined
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Status
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            KYC
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {mockUserAccounts.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle font-medium">
                                                {user.name}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {user.email}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {user.joinedDate}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {user.status === 'active' && (
                                                    <Badge className="bg-green-500">
                                                        Active
                                                    </Badge>
                                                )}
                                                {user.status === 'pending' && (
                                                    <Badge variant="secondary">
                                                        Pending
                                                    </Badge>
                                                )}
                                                {user.status ===
                                                    'suspended' && (
                                                    <Badge variant="destructive">
                                                        Suspended
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {user.kycStatus ===
                                                    'verified' && (
                                                    <Badge className="bg-blue-500">
                                                        Verified
                                                    </Badge>
                                                )}
                                                {user.kycStatus ===
                                                    'pending' && (
                                                    <Badge variant="secondary">
                                                        Pending
                                                    </Badge>
                                                )}
                                                {user.kycStatus ===
                                                    'rejected' && (
                                                    <Badge variant="destructive">
                                                        Rejected
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Approvals
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-muted-foreground">
                                Accounts awaiting review
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Flagged Transactions
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground">
                                Under review
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Support Tickets
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">
                                Open tickets
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
