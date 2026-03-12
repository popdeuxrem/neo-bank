import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

interface Window {
    Echo?: {
        private: (channel: string) => {
            listen: (event: string, callback: (data: unknown) => void) => void;
            stopListening: (event: string) => void;
        };
        channel: (channel: string) => {
            listen: (event: string, callback: (data: unknown) => void) => void;
        };
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
}
