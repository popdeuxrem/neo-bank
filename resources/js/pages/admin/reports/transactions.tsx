import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Eye,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { PageHeader, FilterBar, FilterInput, FilterSelect } from "@/components/admin/filter-bar";

interface Transaction {
  id: number;
  transaction_number: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  user_name: string;
  user_email: string;
  entries: { account: string; entry_type: string; amount: number }[];
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface Summary {
  total_volume: number;
  total_count: number;
  avg_amount: number;
}

interface TransactionReportProps {
  transactions: Transaction[];
  pagination: Pagination;
  summary: Summary;
  filters: {
    search: string;
    type: string;
    status: string;
    min_amount: string;
    max_amount: string;
    from_date: string;
    to_date: string;
    sort: string;
    dir: string;
  };
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionReport({
  transactions,
  pagination,
  summary,
  filters: initialFilters,
}: TransactionReportProps) {
  const [filters, setFilters] = useState(initialFilters);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    window.location.href = `/admin/reports/transactions?${params.toString()}`;
  };

  const activeFilterCount = [
    filters.search,
    filters.type,
    filters.status,
    filters.min_amount,
    filters.max_amount,
    filters.from_date,
    filters.to_date,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      status: "",
      min_amount: "",
      max_amount: "",
      from_date: "",
      to_date: "",
      sort: "created_at",
      dir: "desc",
    });
    window.location.href = "/admin/reports/transactions";
  };

  const exportData = (format: string) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    params.set("export", format);
    window.location.href = `/admin/reports/transactions?${params.toString()}`;
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Transaction History"
        subtitle="View and filter all transactions across the platform"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => exportData("csv")}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Total Volume</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatCurrency(summary.total_volume)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Total Transactions</p>
          <p className="mt-1 text-2xl font-bold text-white">{summary.total_count}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Average Amount</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatCurrency(summary.avg_amount)}
          </p>
        </div>
      </motion.div>

      <FilterBar onClear={clearFilters} activeCount={activeFilterCount}>
        <FilterInput
          value={filters.search}
          onChange={(v) => handleFilterChange("search", v)}
          placeholder="Search transaction ID or user..."
        />
        <FilterSelect
          value={filters.type}
          onChange={(v) => handleFilterChange("type", v)}
          options={[
            { value: "deposit", label: "Deposit" },
            { value: "withdrawal", label: "Withdrawal" },
            { value: "transfer", label: "Transfer" },
            { value: "payment", label: "Payment" },
            { value: "refund", label: "Refund" },
          ]}
          placeholder="All Types"
        />
        <FilterSelect
          value={filters.status}
          onChange={(v) => handleFilterChange("status", v)}
          options={[
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
            { value: "flagged", label: "Flagged" },
            { value: "reversed", label: "Reversed" },
          ]}
          placeholder="All Statuses"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.min_amount}
            onChange={(e) => handleFilterChange("min_amount", e.target.value)}
            placeholder="Min amount"
            className="w-28 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <span className="text-slate-500">-</span>
          <input
            type="number"
            value={filters.max_amount}
            onChange={(e) => handleFilterChange("max_amount", e.target.value)}
            placeholder="Max amount"
            className="w-28 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <input
          type="date"
          value={filters.from_date}
          onChange={(e) => handleFilterChange("from_date", e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="date"
          value={filters.to_date}
          onChange={(e) => handleFilterChange("to_date", e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
        />
      </FilterBar>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Transaction
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  User
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Type
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((txn) => (
                <tr key={txn.id} className="group hover:bg-white/5">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-mono text-sm font-medium text-white">
                        {txn.transaction_number}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">
                        {txn.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-white">{txn.user_name || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{txn.user_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`capitalize ${typeColors[txn.type] || "text-slate-400"}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-white">{formatCurrency(txn.amount)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[txn.status] || "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-400">{formatDate(txn.created_at)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ArrowRightLeft className="mb-4 h-12 w-12 text-slate-500" />
            <p className="text-lg font-medium text-white">No transactions found</p>
            <p className="text-sm text-slate-400">Try adjusting your filters</p>
          </div>
        )}

        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-4">
            <p className="text-sm text-slate-400">
              Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{" "}
              {pagination.total} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("page", String(pagination.current_page - 1));
                  window.location.href = `/admin/reports/transactions?${params.toString()}`;
                }}
                disabled={pagination.current_page === 1}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("page", String(pagination.current_page + 1));
                  window.location.href = `/admin/reports/transactions?${params.toString()}`;
                }}
                disabled={pagination.current_page === pagination.last_page}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
