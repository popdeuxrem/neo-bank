import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Appearance() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
    const [accentColor, setAccentColor] = useState('#6366f1');

    const colors = [
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Violet', value: '#8b5cf6' },
        { name: 'Emerald', value: '#10b981' },
        { name: 'Rose', value: '#f43f5e' },
        { name: 'Amber', value: '#f59e0b' },
        { name: 'Cyan', value: '#06b6d4' },
    ];

    return (
        <UserLayout>
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">Appearance</h1>
                    <p className="text-sm text-zinc-400">Customize how Magnetiq looks</p>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                            <Palette className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Theme</h2>
                            <p className="text-sm text-zinc-400">Choose your preferred color scheme</p>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-all ${
                                theme === 'light' 
                                    ? 'border-indigo-500 bg-indigo-500/10' 
                                    : 'border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="h-16 w-full rounded-lg bg-white flex items-center justify-center">
                                <Sun className="h-6 w-6 text-zinc-900" />
                            </div>
                            <span className="text-sm font-medium text-white">Light</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-all ${
                                theme === 'dark' 
                                    ? 'border-indigo-500 bg-indigo-500/10' 
                                    : 'border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="h-16 w-full rounded-lg bg-zinc-900 flex items-center justify-center">
                                <Moon className="h-6 w-6 text-zinc-100" />
                            </div>
                            <span className="text-sm font-medium text-white">Dark</span>
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-all ${
                                theme === 'system' 
                                    ? 'border-indigo-500 bg-indigo-500/10' 
                                    : 'border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="h-16 w-full rounded-lg bg-gradient-to-r from-white to-zinc-900 flex items-center justify-center">
                                <Monitor className="h-6 w-6 text-zinc-100" />
                            </div>
                            <span className="text-sm font-medium text-white">System</span>
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                            <Palette className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Accent Color</h2>
                            <p className="text-sm text-zinc-400">Choose your accent color</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setAccentColor(color.value)}
                                className={`h-12 w-12 rounded-full transition-all ${
                                    accentColor === color.value 
                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' 
                                        : 'hover:scale-110'
                                }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
}
