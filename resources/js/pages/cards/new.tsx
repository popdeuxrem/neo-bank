import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLayout from '@/layouts/user-layout';

const Icons = {
    Plus: LucideIcons.Plus,
    Check: LucideIcons.Check,
    CreditCard: LucideIcons.CreditCard,
    Smartphone: LucideIcons.Smartphone,
    Building: LucideIcons.Building,
    DollarSign: LucideIcons.DollarSign,
    Calendar: LucideIcons.Calendar,
    User: LucideIcons.User,
    ArrowLeft: LucideIcons.ArrowLeft,
    ArrowRight: LucideIcons.ArrowRight,
    Shield: LucideIcons.Shield,
    Clock: LucideIcons.Clock,
    AlertCircle: LucideIcons.AlertCircle,
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

interface CardFormData {
    cardType: 'virtual' | 'physical';
    network: 'visa' | 'mastercard';
    currency: string;
    dailyLimit: number;
    monthlyLimit: number;
    cardholderName: string;
}

const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

export default function NewCard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CardFormData>({
        cardType: 'virtual',
        network: 'visa',
        currency: 'USD',
        dailyLimit: 1000,
        monthlyLimit: 5000,
        cardholderName: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateFormData = (field: keyof CardFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const formatCurrency = (amount: number) => {
        const currency = currencies.find(c => c.code === formData.currency);
        return `${currency?.symbol || '$'}${amount.toLocaleString()}`;
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(4);
        }, 1500);
    };

    const canProceed = () => {
        if (step === 1) return formData.cardType && formData.network;
        if (step === 2) return formData.currency && formData.dailyLimit > 0 && formData.monthlyLimit > 0;
        if (step === 3) return formData.cardholderName.length >= 2;
        return false;
    };

    const cardTypeDetails = {
        virtual: {
            title: 'Virtual Card',
            description: 'Instantly generated for online purchases. No physical card needed.',
            features: ['Instant activation', 'No delivery required', 'Perfect for online shopping', 'Lower fees'],
            icon: Icons.Smartphone,
        },
        physical: {
            title: 'Physical Card',
            description: 'Physical debit card delivered to your address. Use anywhere cards are accepted.',
            features: ['Works at ATMs', 'In-store purchases', 'Contactless payments', 'Premium design'],
            icon: Icons.CreditCard,
        },
    };

    const networkDetails = {
        visa: {
            name: 'Visa',
            color: 'from-[#1a1f71] to-[#2d42bc]',
            features: ['Global acceptance', 'Zero foreign transaction fees', 'Purchase protection'],
        },
        mastercard: {
            name: 'Mastercard',
            color: 'from-[#1a1a1a] via-[#2d2d2d] to-[#eb001b]',
            features: ['Worldwide acceptance', 'Mastercard ID theft protection', 'Zero liability protection'],
        },
    };

    return (
        <UserLayout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="mx-auto max-w-3xl space-y-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="mb-6">
                        <Button variant="ghost" size="sm" asChild className="mb-4 text-zinc-400">
                            <Link href="/cards">
                                <Icons.ArrowLeft className="mr-2 h-4 w-4" /> Back to Cards
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold text-white">Issue New Card</h1>
                        <p className="text-sm text-zinc-400">
                            {step === 4 ? 'Your card has been issued successfully!' : 'Follow the steps to create your new card'}
                        </p>
                    </div>
                </motion.div>

                {step < 4 && (
                    <motion.div variants={fadeUp}>
                        <div className="mb-8 flex items-center justify-center gap-2">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                        step >= s ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500'
                                    }`}>
                                        {step > s ? <Icons.Check className="h-4 w-4" /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`h-0.5 w-12 ${step > s ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <motion.div variants={fadeUp}>
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Select Card Type</h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {(['virtual', 'physical'] as const).map((type) => {
                                        const details = cardTypeDetails[type];
                                        const Icon = details.icon;
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => updateFormData('cardType', type)}
                                                className={`relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all ${
                                                    formData.cardType === type
                                                        ? 'border-indigo-500 bg-indigo-500/10'
                                                        : 'border-white/10 bg-white/5 hover:border-white/20'
                                                }`}
                                            >
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
                                                    <Icon className="h-6 w-6 text-indigo-400" />
                                                </div>
                                                <h3 className="mb-1 font-semibold text-white">{details.title}</h3>
                                                <p className="text-sm text-zinc-400">{details.description}</p>
                                                <ul className="mt-4 space-y-1">
                                                    {details.features.map((feature, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                                                            <Icons.Check className="h-3 w-3 text-emerald-400" /> {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                                {formData.cardType === type && (
                                                    <div className="absolute right-4 top-4">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                                                            <Icons.Check className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Select Card Network</h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {(['visa', 'mastercard'] as const).map((network) => {
                                        const details = networkDetails[network];
                                        return (
                                            <button
                                                key={network}
                                                onClick={() => updateFormData('network', network)}
                                                className={`relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all ${
                                                    formData.network === network
                                                        ? 'border-indigo-500 bg-indigo-500/10'
                                                        : 'border-white/10 bg-white/5 hover:border-white/20'
                                                }`}
                                            >
                                                <div className={`mb-4 h-16 rounded-lg bg-gradient-to-br ${details.color} p-4`}>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-white">{details.name}</span>
                                                        <div className="flex gap-1">
                                                            <div className="h-6 w-6 rounded-full border-2 border-white/30 bg-amber-400/80" />
                                                            <div className="h-6 w-6 rounded-full border-2 border-white/30 bg-rose-400/80 -ml-2" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <ul className="space-y-1">
                                                    {details.features.map((feature, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                                                            <Icons.Check className="h-3 w-3 text-emerald-400" /> {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                                {formData.network === network && (
                                                    <div className="absolute right-4 top-4">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                                                            <Icons.Check className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Card Settings</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-zinc-300">Currency</Label>
                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                            {currencies.map((currency) => (
                                                <button
                                                    key={currency.code}
                                                    onClick={() => updateFormData('currency', currency.code)}
                                                    className={`rounded-lg border p-3 text-center transition-all ${
                                                        formData.currency === currency.code
                                                            ? 'border-indigo-500 bg-indigo-500/10'
                                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="font-medium text-white">{currency.symbol}</div>
                                                    <div className="text-xs text-zinc-400">{currency.code}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label className="text-zinc-300">Daily Limit</Label>
                                            <div className="relative mt-1">
                                                <Icons.DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    type="number"
                                                    value={formData.dailyLimit}
                                                    onChange={(e) => updateFormData('dailyLimit', Number(e.target.value))}
                                                    className="border-white/10 bg-white/5 pl-9 text-white"
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-zinc-500">Maximum spending per day</p>
                                        </div>
                                        <div>
                                            <Label className="text-zinc-300">Monthly Limit</Label>
                                            <div className="relative mt-1">
                                                <Icons.DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    type="number"
                                                    value={formData.monthlyLimit}
                                                    onChange={(e) => updateFormData('monthlyLimit', Number(e.target.value))}
                                                    className="border-white/10 bg-white/5 pl-9 text-white"
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-zinc-500">Maximum spending per month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Limit Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Daily Limit</span>
                                        <span className="font-medium text-white">{formatCurrency(formData.dailyLimit)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Monthly Limit</span>
                                        <span className="font-medium text-white">{formatCurrency(formData.monthlyLimit)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Transactions per day</span>
                                        <span className="font-medium text-white">Unlimited</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Cardholder Information</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-zinc-300">Cardholder Name</Label>
                                        <div className="relative mt-1">
                                            <Icons.User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                            <Input
                                                type="text"
                                                placeholder="Name as it appears on card"
                                                value={formData.cardholderName}
                                                onChange={(e) => updateFormData('cardholderName', e.target.value)}
                                                className="border-white/10 bg-white/5 pl-9 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h2 className="mb-4 text-lg font-semibold text-white">Review & Confirm</h2>
                                <div className="space-y-4">
                                    <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6">
                                        <div className="mb-6 flex items-start justify-between">
                                            <div>
                                                <p className="text-xs text-white/60">Card Type</p>
                                                <p className="font-medium text-white capitalize">{formData.cardType}</p>
                                            </div>
                                            <div className="rounded-lg bg-white/20 px-3 py-1">
                                                <p className="text-xs text-white">Magnetiq</p>
                                            </div>
                                        </div>
                                        <p className="mb-6 font-mono text-xl tracking-widest text-white">**** **** **** ****</p>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xs text-white/60">Cardholder</p>
                                                <p className="font-medium text-white uppercase">{formData.cardholderName || 'YOUR NAME'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-white/60">Network</p>
                                                <p className="font-medium text-white uppercase">{formData.network}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="rounded-lg bg-white/5 p-4">
                                            <p className="text-xs text-zinc-500">Currency</p>
                                            <p className="font-medium text-white">{formData.currency}</p>
                                        </div>
                                        <div className="rounded-lg bg-white/5 p-4">
                                            <p className="text-xs text-zinc-500">Daily Limit</p>
                                            <p className="font-medium text-white">{formatCurrency(formData.dailyLimit)}</p>
                                        </div>
                                        <div className="rounded-lg bg-white/5 p-4">
                                            <p className="text-xs text-zinc-500">Monthly Limit</p>
                                            <p className="font-medium text-white">{formatCurrency(formData.monthlyLimit)}</p>
                                        </div>
                                        <div className="rounded-lg bg-white/5 p-4">
                                            <p className="text-xs text-zinc-500">Network</p>
                                            <p className="font-medium text-white capitalize">{formData.network}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-4">
                                <Icons.AlertCircle className="h-5 w-5 text-amber-400" />
                                <div>
                                    <p className="font-medium text-amber-400">Please review carefully</p>
                                    <p className="text-sm text-zinc-400">Once the card is issued, card type and network cannot be changed. Limits can be adjusted later.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                                        <Icons.Check className="h-8 w-8 text-emerald-400" />
                                    </div>
                                </div>
                                <h2 className="mb-2 text-xl font-bold text-white">Card Issued Successfully!</h2>
                                <p className="text-zinc-400">
                                    {formData.cardType === 'virtual' 
                                        ? 'Your virtual card is now ready to use. You can find the details in your cards dashboard.'
                                        : 'Your physical card will be delivered within 5-7 business days. You can track its status in your cards dashboard.'
                                    }
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                                <h3 className="mb-4 font-semibold text-white">What's Next?</h3>
                                <div className="space-y-3">
                                    {formData.cardType === 'virtual' ? (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                                                    <Icons.Smartphone className="h-4 w-4 text-indigo-400" />
                                                </div>
                                                <span className="text-zinc-300">View card details in your dashboard</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                                                    <Icons.CreditCard className="h-4 w-4 text-indigo-400" />
                                                </div>
                                                <span className="text-zinc-300">Add funds to start using your card</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                                                    <Icons.Clock className="h-4 w-4 text-indigo-400" />
                                                </div>
                                                <span className="text-zinc-300">Track delivery status in real-time</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                                                    <Icons.CreditCard className="h-4 w-4 text-indigo-400" />
                                                </div>
                                                <span className="text-zinc-300">Use virtual card while waiting for physical</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600" asChild>
                                    <Link href="/cards">View My Cards</Link>
                                </Button>
                                <Button variant="outline" className="flex-1 border-white/10" asChild>
                                    <Link href="/cards/transactions">View Transactions</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {step < 4 && (
                    <motion.div variants={fadeUp} className="flex gap-3">
                        {step > 1 && (
                            <Button variant="outline" className="border-white/10" onClick={() => setStep(step - 1)}>
                                <Icons.ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                                Continue <Icons.ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600" onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Confirm & Issue Card'}
                            </Button>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </UserLayout>
    );
}
