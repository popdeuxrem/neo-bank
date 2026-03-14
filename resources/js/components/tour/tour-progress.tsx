import { motion } from 'framer-motion';
import { useTour } from './tour-engine';

export function TourProgress() {
    const { isActive, currentStep, totalSteps } = useTour();
    
    if (!isActive) return null;

    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-0 right-0 top-0 z-[10000] h-1 bg-zinc-800"
        >
            <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            />
        </motion.div>
    );
}