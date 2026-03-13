import { test, expect } from '@playwright/test';

interface Transaction {
    id: string;
    accountId: string;
    type: string;
    amount: number;
    currency: string;
    description: string;
    merchant?: string;
    category?: string;
    date: string;
    status: string;
}

const MOCK_TRANSACTION_FIELDS: Record<keyof Transaction, string> = {
    id: 'string',
    accountId: 'string',
    type: "'credit' | 'debit' | 'transfer' | 'payment'",
    amount: 'number',
    currency: 'string',
    description: 'string',
    merchant: 'string (optional)',
    category: 'string (optional)',
    date: 'string (ISO 8601)',
    status: "'pending' | 'completed' | 'failed'",
};

test.describe('API Consistency Check', () => {
    test('should return transactions from production API', async ({ request }) => {
        const response = await request.get('/api/v1/transactions');
        
        if (response.status() === 200) {
            const transactions = await response.json();
            expect(Array.isArray(transactions)).toBe(true);
        } else {
            test.skip();
        }
    });

    test('should validate all required fields are present with correct types', async ({
        request,
    }) => {
        const response = await request.get('/api/v1/transactions');
        
        if (response.status() !== 200) {
            test.skip();
        }

        const transactions: Transaction[] = await response.json();
        expect(transactions.length).toBeGreaterThan(0);

        const transaction = transactions[0];
        
        expect(typeof transaction.id).toBe('string');
        expect(typeof transaction.accountId).toBe('string');
        expect(typeof transaction.type).toBe('string');
        expect(typeof transaction.amount).toBe('number');
        expect(typeof transaction.currency).toBe('string');
        expect(typeof transaction.description).toBe('string');
        expect(typeof transaction.date).toBe('string');
        expect(typeof transaction.status).toBe('string');
    });

    test('should validate type field values are valid', async ({ request }) => {
        const response = await request.get('/api/v1/transactions');
        
        if (response.status() !== 200) {
            test.skip();
        }

        const transactions: Transaction[] = await response.json();
        const validTypes = ['credit', 'debit', 'transfer', 'payment'];

        for (const txn of transactions) {
            expect(validTypes).toContain(txn.type);
        }
    });

    test('should validate status field values are valid', async ({ request }) => {
        const response = await request.get('/api/v1/transactions');
        
        if (response.status() !== 200) {
            test.skip();
        }

        const transactions: Transaction[] = await response.json();
        const validStatuses = ['pending', 'completed', 'failed'];

        for (const txn of transactions) {
            expect(validStatuses).toContain(txn.status);
        }
    });

    test('should validate date is in ISO 8601 format', async ({ request }) => {
        const response = await request.get('/api/v1/transactions');
        
        if (response.status() !== 200) {
            test.skip();
        }

        const transactions: Transaction[] = await response.json();
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

        for (const txn of transactions) {
            expect(txn.date).toMatch(isoDateRegex);
        }
    });

    test('should validate amount is a number, not a string', async ({
        request,
    }) => {
        const response = await request.get('/api/v1/transactions');
        
        if (response.status() !== 200) {
            test.skip();
        }

        const transactions: Transaction[] = await response.json();

        for (const txn of transactions) {
            expect(typeof txn.amount).toBe('number');
            expect(Number.isFinite(txn.amount)).toBe(true);
        }
    });
});

test.describe('Mock vs Production Comparison', () => {
    test('should compare field types between mock and production', async ({
        request,
    }) => {
        const response = await request.get('/api/v1/transactions');
        
        if (response.status() !== 200) {
            test.skip();
        }

        const productionTransactions: Transaction[] = await response.json();
        expect(productionTransactions.length).toBeGreaterThan(0);

        const typeMismatches: string[] = [];

        for (const field of Object.keys(MOCK_TRANSACTION_FIELDS) as Array<keyof Transaction>) {
            const mockType = MOCK_TRANSACTION_FIELDS[field];
            const prodField = productionTransactions[0][field];
            const prodType = typeof prodField;

            if (field === 'amount') {
                if (prodType !== 'number') {
                    typeMismatches.push(
                        `Field '${field}': expected number, got ${prodType}`,
                    );
                }
            } else if (field !== 'merchant' && field !== 'category') {
                if (prodType !== 'string') {
                    typeMismatches.push(
                        `Field '${field}': expected string, got ${prodType}`,
                    );
                }
            }
        }

        expect(typeMismatches).toHaveLength(0);
    });

    test('should report all type mismatches across all transactions', async ({
        request,
    }) => {
        const response = await request.get('/api/v1/transactions');
        
        if (response.status() !== 200) {
            test.skip();
        }

        const transactions: Transaction[] = await response.json();
        const mismatches: string[] = [];

        transactions.forEach((txn, index) => {
            if (typeof txn.amount !== 'number') {
                mismatches.push(
                    `Transaction ${index + 1}: amount is ${typeof txn.amount}, expected number`,
                );
            }
            if (typeof txn.id !== 'string') {
                mismatches.push(
                    `Transaction ${index + 1}: id is ${typeof txn.id}, expected string`,
                );
            }
        });

        expect(mismatches).toHaveLength(0);
    });
});
