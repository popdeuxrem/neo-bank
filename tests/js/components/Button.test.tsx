import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../resources/js/components/ButtonPrimary';

describe('Button', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>);
        expect(
            screen.getByRole('button', { name: /click me/i }),
        ).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByRole('button'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state', () => {
        render(<Button isLoading>Submit</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('renders different variants', () => {
        const { rerender } = render(<Button variant="default">Default</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button size="xl">Extra Large</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
