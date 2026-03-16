import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

interface KYCBannerProps {
    status: 'pending' | 'in_progress' | 'verified' | 'rejected';
    progress?: number;
}

export function KYCBanner({ status = 'pending', progress = 25 }: KYCBannerProps) {
    if (status === 'verified') {
return null;
}

    const statusConfig = {
        pending: {
            color: 'bg-amber-500/10 border-amber-500/30',
            icon: AlertTriangle,
            iconColor: 'text-amber-400',
            title: 'Complete your verification',
            description: 'Verify your identity to unlock all features',
            progress: 25,
        },
        in_progress: {
            color: 'bg-blue-500/10 border-blue-500/30',
            icon: AlertTriangle,
            iconColor: 'text-blue-400',
            title: 'Verification in progress',
            description: 'We\'re reviewing your documents',
            progress: progress,
        },
        rejected: {
            color: 'bg-rose-500/10 border-rose-500/30',
            icon: AlertTriangle,
            iconColor: 'text-rose-400',
            title: 'Verification rejected',
            description: 'Please resubmit your documents',
            progress: 0,
        },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className={`mb-4 rounded-xl border ${config.color} p-4`}
        >
            <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5`} />
                <div className="flex-1">
                    <h3 className="font-medium text-white">{config.title}</h3>
                    <p className="text-sm text-zinc-400">{config.description}</p>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 rounded-full transition-all" 
                                style={{ width: `${config.progress}%` }}
                            />
                        </div>
                        <span className="text-xs text-zinc-500">{config.progress}%</span>
                    </div>
                </div>
                <Button size="sm" asChild className="ml-auto">
                    <Link href="/settings/kyc">
                        Verify Now <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}
