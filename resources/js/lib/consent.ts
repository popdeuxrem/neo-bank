import { hasConsent } from '@/hooks/useCookieConsent';

type ScriptLoaderOptions = {
    src?: string;
    content?: string;
    async?: boolean;
    defer?: boolean;
    id?: string;
    onLoad?: () => void;
    onError?: (error: Error) => void;
};

const loadedScripts = new Set<string>();

export function loadScriptWhenConsented(options: ScriptLoaderOptions): void {
    if (typeof window === 'undefined') {
        return;
    }

    const {
        src,
        content,
        async = false,
        defer = false,
        id,
        onLoad,
        onError,
    } = options;

    if (!id && !src) {
        console.warn('Script loader: Either id or src must be provided');
        return;
    }

    const scriptId = id || `script-${src}`;

    if (loadedScripts.has(scriptId)) {
        return;
    }

    if (!hasConsent()) {
        console.log(`Script "${scriptId}" deferred - awaiting cookie consent`);
        return;
    }

    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
        loadedScripts.add(scriptId);
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = async;
    script.defer = defer;

    if (src) {
        script.src = src;
    }

    if (content) {
        script.textContent = content;
    }

    script.onload = () => {
        loadedScripts.add(scriptId);
        onLoad?.();
    };

    script.onerror = (event) => {
        const error = new Error(`Failed to load script: ${scriptId}`);
        console.error(error);
        onError?.(error);
    };

    document.head.appendChild(script);
}

export function loadStylesheetWhenConsented(
    href: string,
    id: string,
    onLoad?: () => void,
): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!hasConsent()) {
        console.log(`Stylesheet "${id}" deferred - awaiting cookie consent`);
        return;
    }

    const existingLink = document.getElementById(id);
    if (existingLink) {
        return;
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = () => {
        onLoad?.();
    };

    document.head.appendChild(link);
}

export function isConsentGranted(): boolean {
    return hasConsent();
}
