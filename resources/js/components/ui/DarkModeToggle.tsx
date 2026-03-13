import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  className?: string;
  defaultDark?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  className,
  defaultDark = false,
}) => {
  const [isDark, setIsDark] = React.useState(defaultDark);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <motion.button
      onClick={() => setIsDark(!isDark)}
      className={cn(
        'relative h-10 w-20 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] p-1',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className="absolute inset-1"
        animate={{ x: isDark ? 40 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div
          className={cn(
            'h-full w-8 rounded-full flex items-center justify-center transition-colors',
            isDark ? 'bg-[#1f2937]' : 'bg-[var(--color-primary)]'
          )}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-yellow-400" />
          ) : (
            <Sun className="h-4 w-4 text-white" />
          )}
        </div>
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
