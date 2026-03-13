import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { clsx } from "clsx";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "success" | "default";
  loading?: boolean;
  children?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  children,
}: ConfirmModalProps) {
  const variantStyles = {
    danger: {
      button: "bg-rose-500 hover:bg-rose-600 text-white",
      icon: "text-rose-400",
      iconBg: "bg-rose-500/20",
    },
    warning: {
      button: "bg-amber-500 hover:bg-amber-600 text-white",
      icon: "text-amber-400",
      iconBg: "bg-amber-500/20",
    },
    success: {
      button: "bg-emerald-500 hover:bg-emerald-600 text-white",
      icon: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
    },
    default: {
      button: "bg-indigo-500 hover:bg-indigo-600 text-white",
      icon: "text-indigo-400",
      iconBg: "bg-indigo-500/20",
    },
  };

  const styles = variantStyles[variant];

  const Icon = variant === "danger" ? XCircle : variant === "warning" ? AlertTriangle : CheckCircle;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={clsx("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", styles.iconBg)}>
                    <Icon className={clsx("h-6 w-6", styles.icon)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{description}</p>
                    {children && <div className="mt-4">{children}</div>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-white/5 px-6 py-4">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={clsx(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
                    styles.button
                  )}
                >
                  {loading ? "Processing..." : confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
