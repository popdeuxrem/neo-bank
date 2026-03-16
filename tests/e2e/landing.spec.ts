import { test, expect } from '@playwright/test';
import {
    waitForFramerMotionAnimation,
    checkForWebGLErrors,
} from './utils/test-utils';

test.describe('Landing Page', () => {
    test('should load landing page successfully with status 200', async ({
        page,
    }) => {
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);
        await expect(page).toHaveTitle(/NeoBank/i);
    });

    test('should render MagnetiqCard3D component without WebGL errors', async ({
        page,
    }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const magnetiqCard = page.locator('[class*="MagnetiqCard3D"]');
        await expect(magnetiqCard).toBeVisible();

        const webglErrors = await checkForWebGLErrors(page);
        expect(webglErrors).toHaveLength(0);
    });

    test('should complete Framer Motion animations within 500ms', async ({
        page,
    }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await waitForFramerMotionAnimation(page);

        const animationsComplete = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('*'));

            for (const el of elements) {
                const style = window.getComputedStyle(el);
                const transitionProperty = style.transitionProperty;
                const transitionDuration = style.transitionDuration;

                if (
                    (transitionProperty.includes('opacity') ||
                        transitionProperty.includes('transform')) &&
                    parseFloat(transitionDuration) * 1000 > 500
                ) {
                    return false;
                }
            }

            return true;
        });

        expect(animationsComplete).toBe(true);
    });
});

test.describe('SignupForm', () => {
    test('should submit email and show success toast', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const emailInput = page.locator('input[type="email"]').first();
        await emailInput.fill('test@example.com');

        const submitButton = page.locator('button[type="submit"]').first();
        await submitButton.click();

        await page.waitForTimeout(1500);

        const pageContent = await page.content();
        expect(pageContent.toLowerCase()).toContain('success');
    });

    test('should validate Framer Motion transitions on signup success', async ({
        page,
    }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const emailInput = page.locator('input[type="email"]').first();
        await emailInput.fill('testuser@example.com');

        const submitButton = page.locator('button[type="submit"]').first();
        await submitButton.click();

        await waitForFramerMotionAnimation(page);
    });
});
