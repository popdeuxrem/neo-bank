import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    Plus: LucideIcons.Plus,
    Search: LucideIcons.Search,
    MoreVertical: LucideIcons.MoreVertical,
    Edit: LucideIcons.Pencil,
    Trash: LucideIcons.Trash2,
    ArrowLeft: LucideIcons.ArrowLeft,
    Check: LucideIcons.Check,
};

const categories = [
    { id: 'electricity', name: 'Electricity', icon: Icons.Zap },
    { id: 'water', name: 'Water', icon: Icons.Droplets },
    { id: 'gas', name: 'Gas', icon: Icons.Flame },
    { id: 'internet', name: 'Internet', icon: Icons.Wifi },
    { id: 'mobile', name: 'Mobile', icon: Icons.Smartphone },
    { id: 'tv', name: 'TV', icon: Icons.Tv },
    { id: 'insurance', name: 'Insurance', icon: Icons.Shield },
    { id: 'government', name: 'Government', icon: Icons.Landmark },
    { id: 'transport', name: 'Transport', icon: Icons.Bus },
    { id: 'other', name: 'Other', icon: Icons.MoreHorizontal },
];

interface SavedBiller {
    id: string;
    name: string;
    category: string;
    accountNumber: string;
    amount: number;
    dueDate: string;
    autoPay: boolean;
}

