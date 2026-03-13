import type { User, Account, Transaction, Payment } from './api';

export const mockUsers: User[] = [
    {
        id: 'usr_001',
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '+1 (555) 123-4567',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        createdAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'usr_002',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        phone: '+1 (555) 987-6543',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        createdAt: '2024-02-20T14:30:00Z',
    },
];

export const mockAccounts: Account[] = [
    {
        id: 'acc_001',
        userId: 'usr_001',
        name: 'Primary Checking',
        type: 'checking',
        balance: 15750.89,
        currency: 'USD',
        last4: '4521',
        isDefault: true,
        createdAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'acc_002',
        userId: 'usr_001',
        name: 'Savings Account',
        type: 'savings',
        balance: 45000.0,
        currency: 'USD',
        last4: '8832',
        isDefault: false,
        createdAt: '2024-01-20T09:00:00Z',
    },
    {
        id: 'acc_003',
        userId: 'usr_001',
        name: 'Investment Portfolio',
        type: 'investment',
        balance: 125000.5,
        currency: 'USD',
        isDefault: false,
        createdAt: '2024-02-10T11:00:00Z',
    },
    {
        id: 'acc_004',
        userId: 'usr_001',
        name: 'Business Credit',
        type: 'credit',
        balance: -2500.0,
        currency: 'USD',
        last4: '7734',
        isDefault: false,
        createdAt: '2024-03-01T08:00:00Z',
    },
];

const categories = [
    'Food & Dining',
    'Shopping',
    'Transportation',
    'Entertainment',
    'Bills & Utilities',
    'Health & Fitness',
    'Travel',
    'Income',
    'Transfer',
    'Groceries',
];

const merchants = [
    'Amazon',
    'Starbucks',
    'Uber',
    'Netflix',
    'Whole Foods',
    'Apple',
    'Spotify',
    'Target',
    'Walmart',
    'Shell Gas',
    'Costco',
    'CVS Pharmacy',
    'DoorDash',
    'Airbnb',
    'Direct Deposit',
    'Payroll',
    'Venmo',
    'Zelle',
    'Wire Transfer',
    'ATM Withdrawal',
];

const statuses: Transaction['status'][] = ['completed', 'pending', 'failed'];

function randomDate(start: Date, end: Date): Date {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
}

function generateTransactions(count: number): Transaction[] {
    const transactions: Transaction[] = [];
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < count; i++) {
        const isCredit = Math.random() > 0.6;
        const isTransfer = Math.random() > 0.8;
        const type = isTransfer
            ? 'transfer'
            : isCredit
              ? 'credit'
              : Math.random() > 0.5
                ? 'debit'
                : 'payment';

        const amount =
            type === 'credit'
                ? Math.round(Math.random() * 5000 * 100) / 100
                : -Math.round(Math.random() * 500 * 100) / 100;

        const merchant = isCredit
            ? ['Direct Deposit', 'Payroll', 'Refund', 'Transfer Received'][
                  Math.floor(Math.random() * 4)
              ]
            : merchants[Math.floor(Math.random() * merchants.length)];

        transactions.push({
            id: `txn_${String(i + 1).padStart(4, '0')}`,
            accountId: 'acc_001',
            type,
            amount,
            currency: 'USD',
            description: merchant,
            merchant,
            category: isCredit
                ? 'Income'
                : categories[Math.floor(Math.random() * categories.length)],
            date: randomDate(sixMonthsAgo, now).toISOString(),
            status:
                Math.random() > 0.95
                    ? 'pending'
                    : Math.random() > 0.98
                      ? 'failed'
                      : 'completed',
        });
    }

    return transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export const mockTransactions: Transaction[] = generateTransactions(50);

export const mockPayments: Payment[] = [
    {
        id: 'pmt_001',
        userId: 'usr_001',
        amount: 250.0,
        currency: 'USD',
        recipientName: 'Electric Company',
        recipientAccount: '****1234',
        description: 'Monthly electric bill',
        status: 'completed',
        createdAt: '2024-06-01T10:00:00Z',
    },
    {
        id: 'pmt_002',
        userId: 'usr_001',
        amount: 1500.0,
        currency: 'USD',
        recipientName: 'Rent Payment',
        recipientAccount: '****5678',
        description: 'June rent',
        status: 'completed',
        createdAt: '2024-06-01T08:00:00Z',
    },
    {
        id: 'pmt_003',
        userId: 'usr_001',
        amount: 89.99,
        currency: 'USD',
        recipientName: 'Internet Provider',
        recipientAccount: '****9012',
        description: 'Monthly internet',
        status: 'pending',
        createdAt: '2024-06-15T12:00:00Z',
    },
];

class MockApiService {
    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getUser(userId: string): Promise<User | null> {
        await this.delay(300);
        return mockUsers.find((u) => u.id === userId) || null;
    }

    async getAccounts(userId: string): Promise<Account[]> {
        await this.delay(300);
        return mockAccounts.filter((a) => a.userId === userId);
    }

    async getAccount(accountId: string): Promise<Account | null> {
        await this.delay(200);
        return mockAccounts.find((a) => a.id === accountId) || null;
    }

    async getTransactions(
        accountId: string,
        filters?: { startDate?: string; endDate?: string; type?: string },
    ): Promise<Transaction[]> {
        await this.delay(400);
        let transactions = mockTransactions.filter(
            (t) => t.accountId === accountId,
        );

        if (filters?.startDate) {
            transactions = transactions.filter(
                (t) => new Date(t.date) >= new Date(filters.startDate!),
            );
        }

        if (filters?.endDate) {
            transactions = transactions.filter(
                (t) => new Date(t.date) <= new Date(filters.endDate!),
            );
        }

        if (filters?.type) {
            transactions = transactions.filter((t) => t.type === filters.type);
        }

        return transactions;
    }

    async getTransaction(transactionId: string): Promise<Transaction | null> {
        await this.delay(200);
        return mockTransactions.find((t) => t.id === transactionId) || null;
    }

    async getPayments(userId: string): Promise<Payment[]> {
        await this.delay(300);
        return mockPayments.filter((p) => p.userId === userId);
    }

    async getPayment(paymentId: string): Promise<Payment | null> {
        await this.delay(200);
        return mockPayments.find((p) => p.id === paymentId) || null;
    }

    async createPayment(
        data: Omit<Payment, 'id' | 'createdAt' | 'status'>,
    ): Promise<Payment> {
        await this.delay(500);
        const newPayment: Payment = {
            ...data,
            id: `pmt_${String(mockPayments.length + 1).padStart(3, '0')}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        mockPayments.push(newPayment);
        return newPayment;
    }

    async getStats(accountId: string) {
        await this.delay(300);
        const accountTransactions = mockTransactions.filter(
            (t) => t.accountId === accountId,
        );

        const income = accountTransactions
            .filter((t) => t.type === 'credit' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = accountTransactions
            .filter(
                (t) =>
                    (t.type === 'debit' || t.type === 'payment') &&
                    t.status === 'completed',
            )
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const pending = accountTransactions
            .filter((t) => t.status === 'pending')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        return {
            income,
            expenses,
            pending,
            totalTransactions: accountTransactions.length,
        };
    }
}

export const mockApi = new MockApiService();
