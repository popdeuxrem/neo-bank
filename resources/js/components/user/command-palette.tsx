import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, LayoutDashboard, CreditCard, ArrowRightLeft, Send, Layers, Settings, FileText, BarChart3, DollarSign, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CommandItem {
    id: string;
    type: 'page' | 'action' | 'transaction' | 'account';
    title: string;
    subtitle?: string;
    icon: any;
    action: () => void;
}

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const pages: CommandItem[] = [
        { id: 'dashboard', type: 'page', title: 'Dashboard', icon: LayoutDashboard, action: () => window.location.href = '/dashboard' },
        { id: 'accounts', type: 'page', title: 'Accounts', icon: CreditCard, action: () => window.location.href = '/accounts' },
        { id: 'transactions', type: 'page', title: 'Transactions', icon: ArrowRightLeft, action: () => window.location.href = '/transactions' },
        { id: 'payments', type: 'page', title: 'Payments', icon: Send, action: () => window.location.href = '/payments' },
        { id: 'cards', type: 'page', title: 'Virtual Cards', icon: Layers, action: () => window.location.href = '/cards' },
        { id: 'analytics', type: 'page', title: 'Analytics', icon: BarChart3, action: () => window.location.href = '/analytics' },
        { id: 'statements', type: 'page', title: 'Statements', icon: FileText, action: () => window.location.href = '/statements' },
        { id: 'settings', type: 'page', title: 'Settings', icon: Settings, action: () => window.location.href = '/settings/profile' },
    ];

    const actions: CommandItem[] = [
        { id: 'send-money', type: 'action', title: 'Send Money', subtitle: 'Send a payment', icon: Send, action: () => window.location.href = '/payments' },
        { id: 'add-funds', type: 'action', title: 'Add Funds', subtitle: 'Add money to account', icon: DollarSign, action: () => window.location.href = '/payments' },
    ];

    const allItems: CommandItem[] = [...pages, ...actions];

    const filteredItems = query
        ? allItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
        : allItems;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) {
return;
}
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();

                if (filteredItems[selectedIndex]) {
                    filteredItems[selectedIndex].action();
                    onOpenChange(false);
                }
            } else if (e.key === 'Escape') {
                onOpenChange(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, selectedIndex, filteredItems, onOpenChange]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm"
                    onClick={() => onOpenChange(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 border-b border-white/10 p-4">
                            <Search className="h-5 w-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search pages, actions..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
                                autoFocus
                            />
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400" onClick={() => onOpenChange(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="max-h-96 overflow-y-auto p-2">
                            {filteredItems.length === 0 ? (
                                <div className="py-8 text-center text-zinc-500">
                                    <Search className="mx-auto mb-2 h-8 w-8" />
                                    <p>No results found</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {!query && (
                                        <div className="px-3 py-2 text-xs font-medium text-zinc-500">Pages</div>
                                    )}
                                    {filteredItems.slice(0, query ? filteredItems.length : 8).map((item, index) => {
                                        const Icon = item.icon;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    item.action();
                                                    onOpenChange(false);
                                                }}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                                                    selectedIndex === index ? 'bg-indigo-500/20 text-white' : 'text-zinc-300 hover:bg-white/5'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4 text-zinc-500" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{item.title}</p>
                                                    {item.subtitle && (
                                                        <p className="text-xs text-zinc-500">{item.subtitle}</p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-zinc-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↑</kbd>
                                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↓</kbd>
                                    <span>Navigate</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↵</kbd>
                                    <span>Select</span>
                                </span>
                            </div>
                            <span className="flex items-center gap-1">
                                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">esc</kbd>
                                <span>Close</span>
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
