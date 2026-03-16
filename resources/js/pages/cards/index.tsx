import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    Plus: LucideIcons.Plus,
    Eye: LucideIcons.Eye,
    EyeOff: LucideIcons.EyeOff,
    Snowflake: LucideIcons.Snowflake,
    Settings: LucideIcons.Settings,
    CreditCard: LucideIcons.CreditCard,
    Globe: LucideIcons.Globe,
    Smartphone: LucideIcons.Smartphone,
    ArrowUpRight: LucideIcons.ArrowUpRight,
    ArrowDownLeft: LucideIcons.ArrowDownLeft,
    Clock: LucideIcons.Clock,
    Filter: LucideIcons.Filter,
    Download: LucideIcons.Download,
    X: LucideIcons.X,
    Check: LucideIcons.Check,
};

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const formatCardNumber = (number: string, show: boolean) => {
    if (show) return number;
    return number.replace(/\d{4}(?=\d)/g, '****');
};

interface VirtualCard {
    id: string;
    name: string;
    number: string;
    expiry: string;
    cvv: string;
    status: 'active' | 'frozen' | 'cancelled';
    balance: number;
    limit: number;
    type: 'virtual' | 'physical';
    network: 'visa' | 'mastercard';
    currency: string;
}

interface Transaction {
    id: string;
    cardId: string;
    merchant: string;
    amount: number;
    currency: string;
    date: string;
    type: 'debit' | 'credit';
    category: string;
    status: 'completed' | 'pending' | 'declined';
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

function Card3DTilt({ card, isSelected, onClick, showNumber, showCvv, onToggleNumber, onToggleCvv, onFreeze }: {
    card: VirtualCard;
    isSelected: boolean;
    onClick: () => void;
    showNumber: boolean;
    showCvv: boolean;
    onToggleNumber: () => void;
    onToggleCvv: () => void;
    onFreeze: () => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!cardRef.current || !isHovered) return;
            
            const rect = cardRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const x = (e.clientX - centerX) / (rect.width / 2);
            const y = (e.clientY - centerY) / (rect.height / 2);
            
            setTilt({ x: -y * 10, y: x * 10 });
        };

