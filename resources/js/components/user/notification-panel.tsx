import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Transaction, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Notification {
    id: string;
    type: 'transaction' | 'alert' | 'system';
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

interface NotificationPanelProps {
    notifications: Notification[];
    onMarkRead?: (id: string) => void;
    onMarkAllRead?: () => void;
}

export function NotificationPanel({ notifications, onMarkRead, onMarkAllRead }: NotificationPanelProps) {
    const [filter, setFilter] = useState('all');

    const filterNotifications = (type: string) => {
        if (type === 'all') return notifications;
        return notifications.filter(n => n.type === type);
    };

    const formatTime = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return d.toLocaleDateString();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'transaction': return Transaction;
            case 'alert': return AlertTriangle;
            default: return Settings;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'transaction': return 'text-emerald-400 bg-emerald-500/20';
            case 'alert': return 'text-amber-400 bg-amber-500/20';
            default: return 'text-blue-400 bg-blue-500/20';
        }
    };

    const filteredNotifications = filterNotifications(filter);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">Notifications</h2>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-rose-500/20 text-rose-400">
                            {unreadCount}
                        </Badge>
                    )}
                </div>
                {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white" onClick={onMarkAllRead}>
                        Mark all read
                    </Button>
                )}
            </div>

            <div className="flex gap-1 border-b border-white/10 px-4 py-2">
                {['all', 'transaction', 'alert', 'system'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            filter === tab
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Bell className="mb-2 h-8 w-8 text-zinc-600" />
                        <p className="text-sm text-zinc-500">No notifications</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredNotifications.map((notification, index) => {
                            const Icon = getIcon(notification.type);
                            return (
                                <motion.button
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5 ${!notification.read ? 'bg-white/5' : ''}`}
                                    onClick={() => onMarkRead?.(notification.id)}
                                >
                                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${getIconColor(notification.type)}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-medium ${notification.read ? 'text-zinc-400' : 'text-white'}`}>
                                                {notification.title}
                                            </p>
                                            {!notification.read && (
                                                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">{notification.message}</p>
                                        <p className="mt-1 text-[10px] text-zinc-600">{formatTime(notification.created_at)}</p>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
