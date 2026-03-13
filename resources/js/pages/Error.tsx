import { Button } from '@/components/ui/button';

interface ErrorProps {
    status?: number;
    message?: string;
}

export default function Error({
    status = 500,
    message = 'An unexpected error occurred',
}: ErrorProps) {
    const isProduction = import.meta.env.PROD;

    return (
        <div
            style={{
                background: 'var(--color-background)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-body)',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    padding: '2rem',
                    maxWidth: '480px',
                }}
            >
                <div
                    style={{
                        fontSize: '6rem',
                        fontWeight: '700',
                        color: 'var(--color-primary)',
                        lineHeight: 1,
                        marginBottom: '1rem',
                    }}
                >
                    {status}
                </div>

                <h1
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.5rem',
                    }}
                >
                    {status === 404
                        ? 'Page Not Found'
                        : status === 403
                          ? 'Access Denied'
                          : 'Server Error'}
                </h1>

                <p
                    style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '2rem',
                    }}
                >
                    {message}
                    {isProduction && status === 500 && (
                        <span> Please try again later.</span>
                    )}
                </p>

                <Button asChild>
                    <a href="/">Return Home</a>
                </Button>
            </div>
        </div>
    );
}
