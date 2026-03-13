import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  ChevronRight,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/format';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClear?: (id: string) => void;
  onClearAll?: () => void;
  maxNotifications?: number;
  className?: string;
}

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    icon: 'text-green-500 bg-green-50',
    bg: 'border-green-100',
  },
  error: {
    icon: 'text-red-500 bg-red-50',
    bg: 'border-red-100',
  },
  warning: {
    icon: 'text-yellow-500 bg-yellow-50',
    bg: 'border-yellow-100',
  },
  info: {
    icon: 'text-blue-500 bg-blue-50',
    bg: 'border-blue-100',
  },
};

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onClearAll,
  maxNotifications = 20,
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayNotifications = notifications.slice(0, maxNotifications);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-[var(--color-text-muted)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-xs font-medium text-[var(--color-primary)]">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {displayNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border-light)]">
                  {displayNotifications.map((notification) => {
                    const Icon = iconMap[notification.type];
                    const colors = colorMap[notification.type];

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          'relative px-4 py-3 hover:bg-[var(--color-background)] transition-colors cursor-pointer',
                          !notification.read && 'bg-[var(--color-primary)]/5'
                        )}
                        onClick={() => onMarkAsRead?.(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className={cn('flex-shrink-0 rounded-full p-2', colors.icon)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm',
                              notification.read 
                                ? 'text-[var(--color-text-muted)]' 
                                : 'font-medium text-[var(--color-text-primary)]'
                            )}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                              {formatRelativeTime(notification.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClear?.(notification.id);
                            }}
                            className="flex-shrink-0 p-1 rounded hover:bg-[var(--color-border)] transition-colors"
                          >
                            <X className="h-3 w-3 text-[var(--color-text-muted)]" />
                          </button>
                        </div>
                        {!notification.read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-background)]">
                <button
                  onClick={onClearAll}
                  className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear all
                </button>
                <button className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationCenter;
