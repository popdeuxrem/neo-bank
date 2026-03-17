import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  PiggyBank,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { PageHeader, FilterBar, FilterSelect } from "@/components/admin/filter-bar";
import { DataTable } from "@/components/admin/data-table";
import AdminLayout from "@/layouts/admin-layout";

interface DpsPlan {
  id: number;
  name: string;
  interest_rate: number;
  minimum_amount: number;
  maximum_amount: number;
  duration_months: number;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

interface DpsPageProps {
  plans: DpsPlan[];
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  inactive: "bg-slate-500/20 text-slate-400",
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
  });
}

export default function DpsPlans({ plans }: DpsPageProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DpsPlan | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleDelete = async () => {
    if (!selectedPlan || !csrfToken) return;

    try {
      const response = await fetch(`/admin/dps/plans/${selectedPlan.id}`, {
        method: "DELETE",
        headers: { "X-CSRF-TOKEN": csrfToken },
      });
      if (response.ok) window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
    }

    setDeleteModalOpen(false);
    setSelectedPlan(null);
  };

  const handleToggleStatus = async (plan: DpsPlan) => {
    if (!csrfToken) return;

    try {
      const response = await fetch(`/admin/dps/plans/${plan.id}/toggle`, {
        method: "POST",
        headers: { "X-CSRF-TOKEN": csrfToken },
      });
      if (response.ok) window.location.reload();
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Plan Name",
      render: (plan: DpsPlan) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-white">{plan.name}</p>
            <p className="text-xs text-slate-500">{plan.duration_months} months term</p>
          </div>
        </div>
      ),
    },
    {
      key: "interest_rate",
      label: "Interest Rate",
      sortable: true,
      render: (plan: DpsPlan) => (
        <div>
          <p className="font-medium text-white">{plan.interest_rate}%</p>
          <p className="text-xs text-slate-500">per annum</p>
        </div>
      ),
    },
    {
      key: "minimum_amount",
      label: "Min Amount",
      sortable: true,
      render: (plan: DpsPlan) => (
        <span className="text-white">{formatCurrency(plan.minimum_amount)}</span>
      ),
    },
    {
      key: "maximum_amount",
      label: "Max Amount",
      sortable: true,
      render: (plan: DpsPlan) => (
        <span className="text-white">{formatCurrency(plan.maximum_amount)}</span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (plan: DpsPlan) => (
        <span className="text-white">{plan.duration_months} months</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (plan: DpsPlan) => (
        <button
          onClick={() => handleToggleStatus(plan)}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[plan.status] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {plan.status === "active" && <CheckCircle className="h-3 w-3" />}
          {plan.status === "inactive" && <Clock className="h-3 w-3" />}
          {plan.status}
        </button>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (plan: DpsPlan) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedPlan(plan);
              setEditModalOpen(true);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button
            onClick={() => {
              setSelectedPlan(plan);
              setDeleteModalOpen(true);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="DPS Plans"
        subtitle="Manage Deposit Pension Scheme plans"
        actions={
          <button
            onClick={() => {
              setSelectedPlan(null);
              setEditModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <DataTable columns={columns} data={plans} />
      </motion.div>

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">
              {selectedPlan ? "Edit DPS Plan" : "Create DPS Plan"}
            </h3>
            <form>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-slate-400">Plan Name</label>
                <input
                  type="text"
                  defaultValue={selectedPlan?.name}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g., Silver DPS Plan"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={selectedPlan?.interest_rate}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="8.5"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">Duration (Months)</label>
                  <input
                    type="number"
                    defaultValue={selectedPlan?.duration_months}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="12"
                  />
                </div>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">Minimum Amount</label>
                  <input
                    type="number"
                    defaultValue={selectedPlan?.minimum_amount}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-400">Maximum Amount</label>
                  <input
                    type="number"
                    defaultValue={selectedPlan?.maximum_amount}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="1000000"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
                >
                  {selectedPlan ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedPlan(null); }}
        onConfirm={handleDelete}
        title="Delete DPS Plan"
        description={`Are you sure you want to delete "${selectedPlan?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </AdminLayout>
  );
}
