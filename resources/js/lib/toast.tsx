import { toast as sonnerToast, Toaster } from 'sonner';
import { formatCurrency } from '@/lib/format';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  description?: string;
}

export function toast(type: ToastType, title: string, options?: ToastOptions) {
  const { duration = 4000, description } = options || {};

  switch (type) {
    case 'success':
      return sonnerToast.success(title, { description, duration });
    case 'error':
      return sonnerToast.error(title, { description, duration });
    case 'warning':
      return sonnerToast.warning(title, { description, duration });
    case 'info':
    default:
      return sonnerToast.info(title, { description, duration });
  }
}

export function toastTransactionCompleted(
  amount: number,
  currency: string = 'USD',
  reference?: string
) {
  const formattedAmount = formatCurrency(amount, { currency, showSign: true });
  
  sonnerToast.success('Transaction Completed', {
    description: reference
      ? `${formattedAmount} - Ref: ${reference}`
      : formattedAmount,
    duration: 5000,
  });
}

export function toastFraudAlert(
  message: string,
  severity: 'critical' | 'high' | 'medium' = 'high'
) {
  const duration = severity === 'critical' ? 15000 : 10000;
  
  sonnerToast.error('Security Alert', {
    description: message,
    duration,
  });
}

export function toastAccountBlocked(reason?: string) {
  sonnerToast.warning('Account Restricted', {
    description: reason || 'Your account has limited functionality. Please verify your identity.',
    duration: 10000,
  });
}

export function toastAccountVerified() {
  sonnerToast.success('Identity Verified', {
    description: 'Your account is now fully verified. All features are available.',
  });
}

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      expand
      visibleToasts={5}
      closeButton
    />
  );
}

export default toast;
