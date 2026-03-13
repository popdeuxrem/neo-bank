import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface MagnetiqCardProps {
    className?: string;
}

export const MagnetiqCard: React.FC<MagnetiqCardProps> = ({ className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, {
        stiffness: 500,
        damping: 100,
    });
    const mouseYSpring = useSpring(y, {
        stiffness: 500,
        damping: 100,
    });

    const rotateX = useTransform(
        mouseYSpring,
        [-0.5, 0.5],
        ['15deg', '-15deg'],
    );
    const rotateY = useTransform(
        mouseXSpring,
        [-0.5, 0.5],
        ['-15deg', '15deg'],
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('relative', className)}
        >
            <div className="relative h-[210px] w-[340px] overflow-hidden rounded-2xl border border-[#333] bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] shadow-2xl">
                {/* Purple glow effect */}
                <div className="absolute -inset-20 bg-gradient-to-tr from-[#8B5CF6]/30 via-[#6D28D9]/20 to-transparent opacity-60 blur-3xl" />

                {/* Card texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30" />

                {/* Card content */}
                <div className="relative z-10 flex h-full flex-col justify-between p-6">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                        <div className="text-sm font-semibold tracking-wider text-white/80">
                            Magnetiq
                        </div>
                        <div className="h-6 w-10 rounded bg-gradient-to-r from-[#FFD700] to-[#FFA500]" />
                    </div>

                    {/* Chip */}
                    <div className="absolute top-16 left-6 h-11 w-14 rounded-lg bg-gradient-to-br from-[#FFD700]/80 to-[#DAA520] shadow-lg">
                        <div className="flex h-full w-full items-center justify-center rounded-lg border border-white/20">
                            <div className="h-1 w-10 rounded-full bg-[#1a1a1a]/40" />
                        </div>
                    </div>

                    {/* Card number */}
                    <div className="mt-12 font-mono text-lg tracking-[0.2em] text-white/90">
                        **** **** **** 4829
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-xs tracking-wider text-white/50 uppercase">
                                Card Holder
                            </div>
                            <div className="text-sm font-medium text-white">
                                JOHN DOE
                            </div>
                        </div>
                        <div>
                            <div className="text-xs tracking-wider text-white/50 uppercase">
                                Expires
                            </div>
                            <div className="text-sm font-medium text-white">
                                12/28
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shine effect */}
                <div className="animate-shine absolute inset-0 -translate-x-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            </div>
        </motion.div>
    );
};

export default MagnetiqCard;
