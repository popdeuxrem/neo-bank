import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    webServer: {
        command: 'npm run dev',
        port: 5173,
        reuseExistingServer: !process.env.CI,
    },
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:5173',
        screenshot: 'only-on-failure',
        trace: process.env.CI ? 'on-first-retry' : 'off',
    },
    projects: [
        {
            name: 'Desktop Chrome',
            use: {
                browserName: 'chromium',
                viewport: { width: 1280, height: 720 },
            },
        },
        {
            name: 'Mobile Safari',
            use: {
                browserName: 'webkit',
                viewport: { width: 375, height: 667 },
            },
        },
        {
            name: 'Tablet Firefox',
            use: {
                browserName: 'firefox',
                viewport: { width: 768, height: 1024 },
            },
        },
    ],
});
