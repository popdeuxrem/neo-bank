export interface Account {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'forex';
    currency: string;
    currencySymbol: string;
    accountNumber: string;
    routingNumber: string;
    balance: number;
    availableBalance: number;
    institution: string;
    status: 'active' | 'pending' | 'frozen';
    createdAt: string;
    mask: string;
}

export interface Transaction {
    id: string;
    accountId: string;
    accountName: string;
    merchant: string;
    merchantLogo?: string;
    category: string;
    categoryColor: string;
    amount: number;
    currency: string;
    type: 'debit' | 'credit' | 'transfer';
    status: 'completed' | 'pending' | 'failed' | 'flagged';
    timestamp: string;
    description: string;
    reference?: string;
    pending?: boolean;
}

export interface Payment {
    id: string;
    recipientName: string;
    recipientAccount: string;
    recipientBank: string;
    amount: number;
    currency: string;
    fee: number;
    exchangeRate?: number;
    recipientReceives?: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    createdAt: string;
    completedAt?: string;
    type: 'domestic' | 'international';
    reference: string;
}

export interface LedgerEntry {
    id: string;
    entryNumber: string;
    date: string;
    description: string;
    debits: {
        accountCode: string;
        accountName: string;
        amount: number;
    }[];
    credits: {
        accountCode: string;
        accountName: string;
        amount: number;
    }[];
    postedBy: string;
    status: 'draft' | 'posted' | 'voided';
}

export interface ChartDataPoint {
    date: string;
    balance: number;
    inflow: number;
    outflow: number;
}

export interface SparklineData {
    accountId: string;
    data: number[];
}

export interface SpendingCategory {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface ScheduledPayment {
    id: string;
    recipientName: string;
    amount: number;
    currency: string;
    scheduledDate: string;
    status: 'scheduled' | 'processing' | 'completed' | 'failed';
}

const generateSparkline = (days: number = 30, startValue: number, variance: number = 0.1): number[] => {
    const data: number[] = [];
    let current = startValue;
    
    for (let i = 0; i < days; i++) {
        const change = (Math.random() - 0.5) * 2 * variance * current;
        current += change;
        data.push(Math.max(0, current));
    }
    
    return data;
};

const generateChartData = (days: number = 30): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    let balance = 250000;
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const inflow = Math.random() > 0.3 ? Math.random() * 15000 + 1000 : 0;
        const outflow = Math.random() > 0.4 ? Math.random() * 10000 + 500 : 0;
        
        balance = balance + inflow - outflow;
        
        data.push({
            date: date.toISOString().split('T')[0],
            balance: Math.round(balance * 100) / 100,
            inflow: Math.round(inflow * 100) / 100,
            outflow: Math.round(outflow * 100) / 100,
        });
    }
    
    return data;
};

export const fakeAccounts: Account[] = [
    {
        id: 'acc_001',
        name: 'Primary Checking',
        type: 'checking',
        currency: 'USD',
        currencySymbol: '$',
        accountNumber: '****4521',
        routingNumber: '021000021',
        balance: 127543.89,
        availableBalance: 125043.89,
        institution: 'Neo Bank',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        mask: '4521',
    },
    {
        id: 'acc_002',
        name: 'High-Yield Savings',
        type: 'savings',
        currency: 'USD',
        currencySymbol: '$',
        accountNumber: '****7832',
        routingNumber: '021000021',
        balance: 85432.15,
        availableBalance: 85432.15,
        institution: 'Neo Bank',
        status: 'active',
        createdAt: '2024-02-20T14:15:00Z',
        mask: '7832',
    },
    {
        id: 'acc_003',
        name: 'Euro Account',
        type: 'forex',
        currency: 'EUR',
        currencySymbol: '€',
        accountNumber: '****9102',
        routingNumber: 'GENODEF1M08',
        balance: 45678.42,
        availableBalance: 45678.42,
        institution: 'Neo Bank Europe',
        status: 'active',
        createdAt: '2024-03-10T09:00:00Z',
        mask: '9102',
    },
    {
        id: 'acc_004',
        name: 'GBP Business',
        type: 'forex',
        currency: 'GBP',
        currencySymbol: '£',
        accountNumber: '****3456',
        routingNumber: 'BARCGB22',
        balance: 25738.14,
        availableBalance: 25738.14,
        institution: 'Neo Bank UK',
        status: 'active',
        createdAt: '2024-04-05T16:45:00Z',
        mask: '3456',
    },
];

