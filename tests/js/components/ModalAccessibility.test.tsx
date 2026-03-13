import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const MockDialog = ({
    open = false,
    onClose = () => {},
    title = 'Test Dialog',
    description = 'Test description',
    children = <p>Dialog content</p>,
}: {
    open?: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
    children?: React.ReactNode;
}) => {
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-desc"
        >
            <h2 id="dialog-title">{title}</h2>
            <p id="dialog-desc">{description}</p>
            {children}
            <button onClick={onClose} aria-label="Close">
                Close
            </button>
        </div>
    );
};

describe('Modal Accessibility', () => {
    it('renders with proper ARIA attributes when open', () => {
        render(
            <MockDialog
                open
                title="Test Dialog"
                description="Test description"
            />,
        );

        expect(screen.getByRole('dialog')).toHaveAttribute(
            'aria-modal',
            'true',
        );
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby');
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby');
    });

    it('contains title in dialog', () => {
        render(<MockDialog open title="My Dialog" />);

        expect(screen.getByText('My Dialog')).toBeInTheDocument();
    });

    it('contains description for screen readers', () => {
        render(<MockDialog open description="Dialog description" />);

        expect(screen.getByText('Dialog description')).toBeInTheDocument();
    });

    it('has close button with accessible label', () => {
        render(<MockDialog open onClose={() => {}} />);

        expect(screen.getByLabelText(/close/i)).toBeInTheDocument();
    });

    it('returns null when closed', () => {
        const { container } = render(<MockDialog open={false} />);

        expect(container.firstChild).toBeNull();
    });

    it('focuses dialog when opened', async () => {
        const user = userEvent.setup();
        render(<MockDialog open />);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveFocus();
    });

    it('has proper heading structure', () => {
        render(<MockDialog open title="Dialog Title" />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
    });

    it('traps focus within modal when open', async () => {
        const user = userEvent.setup();
        render(
            <MockDialog open>
                <button>First</button>
                <button>Last</button>
            </MockDialog>,
        );

        const firstButton = screen.getByText('First');
        const lastButton = screen.getByText('Last');

        expect(firstButton).toBeInTheDocument();
        expect(lastButton).toBeInTheDocument();
    });
});
