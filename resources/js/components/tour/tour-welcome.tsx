import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Lock, CheckCircle, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { useTour } from './tour-engine';

export function TourWelcome() {
    const { isWelcome, startTour, skip } = useTour();
    const { user } = usePage().props as { user?: { first_name?: string } };
    const firstName = user?.first_name || 'there';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isWelcome) {
return;
}

            if (e.key === 'Escape') {
                e.preventDefault();
                skip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isWelcome, skip]);

    return (
        <AnimatePresence>
            {isWelcome && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="welcome-title"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-10 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="mb-8 flex justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="relative"
                            >
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                                    <Hexagon className="h-10 w-10 text-white" />
                                </div>
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-2xl bg-indigo-400/20"
                                />
                            </motion.div>
                        </div>

                        <motion.h2
                            id="welcome-title"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-3 text-center text-2xl font-bold text-white"
                        >
                            Welcome to Magnetiq, {firstName} 👋
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="mb-6 text-center text-zinc-400"
                        >
                            Your premium banking experience is ready.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 text-center text-sm leading-relaxed text-zinc-500"
                        >
                            Let&apos;s take 2 minutes to show you around. We&apos;ll walk you through your accounts, how to send money, and everything you need to get started.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="mb-8 text-center text-xs font-medium text-zinc-600"
                        >
                            12 quick steps
                        </motion.p>

                        <div className="mb-8 flex flex-col gap-3">
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                onClick={startTour}
                                className="w-full rounded-full bg-indigo-500 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25"
                            >
                                Show me around
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                onClick={skip}
                                className="w-full rounded-full py-3 text-center text-sm font-medium text-zinc-500 transition-all hover:bg-white/5 hover:text-zinc-300"
                            >
                                Skip for now
                            </motion.button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-6 text-xs text-zinc-600"
                        >
                            <div className="flex items-center gap-2">
                                <Lock className="h-3.5 w-3.5" />
                                <span>256-bit encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>FDIC insured</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="h-3.5 w-3.5" />
                                <span>Instant transfers</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}