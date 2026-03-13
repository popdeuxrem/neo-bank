import { useState } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  ArrowRightLeft,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { PageHeader } from "@/components/admin/filter-bar";
import { RiskBadge } from "@/components/admin/risk-badge";

interface Stat {
  totalUsers: number;
  newUsersToday: number;
  newUsersYesterday: number;
  pendingKyc: number;
  flaggedTransactions: number;
  activeTickets: number;
  totalTransactionVolume: number;
  totalTransactionCount: number;
}

interface Transaction {
  id: number;
  transaction_number: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  user_id: number;
  user_name: string;
  user_email: string;
}

interface KycDocument {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  document_type: string;
  document_type_label: string;
  file_path: string;
  status: string;
  created_at: string;
}

interface FraudAlert {
  id: number;
  transaction_number: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  user_id: number;
  user_name: string;
  fraud_score: number | null;
  fraud_reason: string;
}

interface ChartData {
  date: string;
  label: string;
  volume: number;
  count: number;
  deposits: number;
  withdrawals: number;
  transfers: number;
  payments: number;
}

interface DashboardProps {
  stats: Stat;
  recentTransactions: Transaction[];
  kycQueue: KycDocument[];
  fraudAlerts: FraudAlert[];
  chartData: ChartData[];
}

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  failed: "bg-rose-500/20 text-rose-400",
  flagged: "bg-orange-500/20 text-orange-400",
  reversed: "bg-slate-500/20 text-slate-400",
};

const typeColors: Record<string, string> = {
  deposit: "text-blue-400",
  withdrawal: "text-rose-400",
  transfer: "text-purple-400",
  payment: "text-cyan-400",
  refund: "text-amber-400",
  fee: "text-slate-400",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function Dashboard({
  stats,
  recentTransactions,
  kycQueue,
  fraudAlerts,
  chartData,
}: DashboardProps) {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");
  const [chartMetric, setChartMetric] = useState<"volume" | "count">("volume");

  const filteredChartData =
    timeRange === "7D"
      ? chartData.slice(-7)
      : timeRange === "90D"
      ? chartData
      : chartData;

  const userTrend = calculateTrend(stats.newUsersToday, stats.newUsersYesterday);

  const transactionTypes = [
    { name: "Deposits", value: filteredChartData.reduce((sum, d) => sum + d.deposits, 0), color: "#3b82f6" },
    { name: "Withdrawals", value: filteredChartData.reduce((sum, d) => sum + d.withdrawals, 0), color: "#f43f5e" },
    { name: "Transfers", value: filteredChartData.reduce((sum, d) => sum + d.transfers, 0), color: "#a855f7" },
    { name: "Payments", value: filteredChartData.reduce((sum, d) => sum + d.payments, 0), color: "#06b6d4" },
  ].filter((t) => t.value > 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your bank."
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
      >
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-400">Total Users</p>
                <p className="text-3xl font-bold text-white">{formatNumber(stats.totalUsers)}</p>
                <div className="flex items-center gap-1 text-sm">
                  {userTrend >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-rose-400" />
                  )}
                  <span className={userTrend >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {userTrend > 0 ? "+" : ""}
                    {userTrend}%
                  </span>
                  <span className="text-slate-500">vs yesterday</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500/50" />
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-400">Total Transactions</p>
                <p className="text-3xl font-bold text-white">{formatNumber(stats.totalTransactionCount)}</p>
                <p className="text-sm text-slate-400">
                  {formatCurrency(stats.totalTransactionVolume)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <ArrowRightLeft className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/50" />
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-400">Pending KYC</p>
                <p className="text-3xl font-bold text-white">{stats.pendingKyc}</p>
                <p className="text-sm text-slate-500">documents to review</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/50" />
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-400">Flagged Transactions</p>
                <p className="text-3xl font-bold text-white">{stats.flaggedTransactions}</p>
                <p className="text-sm text-slate-500">need investigation</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500/50" />
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-400">Active Tickets</p>
                <p className="text-3xl font-bold text-white">{stats.activeTickets}</p>
                <p className="text-sm text-slate-500">pending support</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500/50" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Transaction Overview</h2>
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-white/5 p-1">
              {(["volume", "count"] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setChartMetric(metric)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    chartMetric === metric
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {metric === "volume" ? "Volume ($)" : "Count"}
                </button>
              ))}
            </div>
            <div className="flex rounded-lg bg-white/5 p-1">
              {(["7D", "30D", "90D"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredChartData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  chartMetric === "volume" ? `$${(value / 1000).toFixed(0)}k` : value
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value: number) => [
                  chartMetric === "volume" ? formatCurrency(value * 100) : value,
                  chartMetric === "volume" ? "Volume" : "Count",
                ]}
              />
              <Area
                type="monotone"
                dataKey={chartMetric}
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            <Link
              href="/admin/reports/transactions"
              className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                    User
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Type
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Amount
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Date
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="group hover:bg-white/5">
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-white">{txn.user_name || "Unknown"}</p>
                        <p className="text-sm text-slate-500">{txn.user_email}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`capitalize ${typeColors[txn.type] || "text-slate-400"}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-white">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[txn.status] || "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-400">{formatDate(txn.created_at)}</td>
                    <td className="py-4">
                      <Link
                        href={`/admin/reports/transactions/${txn.id}`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6 lg:col-span-2"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">KYC Queue</h2>
              <Link
                href="/admin/oversight/kyc"
                className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {kycQueue.length > 0 ? (
              <div className="space-y-4">
                {kycQueue.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{doc.user_name}</p>
                        <p className="text-sm text-slate-500">{doc.document_type_label}</p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/oversight/kyc/${doc.id}`}
                      className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-400 hover:bg-amber-500/30"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="mb-2 h-10 w-10 text-emerald-400" />
                <p className="text-slate-400">All caught up!</p>
                <p className="text-sm text-slate-500">No pending documents</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Fraud Alerts</h2>
              <Link
                href="/admin/oversight/fraud"
                className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {fraudAlerts.length > 0 ? (
              <div className="space-y-4">
                {fraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{alert.user_name}</p>
                        <p className="text-sm text-slate-500">{alert.fraud_reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.fraud_score !== null && <RiskBadge score={alert.fraud_score} size="sm" />}
                      <Link
                        href={`/admin/oversight/fraud/${alert.id}`}
                        className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-rose-400 hover:bg-rose-500/30"
                      >
                        Investigate
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="mb-2 h-10 w-10 text-emerald-400" />
                <p className="text-slate-400">No flagged transactions</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-white">User Growth</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Transaction Types</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {transactionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {transactionTypes.map((type) => (
              <div key={type.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-xs text-slate-400">
                  {type.name} ({type.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-white">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-sm text-slate-300">Redis</span>
              </div>
              <span className="text-sm font-medium text-emerald-400">Connected</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-sm text-slate-300">Queue Workers</span>
              </div>
              <span className="text-sm font-medium text-blue-400">3 running</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-sm text-slate-300">Last Cron</span>
              </div>
              <span className="text-sm font-medium text-purple-400">2 min ago</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-sm text-slate-300">DB Connections</span>
              </div>
              <span className="text-sm font-medium text-cyan-400">15/100</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
