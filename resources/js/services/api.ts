const API_BASE_URL = '/api';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    phone?: string;
    createdAt: string;
}

export interface Account {
    id: string;
    userId: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment';
    balance: number;
    currency: string;
    last4?: string;
    isDefault: boolean;
    createdAt: string;
}

export interface Transaction {
    id: string;
    accountId: string;
    type: 'credit' | 'debit' | 'transfer' | 'payment';
    amount: number;
    currency: string;
    description: string;
    merchant?: string;
    category?: string;
    date: string;
    status: 'pending' | 'completed' | 'failed';
}

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    recipientName: string;
    recipientAccount?: string;
    description?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
}

class ApiService {
    private async request<T>(
        endpoint: string,
        options?: RequestInit,
    ): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async getUser(userId: string): Promise<User> {
        return this.request<User>(`/users/${userId}`);
    }

    async updateUser(userId: string, data: Partial<User>): Promise<User> {
        return this.request<User>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getAccounts(userId: string): Promise<Account[]> {
        return this.request<Account[]>(`/users/${userId}/accounts`);
    }

    async getAccount(accountId: string): Promise<Account> {
        return this.request<Account>(`/accounts/${accountId}`);
    }

    async createAccount(
        data: Omit<Account, 'id' | 'createdAt'>,
    ): Promise<Account> {
        return this.request<Account>('/accounts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getTransactions(
        accountId: string,
        filters?: { startDate?: string; endDate?: string; type?: string },
    ): Promise<Transaction[]> {
        const params = new URLSearchParams();
        if (filters?.startDate) params.set('startDate', filters.startDate);
        if (filters?.endDate) params.set('endDate', filters.endDate);
        if (filters?.type) params.set('type', filters.type);

        const queryString = params.toString();
        return this.request<Transaction[]>(
            `/accounts/${accountId}/transactions${queryString ? `?${queryString}` : ''}`,
        );
    }

    async getTransaction(transactionId: string): Promise<Transaction> {
        return this.request<Transaction>(`/transactions/${transactionId}`);
    }

    async createPayment(
        data: Omit<Payment, 'id' | 'createdAt' | 'status'>,
    ): Promise<Payment> {
        return this.request<Payment>('/payments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getPayments(userId: string): Promise<Payment[]> {
        return this.request<Payment[]>(`/users/${userId}/payments`);
    }

    async getPayment(paymentId: string): Promise<Payment> {
        return this.request<Payment>(`/payments/${paymentId}`);
    }
}

export const api = new ApiService();
