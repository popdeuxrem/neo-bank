import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from './tour-engine';

interface SpotlightProps {
    targetSelector: string;
    padding?: number;
}

export function TourSpotlight({ targetSelector, padding = 12 }: SpotlightProps) {
    const { isActive } = useTour();
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const updateRect = useCallback(() => {
        if (!targetSelector) {
            setRect(null);
            return;
        }

        const element = document.querySelector(targetSelector) as HTMLElement | null;
        if (element) {
            const boundingRect = element.getBoundingClientRect();
            setRect(boundingRect);
        } else {
            setRect(null);
        }
    }, [targetSelector]);

    useEffect(() => {
        updateRect();

        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            updateRect();
        };

        const observer = new ResizeObserver(() => {
            updateRect();
        });

        window.addEventListener('resize', handleResize);
        
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            observer.observe(targetElement);
        }

        const interval = setInterval(updateRect, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
            clearInterval(interval);
        };
    }, [targetSelector, updateRect]);

    const pathData = useMemo(() => {
        if (!rect) return '';

        const { x, y, width, height } = rect;
        const px = x - padding;
        const py = y - padding;
        const pw = width + padding * 2;
        const ph = height + padding * 2;

        const outer = `M 0 0 L ${windowSize.width} 0 L ${windowSize.width} ${windowSize.height} L 0 ${windowSize.height} Z`;
        const inner = `M ${px} ${py} L ${px + pw} ${py} L ${px + pw} ${py + ph} L ${px} ${py + ph} Z`;

        return `${outer} ${inner}`;
    }, [rect, windowSize, padding]);

    const glowPath = useMemo(() => {
        if (!rect) return '';

        const { x, y, width, height } = rect;
        const px = x - padding;
        const py = y - padding;
        const pw = width + padding * 2;
        const ph = height + padding * 2;

        return `M ${px} ${py} L ${px + pw} ${py} L ${px + pw} ${py + ph} L ${px} ${py + ph} Z`;
    }, [rect, padding]);

    if (!isActive || !rect) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9998] pointer-events-none"
            >
                <svg
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))' }}
                >
                    <defs>
                        <mask id="spotlight-mask">
                            <rect width="100%" height="100%" fill="white" />
                            <motion.path
                                d={pathData}
                                fill="black"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </mask>
                    </defs>
                    
                    <motion.rect
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.55)"
                        mask="url(#spotlight-mask)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    
                    <motion.path
                        d={glowPath}
                        fill="none"
                        stroke="url(#glow-gradient)"
                        strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                    
                    <defs>
                        <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>
        </AnimatePresence>
    );
}