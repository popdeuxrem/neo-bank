import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRightLeft,
    Wallet,
    CheckCircle,
    Search,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface Account {
    id: string;
    userId: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment';
    balance: number;
    currency: string;
    last4?: string;
    isDefault: boolean;
}

interface TransferWizardProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: Account[];
    users: User[];
}

type TransferStep = 'select' | 'amount' | 'review' | 'success';

interface TransferState {
    step: TransferStep;
    sourceAccountId: string | null;
    recipientId: string | null;
    amount: number;
    isPending: boolean;
    optimisticBalance: number | null;
}

const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

export const TransferWizard: React.FC<TransferWizardProps> = ({
    isOpen,
    onClose,
    accounts,
    users,
}) => {
    const [direction, setDirection] = React.useState(1);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showRecipientDropdown, setShowRecipientDropdown] =
        React.useState(false);

    const [state, setState] = React.useState<TransferState>({
        step: 'select',
        sourceAccountId: null,
        recipientId: null,
        amount: 0,
        isPending: false,
        optimisticBalance: null,
    });

    const selectedAccount = accounts.find(
        (a) => a.id === state.sourceAccountId,
    );
    const selectedRecipient = users.find((u) => u.id === state.recipientId);

    const filteredUsers = React.useMemo(() => {
        if (!searchQuery.trim()) {
return [];
}

        const query = searchQuery.toLowerCase();

        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query),
        );
    }, [users, searchQuery]);

    const handleSelectAccount = (accountId: string) => {
        setState((prev) => ({
            ...prev,
            sourceAccountId: accountId,
        }));
    };

    const handleSelectRecipient = (user: User) => {
        setState((prev) => ({
            ...prev,
            recipientId: user.id,
        }));
        setSearchQuery(user.name);
        setShowRecipientDropdown(false);
    };

    const handleAmountChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        const maxAmount = selectedAccount?.balance || 0;
        const clampedValue = Math.min(numValue, maxAmount);

        setState((prev) => ({
            ...prev,
            amount: clampedValue,
        }));
    };

    const goToStep = (step: TransferStep) => {
        setDirection(step === 'success' ? 1 : 1);
        setState((prev) => ({ ...prev, step }));
    };

    const canProceedFromSelect = state.sourceAccountId && state.recipientId;
    const canProceedFromAmount =
        state.amount > 0 &&
        selectedAccount &&
        state.amount <= selectedAccount.balance;

    const handleNext = () => {
        if (state.step === 'select' && canProceedFromSelect) {
            goToStep('amount');
        } else if (state.step === 'amount' && canProceedFromAmount) {
            goToStep('review');
        } else if (state.step === 'review') {
            handleTransfer();
        }
    };

    const handleTransfer = async () => {
        if (!selectedAccount) {
return;
}

        setState((prev) => ({
            ...prev,
            isPending: true,
            optimisticBalance:
                prev.optimisticBalance !== null
                    ? prev.optimisticBalance
                    : selectedAccount.balance - prev.amount,
        }));

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setState((prev) => ({
            ...prev,
            isPending: false,
            step: 'success',
        }));
    };

    const handleReset = () => {
        setState({
            step: 'select',
            sourceAccountId: null,
            recipientId: null,
            amount: 0,
            isPending: false,
            optimisticBalance: null,
        });
        setSearchQuery('');
        onClose();
    };

    const downloadReceipt = () => {
        const receiptData = {
            from: selectedAccount?.name,
            to: selectedRecipient?.name,
            amount: state.amount,
            currency: selectedAccount?.currency,
            date: new Date().toISOString(),
            transactionId: `TXN-${Date.now()}`,
        };
        const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${receiptData.transactionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const displayBalance =
        state.optimisticBalance !== null
            ? state.optimisticBalance
            : selectedAccount?.balance;

    const steps = [
        { id: 'select', label: 'Select' },
        { id: 'amount', label: 'Amount' },
        { id: 'review', label: 'Review' },
        { id: 'success', label: 'Success' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === state.step);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={handleReset}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                        }}
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-xl"
                    >
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between border-b px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <ArrowRightLeft className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Transfer Money
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Step {currentStepIndex + 1} of 4
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex gap-2 border-b px-6 py-3">
                                {steps.map((s, i) => (
                                    <div
                                        key={s.id}
                                        className={cn(
                                            'h-1 flex-1 rounded-full transition-colors',
                                            i <= currentStepIndex
                                                ? 'bg-primary'
                                                : 'bg-muted',
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <AnimatePresence mode="wait">
                                    {state.step === 'select' && (
                                        <motion.div
                                            key="select"
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            custom={direction}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Source Account
                                                </label>
                                                <div className="space-y-2">
                                                    {accounts.map((account) => (
                                                        <button
                                                            key={account.id}
                                                            onClick={() =>
                                                                handleSelectAccount(
                                                                    account.id,
                                                                )
                                                            }
                                                            className={cn(
                                                                'flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:border-primary/50',
                                                                state.sourceAccountId ===
                                                                    account.id
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-border',
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                                    <Wallet className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            account.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {account.type
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase() +
                                                                            account.type.slice(
                                                                                1,
                                                                            )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="font-medium">
                                                                {formatCurrency(
                                                                    account.balance,
                                                                    account.currency,
                                                                )}
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Recipient
                                                </label>
                                                <div className="relative">
                                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => {
                                                            setSearchQuery(
                                                                e.target.value,
                                                            );
                                                            setShowRecipientDropdown(
                                                                true,
                                                            );
                                                            setState(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    recipientId:
                                                                        null,
                                                                }),
                                                            );
                                                        }}
                                                        onFocus={() =>
                                                            setShowRecipientDropdown(
                                                                true,
                                                            )
                                                        }
                                                        placeholder="Search by name or email..."
                                                        className="w-full rounded-lg border border-input bg-background py-2.5 pr-4 pl-10 text-sm outline-none focus:border-primary"
                                                    />
                                                    {showRecipientDropdown &&
                                                        filteredUsers.length >
                                                            0 && (
                                                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-background shadow-lg">
                                                                {filteredUsers.map(
                                                                    (user) => (
                                                                        <button
                                                                            key={
                                                                                user.id
                                                                            }
                                                                            onClick={() =>
                                                                                handleSelectRecipient(
                                                                                    user,
                                                                                )
                                                                            }
                                                                            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"
                                                                        >
                                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                                                                {user.name.charAt(
                                                                                    0,
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-medium">
                                                                                    {
                                                                                        user.name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        user.email
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </button>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                                {selectedRecipient && (
                                                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary/5 p-3">
                                                        <CheckCircle className="h-4 w-4 text-primary" />
                                                        <span className="text-sm">
                                                            {
                                                                selectedRecipient.name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {state.step === 'amount' && (
                                        <motion.div
                                            key="amount"
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            custom={direction}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Amount
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-xl font-medium text-muted-foreground">
                                                        $
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={
                                                            state.amount || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleAmountChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="0.00"
                                                        className="w-full rounded-lg border border-input bg-background py-4 pr-4 pl-10 text-2xl font-semibold outline-none focus:border-primary"
                                                    />
                                                </div>
                                            </div>

                                            <div className="rounded-lg border bg-muted/50 p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Available Balance
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatCurrency(
                                                            selectedAccount?.balance ||
                                                                0,
                                                            selectedAccount?.currency,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        After Transfer
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'font-medium',
                                                            displayBalance !==
                                                                undefined &&
                                                                displayBalance <
                                                                    0
                                                                ? 'text-red-500'
                                                                : '',
                                                        )}
                                                    >
                                                        {formatCurrency(
                                                            Math.max(
                                                                0,
                                                                displayBalance ||
                                                                    0,
                                                            ),
                                                            selectedAccount?.currency,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {state.amount >
                                                (selectedAccount?.balance ||
                                                    0) && (
                                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                                    Insufficient funds. You can
                                                    transfer up to{' '}
                                                    {formatCurrency(
                                                        selectedAccount?.balance ||
                                                            0,
                                                        selectedAccount?.currency,
                                                    )}
                                                    .
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {state.step === 'review' && (
                                        <motion.div
                                            key="review"
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            custom={direction}
                                            className="space-y-6"
                                        >
                                            <div className="rounded-lg border p-4">
                                                <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                                                    Transfer Details
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">
                                                            From
                                                        </span>
                                                        <span className="font-medium">
                                                            {
                                                                selectedAccount?.name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">
                                                            To
                                                        </span>
                                                        <span className="font-medium">
                                                            {
                                                                selectedRecipient?.name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">
                                                            Amount
                                                        </span>
                                                        <span className="text-xl font-bold">
                                                            {formatCurrency(
                                                                state.amount,
                                                                selectedAccount?.currency,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleTransfer}
                                                disabled={state.isPending}
                                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                                            >
                                                {state.isPending ? (
                                                    <>
                                                        <motion.div
                                                            animate={{
                                                                rotate: 360,
                                                            }}
                                                            transition={{
                                                                duration: 1,
                                                                repeat: Infinity,
                                                                ease: 'linear',
                                                            }}
                                                            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                                                        />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Confirm Transfer
                                                        <ArrowRight className="h-4 w-4" />
                                                    </>
                                                )}
                                            </button>
                                        </motion.div>
                                    )}

                                    {state.step === 'success' && (
                                        <motion.div
                                            key="success"
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            custom={direction}
                                            className="flex flex-col items-center justify-center space-y-6 py-8"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: 'spring',
                                                    damping: 15,
                                                    stiffness: 200,
                                                }}
                                            >
                                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                                </div>
                                            </motion.div>

                                            <div className="text-center">
                                                <h3 className="text-xl font-semibold">
                                                    Transfer Successful!
                                                </h3>
                                                <p className="mt-1 text-muted-foreground">
                                                    {formatCurrency(
                                                        state.amount,
                                                        selectedAccount?.currency,
                                                    )}{' '}
                                                    sent to{' '}
                                                    {selectedRecipient?.name}
                                                </p>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={downloadReceipt}
                                                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                                >
                                                    Download Receipt
                                                </button>
                                                <button
                                                    onClick={handleReset}
                                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {state.step !== 'success' && (
                                <div className="border-t p-6">
                                    {state.step === 'select' && (
                                        <button
                                            onClick={handleNext}
                                            disabled={!canProceedFromSelect}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            Continue
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    )}
                                    {state.step === 'amount' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() =>
                                                    goToStep('select')
                                                }
                                                className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-colors hover:bg-muted"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                Back
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={!canProceedFromAmount}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                                            >
                                                Continue
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                    {state.step === 'review' && (
                                        <button
                                            onClick={() => goToStep('amount')}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg border py-3 font-medium transition-colors hover:bg-muted"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Edit Transfer
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TransferWizard;
