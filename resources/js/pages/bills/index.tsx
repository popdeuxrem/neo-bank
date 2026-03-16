import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    Zap: LucideIcons.Zap,
    Droplets: LucideIcons.Droplets,
    Flame: LucideIcons.Flame,
    Wifi: LucideIcons.Wifi,
    Smartphone: LucideIcons.Smartphone,
    Tv: LucideIcons.Tv,
    Shield: LucideIcons.Shield,
    Landmark: LucideIcons.Landmark,
    Bus: LucideIcons.Bus,
    MoreHorizontal: LucideIcons.MoreHorizontal,
    Clock: LucideIcons.Clock,
    ChevronRight: LucideIcons.ChevronRight,
    ArrowRight: LucideIcons.ArrowRight,
    Plus: LucideIcons.Plus,
};

const categories = [
    { id: 'electricity', name: 'Electricity', icon: Icons.Zap, color: 'from-amber-500 to-orange-600' },
    { id: 'water', name: 'Water', icon: Icons.Droplets, color: 'from-blue-500 to-cyan-600' },
    { id: 'gas', name: 'Gas', icon: Icons.Flame, color: 'from-red-500 to-rose-600' },
    { id: 'internet', name: 'Internet', icon: Icons.Wifi, color: 'from-violet-500 to-purple-600' },
    { id: 'mobile', name: 'Mobile', icon: Icons.Smartphone, color: 'from-emerald-500 to-teal-600' },
    { id: 'tv', name: 'TV', icon: Icons.Tv, color: 'from-pink-500 to-rose-600' },
    { id: 'insurance', name: 'Insurance', icon: Icons.Shield, color: 'from-slate-500 to-zinc-600' },
    { id: 'government', name: 'Government', icon: Icons.Landmark, color: 'from-indigo-500 to-blue-600' },
    { id: 'transport', name: 'Transport', icon: Icons.Bus, color: 'from-cyan-500 to-sky-600' },
    { id: 'other', name: 'Other', icon: Icons.MoreHorizontal, color: 'from-zinc-500 to-neutral-600' },
];

const savedBillers = [
    { id: '1', name: 'Con Edison', category: 'Electricity', accountNumber: '****4521', amount: 189.45, dueDate: 'Mar 20' },
    { id: '2', name: 'Verizon', category: 'Mobile', accountNumber: '****8902', amount: 89.99, dueDate: 'Mar 25' },
    { id: '3', name: 'AT&T Internet', category: 'Internet', accountNumber: '****3456', amount: 79.99, dueDate: 'Apr 1' },
];

const recentBills = [
    { id: '1', name: 'Con Edison', category: 'Electricity', amount: 189.45, date: 'Feb 15, 2026', status: 'paid' },
    { id: '2', name: 'Verizon', category: 'Mobile', amount: 89.99, date: 'Jan 28, 2026', status: 'paid' },
    { id: '3', name: 'AT&T Internet', category: 'Internet', amount: 79.99, date: 'Jan 25, 2026', status: 'paid' },
    { id: '4', name: 'State Farm', category: 'Insurance', amount: 245.00, date: 'Feb 15, 2026', status: 'paid' },
    { id: '5', name: 'Netflix', category: 'TV', amount: 15.99, date: 'Mar 11, 2026', status: 'paid' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function BillsIndex() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const getCategoryIcon = (categoryName: string) => {
        const cat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        return cat ? cat.icon : Icons.Zap;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
            >
                <motion.div variants={itemVariants} className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Pay Bills</h1>
                    <p className="text-zinc-400">Pay your utility bills and manage recurring payments</p>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h2 className="text-lg font-semibold text-white mb-4">Select Category</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <motion.button
                                    key={category.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`relative group p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 ${
                                        selectedCategory === category.id ? 'ring-2 ring-indigo-500' : ''
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-white">{category.name}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-white text-base">Quick Pay</CardTitle>
                            <Link href="/bills/saved">
                                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                    View All <Icons.ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {savedBillers.map((biller) => {
                                const Icon = getCategoryIcon(biller.category);
                                return (
                                    <div
                                        key={biller.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-white/5 hover:border-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{biller.name}</p>
                                                <p className="text-xs text-zinc-500">{biller.category} • {biller.accountNumber}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-white">{formatCurrency(biller.amount)}</p>
                                            <p className="text-xs text-zinc-500">Due {biller.dueDate}</p>
                                        </div>
                                        <Button size="sm" className="ml-3 bg-indigo-500 hover:bg-indigo-600">
                                            Pay
                                        </Button>
                                    </div>
                                );
                            })}
                            <Link href="/bills/saved">
                                <Button variant="outline" className="w-full mt-2 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
                                    <Icons.Plus className="w-4 h-4 mr-2" /> Add New Biller
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-white text-base">Recent Bills</CardTitle>
                            <Link href="/bills/history">
                                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                    View All <Icons.ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentBills.map((bill) => {
                                const Icon = getCategoryIcon(bill.category);
                                return (
                                    <div
                                        key={bill.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{bill.name}</p>
                                                <p className="text-xs text-zinc-500">{bill.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium text-white">{formatCurrency(bill.amount)}</p>
                                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                                                Paid
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <Icons.Clock className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Scheduled Payments</p>
                            <p className="text-sm text-zinc-400">3 bills scheduled for this month</p>
                        </div>
                    </div>
                    <Link href="/payments/scheduled">
                        <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20">
                            Manage <Icons.ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
