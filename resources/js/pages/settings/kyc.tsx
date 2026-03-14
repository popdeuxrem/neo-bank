import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    Upload, 
    FileText, 
    User, 
    Home,
    X,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/layouts/user-layout';
import { toast } from 'sonner';

interface KYCStep {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'pending' | 'current' | 'rejected';
    icon: any;
}

const initialSteps: KYCStep[] = [
    { 
        id: 1, 
        title: 'Personal Information', 
        description: 'Basic details about you',
        status: 'completed',
        icon: User 
    },
    { 
        id: 2, 
        title: 'Identity Document', 
        description: 'Upload ID or passport',
        status: 'current',
        icon: FileText 
    },
    { 
        id: 3, 
        title: 'Proof of Address', 
        description: 'Utility bill or bank statement',
        status: 'pending',
        icon: Home 
    },
    { 
        id: 4, 
        title: 'Selfie Verification', 
        description: 'Quick face verification',
        status: 'pending',
        icon: Shield 
    },
    { 
        id: 5, 
        title: 'Review', 
        description: 'Final verification (1-2 business days)',
        status: 'pending',
        icon: Clock 
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 }
};

export default function KYC() {
    const [steps, setSteps] = useState<KYCStep[]>(initialSteps);
    const [currentStep, setCurrentStep] = useState(2);
    const [uploading, setUploading] = useState(false);
    const [rejectedReason, setRejectedReason] = useState<string | null>('Document image was blurry. Please upload a clear, high-resolution image.');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/20';
            case 'current': return 'text-indigo-400 bg-indigo-500/20';
            case 'pending': return 'text-zinc-400 bg-zinc-500/20';
            case 'rejected': return 'text-rose-400 bg-rose-500/20';
            default: return 'text-zinc-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return CheckCircle;
            case 'current': return Clock;
            case 'rejected': return AlertCircle;
            default: return Clock;
        }
    };

    const handleUpload = async (stepId: number) => {
        setUploading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setUploading(false);
        
        setSteps(prev => prev.map(step => {
            if (step.id === stepId) {
                return { ...step, status: 'completed' as const };
            }
            if (step.id === stepId + 1) {
                return { ...step, status: 'current' as const };
            }
            return step;
        }));
        
        setCurrentStep(stepId + 1);
        toast.success('Document uploaded successfully');
    };

    const overallStatus = 'pending';

    return (
        <UserLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Identity Verification</h1>
                    <p className="text-sm text-zinc-400">Complete verification to unlock all features</p>
                </div>

                <div className={`rounded-2xl border p-6 ${
                    overallStatus === 'verified' ? 'border-emerald-500/20 bg-emerald-500/10' :
                    overallStatus === 'pending' ? 'border-amber-500/20 bg-amber-500/10' :
                    overallStatus === 'rejected' ? 'border-rose-500/20 bg-rose-500/10' :
                    'border-white/10 bg-zinc-900/50'
                }`}>
                    <div className="flex items-center gap-4">
                        {overallStatus === 'verified' && <CheckCircle className="h-8 w-8 text-emerald-400" />}
                        {overallStatus === 'pending' && <Clock className="h-8 w-8 text-amber-400" />}
                        {overallStatus === 'rejected' && <AlertCircle className="h-8 w-8 text-rose-400" />}
                        {overallStatus === 'incomplete' && <Shield className="h-8 w-8 text-zinc-400" />}
                        
                        <div>
                            <h2 className={`font-semibold ${
                                overallStatus === 'verified' ? 'text-emerald-400' :
                                overallStatus === 'pending' ? 'text-amber-400' :
                                overallStatus === 'rejected' ? 'text-rose-400' :
                                'text-white'
                            }`}>
                                {overallStatus === 'verified' && 'Verified'}
                                {overallStatus === 'pending' && 'Verification Pending'}
                                {overallStatus === 'rejected' && 'Verification Rejected'}
                                {overallStatus === 'incomplete' && 'Complete Your Verification'}
                            </h2>
                            <p className="text-sm text-zinc-400">
                                {overallStatus === 'verified' && 'Your account is fully verified'}
                                {overallStatus === 'pending' && 'We are reviewing your documents'}
                                {overallStatus === 'rejected' && 'Please re-submit your documents'}
                                {overallStatus === 'incomplete' && 'Finish the steps below to verify'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        {steps.map((step, index) => {
                            const StatusIcon = getStatusIcon(step.status);
                            const isActive = step.status === 'current';
                            
                            return (
                                <motion.div
                                    key={step.id}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeUp}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative rounded-2xl border p-6 transition-all ${
                                        isActive 
                                            ? 'border-indigo-500/50 bg-indigo-500/5' 
                                            : step.status === 'completed'
                                            ? 'border-emerald-500/20 bg-emerald-500/5'
                                            : 'border-white/10 bg-zinc-900/50'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getStatusColor(step.status)}`}>
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-white">{step.title}</h3>
                                                <Badge className={getStatusColor(step.status)}>
                                                    <StatusIcon className="mr-1 h-3 w-3" />
                                                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <p className="mt-1 text-sm text-zinc-400">{step.description}</p>
                                            
                                            {step.status === 'rejected' && (
                                                <div className="mt-3 rounded-lg bg-rose-500/10 p-3">
                                                    <p className="text-xs text-rose-400">{rejectedReason}</p>
                                                </div>
                                            )}
                                            
                                            {isActive && (
                                                <div className="mt-4">
                                                    <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center transition-all hover:border-indigo-500/50">
                                                        <Upload className="mx-auto mb-3 h-8 w-8 text-zinc-500" />
                                                        <p className="text-sm text-zinc-400">
                                                            Drag and drop your document here, or{' '}
                                                            <span className="text-indigo-400">browse</span>
                                                        </p>
                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            Supported: PDF, JPG, PNG (max 10MB)
                                                        </p>
                                                        <Button 
                                                            className="mt-4 bg-indigo-500 hover:bg-indigo-600"
                                                            onClick={() => handleUpload(step.id)}
                                                            disabled={uploading}
                                                        >
                                                            {uploading ? 'Uploading...' : 'Upload Document'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {step.status === 'completed' && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                                                    <span className="text-sm text-emerald-400">Completed</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {index < steps.length - 1 && (
                                        <div className="absolute bottom-0 left-8 top-20 w-0.5 bg-white/10">
                                            <div className={`h-full w-full ${
                                                step.status === 'completed' ? 'bg-emerald-500' : 'bg-transparent'
                                            }`} />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <h3 className="mb-4 font-semibold text-white">What you need</h3>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400" />
                                    <span>Valid government-issued ID (passport, driver's license)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400" />
                                    <span>Proof of address (utility bill, bank statement)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400" />
                                    <span>Good quality selfie with your ID</span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <h3 className="mb-4 font-semibold text-white">Verification time</h3>
                            <p className="text-sm text-zinc-400">
                                Most verifications are completed within 1-2 business days. 
                                You'll receive an email once your documents have been reviewed.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <h3 className="mb-4 font-semibold text-white">Need help?</h3>
                            <p className="mb-4 text-sm text-zinc-400">
                                Our support team is here to help with any questions.
                            </p>
                            <Button variant="outline" className="w-full border-white/10">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
