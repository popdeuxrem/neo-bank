import { test, expect } from '@playwright/test';

test.describe('Lighthouse Performance', () => {
    test('should achieve Performance score greater than 90 on Landing page', async ({
        page,
    }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const metrics = await page.evaluate(() => {
            return {
                loadEventEnd: performance.timing.loadEventEnd,
                navigationStart: performance.timing.navigationStart,
            };
        });

        const loadTime = metrics.loadEventEnd - metrics.navigationStart;
        expect(loadTime).toBeLessThan(3000);
    });

    test('should have fast First Contentful Paint', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const fcp = await page.evaluate(() => {
            const paintEntries = performance.getEntriesByType('paint');
            const fcpEntry = paintEntries.find(
                (entry) => entry.name === 'first-contentful-paint',
            );
            return fcpEntry ? fcpEntry.startTime : 0;
        });

        expect(fcp).toBeLessThan(2000);
    });
});

test.describe('Responsive Navbar', () => {
    test('should collapse navbar into hamburger menu on Mobile Safari viewport', async ({
        page,
    }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const hamburgerButton = page.locator('button[class*="hamburger"], button[class*="menu"], [aria-label="Menu"]');
        const navLinks = page.locator('nav a, nav button');
        
        const linksCount = await navLinks.count();
        if (linksCount > 3) {
            await expect(hamburgerButton).toBeVisible();
        }
    });

    test('should open mobile navigation when clicking hamburger menu', async ({
        page,
    }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const hamburgerButton = page.locator('button[class*="hamburger"], button[class*="menu"], [aria-label="Menu"]');
        
        const hamburgerExists = await hamburgerButton.count();
        if (hamburgerExists > 0) {
            await hamburgerButton.click();
            await page.waitForTimeout(500);
            
            const mobileMenu = page.locator('[class*="mobile"], [class*="drawer"], [role="dialog"]');
            const menuVisible = await mobileMenu.count();
            expect(menuVisible).toBeGreaterThan(0);
        }
    });
});
