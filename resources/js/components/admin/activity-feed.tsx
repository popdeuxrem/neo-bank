import { motion } from "framer-motion";
import { 
  User, ArrowRightLeft, Shield, AlertTriangle, 
  CreditCard, MessageSquare, Settings, LogIn, 
  CheckCircle, XCircle, FileText 
} from "lucide-react";
import { clsx } from "clsx";

interface ActivityItem {
  id: string;
  type: "user" | "transaction" | "kyc" | "fraud" | "card" | "ticket" | "settings" | "login" | "approve" | "reject" | "document";
  description: string;
  user?: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
  onItemClick?: (item: ActivityItem) => void;
}

const activityIcons = {
  user: User,
  transaction: ArrowRightLeft,
  kyc: Shield,
  fraud: AlertTriangle,
  card: CreditCard,
  ticket: MessageSquare,
  settings: Settings,
  login: LogIn,
  approve: CheckCircle,
  reject: XCircle,
  document: FileText,
};

const activityColors = {
  user: "text-indigo-400 bg-indigo-500/20",
  transaction: "text-blue-400 bg-blue-500/20",
  kyc: "text-amber-400 bg-amber-500/20",
  fraud: "text-rose-400 bg-rose-500/20",
  card: "text-purple-400 bg-purple-500/20",
  ticket: "text-cyan-400 bg-cyan-500/20",
  settings: "text-slate-400 bg-slate-500/20",
  login: "text-emerald-400 bg-emerald-500/20",
  approve: "text-emerald-400 bg-emerald-500/20",
  reject: "text-rose-400 bg-rose-500/20",
  document: "text-orange-400 bg-orange-500/20",
};

export function ActivityFeed({ activities, loading = false, onItemClick }: ActivityFeedProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 animate-pulse">
            <div className="h-10 w-10 rounded-xl bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/4 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type] || LogIn;
        const colorClass = activityColors[activity.type] || activityColors.login;

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onItemClick?.(activity)}
            className={clsx(
              "group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-white/5",
              onItemClick && "cursor-pointer"
            )}
          >
            <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", colorClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-200">
                {activity.user && (
                  <span className="font-medium text-white">{activity.user.name} </span>
                )}
                {activity.description}
              </p>
              <p className="mt-1 text-xs text-slate-500">{formatTimestamp(activity.timestamp)}</p>
            </div>
          </motion.div>
        );
      })}

      {activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <LogIn className="h-8 w-8 text-slate-500" />
          </div>
          <p className="text-slate-400">No recent activity</p>
        </div>
      )}
    </div>
  );
}