export const fakeTransactions: Transaction[] = [
    {
        id: 'txn_001',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Stripe',
        category: 'Income',
        categoryColor: '#10b981',
        amount: 12847.50,
        currency: 'USD',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-03-13T14:32:00Z',
        description: 'Payment received from Stripe',
        reference: 'py_3O5kFjl2eZvKYlo',
    },
    {
        id: 'txn_002',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Amazon Web Services',
        category: 'Technology',
        categoryColor: '#f97316',
        amount: -1249.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-13T11:15:00Z',
        description: 'AWS Monthly Subscription',
        reference: 'aws_inv_202603',
    },
    {
        id: 'txn_003',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Whole Foods Market',
        category: 'Food',
        categoryColor: '#22c55e',
        amount: -187.43,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-12T18:45:00Z',
        description: 'Grocery shopping',
    },
    {
        id: 'txn_004',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Figma',
        category: 'Technology',
        categoryColor: '#f97316',
        amount: -144.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-12T10:20:00Z',
        description: 'Figma Professional - Monthly',
    },
    {
        id: 'txn_005',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Netflix',
        category: 'Entertainment',
        categoryColor: '#ef4444',
        amount: -15.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-11T09:00:00Z',
        description: 'Netflix Subscription',
    },
    {
        id: 'txn_006',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Uber',
        category: 'Transport',
        categoryColor: '#8b5cf6',
        amount: -24.50,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-11T22:30:00Z',
        description: 'Trip from Downtown',
    },
    {
        id: 'txn_007',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Apple',
        category: 'Technology',
        categoryColor: '#f97316',
        amount: -9.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-10T14:00:00Z',
        description: 'iCloud+ 200GB',
    },
    {
        id: 'txn_008',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'WeWork',
        category: 'Business',
        categoryColor: '#6366f1',
        amount: -450.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-10T08:00:00Z',
        description: 'WeWork Desk - March 2026',
    },
    {
        id: 'txn_009',
        accountId: 'acc_002',
        accountName: 'High-Yield Savings',
        merchant: 'Interest Payment',
        category: 'Income',
        categoryColor: '#10b981',
        amount: 312.47,
        currency: 'USD',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-03-09T00:00:00Z',
        description: 'Monthly Interest Payment',
    },
    {
        id: 'txn_010',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Direct Deposit - Acme Corp',
        category: 'Income',
        categoryColor: '#10b981',
        amount: 8500.00,
        currency: 'USD',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-03-08T09:00:00Z',
        description: 'Payroll - March 2026',
        reference: 'dd_acme_0308',
    },
    {
        id: 'txn_011',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Transfer to Savings',
        category: 'Transfer',
        categoryColor: '#3b82f6',
        amount: -2000.00,
        currency: 'USD',
        type: 'transfer',
        status: 'completed',
        timestamp: '2026-03-07T16:00:00Z',
        description: 'Transfer to High-Yield Savings',
    },
    {
        id: 'txn_012',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Target',
        category: 'Shopping',
        categoryColor: '#ec4899',
        amount: -156.78,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-06T14:30:00Z',
        description: 'Household items',
    },
    {
        id: 'txn_013',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Spotify',
        category: 'Entertainment',
        categoryColor: '#ef4444',
        amount: -9.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-05T12:00:00Z',
        description: 'Spotify Premium',
    },
    {
        id: 'txn_014',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Pending - DoorDash',
        category: 'Food',
        categoryColor: '#22c55e',
        amount: -67.80,
        currency: 'USD',
        type: 'debit',
        status: 'pending',
        timestamp: '2026-03-13T20:00:00Z',
        description: 'DoorDash Order - Pending',
        pending: true,
    },
    {
        id: 'txn_015',
        accountId: 'acc_003',
        accountName: 'Euro Account',
        merchant: 'Transfer from EUR Account',
        category: 'Transfer',
        categoryColor: '#3b82f6',
        amount: 5000.00,
        currency: 'EUR',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-03-04T10:00:00Z',
        description: 'Transfer from EUR Account',
    },
    {
        id: 'txn_016',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Payroll - Acme Corp',
        category: 'Income',
        categoryColor: '#10b981',
        amount: 8500.00,
        currency: 'USD',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-02-22T09:00:00Z',
        description: 'Payroll - February 2026',
    },
    {
        id: 'txn_017',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Venmo - John D',
        category: 'Transfer',
        categoryColor: '#3b82f6',
        amount: -150.00,
        currency: 'USD',
        type: 'transfer',
        status: 'completed',
        timestamp: '2026-02-20T15:30:00Z',
        description: 'Dinner split',
    },
    {
        id: 'txn_018',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Con Edison',
        category: 'Utilities',
        categoryColor: '#64748b',
        amount: -189.45,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-15T08:00:00Z',
        description: 'Electric Bill - February',
    },
    {
        id: 'txn_019',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Chase Mortgage',
        category: 'Housing',
        categoryColor: '#8b5cf6',
        amount: -2450.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-01T09:00:00Z',
        description: 'Mortgage Payment',
    },
    {
        id: 'txn_020',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Verizon',
        category: 'Utilities',
        categoryColor: '#64748b',
        amount: -89.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-28T10:00:00Z',
        description: 'Phone Bill - February',
    },
    {
        id: 'txn_021',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Gym Membership',
        category: 'Health',
        categoryColor: '#14b8a6',
        amount: -149.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-15T06:00:00Z',
        description: 'Equinox Membership',
    },
    {
        id: 'txn_022',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Refund - Amazon',
        category: 'Shopping',
        categoryColor: '#ec4899',
        amount: 45.99,
        currency: 'USD',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-01-12T14:00:00Z',
        description: 'Return refund',
    },
    {
        id: 'txn_023',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'NYC MetroCard',
        category: 'Transport',
        categoryColor: '#8b5cf6',
        amount: -33.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-10T09:30:00Z',
        description: 'MetroCard Reload',
    },
    {
        id: 'txn_024',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'CVS Pharmacy',
        category: 'Health',
        categoryColor: '#14b8a6',
        amount: -23.67,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-08T11:00:00Z',
        description: 'Prescription + Items',
    },
    {
        id: 'txn_025',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Starbucks',
        category: 'Food',
        categoryColor: '#22c55e',
        amount: -12.45,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-05T08:15:00Z',
        description: 'Coffee + Pastry',
    },
    {
        id: 'txn_026',
        accountId: 'acc_004',
        accountName: 'GBP Business',
        merchant: 'Client Payment - TechStart Ltd',
        category: 'Income',
        categoryColor: '#10b981',
        amount: 12500.00,
        currency: 'GBP',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-03-11T14:00:00Z',
        description: 'Invoice #INV-2026-034',
    },
    {
        id: 'txn_027',
        accountId: 'acc_004',
        accountName: 'GBP Business',
        merchant: 'Transfer to USD',
        category: 'Transfer',
        categoryColor: '#3b82f6',
        amount: -5000.00,
        currency: 'GBP',
        type: 'transfer',
        status: 'completed',
        timestamp: '2026-03-09T11:00:00Z',
        description: 'Currency conversion to USD',
    },
    {
        id: 'txn_028',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'LinkedIn Premium',
        category: 'Business',
        categoryColor: '#6366f1',
        amount: -29.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-03-01T10:00:00Z',
        description: 'LinkedIn Premium Business',
    },
    {
        id: 'txn_029',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Notion',
        category: 'Technology',
        categoryColor: '#f97316',
        amount: -8.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-28T09:00:00Z',
        description: 'Notion Team Plan',
    },
    {
        id: 'txn_030',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Adobe Creative Cloud',
        category: 'Technology',
        categoryColor: '#f97316',
        amount: -54.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-25T08:00:00Z',
        description: 'Adobe CC - Monthly',
    },
    {
        id: 'txn_031',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'JetBlue',
        category: 'Travel',
        categoryColor: '#0ea5e9',
        amount: -389.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-20T16:00:00Z',
        description: 'Flight to Miami',
    },
    {
        id: 'txn_032',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Marriott Hotel',
        category: 'Travel',
        categoryColor: '#0ea5e9',
        amount: -456.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-22T14:00:00Z',
        description: 'Hotel - Miami Business Trip',
    },
    {
        id: 'txn_033',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Petco',
        category: 'Shopping',
        categoryColor: '#ec4899',
        amount: -89.34,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-18T12:00:00Z',
        description: 'Pet supplies',
    },
    {
        id: 'txn_034',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'State Farm Insurance',
        category: 'Insurance',
        categoryColor: '#64748b',
        amount: -245.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-15T09:00:00Z',
        description: 'Auto Insurance - Monthly',
    },
    {
        id: 'txn_035',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Dropbox',
        category: 'Technology',
        categoryColor: '#f97316',
        amount: -11.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-10T11:00:00Z',
        description: 'Dropbox Plus',
    },
    {
        id: 'txn_036',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Etsy',
        category: 'Shopping',
        categoryColor: '#ec4899',
        amount: -67.50,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-08T15:00:00Z',
        description: 'Gift for friend',
    },
    {
        id: 'txn_037',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Steam',
        category: 'Entertainment',
        categoryColor: '#ef4444',
        amount: -49.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-02-05T20:00:00Z',
        description: 'Video game purchase',
    },
    {
        id: 'txn_038',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Transfer from Savings',
        category: 'Transfer',
        categoryColor: '#3b82f6',
        amount: 5000.00,
        currency: 'USD',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-02-01T10:00:00Z',
        description: 'Emergency fund withdrawal',
    },
    {
        id: 'txn_039',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Grubhub',
        category: 'Food',
        categoryColor: '#22c55e',
        amount: -45.67,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-30T19:00:00Z',
        description: 'Dinner delivery',
    },
    {
        id: 'txn_040',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'AT&T Internet',
        category: 'Utilities',
        categoryColor: '#64748b',
        amount: -79.99,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-25T08:00:00Z',
        description: 'Internet Bill',
    },
    {
        id: 'txn_041',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Costco',
        category: 'Shopping',
        categoryColor: '#ec4899',
        amount: -234.56,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-22T14:00:00Z',
        description: 'Bulk household items',
    },
    {
        id: 'txn_042',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Walmart',
        category: 'Shopping',
        categoryColor: '#ec4899',
        amount: -78.90,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-18T11:00:00Z',
        description: 'Household essentials',
    },
    {
        id: 'txn_043',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'American Express',
        category: 'Credit Card',
        categoryColor: '#f59e0b',
        amount: -1890.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-15T09:00:00Z',
        description: 'Credit Card Payment',
    },
    {
        id: 'txn_044',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'E*TRADE',
        category: 'Investment',
        categoryColor: '#10b981',
        amount: -1000.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-12T10:00:00Z',
        description: 'Monthly investment',
    },
    {
        id: 'txn_045',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'T-mobile',
        category: 'Utilities',
        categoryColor: '#64748b',
        amount: -85.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-10T08:00:00Z',
        description: 'Phone Bill',
    },
    {
        id: 'txn_046',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Refund - Target',
        category: 'Shopping',
        categoryColor: '#ec4899',
        amount: 56.78,
        currency: 'USD',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-01-08T14:00:00Z',
        description: 'Return refund',
    },
    {
        id: 'txn_047',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Payroll - Acme Corp',
        category: 'Income',
        categoryColor: '#10b981',
        amount: 8500.00,
        currency: 'USD',
        type: 'credit',
        status: 'completed',
        timestamp: '2026-01-05T09:00:00Z',
        description: 'Payroll - January 2026',
    },
    {
        id: 'txn_048',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Duane Reade',
        category: 'Health',
        categoryColor: '#14b8a6',
        amount: -34.56,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-03T10:00:00Z',
        description: 'Prescription',
    },
    {
        id: 'txn_049',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Postmates',
        category: 'Food',
        categoryColor: '#22c55e',
        amount: -52.30,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-02T19:00:00Z',
        description: 'New Year dinner',
    },
    {
        id: 'txn_050',
        accountId: 'acc_001',
        accountName: 'Primary Checking',
        merchant: 'Charity Donation',
        category: 'Donation',
        categoryColor: '#10b981',
        amount: -500.00,
        currency: 'USD',
        type: 'debit',
        status: 'completed',
        timestamp: '2026-01-01T12:00:00Z',
        description: 'Red Cross Donation',
    },
];