        if (isHovered) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isHovered]);

    const gradients: Record<string, string> = {
        visa: 'from-[#1a1f71] via-[#2d42bc] to-[#1a1f71]',
        mastercard: 'from-[#1a1a1a] via-[#2d2d2d] to-[#eb001b]'
    };

    const cardStyle = {
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out'
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={cardStyle}
            className={`relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[card.network]} p-6 transition-all ${
                isSelected ? 'ring-2 ring-indigo-400 shadow-2xl shadow-indigo-500/25' : 'ring-1 ring-white/10'
            } ${card.status === 'frozen' ? 'opacity-80' : ''}`}
        >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            
            <div className="relative z-10">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-white">{card.name}</h3>
                        <div className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary" className={card.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}>
                                {card.status}
                            </Badge>
                            <span className="text-xs text-white/60">{card.type === 'virtual' ? 'Virtual' : 'Physical'}</span>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {card.status === 'active' ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); onFreeze(); }}
                                className="rounded-lg bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                                title="Freeze Card"
                            >
                                <Icons.Snowflake className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); onFreeze(); }}
                                className="rounded-lg bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                                title="Unfreeze Card"
                            >
                                <Icons.Check className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="font-mono text-xl tracking-widest text-white">
                        {formatCardNumber(card.number, showNumber)}
                    </p>
                    <div className="mt-2 flex gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleNumber(); }}
                            className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
                        >
                            {showNumber ? <Icons.EyeOff className="h-3 w-3" /> : <Icons.Eye className="h-3 w-3" />}
                            {showNumber ? 'Hide' : 'Show'} Number
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleCvv(); }}
                            className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
                        >
                            {showCvv ? <Icons.EyeOff className="h-3 w-3" /> : <Icons.Eye className="h-3 w-3" />}
                            {showCvv ? card.cvv : '***'}
                        </button>
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-white/60">Expires</p>
                        <p className="font-mono text-white">{card.expiry}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-white/60">Balance</p>
                        <p className="font-semibold text-white">{formatCurrency(card.balance, card.currency)}</p>
                    </div>
                </div>

                {card.status === 'frozen' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <Icons.Snowflake className="h-16 w-16 text-blue-400" />
                            <span className="font-medium text-white">Card Frozen</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function Cards() {
    const [cards] = useState<VirtualCard[]>([
        { id: '1', name: 'Primary Card', number: '4532 1234 5678 4291', expiry: '12/28', cvv: '123', status: 'active', balance: 5430, limit: 10000, type: 'virtual', network: 'visa', currency: 'USD' },
        { id: '2', name: 'Travel Card', number: '5425 2334 3010 9903', expiry: '09/27', cvv: '456', status: 'active', balance: 2100, limit: 5000, type: 'virtual', network: 'mastercard', currency: 'USD' },
        { id: '3', name: 'Shopping Card', number: '3782 8224 6310 005', expiry: '06/26', cvv: '789', status: 'frozen', balance: 890, limit: 3000, type: 'physical', network: 'visa', currency: 'USD' },
    ]);

    const [transactions] = useState<Transaction[]>([
        { id: '1', cardId: '1', merchant: 'Amazon', amount: 89.99, currency: 'USD', date: '2026-03-15', type: 'debit', category: 'Shopping', status: 'completed' },
        { id: '2', cardId: '1', merchant: 'Netflix', amount: 15.99, currency: 'USD', date: '2026-03-14', type: 'debit', category: 'Entertainment', status: 'completed' },
        { id: '3', cardId: '1', merchant: 'Refund', amount: -45.00, currency: 'USD', date: '2026-03-13', type: 'credit', category: 'Refund', status: 'completed' },
        { id: '4', cardId: '1', merchant: 'Uber', amount: 24.50, currency: 'USD', date: '2026-03-12', type: 'debit', category: 'Transport', status: 'pending' },
        { id: '5', cardId: '2', merchant: 'Airbnb', amount: 350.00, currency: 'USD', date: '2026-03-11', type: 'debit', category: 'Travel', status: 'completed' },
        { id: '6', cardId: '1', merchant: 'Apple Store', amount: 1299.00, currency: 'USD', date: '2026-03-10', type: 'debit', category: 'Shopping', status: 'declined' },
    ]);

    const [selectedCard, setSelectedCard] = useState<string>('1');
    const [showNumber, setShowNumber] = useState<Record<string, boolean>>({});
    const [showCvv, setShowCvv] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState('transactions');

    const selected = cards.find(c => c.id === selectedCard);
    const cardTransactions = transactions.filter(t => t.cardId === selectedCard);

    const toggleNumber = (id: string) => setShowNumber(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleCvv = (id: string) => setShowCvv(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleFreeze = (id: string) => {
        console.log('Toggle freeze for card:', id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-400';
            case 'pending': return 'text-amber-400';
            case 'declined': return 'text-rose-400';
            default: return 'text-zinc-400';
        }
    };

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">My Cards</h1>
                            <p className="text-sm text-zinc-400">{cards.length} cards • Total {formatCurrency(cards.reduce((sum, c) => sum + c.balance, 0))}</p>
                        </div>
                        <Button className="bg-indigo-500 hover:bg-indigo-600" asChild>
                            <Link href="/cards/new">
                                <Icons.Plus className="mr-2 h-4 w-4" /> Issue New Card
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {cards.map((card) => (
                                <Card3DTilt
                                    key={card.id}
                                    card={card}
                                    isSelected={selectedCard === card.id}
                                    onClick={() => setSelectedCard(card.id)}
                                    showNumber={showNumber[card.id] || false}
                                    showCvv={showCvv[card.id] || false}
                                    onToggleNumber={() => toggleNumber(card.id)}
                                    onToggleCvv={() => toggleCvv(card.id)}
                                    onFreeze={() => toggleFreeze(card.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {selected && (
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                                <Badge variant="secondary" className={selected.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}>
                                    {selected.status}
                                </Badge>
                            </div>

                            <div className="mb-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">Current Balance</span>
                                    <span className="font-medium text-white">{formatCurrency(selected.balance, selected.currency)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">Spending Limit</span>
                                    <span className="font-medium text-white">{formatCurrency(selected.limit, selected.currency)}</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 transition-all" 
                                        style={{ width: `${Math.min((selected.balance / selected.limit) * 100, 100)}%` }} 
                                    />
                                </div>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="mb-4 grid w-full grid-cols-2 bg-white/5">
                                    <TabsTrigger value="transactions" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
                                        <Icons.Clock className="mr-2 h-4 w-4" /> Transactions
                                    </TabsTrigger>
                                    <TabsTrigger value="controls" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
                                        <Icons.Settings className="mr-2 h-4 w-4" /> Controls
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="transactions" className="space-y-3">
                                    {cardTransactions.length > 0 ? (
                                        cardTransactions.slice(0, 5).map((tx) => (
                                            <div key={tx.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tx.type === 'debit' ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
                                                        {tx.type === 'debit' ? (
                                                            <Icons.ArrowUpRight className="h-4 w-4 text-rose-400" />
                                                        ) : (
                                                            <Icons.ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{tx.merchant}</p>
                                                        <p className="text-xs text-zinc-500">{tx.date} • {tx.category}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-medium ${tx.type === 'debit' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                        {tx.type === 'debit' ? '-' : '+'}{formatCurrency(Math.abs(tx.amount), tx.currency)}
                                                    </p>
                                                    <span className={`text-xs ${getStatusColor(tx.status)}`}>{tx.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-zinc-500">No transactions yet</p>
                                    )}
                                    <Button variant="ghost" className="w-full text-zinc-400" asChild>
                                        <Link href="/cards/transactions">View All Transactions</Link>
                                    </Button>
                                </TabsContent>

                                <TabsContent value="controls" className="space-y-4">
                                    {[
                                        { label: 'Online Transactions', enabled: true, icon: Icons.Globe },
                                        { label: 'In-Store Purchases', enabled: true, icon: Icons.CreditCard },
                                        { label: 'ATM Withdrawals', enabled: true, icon: Icons.Smartphone },
                                        { label: 'International Use', enabled: false, icon: Icons.Globe },
                                    ].map((control, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <control.icon className="h-4 w-4 text-zinc-400" />
                                                <span className="text-sm text-zinc-300">{control.label}</span>
                                            </div>
                                            <button
                                                className={`relative h-6 w-11 rounded-full transition-colors ${control.enabled ? 'bg-indigo-500' : 'bg-zinc-600'}`}
                                            >
                                                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${control.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full border-white/10" asChild>
                                        <Link href="/cards/controls">Manage All Controls</Link>
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </UserLayout>
    );
}
