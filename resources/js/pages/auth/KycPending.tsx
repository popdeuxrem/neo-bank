import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, Shield, Upload } from 'lucide-react';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function KycPending() {
    return (
        <AuthSplitLayout>
            <Head title="Verification Required - Neo Bank" />
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="mx-auto w-full max-w-md"
            >
                <motion.div variants={fadeUp} className="mb-8 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                        <Clock className="h-8 w-8 text-amber-500" />
                    </div>
                    <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                        Verification Required
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Complete your identity verification to unlock all features
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6"
                >
                    <div className="mb-4 flex items-start gap-4">
                        <div className="mt-1 shrink-0">
                            <Shield className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                                Why verify your identity?
                            </h3>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                As a regulated financial institution, we need to verify your identity before you can:
                            </p>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        {[
                            'Send or receive money',
                            'Add funds to your account',
                            'Apply for a debit card',
                            'Access full account features',
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                            <Upload className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                                Upload Your Documents
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Government-issued ID required
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/verify-identity"
                        className="mt-4 block w-full rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25"
                    >
                        Start Verification
                    </Link>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-8 text-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </motion.div>

                <motion.div 
                    variants={fadeUp}
                    className="mt-6 flex items-center justify-center gap-6 text-xs text-zinc-400"
                >
                    <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        256-bit SSL
                    </span>
                    <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        FDIC Insured
                    </span>
                </motion.div>
            </motion.div>
        </AuthSplitLayout>
    );
}