export const fakePayments: Payment[] = [
    {
        id: 'pmt_001',
        recipientName: 'Sarah Johnson',
        recipientAccount: '****5678',
        recipientBank: 'Chase Bank',
        amount: 2500.00,
        currency: 'USD',
        fee: 0,
        recipientReceives: 2500.00,
        status: 'completed',
        createdAt: '2026-03-10T14:30:00Z',
        completedAt: '2026-03-10T14:32:00Z',
        type: 'domestic',
        reference: 'PMT-2026-001',
    },
    {
        id: 'pmt_002',
        recipientName: 'Michael Chen',
        recipientAccount: '****9012',
        recipientBank: 'Bank of America',
        amount: 750.00,
        currency: 'USD',
        fee: 0,
        recipientReceives: 750.00,
        status: 'completed',
        createdAt: '2026-03-08T10:15:00Z',
        completedAt: '2026-03-08T10:17:00Z',
        type: 'domestic',
        reference: 'PMT-2026-002',
    },
    {
        id: 'pmt_003',
        recipientName: 'Emma Watson',
        recipientAccount: '****3456',
        recipientBank: 'Barclays UK',
        amount: 1000.00,
        currency: 'USD',
        fee: 15.00,
        exchangeRate: 0.7854,
        recipientReceives: 773.58,
        status: 'completed',
        createdAt: '2026-03-05T09:00:00Z',
        completedAt: '2026-03-05T09:05:00Z',
        type: 'international',
        reference: 'PMT-2026-003',
    },
    {
        id: 'pmt_004',
        recipientName: 'David Mueller',
        recipientAccount: '****7890',
        recipientBank: 'Deutsche Bank',
        amount: 2000.00,
        currency: 'USD',
        fee: 25.00,
        exchangeRate: 0.9234,
        recipientReceives: 1823.45,
        status: 'pending',
        createdAt: '2026-03-13T16:00:00Z',
        type: 'international',
        reference: 'PMT-2026-004',
    },
    {
        id: 'pmt_005',
        recipientName: 'Lisa Anderson',
        recipientAccount: '****2345',
        recipientBank: 'Wells Fargo',
        amount: 500.00,
        currency: 'USD',
        fee: 0,
        recipientReceives: 500.00,
        status: 'completed',
        createdAt: '2026-03-01T11:30:00Z',
        completedAt: '2026-03-01T11:32:00Z',
        type: 'domestic',
        reference: 'PMT-2026-005',
    },
    {
        id: 'pmt_006',
        recipientName: 'James Wilson',
        recipientAccount: '****6789',
        recipientBank: 'Citibank',
        amount: 1500.00,
        currency: 'USD',
        fee: 0,
        recipientReceives: 1500.00,
        status: 'failed',
        createdAt: '2026-02-28T15:00:00Z',
        type: 'domestic',
        reference: 'PMT-2026-006',
    },
    {
        id: 'pmt_007',
        recipientName: 'Sophie Martin',
        recipientAccount: '****4567',
        recipientBank: 'BNP Paribas',
        amount: 3000.00,
        currency: 'USD',
        fee: 35.00,
        exchangeRate: 0.9123,
        recipientReceives: 2705.67,
        status: 'completed',
        createdAt: '2026-02-25T08:45:00Z',
        completedAt: '2026-02-25T08:52:00Z',
        type: 'international',
        reference: 'PMT-2026-007',
    },
    {
        id: 'pmt_008',
        recipientName: 'Robert Taylor',
        recipientAccount: '****1234',
        recipientBank: 'US Bank',
        amount: 800.00,
        currency: 'USD',
        fee: 0,
        recipientReceives: 800.00,
        status: 'completed',
        createdAt: '2026-02-20T13:20:00Z',
        completedAt: '2026-02-20T13:22:00Z',
        type: 'domestic',
        reference: 'PMT-2026-008',
    },
    {
        id: 'pmt_009',
        recipientName: 'Yuki Tanaka',
        recipientAccount: '****8901',
        recipientBank: 'MUFG Bank',
        amount: 500.00,
        currency: 'USD',
        fee: 20.00,
        exchangeRate: 149.50,
        recipientReceives: 71760.00,
        status: 'completed',
        createdAt: '2026-02-15T10:00:00Z',
        completedAt: '2026-02-15T10:08:00Z',
        type: 'international',
        reference: 'PMT-2026-009',
    },
    {
        id: 'pmt_010',
        recipientName: 'Amanda Brown',
        recipientAccount: '****4321',
        recipientBank: 'PNC Bank',
        amount: 1200.00,
        currency: 'USD',
        fee: 0,
        recipientReceives: 1200.00,
        status: 'cancelled',
        createdAt: '2026-02-10T16:30:00Z',
        type: 'domestic',
        reference: 'PMT-2026-010',
    },
];

