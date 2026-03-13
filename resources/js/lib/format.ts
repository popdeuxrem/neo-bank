const currencyFormatters: Map<string, Intl.NumberFormat> = new Map();

export function getCurrencyFormatter(
    currency: string = 'USD',
    locale: string = 'en-US',
): Intl.NumberFormat {
    const key = `${locale}-${currency}`;

    if (!currencyFormatters.has(key)) {
        currencyFormatters.set(
            key,
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        );
    }

    return currencyFormatters.get(key)!;
}

export function formatCurrency(
    amount: number,
    options?: {
        currency?: string;
        locale?: string;
        showSign?: boolean;
        compact?: boolean;
    },
): string {
    const {
        currency = 'USD',
        locale = 'en-US',
        showSign = false,
        compact = false,
    } = options || {};

    const formatter = compact
        ? new Intl.NumberFormat(locale, {
              style: 'currency',
              currency,
              notation: 'compact',
              maximumFractionDigits: 1,
          })
        : getCurrencyFormatter(currency, locale);

    const formatted = formatter.format(Math.abs(amount));

    if (showSign && amount !== 0) {
        return amount > 0 ? `+${formatted}` : `-${formatted}`;
    }

    return formatted;
}

export function formatNumber(
    value: number,
    options?: {
        locale?: string;
        decimals?: number;
        compact?: boolean;
    },
): string {
    const { locale = 'en-US', decimals, compact = false } = options || {};

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals ?? 0,
        maximumFractionDigits: decimals ?? 2,
        notation: compact ? 'compact' : 'standard',
    }).format(value);
}

export function formatPercent(
    value: number,
    options?: {
        locale?: string;
        decimals?: number;
        showSign?: boolean;
    },
): string {
    const { locale = 'en-US', decimals = 1, showSign = false } = options || {};

    const formatter = new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    const formatted = formatter.format(value / 100);

    if (showSign && value > 0) {
        return `+${formatted}`;
    }

    return formatted;
}

export function formatDate(
    date: Date | string,
    options?: {
        locale?: string;
        format?: 'short' | 'medium' | 'long' | 'full';
        includeTime?: boolean;
    },
): string {
    const {
        locale = 'en-US',
        format = 'medium',
        includeTime = false,
    } = options || {};

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const formatMap: Record<string, Intl.DateTimeFormatOptions> = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        medium: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric' },
        full: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        },
    };

    const formatOptions = { ...formatMap[format] };

    if (includeTime) {
        formatOptions.hour = 'numeric';
        formatOptions.minute = '2-digit';
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

export function formatRelativeTime(
    date: Date | string,
    locale: string = 'en-US',
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor(
        (now.getTime() - dateObj.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
        return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }

    return formatDate(dateObj, { locale });
}
