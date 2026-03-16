import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  Server,
  Database,
  HardDrive,
  Zap,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/filter-bar";
import AdminLayout from "@/layouts/admin-layout";

interface SystemInfoProps {
  stats: {
    cpu: {
      percentage: number;
      "1min": number;
      "5min": number;
      "15min": number;
    };
    memory: {
      percentage: number;
      system: {
        total: number;
        used: number;
        free: number;
      };
      php: {
        used: number;
        peak: number;
      };
    };
    queues: {
      queues: Record<string, { pending: number; failed: number; delayed: number }>;
      total_pending: number;
      total_failed: number;
    };
    database: {
      connected: boolean;
      response_time_ms: number;
      database: string;
    };
    health_score: number;
    status: string;
    timestamp: string;
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
return "0 B";
}

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatMs(ms: number): string {
  return `${ms.toFixed(2)} ms`;
}

function getStatusColor(status: string): string {
  if (status === "healthy") {
return "text-emerald-400 bg-emerald-500/20";
}

  if (status === "degraded") {
return "text-amber-400 bg-amber-500/20";
}

  return "text-rose-400 bg-rose-500/20";
}

export default function SystemInfo({ stats: initialStats }: { stats?: SystemInfoProps["stats"] }) {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const fetchStats = async () => {
    setLoading(true);

    try {
      const response = await fetch("/admin/health");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }

    setLoading(false);
  };

  const clearCache = async () => {
    setClearingCache(true);

    try {
      await fetch("/admin/system/cache/clear", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken || "",
        },
      });
      await fetchStats();
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }

    setClearingCache(false);
  };

  useEffect(() => {
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const defaultStats = stats || {
    cpu: { percentage: 0, "1min": 0, "5min": 0, "15min": 0 },
    memory: { percentage: 0, system: { total: 0, used: 0, free: 0 }, php: { used: 0, peak: 0 } },
    queues: { queues: {}, total_pending: 0, total_failed: 0 },
    database: { connected: false, response_time_ms: 0, database: "" },
    health_score: 0,
    status: "unknown",
    timestamp: new Date().toISOString(),
  };

  return (
    <AdminLayout>
      <PageHeader
        title="System Info"
        subtitle="Monitor server health and performance metrics"
        actions={
          <div className="flex gap-2">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={clearCache}
              disabled={clearingCache}
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {clearingCache ? "Clearing..." : "Clear Cache"}
            </button>
          </div>
        }
      />

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${stats?.status === "healthy" ? "bg-emerald-400" : stats?.status === "degraded" ? "bg-amber-400" : "bg-rose-400"} ${stats?.status === "healthy" && "animate-pulse"}`} />
          <span className="text-lg font-medium text-white capitalize">{stats?.status || "Unknown"}</span>
        </div>
        <span className="text-sm text-slate-400">
          Health Score: <span className="font-medium text-white">{stats?.health_score || 0}/100</span>
        </span>
        <span className="text-sm text-slate-400">
          Last updated: {stats?.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : "Never"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">CPU Usage</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-400">Current Load</span>
                <span className="font-medium text-white">{defaultStats.cpu.percentage?.toFixed(1) || 0}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${Math.min(defaultStats.cpu.percentage || 0, 100)}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-400">1 min</p>
                <p className="text-lg font-bold text-white">{defaultStats.cpu["1min"]?.toFixed(2) || 0}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-400">5 min</p>
                <p className="text-lg font-bold text-white">{defaultStats.cpu["5min"]?.toFixed(2) || 0}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-400">15 min</p>
                <p className="text-lg font-bold text-white">{defaultStats.cpu["15min"]?.toFixed(2) || 0}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Memory Usage</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-400">System Memory</span>
                <span className="font-medium text-white">{defaultStats.memory.percentage?.toFixed(1) || 0}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all"
                  style={{ width: `${Math.min(defaultStats.memory.percentage || 0, 100)}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-400">Used</p>
                <p className="text-lg font-bold text-white">{formatBytes(defaultStats.memory.system?.used || 0)}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-400">Total</p>
                <p className="text-lg font-bold text-white">{formatBytes(defaultStats.memory.system?.total || 0)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Database</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <span className="text-slate-400">Status</span>
              <div className="flex items-center gap-2">
                {defaultStats.database.connected ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-rose-400" />
                )}
                <span className={defaultStats.database.connected ? "text-emerald-400" : "text-rose-400"}>
                  {defaultStats.database.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-400">Response Time</p>
                <p className="text-lg font-bold text-white">{formatMs(defaultStats.database.response_time_ms || 0)}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-400">Database</p>
                <p className="text-lg font-bold text-white truncate">{defaultStats.database.database || "N/A"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Server className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Queue Workers</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(defaultStats.queues.queues || {}).map(([name, data]) => (
              <div key={name} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="font-medium text-white capitalize">{name}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-slate-400">{data.pending} pending</span>
                  <span className="text-rose-400">{data.failed} failed</span>
                </div>
              </div>
            ))}
            {Object.keys(defaultStats.queues.queues || {}).length === 0 && (
              <p className="text-center text-slate-400">No queue data available</p>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
