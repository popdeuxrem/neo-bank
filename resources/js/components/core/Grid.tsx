import * as React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
    children: React.ReactNode;
    className?: string;
    cols?: 1 | 2 | 3 | 4 | 6 | 12;
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const gapClasses = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
};

const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12',
};

export const Grid: React.FC<GridProps> = ({
    children,
    className,
    cols = 12,
    gap = 'md',
}) => {
    return (
        <div
            className={cn(
                'grid',
                cols < 12
                    ? colClasses[cols]
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-12',
                gapClasses[gap],
                className,
            )}
        >
            {children}
        </div>
    );
};

export default Grid;
