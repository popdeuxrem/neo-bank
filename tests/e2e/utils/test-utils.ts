import { Page, test as base } from '@playwright/test';

export const TEST_USER_EMAIL = 'cody@example.com';

export async function injectAuthenticatedSession(page: Page): Promise<void> {
    await page.goto('/login');

    await page.fill('input[name="email"]', TEST_USER_EMAIL);
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    await page
        .waitForURL(/\/(dashboard|admin)/, { timeout: 10000 })
        .catch(() => {});
}

export async function waitForFramerMotionAnimation(page: Page): Promise<void> {
    await page.waitForFunction(async () => {
        const elements = Array.from(document.querySelectorAll('*'));

        for (const el of elements) {
            const style = window.getComputedStyle(el);
            const transitionProperty = style.transitionProperty;
            const transitionDuration = style.transitionDuration;

            if (
                transitionProperty.includes('opacity') ||
                transitionProperty.includes('transform')
            ) {
                const duration = parseFloat(transitionDuration) * 1000;
                if (duration > 0 && duration < 500) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, duration + 50),
                    );
                }
            }
        }

        const animatedElements = Array.from(
            document.querySelectorAll('[data-state], [class*="animate"]'),
        );
        for (const el of animatedElements) {
            const style = window.getComputedStyle(el);
            if (style.opacity === '0' || style.transform !== 'none') {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }

        return true;
    });
}

export interface WebGLError {
    type: 'error' | 'warning';
    message: string;
    source?: string;
}

export async function checkForWebGLErrors(
    page: Page,
): Promise<WebGLError[]> {
    const errors: WebGLError[] = [];

    page.on('console', (msg) => {
        const text = msg.text();
        if (
            text.toLowerCase().includes('webgl') ||
            text.toLowerCase().includes('webglcontext') ||
            text.toLowerCase().includes('gl_')
        ) {
            errors.push({
                type: msg.type() as 'error' | 'warning',
                message: text,
            });
        }
    });

    await page.reload();

    return errors;
}

export interface SonnerToast {
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    description?: string;
}

export async function getSonnerToasts(page: Page): Promise<SonnerToast[]> {
    return page.evaluate(() => {
        const toasts: SonnerToast[] = [];
        const toastElements = document.querySelectorAll('[data-sonner-toast]');

        toastElements.forEach((el) => {
            const type = el.getAttribute('data-type') as
                | 'success'
                | 'error'
                | 'warning'
                | 'info';
            const title = el.querySelector('[data-title]')?.textContent || undefined;
            const description = el.querySelector('[data-description]')?.textContent || undefined;

            toasts.push({ type, title, description });
        });

        return toasts;
    });
}

export async function waitForSonnerToast(
    page: Page,
    title?: string,
    timeout = 5000,
): Promise<void> {
    if (title) {
        await page.waitForSelector(
            `[data-sonner-toast] [data-title*="${title}"]`,
            { timeout },
        );
    } else {
        await page.waitForSelector('[data-sonner-toast]', { timeout });
    }
}

export async function dismissSonnerToast(page: Page): Promise<void> {
    await page.click('[data-sonner-toast] [data-close]', { force: true }).catch(() => {});
}
