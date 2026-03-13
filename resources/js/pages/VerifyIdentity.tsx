import { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    X,
    ChevronRight,
    Shield,
    Clock,
    CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ButtonPrimary';
import { ButtonSecondary } from '@/components/ButtonSecondary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { formatDate } from '@/lib/format';

interface Document {
    id: number;
    document_type: string;
    file_name: string;
    status: string;
    rejection_reason?: string;
    created_at: string;
    reviewed_at?: string;
}

interface VerifyIdentityProps {
    documents?: Document[];
    maxFileSize?: number;
    allowedTypes?: string[];
}

const documentTypes = [
    {
        value: 'passport',
        label: 'Passport',
        description: 'Government-issued passport',
    },
    {
        value: 'drivers_license',
        label: "Driver's License",
        description: 'Valid driver license',
    },
    {
        value: 'national_id',
        label: 'National ID',
        description: 'National identity card',
    },
    {
        value: 'utility_bill',
        label: 'Utility Bill',
        description: 'Recent utility bill (within 3 months)',
    },
    {
        value: 'bank_statement',
        label: 'Bank Statement',
        description: 'Recent bank statement (within 3 months)',
    },
];

const statusConfig = {
    pending: {
        icon: Clock,
        color: 'text-yellow-500',
        bg: 'bg-yellow-50',
        label: 'Pending',
    },
    submitted: {
        icon: Upload,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        label: 'Submitted',
    },
    under_review: {
        icon: Shield,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        label: 'Under Review',
    },
    approved: {
        icon: CheckCircle2,
        color: 'text-green-500',
        bg: 'bg-green-50',
        label: 'Approved',
    },
    rejected: {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'bg-red-50',
        label: 'Rejected',
    },
};

export default function VerifyIdentity({
    documents = [],
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
}: VerifyIdentityProps) {
    const [selectedType, setSelectedType] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        document_type: '',
        document: null as File | null,
    });

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const validateFile = (file: File): string | null => {
        if (!allowedTypes.includes(file.type)) {
            return 'Invalid file type. Please upload a JPEG, PNG, WebP, or PDF file.';
        }
        if (file.size > maxFileSize) {
            return `File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`;
        }
        return null;
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            setUploadError('');

            const files = e.dataTransfer.files;
            if (files && files[0]) {
                const error = validateFile(files[0]);
                if (error) {
                    setUploadError(error);
                } else {
                    setData('document', files[0]);
                }
            }
        },
        [allowedTypes, maxFileSize, setData],
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError('');
        const files = e.target.files;
        if (files && files[0]) {
            const error = validateFile(files[0]);
            if (error) {
                setUploadError(error);
            } else {
                setData('document', files[0]);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedType || !data.document) {
            setUploadError('Please select a document type and upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('document_type', selectedType);
        formData.append('document', data.document!);

        post('/identity/verify', {
            data: formData,
            onSuccess: () => {
                reset();
                setSelectedType('');
            },
        });
    };

    const isVerified = documents.some((d) => d.status === 'approved');

    return (
        <>
            <Head title="Verify Identity - NeoBank" />

            <div className="min-h-screen bg-[var(--color-background)] py-8">
                <div className="mx-auto max-w-3xl px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-hero text-3xl font-bold text-[var(--color-text-primary)]">
                            Verify Your Identity
                        </h1>
                        <p className="mt-2 text-[var(--color-text-muted)]">
                            Complete identity verification to unlock all account
                            features
                        </p>
                    </div>

                    {/* Status Banner */}
                    {isVerified && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4"
                        >
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            <div>
                                <p className="font-medium text-green-800">
                                    Identity Verified
                                </p>
                                <p className="text-sm text-green-600">
                                    Your account is fully verified
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Upload Form */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Upload Document
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Document Type Selection */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-[var(--color-text-primary)]">
                                        Document Type
                                    </label>
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        {documentTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedType(type.value)
                                                }
                                                className={cn(
                                                    'rounded-xl border-2 p-4 text-left transition-all',
                                                    selectedType === type.value
                                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50',
                                                )}
                                            >
                                                <p className="font-medium text-[var(--color-text-primary)]">
                                                    {type.label}
                                                </p>
                                                <p className="text-sm text-[var(--color-text-muted)]">
                                                    {type.description}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dropzone */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-[var(--color-text-primary)]">
                                        Upload File
                                    </label>
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        className={cn(
                                            'relative rounded-xl border-2 border-dashed p-8 text-center transition-all',
                                            dragActive
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50',
                                            data.document &&
                                                'border-green-500 bg-green-50',
                                        )}
                                    >
                                        {data.document ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <FileText className="h-8 w-8 text-green-500" />
                                                <div className="text-left">
                                                    <p className="font-medium text-[var(--color-text-primary)]">
                                                        {data.document.name}
                                                    </p>
                                                    <p className="text-sm text-[var(--color-text-muted)]">
                                                        {(
                                                            data.document.size /
                                                            1024
                                                        ).toFixed(1)}{' '}
                                                        KB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            'document',
                                                            null,
                                                        )
                                                    }
                                                    className="rounded p-1 hover:bg-gray-100"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto mb-4 h-12 w-12 text-[var(--color-text-muted)]" />
                                                <p className="mb-1 text-[var(--color-text-primary)]">
                                                    Drag and drop your document
                                                    here
                                                </p>
                                                <p className="mb-4 text-sm text-[var(--color-text-muted)]">
                                                    or click to browse
                                                </p>
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept={allowedTypes.join(
                                                        ',',
                                                    )}
                                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {uploadError && (
                                    <div className="flex items-center gap-2 text-sm text-red-500">
                                        <AlertCircle className="h-4 w-4" />
                                        {uploadError}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={
                                        processing ||
                                        !selectedType ||
                                        !data.document
                                    }
                                    isLoading={processing}
                                    className="w-full"
                                >
                                    Submit for Review
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Submitted Documents */}
                    {documents.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Submitted Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {documents.map((doc) => {
                                            const status =
                                                statusConfig[
                                                    doc.status as keyof typeof statusConfig
                                                ];
                                            const StatusIcon = status.icon;

                                            return (
                                                <motion.div
                                                    key={doc.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className={cn(
                                                        'flex items-center justify-between rounded-xl border p-4',
                                                        status.bg,
                                                        'border-transparent',
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <StatusIcon
                                                            className={cn(
                                                                'h-6 w-6',
                                                                status.color,
                                                            )}
                                                        />
                                                        <div>
                                                            <p className="font-medium text-[var(--color-text-primary)]">
                                                                {
                                                                    documentTypes.find(
                                                                        (t) =>
                                                                            t.value ===
                                                                            doc.document_type,
                                                                    )?.label
                                                                }
                                                            </p>
                                                            <p className="text-sm text-[var(--color-text-muted)]">
                                                                {doc.file_name}{' '}
                                                                • Submitted{' '}
                                                                {formatDate(
                                                                    doc.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span
                                                            className={cn(
                                                                'text-sm font-medium',
                                                                status.color,
                                                            )}
                                                        >
                                                            {status.label}
                                                        </span>
                                                        {doc.rejection_reason && (
                                                            <p className="mt-1 text-xs text-red-500">
                                                                {
                                                                    doc.rejection_reason
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