const initialBillers: SavedBiller[] = [
    { id: '1', name: 'Con Edison', category: 'Electricity', accountNumber: '452189023', amount: 189.45, dueDate: 'Mar 20', autoPay: true },
    { id: '2', name: 'Verizon Wireless', category: 'Mobile', accountNumber: '890267134', amount: 89.99, dueDate: 'Mar 25', autoPay: false },
    { id: '3', name: 'AT&T Internet', category: 'Internet', accountNumber: '345678901', amount: 79.99, dueDate: 'Apr 1', autoPay: true },
    { id: '4', name: 'State Farm Insurance', category: 'Insurance', accountNumber: '789012345', amount: 245.00, dueDate: 'Apr 15', autoPay: true },
    { id: '5', name: 'Netflix', category: 'TV', accountNumber: '****4567', amount: 15.99, dueDate: 'Apr 1', autoPay: true },
    { id: '6', name: 'NYC Department of Tax', category: 'Government', accountNumber: 'TAX-2026-001', amount: 1250.00, dueDate: 'Apr 30', autoPay: false },
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

export default function BillsSaved() {
    const [billers, setBillers] = useState<SavedBiller[]>(initialBillers);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingBiller, setEditingBiller] = useState<SavedBiller | null>(null);
    const [newBiller, setNewBiller] = useState({
        name: '',
        category: 'electricity',
        accountNumber: '',
        amount: '',
        dueDate: '',
        autoPay: false,
    });

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

    const filteredBillers = billers.filter(biller =>
        biller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biller.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddBiller = () => {
        const biller: SavedBiller = {
            id: Date.now().toString(),
            name: newBiller.name,
            category: categories.find(c => c.id === newBiller.category)?.name || 'Other',
            accountNumber: newBiller.accountNumber,
            amount: parseFloat(newBiller.amount) || 0,
            dueDate: newBiller.dueDate,
            autoPay: newBiller.autoPay,
        };
        setBillers([...billers, biller]);
        setNewBiller({ name: '', category: 'electricity', accountNumber: '', amount: '', dueDate: '', autoPay: false });
        setIsAddDialogOpen(false);
    };

    const handleEditBiller = () => {
        if (!editingBiller) return;
        setBillers(billers.map(b => b.id === editingBiller.id ? editingBiller : b));
        setEditingBiller(null);
    };

    const handleDeleteBiller = (id: string) => {
        setBillers(billers.filter(b => b.id !== id));
    };

    const toggleAutoPay = (id: string) => {
        setBillers(billers.map(b => b.id === id ? { ...b, autoPay: !b.autoPay } : b));
    };

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
                    <Link href="/bills">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                            <Icons.ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Saved Billers</h1>
                        <p className="text-zinc-400">Manage your saved billers and payment accounts</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            placeholder="Search billers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500"
                        />
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-500 hover:bg-indigo-600">
                                <Icons.Plus className="w-4 h-4 mr-2" /> Add Biller
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-white/10">
                            <DialogHeader>
                                <DialogTitle className="text-white">Add New Biller</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <Label className="text-zinc-400">Biller Name</Label>
                                    <Input
                                        value={newBiller.name}
                                        onChange={(e) => setNewBiller({ ...newBiller, name: e.target.value })}
                                        placeholder="e.g., Con Edison"
                                        className="bg-zinc-800/50 border-white/10 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-zinc-400">Category</Label>
                                    <select
                                        value={newBiller.category}
                                        onChange={(e) => setNewBiller({ ...newBiller, category: e.target.value })}
                                        className="w-full h-10 rounded-md border border-white/10 bg-zinc-800/50 px-3 py-2 text-white"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-zinc-400">Account Number</Label>
                                    <Input
                                        value={newBiller.accountNumber}
                                        onChange={(e) => setNewBiller({ ...newBiller, accountNumber: e.target.value })}
                                        placeholder="Account number"
                                        className="bg-zinc-800/50 border-white/10 text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Amount Due</Label>
                                        <Input
                                            type="number"
                                            value={newBiller.amount}
                                            onChange={(e) => setNewBiller({ ...newBiller, amount: e.target.value })}
                                            placeholder="0.00"
                                            className="bg-zinc-800/50 border-white/10 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Due Date</Label>
                                        <Input
                                            value={newBiller.dueDate}
                                            onChange={(e) => setNewBiller({ ...newBiller, dueDate: e.target.value })}
                                            placeholder="e.g., Mar 20"
                                            className="bg-zinc-800/50 border-white/10 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="autoPay"
                                        checked={newBiller.autoPay}
                                        onChange={(e) => setNewBiller({ ...newBiller, autoPay: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="autoPay" className="text-sm text-zinc-400">Enable Auto-Pay</Label>
                                </div>
                                <Button onClick={handleAddBiller} className="w-full bg-indigo-500 hover:bg-indigo-600">
                                    Add Biller
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                <motion.div variants={itemVariants} className="grid gap-4">
                    {filteredBillers.map((biller) => {
                        const Icon = getCategoryIcon(biller.category);
                        return (
                            <motion.div
                                key={biller.id}
                                variants={itemVariants}
                                className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white">{biller.name}</p>
                                            {biller.autoPay && (
                                                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-[10px]">
                                                    Auto-Pay
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-500">{biller.category} • ****{biller.accountNumber.slice(-4)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="font-medium text-white">{formatCurrency(biller.amount)}</p>
                                        <p className="text-sm text-zinc-500">Due {biller.dueDate}</p>
                                    </div>
                                    <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
                                        Pay Now
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                                <Icons.MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-zinc-800 border-white/10">
                                            <DropdownMenuItem 
                                                className="text-zinc-300"
                                                onClick={() => toggleAutoPay(biller.id)}
                                            >
                                                {biller.autoPay ? 'Disable Auto-Pay' : 'Enable Auto-Pay'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-zinc-300"
                                                onClick={() => setEditingBiller(biller)}
                                            >
                                                <Icons.Edit className="w-4 h-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-rose-400"
                                                onClick={() => handleDeleteBiller(biller.id)}
                                            >
                                                <Icons.Trash className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {filteredBillers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-zinc-500">No billers found</p>
                    </div>
                )}

                <Dialog open={!!editingBiller} onOpenChange={() => setEditingBiller(null)}>
                    <DialogContent className="bg-zinc-900 border-white/10">
                        <DialogHeader>
                            <DialogTitle className="text-white">Edit Biller</DialogTitle>
                        </DialogHeader>
                        {editingBiller && (
                            <div className="space-y-4 pt-4">
                                <div>
                                    <Label className="text-zinc-400">Biller Name</Label>
                                    <Input
                                        value={editingBiller.name}
                                        onChange={(e) => setEditingBiller({ ...editingBiller, name: e.target.value })}
                                        className="bg-zinc-800/50 border-white/10 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-zinc-400">Account Number</Label>
                                    <Input
                                        value={editingBiller.accountNumber}
                                        onChange={(e) => setEditingBiller({ ...editingBiller, accountNumber: e.target.value })}
                                        className="bg-zinc-800/50 border-white/10 text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Amount Due</Label>
                                        <Input
                                            type="number"
                                            value={editingBiller.amount}
                                            onChange={(e) => setEditingBiller({ ...editingBiller, amount: parseFloat(e.target.value) })}
                                            className="bg-zinc-800/50 border-white/10 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Due Date</Label>
                                        <Input
                                            value={editingBiller.dueDate}
                                            onChange={(e) => setEditingBiller({ ...editingBiller, dueDate: e.target.value })}
                                            className="bg-zinc-800/50 border-white/10 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="editAutoPay"
                                        checked={editingBiller.autoPay}
                                        onChange={(e) => setEditingBiller({ ...editingBiller, autoPay: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="editAutoPay" className="text-sm text-zinc-400">Enable Auto-Pay</Label>
                                </div>
                                <Button onClick={handleEditBiller} className="w-full bg-indigo-500 hover:bg-indigo-600">
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </motion.div>
        </UserLayout>
    );
}
