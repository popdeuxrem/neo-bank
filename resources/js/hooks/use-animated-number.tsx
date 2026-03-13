import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface UseAnimatedNumberOptions {
    duration?: number;
    format?: (value: number) => string;
    decimals?: number;
}

export function useAnimatedNumber(
    value: number,
    options: UseAnimatedNumberOptions = {}
): MotionValue<number> {
    const { duration = 1.5, decimals = 2 } = options;
    
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        stiffness: 100,
        damping: 30,
        mass: 1,
    });

    useEffect(() => {
        const controls = animate(motionValue, value, {
            duration,
            ease: [0.22, 1, 0.36, 1],
        });

        return controls.stop;
    }, [value, duration, motionValue]);

    return springValue;
}

export function useFormattedNumber(
    value: number,
    options: UseAnimatedNumberOptions = {}
): MotionValue<string> {
    const { format, decimals = 2 } = options;
    const motionValue = useAnimatedNumber(value, { decimals });
    const displayValue = useMotionValue('0');

    useEffect(() => {
        return motionValue.on('change', (latest) => {
            const formatted = format
                ? format(latest)
                : latest.toLocaleString('en-US', {
                      minimumFractionDigits: decimals,
                      maximumFractionDigits: decimals,
                  });
            displayValue.set(formatted);
        });
    }, [motionValue, displayValue, format, decimals]);

    return displayValue;
}

export function AnimatedNumber({
    value,
    prefix = '',
    suffix = '',
    decimals = 2,
    className,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
}) {
    const [displayValue, setDisplayValue] = useState(
        `${prefix}0${suffix}`
    );
    const animatedValue = useAnimatedNumber(value, { decimals });

    useEffect(() => {
        return animatedValue.on('change', (latest) => {
            setDisplayValue(
                `${prefix}${latest.toLocaleString('en-US', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                })}${suffix}`
            );
        });
    }, [animatedValue, prefix, suffix, decimals]);

    return (
        <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {displayValue}
        </span>
    );
}

export function useCountUp(
    endValue: number,
    duration: number = 1500
): number {
    const [value, setValue] = useState(0);
    const rafRef = useRef<number>();

    useEffect(() => {
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (endValue - startValue) * easeOutQuart;
            
            setValue(currentValue);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [endValue, duration]);

    return value;
}

export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatCompact(
    value: number,
    decimals: number = 1
): string {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(decimals)}B+`;
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(decimals)}M+`;
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(decimals)}K+`;
    }
    return value.toFixed(decimals);
}

export function formatPercentage(
    value: number,
    decimals: number = 1
): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}
