import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const currencyFlags: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
};

const exchangeRates: Record<string, number> = {
    'USD-EUR': 0.92,
    'USD-GBP': 0.78,
    'EUR-USD': 1.09,
    'GBP-USD': 1.28,
    'EUR-GBP': 0.85,
    'GBP-EUR': 1.18,
};

interface CurrencyConverterProps {
    initialFrom?: string;
    initialTo?: string;
    initialAmount?: number;
}

export function CurrencyConverter({ initialFrom = 'USD', initialTo = 'EUR', initialAmount = 1000 }: CurrencyConverterProps) {
    const [fromCurrency, setFromCurrency] = useState(initialFrom);
    const [toCurrency, setToCurrency] = useState(initialTo);
    const [fromAmount, setFromAmount] = useState(initialAmount);
    const [toAmount, setToAmount] = useState(0);
    const [rateCountdown, setRateCountdown] = useState(30);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const key = `${fromCurrency}-${toCurrency}`;
        const rate = exchangeRates[key] || 1;
        setToAmount(fromAmount * rate);
    }, [fromCurrency, toCurrency, fromAmount]);

    useEffect(() => {
        const timer = setInterval(() => {
            setRateCountdown((prev) => (prev > 0 ? prev - 1 : 30));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getRate = () => {
        const key = `${fromCurrency}-${toCurrency}`;
        return exchangeRates[key] || 1;
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Currency Converter</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <RefreshCw className="h-3 w-3" />
                    Rate refreshes in {rateCountdown}s
                </div>
            </div>

            <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-zinc-800/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <Label className="text-sm text-zinc-400">You pay</Label>
                        <span className="text-sm font-medium text-zinc-300">{currencyFlags[fromCurrency]} {fromCurrency}</span>
                    </div>
                    <Input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(parseFloat(e.target.value) || 0)}
                        className="border-0 bg-transparent text-2xl font-bold text-white focus-visible:ring-0"
                    />
                </div>

                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-white/10 bg-zinc-800 hover:bg-zinc-700"
                        onClick={swapCurrencies}
                    >
                        <ArrowRight className="h-4 w-4 text-zinc-400" />
                    </Button>
                </div>

                <div className="rounded-xl border border-white/10 bg-zinc-800/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <Label className="text-sm text-zinc-400">They receive</Label>
                        <span className="text-sm font-medium text-zinc-300">{currencyFlags[toCurrency]} {toCurrency}</span>
                    </div>
                    <Input
                        type="number"
                        value={toAmount.toFixed(2)}
                        readOnly
                        className="border-0 bg-transparent text-2xl font-bold text-emerald-400 focus-visible:ring-0"
                    />
                </div>

                <div className="rounded-lg bg-indigo-500/10 p-3 text-center">
                    <p className="text-xs text-indigo-400">
                        1 {fromCurrency} = {getRate().toFixed(4)} {toCurrency}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 border-white/10 text-zinc-300 hover:bg-white/5"
                        onClick={() => setFromCurrency('USD')}
                    >
                        USD
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 border-white/10 text-zinc-300 hover:bg-white/5"
                        onClick={() => setFromCurrency('EUR')}
                    >
                        EUR
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 border-white/10 text-zinc-300 hover:bg-white/5"
                        onClick={() => setFromCurrency('GBP')}
                    >
                        GBP
                    </Button>
                </div>
            </div>
        </div>
    );
}
