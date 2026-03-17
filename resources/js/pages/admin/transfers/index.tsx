import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  User,
} from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { PageHeader, FilterBar, FilterSelect } from "@/components/admin/filter-bar";
import { DataTable } from "@/components/admin/data-table";
import AdminLayout from "@/layouts/admin-layout";

interface Transfer {
  id: number;
  transaction_number: string;
  from_user: {
    id: number;
    name: string;
    email: string;
  };
  to_user: {
    id: number;
    name: string;
    email: string;
  };
  amount: number;
  fee: number;
  currency: string;
  type: string;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

interface TransfersPageProps {
  transfers: Transfer[];
  stats: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
  };
  filters: {
    status: string;
    type: string;
    search: string;
  };
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  failed: "bg-rose-500/20 text-rose-400",
  processing: "bg-blue-500/20 text-blue-400",
  reversed: "bg-slate-500/20 text-slate-400",
};

const typeColors: Record<string, string> = {
  internal: "bg-indigo-500/20 text-indigo-400",
  external: "bg-purple-500/20 text-purple-400",
  wire: "bg-cyan-500/20 text-cyan-400",
};

function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
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

export default function TransfersIndex({
  transfers,
  stats,
  filters: initialFilters,
  pagination,
}: TransfersPageProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "reverse" | null>(null);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) {
        params.set(k, v);
      }
    });

    window.location.href = `/admin/transfers?${params.toString()}`;
  };

  const handleAction = async () => {
    if (!selectedTransfer || !actionType || !csrfToken) {
      return;
    }

    let endpoint = "";
    let method = "POST";

    switch (actionType) {
      case "approve":
        endpoint = `/admin/transfers/${selectedTransfer.id}/approve`;
        break;
      case "reject":
        endpoint = `/admin/transfers/${selectedTransfer.id}/reject`;
        break;
      case "reverse":
        endpoint = `/admin/transfers/${selectedTransfer.id}/reverse`;
        break;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Action failed:", error);
    }

    setActionModalOpen(false);
    setSelectedTransfer(null);
    setActionType(null);
  };

  const columns = [
    {
      key: "transfer",
      label: "Transfer",
      render: (transfer: Transfer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
            <ArrowRightLeft className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <p className="font-medium text-white">{transfer.transaction_number}</p>
            <p className="text-xs text-slate-500">{formatDate(transfer.created_at)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "from",
      label: "From",
      render: (transfer: Transfer) => (
        <div>
          <p className="font-medium text-white">{transfer.from_user.name}</p>
          <p className="text-xs text-slate-500">{transfer.from_user.email}</p>
        </div>
      ),
    },
    {
      key: "to",
      label: "To",
      render: (transfer: Transfer) => (
        <div>
          <p className="font-medium text-white">{transfer.to_user.name}</p>
          <p className="text-xs text-slate-500">{transfer.to_user.email}</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (transfer: Transfer) => (
        <div>
          <p className="font-medium text-white">
            {formatCurrency(transfer.amount, transfer.currency)}
          </p>
          <p className="text-xs text-slate-500">Fee: {formatCurrency(transfer.fee)}</p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (transfer: Transfer) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            typeColors[transfer.type] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {transfer.type}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (transfer: Transfer) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[transfer.status] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {transfer.status === "completed" && <CheckCircle className="h-3 w-3" />}
          {transfer.status === "pending" && <Clock className="h-3 w-3" />}
          {transfer.status === "failed" && <XCircle className="h-3 w-3" />}
          {transfer.status === "processing" && <RefreshCw className="h-3 w-3" />}
          {transfer.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (transfer: Transfer) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/transfers/${transfer.id}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {transfer.status === "pending" && (
            <>
              <button
                onClick={() => {
                  setSelectedTransfer(transfer);
                  setActionType("approve");
                  setActionModalOpen(true);
                }}
                className="rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/20"
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedTransfer(transfer);
                  setActionType("reject");
                  setActionModalOpen(true);
                }}
                className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/20"
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          {transfer.status === "completed" && (
            <button
              onClick={() => {
                setSelectedTransfer(transfer);
                setActionType("reverse");
                setActionModalOpen(true);
              }}
              className="rounded-lg p-2 text-amber-400 hover:bg-amber-500/20"
              title="Reverse"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Fund Transfers"
        subtitle="Manage all fund transfers across the platform"
        actions={
          <div className="flex gap-2">
            <Link
              href="/admin/transfers/manual"
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" />
              Manual Transfer
            </Link>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Total Transfers</p>
          <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{stats.pending.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.completed.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Failed</p>
          <p className="text-2xl font-bold text-rose-400">{stats.failed.toLocaleString()}</p>
        </div>
      </motion.div>

      <FilterBar onClear={() => window.location.href = "/admin/transfers"} activeCount={0}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search transfers..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <FilterSelect
          value={filters.status}
          onChange={(v) => handleFilterChange("status", v)}
          options={[
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
            { value: "processing", label: "Processing" },
          ]}
          placeholder="All Statuses"
        />
        <FilterSelect
          value={filters.type}
          onChange={(v) => handleFilterChange("type", v)}
          options={[
            { value: "internal", label: "Internal" },
            { value: "external", label: "External" },
            { value: "wire", label: "Wire" },
          ]}
          placeholder="All Types"
        />
      </FilterBar>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <DataTable
          columns={columns}
          data={transfers}
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          totalItems={pagination.total}
          pageSize={pagination.per_page}
          onPageChange={(page) => {
            const params = new URLSearchParams(window.location.search);
            params.set("page", String(page));
            window.location.href = `/admin/transfers?${params.toString()}`;
          }}
          onRowClick={(transfer) => (window.location.href = `/admin/transfers/${transfer.id}`)}
        />
      </motion.div>

      <ConfirmModal
        isOpen={actionModalOpen}
        onClose={() => {
          setActionModalOpen(false);
          setSelectedTransfer(null);
          setActionType(null);
        }}
        onConfirm={handleAction}
        title={
          actionType === "approve"
            ? "Approve Transfer"
            : actionType === "reject"
            ? "Reject Transfer"
            : "Reverse Transfer"
        }
        description={
          actionType === "approve"
            ? `Are you sure you want to approve this transfer of ${selectedTransfer ? formatCurrency(selectedTransfer.amount, selectedTransfer.currency) : ""}?`
            : actionType === "reject"
            ? "Are you sure you want to reject this transfer? The sender will be notified."
            : "Are you sure you want to reverse this transfer? This will refund the amount to the sender."
        }
        confirmLabel={actionType === "approve" ? "Approve" : actionType === "reject" ? "Reject" : "Reverse"}
        variant={actionType === "approve" ? "success" : actionType === "reject" ? "danger" : "warning"}
      />
    </AdminLayout>
  );
}
