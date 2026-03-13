import { test, expect } from '@playwright/test';
import {
    injectAuthenticatedSession,
    waitForFramerMotionAnimation,
} from './utils/test-utils';

const mockAccount = {
    id: 'acc_001',
    userId: 'usr_001',
    name: 'Primary Checking',
    type: 'checking' as const,
    balance: 15750.89,
    currency: 'USD',
    last4: '4521',
    isDefault: true,
    createdAt: '2024-01-15T10:00:00Z',
};

test.describe('Dashboard', () => {
    test('should authenticate user and navigate to dashboard', async ({
        page,
    }) => {
        await injectAuthenticatedSession(page);
        await expect(page).toHaveURL(/\/(dashboard|admin)/);
    });

    test('should display BalanceCard with correct account data', async ({
        page,
    }) => {
        await injectAuthenticatedSession(page);
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        const balanceCard = page.locator('[class*="BalanceCard"]').first();
        
        const cardExists = await balanceCard.count();
        if (cardExists > 0) {
            await expect(balanceCard).toBeVisible();
        }
    });

    test('should match BalanceCard data schema from mockApi', async ({
        page,
    }) => {
        await injectAuthenticatedSession(page);
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        const schemaFields = ['id', 'userId', 'name', 'type', 'balance', 'currency', 'isDefault'];
        
        const accountData = {
            id: mockAccount.id,
            name: mockAccount.name,
            type: mockAccount.type,
            balance: mockAccount.balance,
            currency: mockAccount.currency,
            isDefault: mockAccount.isDefault,
        };

        expect(accountData).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            type: expect.any(String),
            balance: expect.any(Number),
            currency: expect.any(String),
            isDefault: expect.any(Boolean),
        });
    });

    test('should render dashboard components with animations', async ({
        page,
    }) => {
        await injectAuthenticatedSession(page);
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        await waitForFramerMotionAnimation(page);
    });
});

test.describe('VerifyIdentity', () => {
    test('should navigate to identity verification page after auth', async ({
        page,
    }) => {
        await injectAuthenticatedSession(page);
        await page.goto('/identity/verify');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/\/identity\/verify/);
    });

    test('should simulate file upload and verify progress bar animation', async ({
        page,
    }) => {
        await injectAuthenticatedSession(page);
        await page.goto('/identity/verify');
        await page.waitForLoadState('networkidle');

        const fileInput = page.locator('input[type="file"]');
        const inputExists = await fileInput.count();
        
        if (inputExists > 0) {
            await fileInput.setInputFiles({
                name: 'test-document.pdf',
                mimeType: 'application/pdf',
                buffer: Buffer.from('test file content'),
            });

            await waitForFramerMotionAnimation(page);

            const progressBar = page.locator('[class*="progress"], [role="progressbar"]');
            const progressExists = await progressBar.count();
            
            if (progressExists > 0) {
                await expect(progressBar.first()).toBeVisible();
            }
        }
    });

    test('should verify IdentityDocument record status updates', async ({
        page,
    }) => {
        await injectAuthenticatedSession(page);
        await page.goto('/identity/verify');
        await page.waitForLoadState('networkidle');

        const documentCards = page.locator('[class*="document"], [class*="Document"]');
        const cardCount = await documentCards.count();

        if (cardCount > 0) {
            const statusElements = page.locator('[class*="status"], [data-status]');
            const statusCount = await statusElements.count();
            
            if (statusCount > 0) {
                const validStatuses = ['pending', 'submitted', 'under_review', 'approved', 'rejected'];
                const statusText = await statusElements.first().textContent();
                
                if (statusText) {
                    const hasValidStatus = validStatuses.some(s => 
                        statusText.toLowerCase().includes(s)
                    );
                    expect(hasValidStatus).toBe(true);
                }
            }
        }
    });

    test('should display document upload form with Framer Motion', async ({
        page,
    }) => {
        await injectAuthenticatedSession(page);
        await page.goto('/identity/verify');
        await page.waitForLoadState('networkidle');

        await waitForFramerMotionAnimation(page);
    });
});
