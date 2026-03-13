import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ZoomIn,
    ZoomOut,
    RotateCw,
    RotateCcw,
    X,
    Check,
    XCircle,
    Loader2,
} from 'lucide-react';

interface PendingDocument {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    document_type: string;
    document_type_label: string;
    file_name: string;
    file_path?: string;
    status: string;
    created_at: string;
}

interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: PendingDocument | null;
    documentUrl: string | null;
    isLoading: boolean;
    onApprove: () => void;
    onReject: () => void;
}

export function DocumentModal({
    isOpen,
    onClose,
    document,
    documentUrl,
    isLoading: externalLoading,
    onApprove,
    onReject,
}: DocumentModalProps) {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setRotation(0);
            setIsLoading(true);
            setHasError(false);
        }
    }, [isOpen, document?.id]);

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
    };

    const handleRotateClockwise = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleRotateCounterClockwise = () => {
        setRotation((prev) => (prev - 90 + 360) % 360);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AnimatePresence>
                {isOpen && document && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-background shadow-2xl"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b px-6 py-4">
                                    <div>
                                        <Dialog.Title className="text-lg font-semibold">
                                            {document.document_type_label}
                                        </Dialog.Title>
                                        <Dialog.Description className="text-sm text-muted-foreground">
                                            {document.user_name} ({document.user_email})
                                        </Dialog.Description>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Zoom Controls */}
                                        <button
                                            onClick={handleZoomOut}
                                            className="rounded-md border p-2 hover:bg-muted"
                                            title="Zoom Out"
                                        >
                                            <ZoomOut className="h-4 w-4" />
                                        </button>
                                        <span className="min-w-[3rem] text-center text-sm">
                                            {Math.round(zoom * 100)}%
                                        </span>
                                        <button
                                            onClick={handleZoomIn}
                                            className="rounded-md border p-2 hover:bg-muted"
                                            title="Zoom In"
                                        >
                                            <ZoomIn className="h-4 w-4" />
                                        </button>
                                        <div className="mx-2 h-6 w-px bg-border" />
                                        {/* Rotate Controls */}
                                        <button
                                            onClick={handleRotateCounterClockwise}
                                            className="rounded-md border p-2 hover:bg-muted"
                                            title="Rotate Left"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={handleRotateClockwise}
                                            className="rounded-md border p-2 hover:bg-muted"
                                            title="Rotate Right"
                                        >
                                            <RotateCw className="h-4 w-4" />
                                        </button>
                                        <div className="mx-2 h-6 w-px bg-border" />
                                        {/* Close */}
                                        <Dialog.Close asChild>
                                            <button className="rounded-md border p-2 hover:bg-muted">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </Dialog.Close>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex h-[60vh] items-center justify-center overflow-auto bg-muted/20 p-4">
                                    {externalLoading || isLoading || !documentUrl ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Loading document...
                                            </p>
                                        </div>
                                    ) : hasError ? (
                                        <div className="flex flex-col items-center gap-3 text-red-500">
                                            <XCircle className="h-8 w-8" />
                                            <p>Failed to load document</p>
                                        </div>
                                    ) : (
                                        <img
                                            src={documentUrl || ''}
                                            alt={document.file_name}
                                            style={{
                                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                                transition: 'transform 0.2s ease-out',
                                            }}
                                            className="max-h-full w-auto object-contain"
                                            onLoad={handleImageLoad}
                                            onError={handleImageError}
                                        />
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between border-t px-6 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        <span className="rounded bg-muted px-2 py-1">
                                            {document.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={onReject}
                                            className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Reject
                                        </button>
                                        <button
                                            onClick={onApprove}
                                            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                        >
                                            <Check className="h-4 w-4" />
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
