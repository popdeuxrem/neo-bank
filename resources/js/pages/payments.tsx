import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { payments } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CreditCard,
    Send,
    Repeat,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Payments',
        href: payments(),
    },
];

interface Payment {
    id: number;
    date: string;
    recipient: string;
    amount: number;
    method: string;
    status: 'completed' | 'pending' | 'failed' | 'scheduled';
    type: 'send' | 'receive' | 'recurring';
}

const mockPayments: Payment[] = [
    {
        id: 1,
        date: '2024-03-15',
        recipient: 'John Smith',
        amount: 500.0,
        method: 'Instant Transfer',
        status: 'completed',
        type: 'send',
    },
    {
        id: 2,
        date: '2024-03-14',
        recipient: 'Jane Doe',
        amount: 250.0,
        method: 'Standard Transfer',
        status: 'completed',
        type: 'send',
    },
    {
        id: 3,
        date: '2024-03-16',
        recipient: 'Monthly Rent',
        amount: 1500.0,
        method: 'Scheduled',
        status: 'scheduled',
        type: 'recurring',
    },
    {
        id: 4,
        date: '2024-03-13',
        recipient: 'Bob Wilson',
        amount: 100.0,
        method: 'Instant Transfer',
        status: 'pending',
        type: 'send',
    },
    {
        id: 5,
        date: '2024-03-12',
        recipient: 'Alice Brown',
        amount: 75.0,
        method: 'Standard Transfer',
        status: 'failed',
        type: 'send',
    },
];

export default function Payments() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Payments</h1>
                    <Button>
                        <Send className="mr-2 h-4 w-4" />
                        New Payment
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sent This Month
                            </CardTitle>
                            <Send className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$925.00</div>
                            <p className="text-xs text-muted-foreground">
                                4 transactions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Received
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$5,750.00</div>
                            <p className="text-xs text-muted-foreground">
                                2 transactions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Scheduled
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$1,500.00</div>
                            <p className="text-xs text-muted-foreground">
                                1 upcoming
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Recurring
                            </CardTitle>
                            <Repeat className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$2,500</div>
                            <p className="text-xs text-muted-foreground">
                                3 active
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <Send className="mb-2 h-8 w-8" />
                            <span className="font-medium">Send Money</span>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <CreditCard className="mb-2 h-8 w-8" />
                            <span className="font-medium">Pay Bills</span>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <Repeat className="mb-2 h-8 w-8" />
                            <span className="font-medium">
                                Set Up Recurring
                            </span>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Payments</CardTitle>
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
                                            Recipient
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Method
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Type
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium">
                                            Amount
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {mockPayments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle">
                                                {payment.date}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {payment.recipient}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {payment.method}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {payment.type}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right align-middle font-medium">
                                                $
                                                {payment.amount.toLocaleString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {payment.status ===
                                                    'completed' && (
                                                    <Badge className="bg-green-500">
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Completed
                                                    </Badge>
                                                )}
                                                {payment.status ===
                                                    'pending' && (
                                                    <Badge variant="secondary">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        Pending
                                                    </Badge>
                                                )}
                                                {payment.status ===
                                                    'failed' && (
                                                    <Badge variant="destructive">
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                        Failed
                                                    </Badge>
                                                )}
                                                {payment.status ===
                                                    'scheduled' && (
                                                    <Badge variant="outline">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        Scheduled
                                                    </Badge>
                                                )}
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
