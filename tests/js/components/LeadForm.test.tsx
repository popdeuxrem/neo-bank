import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LeadForm } from '../resources/js/components/LeadForm';

describe('LeadForm', () => {
    it('renders form with input and button', () => {
        render(<LeadForm />);

        expect(
            screen.getByPlaceholderText(/enter your email/i),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /get started/i }),
        ).toBeInTheDocument();
    });

    it('shows error for empty email', async () => {
        render(<LeadForm />);

        const button = screen.getByRole('button', { name: /get started/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        });
    });

    it('shows error for invalid email', async () => {
        render(<LeadForm />);

        const input = screen.getByPlaceholderText(/enter your email/i);
        fireEvent.change(input, { target: { value: 'invalid-email' } });

        const button = screen.getByRole('button', { name: /get started/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByText(/please enter a valid email/i),
            ).toBeInTheDocument();
        });
    });

    it('calls onSubmit with valid email', async () => {
        const handleSubmit = vi.fn().mockResolvedValue(undefined);
        render(<LeadForm onSubmit={handleSubmit} />);

        const input = screen.getByPlaceholderText(/enter your email/i);
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        const button = screen.getByRole('button', { name: /get started/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith('test@example.com');
        });
    });

    it('shows success message after submission', async () => {
        render(<LeadForm />);

        const input = screen.getByPlaceholderText(/enter your email/i);
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        const button = screen.getByRole('button', { name: /get started/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/thanks!/i)).toBeInTheDocument();
        });
    });

    it('shows loading state during submission', async () => {
        const handleSubmit = vi
            .fn()
            .mockImplementation(
                () => new Promise((resolve) => setTimeout(resolve, 100)),
            );
        render(<LeadForm onSubmit={handleSubmit} />);

        const input = screen.getByPlaceholderText(/enter your email/i);
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        const button = screen.getByRole('button', { name: /get started/i });
        fireEvent.click(button);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('displays custom placeholder and button text', () => {
        render(
            <LeadForm
                placeholder="Enter your work email"
                buttonText="Join Now"
            />,
        );

        expect(
            screen.getByPlaceholderText(/enter your work email/i),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /join now/i }),
        ).toBeInTheDocument();
    });

    it('displays privacy message', () => {
        render(<LeadForm />);

        expect(screen.getByText(/no spam/i)).toBeInTheDocument();
    });
});
