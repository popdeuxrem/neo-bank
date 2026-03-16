import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Account } from '@/lib/fake-data';

interface BalanceWidgetProps {
    balance: number;
    currency?: string;
    label?: string;
    trend?: number[];
    showTrend?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function BalanceWidget({ 
    balance, 
    currency = 'USD', 
    label = 'Balance',
    trend = [],
    showTrend = false,
    size = 'md' 
}: BalanceWidgetProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const springValue = useSpring(0, { stiffness: 100, damping: 30 });
    
    useEffect(() => {
        springValue.set(balance);
    }, [balance, springValue]);

    useEffect(() => {
        const unsubscribe = springValue.on('change', (v) => {
            setDisplayValue(v);
        });

        return () => unsubscribe();
    }, [springValue]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const sizeClasses = {
        sm: 'text-xl',
        md: 'text-3xl',
        lg: 'text-5xl',
    };

    const trendDirection = trend.length > 1 ? trend[trend.length - 1] - trend[0] : 0;
    const isPositive = trendDirection >= 0;

    return (
        <div className="flex flex-col">
            {label && <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>}
            <div className="flex items-baseline gap-2">
                <motion.span
                    className={`font-bold tracking-tight text-white ${sizeClasses[size]}`}
                >
                    {formatCurrency(displayValue)}
                </motion.span>
                {showTrend && trend.length > 0 && (
                    <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="text-xs font-medium">
                            {Math.abs(trendDirection).toFixed(1)}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
}

export function Sparkline({ 
    data, 
    width = 80, 
    height = 30, 
    color = '#6366f1',
    strokeWidth = 2 
}: SparklineProps) {
    if (!data || data.length === 0) {
return null;
}

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 4) - 2;

        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
            <circle
                cx={(data.length - 1) / (data.length - 1) * width}
                cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
                r="3"
                fill={color}
            />
        </svg>
    );
}

export function CurrencyDisplay({ 
    amount, 
    currency = 'USD',
    showFlag = true,
    size = 'md' 
}: { 
    amount: number; 
    currency?: string; 
    showFlag?: boolean;
    size?: 'sm' | 'md' | 'lg';
}) {
    const flags: Record<string, string> = {
        USD: '🇺🇸',
        EUR: '🇪🇺',
        GBP: '🇬🇧',
        JPY: '🇯🇵',
        CAD: '🇨🇦',
        AUD: '🇦🇺',
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <span className={`flex items-center gap-1 font-medium ${sizeClasses[size]}`}>
            {showFlag && flags[currency] && <span>{flags[currency]}</span>}
            <span>{formatCurrency(amount, currency)}</span>
        </span>
    );
}
