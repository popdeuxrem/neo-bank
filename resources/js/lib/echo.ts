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

    const reverbKey = typeof import.meta !== 'undefined' 
        ? (import.meta as any).env?.VITE_REVERB_APP_KEY 
        : undefined;
    
    const pusherKey = typeof import.meta !== 'undefined'
        ? (import.meta as any).env?.VITE_PUSHER_APP_KEY
        : undefined;
    
    const reverbHost = typeof import.meta !== 'undefined'
        ? (import.meta as any).env?.VITE_REVERB_HOST
        : undefined;
    
    const reverbPort = typeof import.meta !== 'undefined'
        ? (import.meta as any).env?.VITE_REVERB_PORT
        : 80;
    
    const reverbScheme = typeof import.meta !== 'undefined'
        ? (import.meta as any).env?.VITE_REVERB_SCHEME ?? 'https'
        : 'https';

    // Use Reverb if configured, otherwise fall back to Pusher
    if (reverbKey) {
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: reverbKey,
            wsHost: reverbHost,
            wsPort: reverbPort,
            wssPort: reverbPort === '443' ? 443 : parseInt(reverbPort) || 80,
            forceTLS: reverbScheme === 'https',
            enabledTransports: ['ws', 'wss'],
        });
    } else if (pusherKey) {
        const cluster = typeof import.meta !== 'undefined'
            ? (import.meta as any).env?.VITE_PUSHER_CLUSTER ?? 'mt1'
            : 'mt1';
        
        echoInstance = new Echo({
            broadcaster: 'pusher',
            key: pusherKey,
            cluster: cluster,
            forceTLS: true,
        });
    } else {
        // Return a mock echo for development without Reverb/Pusher
        echoInstance = {
            private: () => ({
                listen: () => echoInstance,
                stopListening: () => {},
            }),
            socket_id: () => null,
            disconnect: () => {},
        };
    }

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
