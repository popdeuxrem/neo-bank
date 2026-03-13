import * as React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ children, className, as: Component = 'div' }, ref) => {
        return (
            <Component
                ref={ref}
                className={cn('mx-auto w-full max-w-[1280px] px-6', className)}
            >
                {children}
            </Component>
        );
    },
);
Container.displayName = 'Container';

export default Container;
