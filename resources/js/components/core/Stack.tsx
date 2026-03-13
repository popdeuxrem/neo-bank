import * as React from 'react';
import { cn } from '@/lib/utils';

interface StackProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'row' | 'column';
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const gapClasses = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-10',
    '3xl': 'gap-12',
};

const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
};

const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
};

export const Stack: React.FC<StackProps> = ({
    children,
    className,
    direction = 'column',
    gap = 'md',
    align = 'start',
    justify = 'start',
}) => {
    return (
        <div
            className={cn(
                'flex',
                direction === 'column' ? 'flex-col' : 'flex-row',
                gapClasses[gap],
                alignClasses[align],
                justifyClasses[justify],
                className,
            )}
        >
            {children}
        </div>
    );
};

export default Stack;
