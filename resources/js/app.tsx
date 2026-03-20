import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@/components/ui/Toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/error-boundary';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Neo-Bank';

// Safe route resolution with fallback
const resolvePage = (name: string) => {
    try {
        return resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        );
    } catch (error) {
        console.warn(`Page "${name}" not found, using Error page`);
        return resolvePageComponent(
            './pages/Error.tsx',
            import.meta.glob('./pages/**/*.tsx'),
        );
    }
};

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: resolvePage,
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ErrorBoundary>
                    <TooltipProvider delayDuration={0}>
                        <ToastProvider>
                            <App {...props} />
                        </ToastProvider>
                    </TooltipProvider>
                </ErrorBoundary>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
