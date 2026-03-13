import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { LogIn, Search, Monitor, Globe, Clock } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { PageHeader, FilterBar, FilterInput } from "@/components/admin/filter-bar";

interface LoginLog {
  id: number;
  user_id: number;
  user: {
    name: string;
    email: string;
  };
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
}

interface LoginsPageProps {
  logs: LoginLog[];
  pagination: Pagination;
  filters: {
    search: string;
    from_date: string;
    to_date: string;
  };
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

function getDeviceIcon(userAgent: string): string {
  if (userAgent.toLowerCase().includes("mobile")) return "📱";
  if (userAgent.toLowerCase().includes("tablet")) return "�Tablet";
  return "💻";
}

export default function LoginsReport({ logs, pagination, filters: initialFilters }: LoginsPageProps) {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    window.location.href = `/admin/reports/logins?${params.toString()}`;
  };

  const activeFilterCount = [filters.search, filters.from_date, filters.to_date].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ search: "", from_date: "", to_date: "" });
    window.location.href = "/admin/reports/logins";
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Login History"
        subtitle="Track user login activity across the platform"
      />

      <FilterBar onClear={clearFilters} activeCount={activeFilterCount}>
        <FilterInput
          value={filters.search}
          onChange={(v) => handleFilterChange("search", v)}
          placeholder="Search by user..."
        />
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
                  User
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  IP Address
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Device
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-white/5">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-white">{log.user?.name || "Unknown"}</p>
                      <p className="text-sm text-slate-500">{log.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-slate-500" />
                      <span className="font-mono text-sm text-slate-300">{log.ip_address}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-400 truncate max-w-[300px]">
                        {log.user_agent}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4" />
                      {formatDate(log.created_at)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <LogIn className="mb-4 h-12 w-12 text-slate-500" />
            <p className="text-lg font-medium text-white">No login records found</p>
            <p className="text-sm text-slate-400">Try adjusting your filters</p>
          </div>
        )}

        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-4">
            <p className="text-sm text-slate-400">
              Showing {pagination.current_page * 20 - 19} to{" "}
              {Math.min(pagination.current_page * 20, pagination.total)} of {pagination.total} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("page", String(pagination.current_page - 1));
                  window.location.href = `/admin/reports/logins?${params.toString()}`;
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
                  window.location.href = `/admin/reports/logins?${params.toString()}`;
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
