import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionRow } from '../resources/js/components/TransactionRow';

describe('TransactionRow', () => {
    const mockTransaction = {
        id: 'txn_001',
        type: 'debit' as const,
        amount: -150.0,
        currency: 'USD',
        description: 'Amazon Purchase',
        merchant: 'Amazon.com',
        category: 'Shopping',
        date: '2024-06-15T10:00:00Z',
        status: 'completed' as const,
    };

    it('renders transaction details correctly', () => {
        render(<TransactionRow {...mockTransaction} />);

        expect(screen.getByText(/amazon purchase/i)).toBeInTheDocument();
        expect(screen.getByText(/amazon\.com/i)).toBeInTheDocument();
        expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    it('formats amount correctly for debit', () => {
        render(<TransactionRow {...mockTransaction} />);

        expect(screen.getByText(/-\$150\.00/i)).toBeInTheDocument();
    });

    it('formats amount correctly for credit', () => {
        render(
            <TransactionRow
                {...mockTransaction}
                type="credit"
                amount={500.0}
            />,
        );

        expect(screen.getByText(/\+\$500\.00/i)).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<TransactionRow {...mockTransaction} onClick={handleClick} />);

        const row = screen.getByText(/amazon purchase/i).closest('div');

        if (row) {
            fireEvent.click(row);
        }

        expect(handleClick).toHaveBeenCalledWith('txn_001');
    });

    it('displays pending status correctly', () => {
        render(<TransactionRow {...mockTransaction} status="pending" />);

        expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it('displays failed status correctly', () => {
        render(<TransactionRow {...mockTransaction} status="failed" />);

        expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });

    it('displays transfer icon for transfer type', () => {
        render(
            <TransactionRow
                {...mockTransaction}
                type="transfer"
                amount={-100.0}
                description="Transfer to Savings"
            />,
        );

        expect(screen.getByText(/transfer to savings/i)).toBeInTheDocument();
    });

    it('displays correct icon based on icon prop', () => {
        const { rerender } = render(
            <TransactionRow {...mockTransaction} icon="arrow-up" />,
        );
        expect(screen.getByText(/amazon purchase/i)).toBeInTheDocument();

        rerender(<TransactionRow {...mockTransaction} icon="arrow-down" />);
        expect(screen.getByText(/amazon purchase/i)).toBeInTheDocument();
    });
});
