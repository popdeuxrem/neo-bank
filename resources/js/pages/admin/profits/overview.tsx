import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building,
  PiggyBank,
  Lock,
  Landmark,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/filter-bar";
import AdminLayout from "@/layouts/admin-layout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ProfitData {
  date: string;
  label: string;
  transaction_fees: number;
  conversion_margin: number;
  wire_fees: number;
  card_fees: number;
  dps_profit: number;
  fdr_profit: number;
  loan_interest: number;
  total: number;
}

interface OverviewProps {
  stats: {
    total_revenue: number;
    transaction_fees: number;
    conversion_profit: number;
    wire_fees: number;
    card_fees: number;
    dps_profit: number;
    fdr_profit: number;
    loan_interest: number;
    revenue_change: number;
  };
  chartData: ProfitData[];
  topSources: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

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

export default function ProfitOverview({ stats, chartData, topSources }: OverviewProps) {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");

  const filteredData =
    timeRange === "7D"
      ? chartData.slice(-7)
      : timeRange === "90D"
      ? chartData
      : timeRange === "1Y"
      ? chartData
      : chartData;

  const statCards = [
    {
      label: "Total Revenue",
      value: stats.total_revenue,
      change: stats.revenue_change,
      icon: DollarSign,
      color: "indigo",
    },
    {
      label: "Transaction Fees",
      value: stats.transaction_fees,
      icon: RefreshCw,
      color: "blue",
    },
    {
      label: "Conversion Profit",
      value: stats.conversion_profit,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      label: "Wire Fees",
      value: stats.wire_fees,
      icon: Landmark,
      color: "purple",
    },
    {
      label: "Card Fees",
      value: stats.card_fees,
      icon: CreditCard,
      color: "pink",
    },
    {
      label: "Loan Interest",
      value: stats.loan_interest,
      icon: Building,
      color: "amber",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Profit Overview"
        subtitle="Track your bank's revenue and profit streams"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-6"
      >
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-white">{formatCurrency(stat.value)}</p>
              </div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${stat.color}-500/20 text-${stat.color}-400`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            {stat.change !== undefined && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                {stat.change >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-rose-400" />
                )}
                <span className={stat.change >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {stat.change >= 0 ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-slate-500">vs last month</span>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Revenue Trend</h2>
          <div className="flex rounded-lg bg-white/5 p-1">
            {(["7D", "30D", "90D", "1Y"] as const).map((range) => (
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
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Revenue by Source</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="name"
                >
                  {topSources.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            {topSources.map((source, index) => (
              <div key={source.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-slate-400">
                  {source.name} ({source.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Top Profit Sources</h2>
          <div className="space-y-4">
            {topSources.map((source, index) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                    <span className="text-sm font-medium text-slate-400">#{index + 1}</span>
                  </div>
                  <span className="text-sm text-white">{source.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{formatCurrency(source.amount)}</p>
                  <p className="text-xs text-slate-500">{source.percentage}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
