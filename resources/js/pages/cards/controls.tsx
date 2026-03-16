import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import UserLayout from '@/layouts/user-layout';

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-indigo-500' : 'bg-zinc-600'}`}
        >
            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );
}

const Icons = {
    ArrowLeft: LucideIcons.ArrowLeft,
    Save: LucideIcons.Save,
    Globe: LucideIcons.Globe,
    CreditCard: LucideIcons.CreditCard,
    Smartphone: LucideIcons.Smartphone,
    MapPin: LucideIcons.MapPin,
    Bell: LucideIcons.Bell,
    Shield: LucideIcons.Shield,
    DollarSign: LucideIcons.DollarSign,
    ShoppingBag: LucideIcons.ShoppingBag,
    Utensils: LucideIcons.Utensils,
    Car: LucideIcons.Car,
    Plane: LucideIcons.Plane,
    Film: LucideIcons.Film,
    Check: LucideIcons.Check,
    X: LucideIcons.X,
    AlertCircle: LucideIcons.AlertCircle,
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

interface CardControl {
    id: string;
    name: string;
    type: 'virtual' | 'physical';
    controls: {
        online: boolean;
        inStore: boolean;
        atm: boolean;
        contactless: boolean;
        international: boolean;
    };
    spendingLimit: {
        daily: number;
        monthly: number;
        perTransaction: number;
    };
    notifications: {
        transactions: boolean;
        largeSpend: boolean;
        lowBalance: boolean;
        foreignTransaction: boolean;
    };
    geographicRestrictions: {
        enabled: boolean;
        countries: string[];
    };
}

const mockCards: CardControl[] = [
    {
        id: '1',
        name: 'Primary Card',
        type: 'virtual',
        controls: { online: true, inStore: true, atm: false, contactless: true, international: true },
        spendingLimit: { daily: 1000, monthly: 5000, perTransaction: 500 },
        notifications: { transactions: true, largeSpend: true, lowBalance: true, foreignTransaction: false },
        geographicRestrictions: { enabled: false, countries: [] }
    },
    {
        id: '2',
        name: 'Travel Card',
        type: 'virtual',
        controls: { online: true, inStore: true, atm: true, contactless: true, international: true },
        spendingLimit: { daily: 2000, monthly: 10000, perTransaction: 1000 },
        notifications: { transactions: true, largeSpend: true, lowBalance: true, foreignTransaction: true },
        geographicRestrictions: { enabled: true, countries: ['US', 'UK', 'FR', 'DE', 'ES', 'IT'] }
    },
    {
        id: '3',
        name: 'Shopping Card',
        type: 'physical',
        controls: { online: true, inStore: true, atm: true, contactless: true, international: false },
        spendingLimit: { daily: 500, monthly: 2000, perTransaction: 200 },
        notifications: { transactions: true, largeSpend: false, lowBalance: true, foreignTransaction: false },
        geographicRestrictions: { enabled: false, countries: [] }
    },
];

const categoryIcons: Record<string, any> = {
    Shopping: Icons.ShoppingBag,
    Dining: Icons.Utensils,
    Transport: Icons.Car,
    Travel: Icons.Plane,
    Entertainment: Icons.Film,
};

export default function CardControls() {
    const [selectedCardId, setSelectedCardId] = useState('1');
    const [cards, setCards] = useState<CardControl[]>(mockCards);
    const [hasChanges, setHasChanges] = useState(false);

    const selectedCard = cards.find(c => c.id === selectedCardId);

    const updateCard = (field: string, value: any) => {
        if (!selectedCard) return;
        
        setCards(prev => prev.map(card => {
            if (card.id !== selectedCardId) return card;
            
            if (field.startsWith('controls.')) {
                const controlKey = field.split('.')[1];
                return { ...card, controls: { ...card.controls, [controlKey]: value } };
            }
            if (field.startsWith('notifications.')) {
                const notifKey = field.split('.')[1];
                return { ...card, notifications: { ...card.notifications, [notifKey]: value } };
            }
            if (field.startsWith('limit.')) {
                const limitKey = field.split('.')[1];
                return { ...card, spendingLimit: { ...card.spendingLimit, [limitKey]: Number(value) } };
            }
            if (field.startsWith('geo.')) {
                const geoKey = field.split('.')[1];
                return { ...card, geographicRestrictions: { ...card.geographicRestrictions, [geoKey]: value } };
            }
            return card;
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        toast.success('Card controls saved successfully');
        setHasChanges(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
                    <div className="mb-6">
                        <Button variant="ghost" size="sm" asChild className="mb-4 text-zinc-400">
                            <Link href="/cards">
                                <Icons.ArrowLeft className="mr-2 h-4 w-4" /> Back to Cards
                            </Link>
                        </Button>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Card Controls</h1>
                                <p className="text-sm text-zinc-400">Manage security settings and spending limits for your cards</p>
                            </div>
                            {hasChanges && (
                                <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={handleSave}>
                                    <Icons.Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {cards.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => setSelectedCardId(card.id)}
                                className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                                    selectedCardId === card.id
                                        ? 'border-indigo-500 bg-indigo-500/10'
                                        : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                            >
                                <Icons.CreditCard className="h-4 w-4" />
                                <span className="text-sm font-medium text-white">{card.name}</span>
                                <Badge variant="secondary" className="bg-white/10 text-zinc-300">
                                    {card.type}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {selectedCard && (
                    <>
                        <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center gap-2">
                                    <Icons.Shield className="h-5 w-5 text-indigo-400" />
                                    <h2 className="text-lg font-semibold text-white">Payment Controls</h2>
                                </div>
                                <p className="mb-4 text-sm text-zinc-400">Enable or disable payment methods for this card</p>
                                
                                <div className="space-y-4">
                                    {[
                                        { key: 'controls.online', label: 'Online Transactions', description: 'Payments made online', icon: Icons.Globe },
                                        { key: 'controls.inStore', label: 'In-Store Purchases', description: 'Card present transactions', icon: Icons.CreditCard },
                                        { key: 'controls.atm', label: 'ATM Withdrawals', description: 'Cash withdrawals', icon: Icons.Smartphone },
                                        { key: 'controls.contactless', label: 'Contactless Payments', description: 'NFC payments', icon: Icons.Bell },
                                        { key: 'controls.international', label: 'International Use', description: 'Transactions outside home country', icon: Icons.Globe },
                                    ].map((item) => {
                                        const isEnabled = selectedCard.controls[item.key.split('.')[1] as keyof typeof selectedCard.controls];
                                        return (
                                            <div key={item.key} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                                                        <item.icon className="h-5 w-5 text-zinc-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{item.label}</p>
                                                        <p className="text-xs text-zinc-500">{item.description}</p>
                                                    </div>
                                                </div>
                                                <ToggleSwitch
                                                    checked={isEnabled}
                                                    onChange={(checked: boolean) => updateCard(item.key, checked)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center gap-2">
                                    <Icons.DollarSign className="h-5 w-5 text-indigo-400" />
                                    <h2 className="text-lg font-semibold text-white">Spending Limits</h2>
                                </div>
                                <p className="mb-4 text-sm text-zinc-400">Set daily, monthly, and per-transaction limits</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-zinc-300">Daily Limit</Label>
                                        <div className="relative mt-1">
                                            <Icons.DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                            <Input
                                                type="number"
                                                value={selectedCard.spendingLimit.daily}
                                                onChange={(e) => updateCard('limit.daily', e.target.value)}
                                                className="border-white/10 bg-white/5 pl-9 text-white"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-zinc-500">Maximum amount per day</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-300">Monthly Limit</Label>
                                        <div className="relative mt-1">
                                            <Icons.DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                            <Input
                                                type="number"
                                                value={selectedCard.spendingLimit.monthly}
                                                onChange={(e) => updateCard('limit.monthly', e.target.value)}
                                                className="border-white/10 bg-white/5 pl-9 text-white"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-zinc-500">Maximum amount per month</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-300">Per-Transaction Limit</Label>
                                        <div className="relative mt-1">
                                            <Icons.DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                            <Input
                                                type="number"
                                                value={selectedCard.spendingLimit.perTransaction}
                                                onChange={(e) => updateCard('limit.perTransaction', e.target.value)}
                                                className="border-white/10 bg-white/5 pl-9 text-white"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-zinc-500">Maximum amount per single transaction</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center gap-2">
                                    <Icons.Bell className="h-5 w-5 text-indigo-400" />
                                    <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
                                </div>
                                <p className="mb-4 text-sm text-zinc-400">Choose which notifications to receive</p>
                                
                                <div className="space-y-4">
                                    {[
                                        { key: 'notifications.transactions', label: 'All Transactions', description: 'Get notified for every transaction' },
                                        { key: 'notifications.largeSpend', label: 'Large Purchases', description: 'Alert for purchases over $100' },
                                        { key: 'notifications.lowBalance', label: 'Low Balance', description: 'Alert when balance is low' },
                                        { key: 'notifications.foreignTransaction', label: 'Foreign Transactions', description: 'Alert for international purchases' },
                                    ].map((item) => {
                                        const isEnabled = selectedCard.notifications[item.key.split('.')[1] as keyof typeof selectedCard.notifications];
                                        return (
                                            <div key={item.key} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-white">{item.label}</p>
                                                    <p className="text-xs text-zinc-500">{item.description}</p>
                                                </div>
                                                <ToggleSwitch
                                                    checked={isEnabled}
                                                    onChange={(checked) => updateCard(item.key, checked)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <div className="mb-4 flex items-center gap-2">
                                    <Icons.MapPin className="h-5 w-5 text-indigo-400" />
                                    <h2 className="text-lg font-semibold text-white">Geographic Restrictions</h2>
                                </div>
                                <p className="mb-4 text-sm text-zinc-400">Restrict card usage to specific countries</p>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-white">Enable Restrictions</p>
                                            <p className="text-xs text-zinc-500">Only allow transactions in selected countries</p>
                                        </div>
                                        <ToggleSwitch
                                            checked={selectedCard.geographicRestrictions.enabled}
                                            onChange={(checked: boolean) => updateCard('geo.enabled', checked)}
                                        />
                                    </div>

                                    {selectedCard.geographicRestrictions.enabled && (
                                        <div>
                                            <Label className="text-zinc-300">Allowed Countries</Label>
                                            <Select 
                                                value={selectedCard.geographicRestrictions.countries[0] || ''}
                                                onValueChange={(value) => updateCard('geo.countries', [value])}
                                            >
                                                <SelectTrigger className="mt-1 border-white/10 bg-white/5">
                                                    <SelectValue placeholder="Select country" />
                                                </SelectTrigger>
                                                <SelectContent className="border-white/10 bg-zinc-900">
                                                    <SelectItem value="US">United States</SelectItem>
                                                    <SelectItem value="UK">United Kingdom</SelectItem>
                                                    <SelectItem value="CA">Canada</SelectItem>
                                                    <SelectItem value="AU">Australia</SelectItem>
                                                    <SelectItem value="DE">Germany</SelectItem>
                                                    <SelectItem value="FR">France</SelectItem>
                                                    <SelectItem value="JP">Japan</SelectItem>
                                                    <SelectItem value="ALL">All Countries</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {selectedCard.geographicRestrictions.countries.map((country) => (
                                                    <Badge key={country} variant="secondary" className="bg-white/10 text-zinc-300">
                                                        {country}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-3">
                                        <Icons.AlertCircle className="h-5 w-5 text-amber-400" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-400">Security Notice</p>
                                            <p className="text-xs text-zinc-400">
                                                Geographic restrictions may affect legitimate transactions while traveling. Consider disabling temporarily if traveling abroad.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6">
                                <h3 className="mb-2 font-semibold text-rose-400">Danger Zone</h3>
                                <p className="mb-4 text-sm text-zinc-400">These actions cannot be undone. Please proceed with caution.</p>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="outline" className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10">
                                        Freeze Card
                                    </Button>
                                    <Button variant="outline" className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10">
                                        Reset PIN
                                    </Button>
                                    <Button variant="outline" className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10">
                                        Cancel Card
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </UserLayout>
    );
}
