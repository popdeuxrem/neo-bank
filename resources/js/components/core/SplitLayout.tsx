import * as React from 'react';
import { cn } from '@/lib/utils';

interface SplitLayoutProps {
    children: React.ReactNode;
    className?: string;
    reverse?: boolean;
    align?: 'start' | 'center' | 'stretch';
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
    children,
    className,
    reverse = false,
    align = 'center',
}) => {
    const alignClasses = {
        start: 'items-start',
        center: 'items-center',
        stretch: 'items-stretch',
    };

    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12',
                alignClasses[align],
                reverse && 'lg:flex-row-reverse',
                className,
            )}
        >
            {children}
        </div>
    );
};

interface SplitContentProps {
    children: React.ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export const SplitContent: React.FC<SplitContentProps> = ({
    children,
    className,
    colSpan = 6,
}) => {
    return (
        <div className={cn('col-span-1 lg:col-span-6', className)}>
            {children}
        </div>
    );
};

interface SplitVisualProps {
    children: React.ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export const SplitVisual: React.FC<SplitVisualProps> = ({
    children,
    className,
    colSpan = 6,
}) => {
    return (
        <div className={cn('col-span-1 lg:col-span-6', className)}>
            {children}
        </div>
    );
};

export default SplitLayout;
