 
import Echo from 'laravel-echo';
import type Pusher from 'pusher-js';

declare global {
    interface Window {
        Echo: any;
        Pusher: typeof Pusher;
    }
}

export interface EchoConfig {
    broadcaster: 'pusher' | 'reverb';
    key?: string;
    cluster?: string;
    wsHost?: string;
    wsPort?: number;
    wssPort?: number;
    forceTLS?: boolean;
}

let echoInstance: any = null;

export function getEchoInstance(config?: EchoConfig): any {
    if (echoInstance && echoInstance.socket_id()) {
        return echoInstance;
    }

    const pusherKey =
        config?.key ||
        (typeof import.meta !== 'undefined'
            ? (import.meta as any).env?.VITE_PUSHER_APP_KEY
            : undefined) ||
        'local';
    const cluster =
        config?.cluster ||
        (typeof import.meta !== 'undefined'
            ? (import.meta as any).env?.VITE_PUSHER_CLUSTER
            : undefined) ||
        'mt1';

    echoInstance = new Echo({
        broadcaster: 'pusher',
        key: pusherKey,
        cluster: cluster,
        forceTLS: false,
    });

    if (typeof window !== 'undefined') {
        window.Echo = echoInstance;
    }

    return echoInstance;
}

export function disconnectEcho(): void {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}

export default getEchoInstance;
