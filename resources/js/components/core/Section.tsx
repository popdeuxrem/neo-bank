import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    spacing?: 'default' | 'none' | 'sm' | 'lg' | 'xl';
    as?: React.ElementType;
}

const spacingClasses = {
    none: '',
    sm: 'py-12',
    default: 'py-24',
    lg: 'py-32',
    xl: 'py-40',
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
    (
        { children, className, spacing = 'default', as: Component = 'section' },
        ref,
    ) => {
        return (
            <Component
                ref={ref}
                className={cn(spacingClasses[spacing], className)}
            >
                {children}
            </Component>
        );
    },
);
Section.displayName = 'Section';

export default Section;
