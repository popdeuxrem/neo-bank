'use client';

import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CookieBanner() {
    const { hasConsented, acceptConsent } = useCookieConsent();

    return (
        <AnimatePresence>
            {!hasConsented && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={cn(
                        'fixed bottom-6 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4',
                    )}
                >
                    <div
                        className={cn(
                            'relative overflow-hidden rounded-xl border border-purple-500/30',
                            'bg-white/10 backdrop-blur-md shadow-xl',
                            'dark:bg-black/40',
                        )}
                    >
                        <div
                            className={cn(
                                'absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5',
                                'dark:from-purple-500/10 dark:to-violet-500/10',
                            )}
                        />

                        <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                                    We use cookies to ensure secure banking and
                                    analyze site traffic. By continuing, you agree
                                    to our{' '}
                                    <Link
                                        href="/privacy"
                                        className="font-medium text-purple-600 underline decoration-purple-500/50 underline-offset-2 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>

                            <div className="flex shrink-0 gap-3">
                                <Button
                                    onClick={acceptConsent}
                                    size="sm"
                                    className={cn(
                                        'bg-purple-600 text-white hover:bg-purple-700',
                                        'dark:bg-purple-600 dark:hover:bg-purple-500',
                                    )}
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}