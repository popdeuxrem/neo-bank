import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, PlusCircle, Shield, Home } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useTour } from './tour-engine';

interface ConfettiParticle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    color: string;
    size: number;
    shape: 'circle' | 'square' | 'rectangle';
}

const CONFETTI_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4'];
const CONFETTI_SHAPES: ('circle' | 'square' | 'rectangle')[] = ['circle', 'square', 'rectangle'];

function generateConfetti(count: number): ConfettiParticle[] {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -15 - 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 6 + 6,
        shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
    }));
}

export function TourComplete() {
    const { isComplete, complete } = useTour();
    const { user } = usePage().props as { user?: { first_name?: string; kyc_verified?: boolean } };
    const firstName = user?.first_name || 'there';
    const isKycVerified = user?.kyc_verified ?? false;

    const [particles, setParticles] = useState<ConfettiParticle[]>([]);
    const [animationFrame, setAnimationFrame] = useState(0);

    useEffect(() => {
        if (isComplete) {
            setParticles(generateConfetti(30));
        }
    }, [isComplete]);

    useEffect(() => {
        if (!isComplete || particles.length === 0) {
return;
}

        let frame = 0;
        const gravity = 0.3;
        const maxFrames = 250;

        const animate = () => {
            if (frame >= maxFrames) {
return;
}

            setParticles(prev =>
                prev.map(p => ({
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    vy: p.vy + gravity,
                    rotation: p.rotation + p.rotationSpeed,
                }))
            );
            
            frame++;
            setAnimationFrame(frame);
            requestAnimationFrame(animate);
        };

        const timeout = setTimeout(() => {
            requestAnimationFrame(animate);
        }, 100);

        return () => clearTimeout(timeout);
    }, [isComplete, particles.length]);

    const handleReplay = useCallback(async () => {
        try {
            await axios.post('/api/onboarding/reset');
            window.location.reload();
        } catch (e) {
            console.error('Failed to reset onboarding:', e);
        }
    }, []);

    return (
        <AnimatePresence>
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-md overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="complete-title"
                >
                    {particles.map(p => {
                        const opacity = animationFrame > 200 ? Math.max(0, 1 - (animationFrame - 200) / 50) : 1;
                        
                        return (
                            <motion.div
                                key={p.id}
                                initial={{ x: p.x, y: p.y, rotate: 0, opacity: 0 }}
                                animate={{ 
                                    x: p.x + p.vx * (animationFrame / 10), 
                                    y: p.y + p.vy * (animationFrame / 10) + 0.15 * Math.pow(animationFrame / 10, 2),
                                    rotate: p.rotation + p.rotationSpeed * (animationFrame / 10),
                                    opacity 
                                }}
                                className="absolute"
                                style={{
                                    width: p.size,
                                    height: p.shape === 'rectangle' ? p.size * 0.5 : p.size,
                                    backgroundColor: p.color,
                                    borderRadius: p.shape === 'circle' ? '50%' : '2px',
                                }}
                            />
                        );
                    })}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-10 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="mb-8 flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                                className="relative"
                            >
                                <svg className="h-24 w-24" viewBox="0 0 100 100">
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="4"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    />
                                    <motion.path
                                        d="M35 50 L48 63 L65 40"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.5, duration: 0.3 }}
                                    />
                                </svg>
                            </motion.div>
                        </div>

                        <motion.h2
                            id="complete-title"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-3 text-center text-2xl font-bold text-white"
                        >
                            You&apos;re all set, {firstName}!
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="mb-8 text-center text-zinc-400"
                        >
                            Your Magnetiq account is ready to go.
                        </motion.p>

                        <div className="mb-8 space-y-3">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link
                                    href="/payments"
                                    className="flex items-center gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 transition-all hover:bg-emerald-500/20"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                        <PlusCircle className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">Add your first funds</div>
                                        <div className="text-xs text-zinc-500">Deposit money into your account</div>
                                    </div>
                                </Link>
                            </motion.div>

                            {!isKycVerified && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.55 }}
                                >
                                    <Link
                                        href="/settings/kyc"
                                        className="flex items-center gap-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 transition-all hover:bg-amber-500/20"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                            <Shield className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">Complete verification</div>
                                            <div className="text-xs text-zinc-500">Unlock all account features</div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-4 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 transition-all hover:bg-indigo-500/20"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                                        <Home className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">Explore your dashboard</div>
                                        <div className="text-xs text-zinc-500">View your accounts and transactions</div>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.65 }}
                            className="text-center text-xs text-zinc-600"
                        >
                            You can replay this tour anytime from{' '}
                            <button onClick={handleReplay} className="text-indigo-400 hover:underline">
                                Settings → Help
                            </button>
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}