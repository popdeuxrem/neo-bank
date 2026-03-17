import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  Landmark,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { PageHeader, FilterBar, FilterSelect } from "@/components/admin/filter-bar";
import { DataTable } from "@/components/admin/data-table";
import AdminLayout from "@/layouts/admin-layout";

interface Loan {
  id: number;
  loan_number: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  plan: {
    id: number;
    name: string;
    interest_rate: number;
  };
  amount: number;
  currency: string;
  emi_amount: number;
  duration_months: number;
  paid_installments: number;
  total_installments: number;
  status: string;
  next_payment_date: string;
  created_at: string;
  [key: string]: unknown;
}

interface LoansPageProps {
  loans: Loan[];
  stats: {
    total: number;
    active: number;
    pending: number;
    overdue: number;
    total_disbursed: number;
    total_collected: number;
  };
  filters: {
    status: string;
    plan: string;
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
  active: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  overdue: "bg-rose-500/20 text-rose-400",
  completed: "bg-blue-500/20 text-blue-400",
  rejected: "bg-slate-500/20 text-slate-400",
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
  });
}

export default function LoansIndex({ loans, stats, filters: initialFilters, pagination }: LoansPageProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "collect" | null>(null);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    window.location.href = `/admin/loans?${params.toString()}`;
  };

  const handleAction = async () => {
    if (!selectedLoan || !actionType || !csrfToken) return;

    let endpoint = "";
    switch (actionType) {
      case "approve":
        endpoint = `/admin/loans/${selectedLoan.id}/approve`;
        break;
      case "reject":
        endpoint = `/admin/loans/${selectedLoan.id}/reject`;
        break;
      case "collect":
        endpoint = `/admin/loans/${selectedLoan.id}/collect`;
        break;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
      });
      if (response.ok) window.location.reload();
    } catch (error) {
      console.error("Action failed:", error);
    }

    setActionModalOpen(false);
    setSelectedLoan(null);
    setActionType(null);
  };

  const columns = [
    {
      key: "loan",
      label: "Loan",
      render: (loan: Loan) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-white">{loan.loan_number}</p>
            <p className="text-xs text-slate-500">{formatDate(loan.created_at)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "Borrower",
      render: (loan: Loan) => (
        <div>
          <p className="font-medium text-white">{loan.user.name}</p>
          <p className="text-xs text-slate-500">{loan.user.email}</p>
        </div>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (loan: Loan) => (
        <div>
          <p className="text-white">{loan.plan.name}</p>
          <p className="text-xs text-slate-500">{loan.plan.interest_rate}% APR</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (loan: Loan) => (
        <div>
          <p className="font-medium text-white">{formatCurrency(loan.amount, loan.currency)}</p>
          <p className="text-xs text-slate-500">EMI: {formatCurrency(loan.emi_amount)}</p>
        </div>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      render: (loan: Loan) => (
        <div className="w-32">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-slate-400">{loan.paid_installments}/{loan.total_installments}</span>
            <span className="text-slate-400">{Math.round((loan.paid_installments / loan.total_installments) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${(loan.paid_installments / loan.total_installments) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (loan: Loan) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[loan.status] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {loan.status === "active" && <CheckCircle className="h-3 w-3" />}
          {loan.status === "pending" && <Clock className="h-3 w-3" />}
          {loan.status === "overdue" && <AlertTriangle className="h-3 w-3" />}
          {loan.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (loan: Loan) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/loans/${loan.id}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {loan.status === "pending" && (
            <>
              <button
                onClick={() => { setSelectedLoan(loan); setActionType("approve"); setActionModalOpen(true); }}
                className="rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/20"
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setSelectedLoan(loan); setActionType("reject"); setActionModalOpen(true); }}
                className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/20"
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          {loan.status === "active" && (
            <button
              onClick={() => { setSelectedLoan(loan); setActionType("collect"); setActionModalOpen(true); }}
              className="rounded-lg p-2 text-indigo-400 hover:bg-indigo-500/20"
              title="Record Payment"
            >
              <DollarSign className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Loans"
        subtitle="Manage loan applications and active loans"
        actions={
          <Link
            href="/admin/loans/plans"
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Link>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-5"
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Total Loans</p>
          <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.active.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{stats.pending.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Overdue</p>
          <p className="text-2xl font-bold text-rose-400">{stats.overdue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Disbursed</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.total_disbursed)}</p>
        </div>
      </motion.div>

      <FilterBar onClear={() => (window.location.href = "/admin/loans")} activeCount={0}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search loans..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <FilterSelect
          value={filters.status}
          onChange={(v) => handleFilterChange("status", v)}
          options={[
            { value: "active", label: "Active" },
            { value: "pending", label: "Pending" },
            { value: "overdue", label: "Overdue" },
            { value: "completed", label: "Completed" },
          ]}
          placeholder="All Statuses"
        />
      </FilterBar>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <DataTable
          columns={columns}
          data={loans}
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          totalItems={pagination.total}
          pageSize={pagination.per_page}
          onPageChange={(page) => {
            const params = new URLSearchParams(window.location.search);
            params.set("page", String(page));
            window.location.href = `/admin/loans?${params.toString()}`;
          }}
        />
      </motion.div>

      <ConfirmModal
        isOpen={actionModalOpen}
        onClose={() => { setActionModalOpen(false); setSelectedLoan(null); setActionType(null); }}
        onConfirm={handleAction}
        title={actionType === "approve" ? "Approve Loan" : actionType === "reject" ? "Reject Loan" : "Record Payment"}
        description={
          actionType === "approve"
            ? `Approve loan of ${selectedLoan ? formatCurrency(selectedLoan.amount, selectedLoan.currency) : ""}?`
            : actionType === "reject"
            ? "Are you sure you want to reject this loan application?"
            : "Record an EMI payment for this loan?"
        }
        confirmLabel={actionType === "approve" ? "Approve" : actionType === "reject" ? "Reject" : "Record"}
        variant={actionType === "approve" ? "success" : actionType === "reject" ? "danger" : "default"}
      />
    </AdminLayout>
  );
}
