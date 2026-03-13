import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InputPill } from '../resources/js/components/InputPill';

describe('InputPill', () => {
    it('renders input with placeholder', () => {
        render(<InputPill placeholder="Enter your email" />);
        expect(
            screen.getByPlaceholderText(/enter your email/i),
        ).toBeInTheDocument();
    });

    it('renders with label', () => {
        render(<InputPill label="Email" placeholder="Enter your email" />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('handles input changes', () => {
        const handleChange = vi.fn();
        render(
            <InputPill
                placeholder="Enter your email"
                onChange={handleChange}
            />,
        );

        const input = screen.getByPlaceholderText(/enter your email/i);
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        expect(handleChange).toHaveBeenCalled();
    });

    it('displays error message', () => {
        render(
            <InputPill
                placeholder="Enter your email"
                error="Invalid email address"
            />,
        );

        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    it('shows icon when provided', () => {
        const { container } = render(
            <InputPill
                placeholder="Enter your email"
                icon={<span>Icon</span>}
            />,
        );

        expect(container.querySelector('.absolute')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<InputPill placeholder="Disabled" disabled />);

        const input = screen.getByPlaceholderText(/disabled/i);
        expect(input).toBeDisabled();
    });

    it('accepts different input types', () => {
        const { rerender } = render(
            <InputPill type="email" placeholder="Email" />,
        );
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();

        rerender(<InputPill type="password" placeholder="Password" />);
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

        rerender(<InputPill type="tel" placeholder="Phone" />);
        expect(screen.getByPlaceholderText(/phone/i)).toBeInTheDocument();
    });
});
