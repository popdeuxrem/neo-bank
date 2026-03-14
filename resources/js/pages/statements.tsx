import { useState } from 'react';
import { FileText, Download, Eye, Trash2, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';
import { fakeAccounts } from '@/lib/fake-data';

const statements = [
    { id: '1', period: 'March 2026', account: 'Primary Checking', format: 'PDF', generated: '2026-03-01', size: '245 KB' },
    { id: '2', period: 'February 2026', account: 'Primary Checking', format: 'PDF', generated: '2026-02-01', size: '238 KB' },
    { id: '3', period: 'January 2026', account: 'Primary Checking', format: 'PDF', generated: '2026-01-01', size: '256 KB' },
    { id: '4', period: 'December 2025', account: 'Primary Checking', format: 'PDF', generated: '2025-12-01', size: '242 KB' },
    { id: '5', period: 'March 2026', account: 'High-Yield Savings', format: 'PDF', generated: '2026-03-01', size: '128 KB' },
    { id: '6', period: 'February 2026', account: 'High-Yield Savings', format: 'PDF', generated: '2026-02-01', size: '125 KB' },
];

export default function Statements() {
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [period, setPeriod] = useState('');
    const [format, setFormat] = useState('pdf');

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Account Statements</h1>
                        <p className="text-sm text-zinc-400">Download and manage your account statements</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-semibold text-white">Generate Statement</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="mb-2 block text-sm text-zinc-400">Account</label>
                            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                                <SelectTrigger className="border-white/10 bg-zinc-800">
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Accounts</SelectItem>
                                    {fakeAccounts.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-zinc-400">Period</label>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="border-white/10 bg-zinc-800">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2026-03">March 2026</SelectItem>
                                    <SelectItem value="2026-02">February 2026</SelectItem>
                                    <SelectItem value="2026-01">January 2026</SelectItem>
                                    <SelectItem value="2025-12">December 2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-zinc-400">Format</label>
                            <Select value={format} onValueChange={setFormat}>
                                <SelectTrigger className="border-white/10 bg-zinc-800">
                                    <SelectValue placeholder="Format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="excel">Excel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                                <FileText className="mr-2 h-4 w-4" /> Generate
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                    <div className="border-b border-white/10 p-4">
                        <h2 className="font-semibold text-white">Statement History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 text-left text-sm text-zinc-500">
                                    <th className="p-4">Period</th>
                                    <th className="p-4">Account</th>
                                    <th className="p-4">Format</th>
                                    <th className="p-4">Generated</th>
                                    <th className="p-4">Size</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statements.map((stmt) => (
                                    <tr key={stmt.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-4 text-white">{stmt.period}</td>
                                        <td className="p-4 text-zinc-400">{stmt.account}</td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="border-white/10">{stmt.format}</Badge>
                                        </td>
                                        <td className="p-4 text-zinc-400">{stmt.generated}</td>
                                        <td className="p-4 text-zinc-400">{stmt.size}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
