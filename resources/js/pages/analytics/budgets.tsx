import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Budget {
    id: string;
    category: string;
    budgeted: number;
    spent: number;
    color: string;
    icon: string;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getStatusColor = (percentage: number) => {
    if (percentage <= 70) return 'text-emerald-400';
    if (percentage <= 90) return 'text-amber-400';
    return 'text-rose-400';
};

const getStatusBg = (percentage: number) => {
    if (percentage <= 70) return 'bg-emerald-500';
    if (percentage <= 90) return 'bg-amber-500';
    return 'bg-rose-500';
};

const getProgressBg = (percentage: number) => {
    if (percentage <= 70) return 'bg-emerald-500';
    if (percentage <= 90) return 'bg-amber-500';
    return 'bg-rose-500';
};

const months = [
    { value: '01-2026', label: 'January 2026' },
    { value: '02-2026', label: 'February 2026' },
    { value: '03-2026', label: 'March 2026' },
    { value: '12-2025', label: 'December 2025' },
    { value: '11-2025', label: 'November 2025' },
    { value: '10-2025', label: 'October 2025' },
];

const categories = [
    { value: 'housing', label: 'Housing', icon: 'Home', color: '#6366f1' },
    { value: 'food', label: 'Food & Dining', icon: 'Utensils', color: '#10b981' },
    { value: 'transport', label: 'Transportation', icon: 'Car', color: '#8b5cf6' },
    { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#f59e0b' },
    { value: 'entertainment', label: 'Entertainment', icon: 'Tv', color: '#ec4899' },
    { value: 'utilities', label: 'Utilities', icon: 'Zap', color: '#06b6d4' },
    { value: 'health', label: 'Health & Fitness', icon: 'Heart', color: '#ef4444' },
    { value: 'travel', label: 'Travel', icon: 'Plane', color: '#3b82f6' },
];

const initialBudgets: Budget[] = [
    { id: '1', category: 'Housing', budgeted: 2500, spent: 2450, color: '#6366f1', icon: 'Home' },
    { id: '2', category: 'Food & Dining', budgeted: 800, spent: 567, color: '#10b981', icon: 'Utensils' },
    { id: '3', category: 'Transportation', budgeted: 400, spent: 380, color: '#8b5cf6', icon: 'Car' },
    { id: '4', category: 'Shopping', budgeted: 500, spent: 423, color: '#f59e0b', icon: 'ShoppingBag' },
    { id: '5', category: 'Entertainment', budgeted: 200, spent: 145, color: '#ec4899', icon: 'Tv' },
    { id: '6', category: 'Utilities', budgeted: 300, spent: 280, color: '#06b6d4', icon: 'Zap' },
    { id: '7', category: 'Health & Fitness', budgeted: 150, spent: 89, color: '#ef4444', icon: 'Heart' },
    { id: '8', category: 'Travel', budgeted: 500, spent: 0, color: '#3b82f6', icon: 'Plane' },
];

const Icons = {
    Home: LucideIcons.Home,
    Utensils: LucideIcons.Utensils,
    Car: LucideIcons.Car,
    ShoppingBag: LucideIcons.ShoppingBag,
    Tv: LucideIcons.Tv,
    Zap: LucideIcons.Zap,
    Heart: LucideIcons.Heart,
    Plane: LucideIcons.Plane,
    Plus: LucideIcons.Plus,
    Pencil: LucideIcons.Pencil,
    X: LucideIcons.X,
    ChevronLeft: LucideIcons.ChevronLeft,
    ChevronRight: LucideIcons.ChevronRight,
    TrendingUp: LucideIcons.TrendingUp,
    TrendingDown: LucideIcons.TrendingDown,
    Target: LucideIcons.Target,
    Wallet: LucideIcons.Wallet,
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AnalyticsBudgets() {
    const [selectedMonth, setSelectedMonth] = useState('03-2026');
    const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [formData, setFormData] = useState({
        category: '',
        budgeted: '',
    });

    const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudgeted - totalSpent;
    const overallPercentage = (totalSpent / totalBudgeted) * 100;

    const handleOpenModal = (budget?: Budget) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({
                category: budget.category.toLowerCase().replace(/[^a-z]/g, ''),
                budgeted: budget.budgeted.toString(),
            });
        } else {
            setEditingBudget(null);
            setFormData({ category: '', budgeted: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const amount = parseFloat(formData.budgeted);
        if (isNaN(amount) || amount <= 0) return;

        const categoryInfo = categories.find(c => c.value === formData.category);
        if (!categoryInfo) return;

        if (editingBudget) {
            setBudgets(budgets.map(b => 
                b.id === editingBudget.id 
                    ? { ...b, budgeted: amount }
                    : b
            ));
        } else {
            const newBudget: Budget = {
                id: Date.now().toString(),
                category: categoryInfo.label,
                budgeted: amount,
                spent: 0,
                color: categoryInfo.color,
                icon: categoryInfo.icon,
            };
            setBudgets([...budgets, newBudget]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        setBudgets(budgets.filter(b => b.id !== id));
    };

    return (
        <UserLayout>
            <motion.div 
                initial="hidden"
                animate="show"
                variants={container}
                className="space-y-6"
            >
                <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Budget Tracker</h1>
                        <p className="text-sm text-zinc-400">Monitor your spending by category</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg bg-zinc-800 p-1">
                            <button
                                onClick={() => {
                                    const idx = months.findIndex(m => m.value === selectedMonth);
                                    if (idx < months.length - 1) setSelectedMonth(months[idx + 1].value);
                                }}
                                className="rounded-md p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                            >
                                <Icons.ChevronLeft className="h-4 w-4" />
                            </button>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-40 border-0 bg-transparent text-white focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    {months.map((month) => (
                                        <SelectItem 
                                            key={month.value} 
                                            value={month.value}
                                            className="text-zinc-300 focus:bg-zinc-700 focus:text-white"
                                        >
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <button
                                onClick={() => {
                                    const idx = months.findIndex(m => m.value === selectedMonth);
                                    if (idx > 0) setSelectedMonth(months[idx - 1].value);
                                }}
                                className="rounded-md p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                            >
                                <Icons.ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    onClick={() => handleOpenModal()}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                >
                                    <Icons.Plus className="mr-2 h-4 w-4" />
                                    Add Budget
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-white">
                                        {editingBudget ? 'Edit Budget' : 'Add New Budget'}
                                    </DialogTitle>
                                    <DialogDescription className="text-zinc-400">
                                        {editingBudget 
                                            ? `Update the budget for ${editingBudget.category}`
                                            : 'Set a monthly budget for a spending category'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Category</label>
                                        <Select 
                                            value={formData.category} 
                                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                                            disabled={!!editingBudget}
                                        >
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                                {categories
                                                    .filter(c => !budgets.some(b => b.category.toLowerCase().replace(/[^a-z]/g, '') === c.value) || editingBudget?.category.toLowerCase().replace(/[^a-z]/g, '') === c.value)
                                                    .map((cat) => (
                                                    <SelectItem 
                                                        key={cat.value} 
                                                        value={cat.value}
                                                        className="text-zinc-300 focus:bg-zinc-700 focus:text-white"
                                                    >
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Monthly Budget</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.budgeted}
                                                onChange={(e) => setFormData({ ...formData, budgeted: e.target.value })}
                                                className="pl-8 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleSave}
                                        disabled={!formData.category || !formData.budgeted}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                    >
                                        {editingBudget ? 'Update' : 'Add'} Budget
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>

                <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total Budget</p>
                            <div className="rounded-lg bg-indigo-500/10 p-2">
                                <Icons.Target className="h-4 w-4 text-indigo-400" />
                            </div>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-white">{formatCurrency(totalBudgeted)}</p>
                        <p className="mt-1 text-xs text-zinc-500">For {months.find(m => m.value === selectedMonth)?.label}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total Spent</p>
                            <div className="rounded-lg bg-rose-500/10 p-2">
                                <Icons.TrendingDown className="h-4 w-4 text-rose-400" />
                            </div>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-white">{formatCurrency(totalSpent)}</p>
                        <p className={`mt-1 text-xs ${getStatusColor(overallPercentage)}`}>
                            {overallPercentage.toFixed(1)}% of budget used
                        </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Remaining</p>
                            <div className="rounded-lg bg-emerald-500/10 p-2">
                                <Icons.Wallet className="h-4 w-4 text-emerald-400" />
                            </div>
                        </div>
                        <p className={`mt-3 text-2xl font-bold ${totalRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(totalRemaining)}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            {totalRemaining >= 0 ? 'Under budget' : 'Over budget'}
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Budget Overview</h2>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-zinc-400">Under (0-70%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                <span className="text-zinc-400">Warning (70-90%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-rose-500" />
                                <span className="text-zinc-400">Over (90%+)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-6 h-3 overflow-hidden rounded-full bg-zinc-800">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${getProgressBg(overallPercentage)}`}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {budgets.map((budget) => {
                                const percentage = (budget.spent / budget.budgeted) * 100;
                                const IconComponent = Icons[budget.icon as keyof typeof Icons] || Icons.ShoppingBag;
                                
                                return (
                                    <motion.div
                                        key={budget.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group rounded-xl border border-white/5 bg-zinc-800/30 p-4 transition-all hover:border-white/10 hover:bg-zinc-800/50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="rounded-lg p-2"
                                                    style={{ backgroundColor: `${budget.color}20` }}
                                                >
                                                    <IconComponent 
                                                        className="h-4 w-4" 
                                                        style={{ color: budget.color }} 
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{budget.category}</p>
                                                    <p className="text-xs text-zinc-500">
                                                        {percentage.toFixed(0)}% used
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleOpenModal(budget)}
                                                    className="rounded p-1 text-zinc-500 hover:bg-zinc-700 hover:text-white"
                                                >
                                                    <Icons.Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(budget.id)}
                                                    className="rounded p-1 text-zinc-500 hover:bg-zinc-700 hover:text-rose-400"
                                                >
                                                    <Icons.X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-lg font-bold text-white">
                                                    {formatCurrency(budget.spent)}
                                                </span>
                                                <span className="text-xs text-zinc-500">
                                                    of {formatCurrency(budget.budgeted)}
                                                </span>
                                            </div>
                                            
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-700">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                                                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                                                    className={`h-full rounded-full ${getProgressBg(percentage)}`}
                                                />
                                            </div>
                                            
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className={`text-xs font-medium ${getStatusColor(percentage)}`}>
                                                    {percentage <= 70 
                                                        ? 'On track' 
                                                        : percentage <= 90 
                                                            ? 'Near limit' 
                                                            : 'Over budget'}
                                                </span>
                                                <span className="text-xs text-zinc-500">
                                                    {formatCurrency(budget.budgeted - budget.spent)} left
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        
                        {budgets.length === 0 && (
                            <div className="col-span-full py-12 text-center">
                                <Icons.Wallet className="mx-auto h-12 w-12 text-zinc-600" />
                                <p className="mt-4 text-zinc-400">No budgets set up yet</p>
                                <Button 
                                    onClick={() => handleOpenModal()}
                                    className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white"
                                >
                                    <Icons.Plus className="mr-2 h-4 w-4" />
                                    Add Your First Budget
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
