import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ledger } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calculator, FileText, Download } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ledger',
        href: ledger(),
    },
];

interface LedgerEntry {
    id: number;
    date: string;
    account: string;
    debit: number;
    credit: number;
    description: string;
    reference: string;
}

const mockLedgerEntries: LedgerEntry[] = [
    {
        id: 1,
        date: '2024-03-15',
        account: 'Cash',
        debit: 5000.0,
        credit: 0,
        description: 'Salary Deposit',
        reference: 'INC-001',
    },
    {
        id: 2,
        date: '2024-03-15',
        account: 'Income',
        debit: 0,
        credit: 5000.0,
        description: 'Salary Deposit',
        reference: 'INC-001',
    },
    {
        id: 3,
        date: '2024-03-14',
        account: 'Expenses',
        debit: 125.5,
        credit: 0,
        description: 'Grocery Store',
        reference: 'EXP-001',
    },
    {
        id: 4,
        date: '2024-03-14',
        account: 'Cash',
        debit: 0,
        credit: 125.5,
        description: 'Grocery Store',
        reference: 'EXP-001',
    },
    {
        id: 5,
        date: '2024-03-13',
        account: 'Savings',
        debit: 1000.0,
        credit: 0,
        description: 'Transfer to Savings',
        reference: 'TRF-001',
    },
    {
        id: 6,
        date: '2024-03-13',
        account: 'Checking',
        debit: 0,
        credit: 1000.0,
        description: 'Transfer to Savings',
        reference: 'TRF-001',
    },
];

export default function Ledger() {
    const totalDebits = mockLedgerEntries.reduce(
        (sum, entry) => sum + entry.debit,
        0,
    );
    const totalCredits = mockLedgerEntries.reduce(
        (sum, entry) => sum + entry.credit,
        0,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ledger" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">General Ledger</h1>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-muted">
                            <FileText className="h-4 w-4" />
                            Generate Report
                        </button>
                        <button className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-muted">
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Debits
                            </CardTitle>
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${totalDebits.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Current period
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Credits
                            </CardTitle>
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${totalCredits.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Current period
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Net Balance
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${(totalDebits - totalCredits).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Balanced
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Journal Entries</CardTitle>
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
                                            Reference
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Account
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            Description
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium">
                                            Debit
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium">
                                            Credit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {mockLedgerEntries.map((entry) => (
                                        <tr
                                            key={entry.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle">
                                                {entry.date}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant="outline">
                                                    {entry.reference}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {entry.account}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {entry.description}
                                            </td>
                                            <td className="p-4 text-right align-middle">
                                                {entry.debit > 0
                                                    ? entry.debit.toLocaleString(
                                                          'en-US',
                                                          {
                                                              style: 'currency',
                                                              currency: 'USD',
                                                          },
                                                      )
                                                    : '-'}
                                            </td>
                                            <td className="p-4 text-right align-middle">
                                                {entry.credit > 0
                                                    ? entry.credit.toLocaleString(
                                                          'en-US',
                                                          {
                                                              style: 'currency',
                                                              currency: 'USD',
                                                          },
                                                      )
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="font-medium">
                                    <tr className="border-b">
                                        <td className="p-4" colSpan={4}>
                                            Total
                                        </td>
                                        <td className="p-4 text-right">
                                            ${totalDebits.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            ${totalCredits.toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
