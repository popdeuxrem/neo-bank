import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient
                    id="magnetiq-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
            </defs>
            <path
                fill="url(#magnetiq-gradient)"
                d="M20 2L4 12v16l16 10 16-10V12L20 2zm0 4l12 7.5v11L20 32 8 24.5v-11L20 6z"
            />
            <path
                fill="url(#magnetiq-gradient)"
                d="M20 10l-6 4v8l6 4 6-4v-8l-6-4zm0 6l2 1.33v5.34L20 24l-2-1.33v-5.34L20 16z"
            />
        </svg>
    );
}