export const fakeLedgerEntries: LedgerEntry[] = [
    {
        id: 'led_001',
        entryNumber: 'JE-2026-001',
        date: '2026-03-13',
        description: 'Payment received from Stripe - Invoice #INV-1045',
        debits: [
            { accountCode: '1100', accountName: 'Cash', amount: 12847.50 },
        ],
        credits: [
            { accountCode: '4100', accountName: 'Revenue', amount: 12847.50 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_002',
        entryNumber: 'JE-2026-002',
        date: '2026-03-13',
        description: 'AWS Monthly Subscription - March 2026',
        debits: [
            { accountCode: '6100', accountName: 'Software Expense', amount: 1249.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 1249.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_003',
        entryNumber: 'JE-2026-003',
        date: '2026-03-12',
        description: 'Transfer to High-Yield Savings Account',
        debits: [
            { accountCode: '1200', accountName: 'Savings Account', amount: 2000.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Checking Account', amount: 2000.00 },
        ],
        postedBy: 'John Doe',
        status: 'posted',
    },
    {
        id: 'led_004',
        entryNumber: 'JE-2026-004',
        date: '2026-03-11',
        description: 'Payroll processing - March 2026',
        debits: [
            { accountCode: '5100', accountName: 'Payroll Expense', amount: 8500.00 },
        ],
        credits: [
            { accountCode: '2100', accountName: 'Accounts Payable', amount: 8500.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_005',
        entryNumber: 'JE-2026-005',
        date: '2026-03-10',
        description: 'Payment to Vendor - WeWork',
        debits: [
            { accountCode: '6200', accountName: 'Rent Expense', amount: 450.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 450.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_006',
        entryNumber: 'JE-2026-006',
        date: '2026-03-09',
        description: 'Monthly interest income',
        debits: [
            { accountCode: '1100', accountName: 'Cash', amount: 312.47 },
        ],
        credits: [
            { accountCode: '4200', accountName: 'Interest Income', amount: 312.47 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_007',
        entryNumber: 'JE-2026-007',
        date: '2026-03-08',
        description: 'Wire transfer received - Client Payment',
        debits: [
            { accountCode: '1100', accountName: 'Cash', amount: 12500.00 },
        ],
        credits: [
            { accountCode: '1300', accountName: 'GBP Account', amount: 12500.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_008',
        entryNumber: 'JE-2026-008',
        date: '2026-03-07',
        description: 'Currency conversion USD to GBP',
        debits: [
            { accountCode: '1300', accountName: 'GBP Account', amount: 6375.00 },
            { accountCode: '7100', accountName: 'FX Loss', amount: 125.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 6500.00 },
        ],
        postedBy: 'John Doe',
        status: 'posted',
    },
    {
        id: 'led_009',
        entryNumber: 'JE-2026-009',
        date: '2026-03-06',
        description: 'Equipment purchase - MacBook Pro',
        debits: [
            { accountCode: '1500', accountName: 'Equipment', amount: 2499.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 2499.00 },
        ],
        postedBy: 'John Doe',
        status: 'posted',
    },
    {
        id: 'led_010',
        entryNumber: 'JE-2026-010',
        date: '2026-03-05',
        description: 'Marketing expense - Facebook Ads',
        debits: [
            { accountCode: '6300', accountName: 'Marketing Expense', amount: 500.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 500.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_011',
        entryNumber: 'JE-2026-011',
        date: '2026-03-04',
        description: 'Professional services - Legal',
        debits: [
            { accountCode: '6400', accountName: 'Professional Fees', amount: 1500.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 1500.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_012',
        entryNumber: 'JE-2026-012',
        date: '2026-03-03',
        description: 'Office supplies purchase',
        debits: [
            { accountCode: '6500', accountName: 'Office Supplies', amount: 234.56 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 234.56 },
        ],
        postedBy: 'John Doe',
        status: 'posted',
    },
    {
        id: 'led_013',
        entryNumber: 'JE-2026-013',
        date: '2026-03-02',
        description: 'Travel expense - Miami Business Trip',
        debits: [
            { accountCode: '6600', accountName: 'Travel Expense', amount: 845.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 845.00 },
        ],
        postedBy: 'John Doe',
        status: 'posted',
    },
    {
        id: 'led_014',
        entryNumber: 'JE-2026-014',
        date: '2026-03-01',
        description: 'Insurance payment - General Liability',
        debits: [
            { accountCode: '6700', accountName: 'Insurance Expense', amount: 245.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 245.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_015',
        entryNumber: 'JE-2026-015',
        date: '2026-02-28',
        description: 'Utilities payment - Electric',
        debits: [
            { accountCode: '6800', accountName: 'Utilities', amount: 189.45 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 189.45 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_016',
        entryNumber: 'JE-2026-016',
        date: '2026-02-27',
        description: 'Client refund processed',
        debits: [
            { accountCode: '4100', accountName: 'Revenue', amount: 250.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 250.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_017',
        entryNumber: 'JE-2026-017',
        date: '2026-02-26',
        description: 'Bank fees - Monthly service charge',
        debits: [
            { accountCode: '6900', accountName: 'Bank Fees', amount: 25.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 25.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_018',
        entryNumber: 'JE-2026-018',
        date: '2026-02-25',
        description: 'Software subscription - Annual',
        debits: [
            { accountCode: '6100', accountName: 'Software Expense', amount: 1200.00 },
        ],
        credits: [
            { accountCode: '1100', accountName: 'Cash', amount: 1200.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_019',
        entryNumber: 'JE-2026-019',
        date: '2026-02-24',
        description: 'Payroll tax deposit',
        debits: [
            { accountCode: '5100', accountName: 'Payroll Expense', amount: 2150.00 },
        ],
        credits: [
            { accountCode: '2200', accountName: 'Payroll Tax Payable', amount: 2150.00 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
    {
        id: 'led_020',
        entryNumber: 'JE-2026-020',
        date: '2026-02-23',
        description: 'Depreciation expense - Equipment',
        debits: [
            { accountCode: '7000', accountName: 'Depreciation Expense', amount: 208.25 },
        ],
        credits: [
            { accountCode: '1510', accountName: 'Accumulated Depreciation', amount: 208.25 },
        ],
        postedBy: 'System',
        status: 'posted',
    },
];

export const fakeChartData = generateChartData(30);

export const fakeSparklines: Record<string, number[]> = {
    acc_001: generateSparkline(30, 120000, 0.08),
    acc_002: generateSparkline(30, 80000, 0.02),
    acc_003: generateSparkline(30, 45000, 0.05),
    acc_004: generateSparkline(30, 25000, 0.06),
};

export const fakeSpendingCategories: SpendingCategory[] = [
    { category: 'Housing', amount: 2450.00, percentage: 32, color: '#6366f1' },
    { category: 'Food', amount: 1823.45, percentage: 24, color: '#22c55e' },
    { category: 'Transport', amount: 892.30, percentage: 12, color: '#8b5cf6' },
    { category: 'Subscriptions', amount: 678.90, percentage: 9, color: '#f97316' },
    { category: 'Transfers', amount: 2150.00, percentage: 18, color: '#3b82f6' },
    { category: 'Other', amount: 562.45, percentage: 5, color: '#64748b' },
];

export const fakeScheduledPayments: ScheduledPayment[] = [
    {
        id: 'sch_001',
        recipientName: 'Chase Mortgage',
        amount: 2450.00,
        currency: 'USD',
        scheduledDate: '2026-04-01T09:00:00Z',
        status: 'scheduled',
    },
    {
        id: 'sch_002',
        recipientName: 'Con Edison',
        amount: 195.00,
        currency: 'USD',
        scheduledDate: '2026-03-15T08:00:00Z',
        status: 'scheduled',
    },
    {
        id: 'sch_003',
        recipientName: 'Equinox Gym',
        amount: 149.00,
        currency: 'USD',
        scheduledDate: '2026-03-15T06:00:00Z',
        status: 'scheduled',
    },
];

export const chartOfAccounts = [
    {
        type: 'Assets',
        code: '1000',
        accounts: [
            { code: '1100', name: 'Cash', balance: 127543.89, type: 'debit' },
            { code: '1200', name: 'Savings Account', balance: 85432.15, type: 'debit' },
            { code: '1300', name: 'Foreign Currency Account', balance: 71416.56, type: 'debit' },
            { code: '1500', name: 'Equipment', balance: 2499.00, type: 'debit' },
            { code: '1510', name: 'Accumulated Depreciation', balance: -208.25, type: 'credit' },
        ],
    },
    {
        type: 'Liabilities',
        code: '2000',
        accounts: [
            { code: '2100', name: 'Accounts Payable', balance: 8500.00, type: 'credit' },
            { code: '2200', name: 'Payroll Tax Payable', balance: 2150.00, type: 'credit' },
        ],
    },
    {
        type: 'Equity',
        code: '3000',
        accounts: [
            { code: '3100', name: 'Owners Equity', balance: 200000.00, type: 'credit' },
            { code: '3200', name: 'Retained Earnings', balance: 45632.15, type: 'credit' },
        ],
    },
    {
        type: 'Income',
        code: '4000',
        accounts: [
            { code: '4100', name: 'Revenue', balance: 32000.00, type: 'credit' },
            { code: '4200', name: 'Interest Income', balance: 312.47, type: 'credit' },
        ],
    },
    {
        type: 'Expenses',
        code: '5000',
        accounts: [
            { code: '5100', name: 'Payroll Expense', balance: 10650.00, type: 'debit' },
            { code: '6100', name: 'Software Expense', balance: 2449.00, type: 'debit' },
            { code: '6200', name: 'Rent Expense', balance: 450.00, type: 'debit' },
            { code: '6300', name: 'Marketing Expense', balance: 500.00, type: 'debit' },
            { code: '6400', name: 'Professional Fees', balance: 1500.00, type: 'debit' },
            { code: '6500', name: 'Office Supplies', balance: 234.56, type: 'debit' },
            { code: '6600', name: 'Travel Expense', balance: 845.00, type: 'debit' },
            { code: '6700', name: 'Insurance Expense', balance: 245.00, type: 'debit' },
            { code: '6800', name: 'Utilities', balance: 189.45, type: 'debit' },
            { code: '6900', name: 'Bank Fees', balance: 25.00, type: 'debit' },
            { code: '7000', name: 'Depreciation Expense', balance: 208.25, type: 'debit' },
            { code: '7100', name: 'FX Loss', balance: 125.00, type: 'debit' },
        ],
    },
];

export function getAccountById(id: string): Account | undefined {
    return fakeAccounts.find((account) => account.id === id);
}

export function getTransactionsByAccountId(accountId: string): Transaction[] {
    return fakeTransactions.filter((transaction) => transaction.accountId === accountId);
}

export function getRecentTransactions(limit: number = 8): Transaction[] {
    return [...fakeTransactions]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
}

export function getTotalBalance(): number {
    return fakeAccounts.reduce((total, account) => total + account.balance, 0);
}

export function getMonthlyInflow(): number {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return fakeTransactions
        .filter(
            (t) =>
                t.type === 'credit' &&
                new Date(t.timestamp) >= startOfMonth &&
                t.status === 'completed'
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function getMonthlyOutflow(): number {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return fakeTransactions
        .filter(
            (t) =>
                t.type === 'debit' &&
                new Date(t.timestamp) >= startOfMonth &&
                t.status === 'completed'
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function getPendingAmount(): number {
    return fakeTransactions
        .filter((t) => t.status === 'pending')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}
