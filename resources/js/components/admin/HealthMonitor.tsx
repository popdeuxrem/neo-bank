import { useState, useEffect, useCallback } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import {
    Activity,
    Layers,
    Cpu,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Server,
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';

interface HealthStats {
    cpu: {
        "1min": number;
        "5min": number;
        "15min": number;
        percentage: number;
    };
    memory: {
        php: { used: number; peak: number };
        system: { total: number; used: number; free: number };
        percentage: number;
    };
    queues: {
        queues: {
            [key: string]: { pending: number; failed: number; delayed: number };
        };
        total_pending: number;
        total_failed: number;
    };
    database: {
        connected: boolean;
        response_time_ms?: number;
        database?: string;
    };
    health_score: number;
    status: 'healthy' | 'degraded' | 'critical';
    timestamp: string;
}

interface ChartDataPoint {
    time: string;
    load: number;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function PulseIndicator({ status }: { status: 'healthy' | 'degraded' | 'critical' }) {
    const colors = {
        healthy: 'bg-green-500',
        degraded: 'bg-yellow-500',
        critical: 'bg-red-500',
    };

    const labels = {
        healthy: 'System Healthy',
        degraded: 'System Degraded',
        critical: 'System Critical',
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors[status]} opacity-75`} />
                <span className={`relative inline-flex h-3 w-3 rounded-full ${colors[status]}`} />
            </div>
            <span className={`text-sm font-medium ${
                status === 'healthy' ? 'text-green-400' :
                status === 'degraded' ? 'text-yellow-400' :
                'text-red-400'
            }`}>
                {labels[status]}
            </span>
        </div>
    );
}

export function HealthMonitor() {
    const [stats, setStats] = useState<HealthStats | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [restarting, setRestarting] = useState(false);

    const fetchHealth = useCallback(async () => {
        try {
            const response = await fetch('/admin/health', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            setStats(data);

            // Update chart data
            const time = new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            setChartData(prev => {
                const newData = [...prev, { time, load: data.cpu.percentage }];
                return newData.slice(-60); // Keep last 60 data points
            });
        } catch (error) {
            console.error('Failed to fetch health stats:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 5000);
        return () => clearInterval(interval);
    }, [fetchHealth]);

    const handleRestartQueue = async () => {
        setRestarting(true);
        try {
            const response = await fetch('/admin/health/restart-queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                toast.success('Queue restart command sent successfully');
            } else {
                toast.error('Failed to restart queue');
            }
        } catch {
            toast.error('An error occurred while restarting the queue');
        } finally {
            setRestarting(false);
        }
    };

    if (loading && !stats) {
        return (
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-4 backdrop-blur-xl">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 w-32 rounded bg-white/10" />
                    <div className="h-20 rounded bg-white/5" />
                    <div className="h-4 w-24 rounded bg-white/10" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-4 backdrop-blur-xl">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">System Health</h3>
                </div>
                <PulseIndicator status={stats?.status || 'healthy'} />
            </div>

            {/* CPU Chart */}
            <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Activity className="h-3 w-3" />
                        CPU Load
                    </div>
                    <span className="text-sm font-medium text-white">
                        {stats?.cpu.percentage.toFixed(1)}%
                    </span>
                </div>
                <div className="h-20 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="time" 
                                hide 
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis 
                                hide 
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                }}
                                labelStyle={{ color: '#9CA3AF' }}
                                itemStyle={{ color: '#8B5CF6' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="load"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                fill="url(#cpuGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Memory */}
                <div className="rounded-lg bg-white/5 p-3">
                    <div className="mb-1 flex items-center gap-1 text-xs text-gray-400">
                        <Cpu className="h-3 w-3" />
                        Memory
                    </div>
                    <div className="text-sm font-medium text-white">
                        {stats?.memory.percentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                        {formatBytes(stats?.memory.system.used || 0)} / {formatBytes(stats?.memory.system.total || 0)}
                    </div>
                </div>

                {/* Queues */}
                <div className="rounded-lg bg-white/5 p-3">
                    <div className="mb-1 flex items-center gap-1 text-xs text-gray-400">
                        <Layers className="h-3 w-3" />
                        Queue
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                            {stats?.queues.total_pending || 0}
                        </span>
                        <span className="text-xs text-gray-500">pending</span>
                    </div>
                    {stats?.queues.total_failed !== undefined && stats.queues.total_failed > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-red-400">
                            <AlertTriangle className="h-3 w-3" />
                            {stats.queues.total_failed} failed
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            0 failed
                        </div>
                    )}
                </div>
            </div>

            {/* Database Status */}
            <div className="mt-3 flex items-center justify-between rounded-lg bg-white/5 p-2 px-3">
                <span className="text-xs text-gray-400">Database</span>
                {stats?.database.connected ? (
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-green-400">
                            {stats.database.response_time_ms?.toFixed(1)}ms
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-400" />
                        <span className="text-xs text-red-400">Disconnected</span>
                    </div>
                )}
            </div>

            {/* Restart Button */}
            <button
                onClick={handleRestartQueue}
                disabled={restarting}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 disabled:opacity-50"
            >
                <RefreshCw className={`h-3 w-3 ${restarting ? 'animate-spin' : ''}`} />
                {restarting ? 'Restarting...' : 'Restart Queue'}
            </button>
        </div>
    );
}

export default HealthMonitor;
