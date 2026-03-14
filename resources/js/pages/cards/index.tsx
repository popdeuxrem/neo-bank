import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, EyeOff, Snowflake, Settings, MoreHorizontal, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserLayout from '@/layouts/user-layout';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
}

export default function Cards() {
    const [cards] = useState<VirtualCard[]>([
        { id: '1', name: 'Primary Card', number: '4532 1234 5678 4291', expiry: '12/28', cvv: '123', status: 'active', balance: 5430, limit: 10000, type: 'virtual' },
        { id: '2', name: 'Travel Card', number: '5425 2334 3010 9903', expiry: '09/27', cvv: '456', status: 'active', balance: 2100, limit: 5000, type: 'virtual' },
        { id: '3', name: 'Shopping Card', number: '3782 8224 6310 005', expiry: '06/26', cvv: '789', status: 'frozen', balance: 890, limit: 3000, type: 'physical' },
    ]);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [showNumber, setShowNumber] = useState<Record<string, boolean>>({});
    const [showCvv, setShowCvv] = useState<Record<string, boolean>>({});
    const [controls, setControls] = useState({
        online: true,
        inStore: true,
        atm: true,
        international: true,
    });

    const selected = cards.find(c => c.id === selectedCard);

    const toggleNumber = (id: string) => setShowNumber(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleCvv = (id: string) => setShowCvv(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Virtual Cards</h1>
                        <p className="text-sm text-zinc-400">{cards.length} cards • Total {formatCurrency(cards.reduce((sum, c) => sum + c.balance, 0))}</p>
                    </div>
                    <Button className="bg-indigo-500 hover:bg-indigo-600">
                        <Plus className="mr-2 h-4 w-4" /> Issue New Card
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        {cards.map((card) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedCard(card.id)}
                                className={`relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 transition-all hover:ring-2 ${
                                    selectedCard === card.id ? 'ring-2 ring-indigo-500' : 'ring-1 ring-white/10'
                                }`}
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-white">{card.name}</h3>
                                        <p className="text-xs text-zinc-500">{card.type === 'virtual' ? 'Virtual Card' : 'Physical Card'}</p>
                                    </div>
                                    <Badge variant={card.status === 'active' ? 'default' : 'secondary'} className={card.status === 'frozen' ? 'bg-blue-500/20 text-blue-400' : ''}>
                                        {card.status}
                                    </Badge>
                                </div>
                                <div className="mb-4">
                                    <p className="font-mono text-lg tracking-widest text-white">
                                        {showNumber[card.id] ? card.number : card.number.replace(/\d{4}(?=\d)/g, '****')}
                                    </p>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-zinc-500">Expires</p>
                                        <p className="font-mono text-white">{card.expiry}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500">CVV</p>
                                        <p className="font-mono text-white">{showCvv[card.id] ? card.cvv : '***'}</p>
                                    </div>
                                </div>
                                {card.status === 'frozen' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <Snowflake className="h-12 w-12 text-blue-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {selected && (
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => toggleNumber(selected.id)}>
                                        {showNumber[selected.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => toggleCvv(selected.id)}>
                                        {showCvv[selected.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="mb-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">Current Balance</span>
                                    <span className="font-medium text-white">{formatCurrency(selected.balance)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">Spending Limit</span>
                                    <span className="font-medium text-white">{formatCurrency(selected.limit)}</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${(selected.balance / selected.limit) * 100}%` }} />
                                </div>
                            </div>

                            <h3 className="mb-4 font-medium text-white">Card Controls</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">Online Transactions</span>
                                    <button 
                                        onClick={() => setControls({ ...controls, online: !controls.online })}
                                        className={`relative h-6 w-11 rounded-full transition-colors ${controls.online ? 'bg-indigo-500' : 'bg-zinc-600'}`}
                                    >
                                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${controls.online ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">In-Store Purchases</span>
                                    <button 
                                        onClick={() => setControls({ ...controls, inStore: !controls.inStore })}
                                        className={`relative h-6 w-11 rounded-full transition-colors ${controls.inStore ? 'bg-indigo-500' : 'bg-zinc-600'}`}
                                    >
                                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${controls.inStore ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">ATM Withdrawals</span>
                                    <button 
                                        onClick={() => setControls({ ...controls, atm: !controls.atm })}
                                        className={`relative h-6 w-11 rounded-full transition-colors ${controls.atm ? 'bg-indigo-500' : 'bg-zinc-600'}`}
                                    >
                                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${controls.atm ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">International</span>
                                    <button 
                                        onClick={() => setControls({ ...controls, international: !controls.international })}
                                        className={`relative h-6 w-11 rounded-full transition-colors ${controls.international ? 'bg-indigo-500' : 'bg-zinc-600'}`}
                                    >
                                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${controls.international ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2">
                                {selected.status === 'active' ? (
                                    <Button variant="outline" className="flex-1 border-white/10">
                                        <Snowflake className="mr-2 h-4 w-4" /> Freeze Card
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="flex-1 border-white/10">
                                        Unfreeze Card
                                    </Button>
                                )}
                                <Button variant="outline" className="flex-1 border-white/10">
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
