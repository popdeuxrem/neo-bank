import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  CheckCircle,
  Ban,
  RotateCcw,
  Shield,
  Eye,
} from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { PageHeader, FilterBar, FilterInput, FilterSelect } from "@/components/admin/filter-bar";
import { RiskBadge } from "@/components/admin/risk-badge";
import { ConfirmModal } from "@/components/admin/confirm-modal";

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
  fraud_score: number | null;
  fraud_reason: string;
  flagged_at: string;
}

interface FraudPageProps {
  transactions: Transaction[];
}

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

export default function FraudQueue({ transactions }: FraudPageProps) {
  const [filters, setFilters] = useState({
    search: "",
    riskLevel: "",
    status: "",
  });
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [resolveAction, setResolveAction] = useState<"approve" | "reject">("approve");
  const [resolveNotes, setResolveNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const filteredTransactions = transactions.filter((txn) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (
        !txn.transaction_number.toLowerCase().includes(search) &&
        !txn.user_name?.toLowerCase().includes(search) &&
        !txn.user_email?.toLowerCase().includes(search)
      ) {
        return false;
      }
    }
    if (filters.riskLevel) {
      if (filters.riskLevel === "high" && (txn.fraud_score ?? 0) <= 60) return false;
      if (filters.riskLevel === "medium" && ((txn.fraud_score ?? 0) <= 30 || (txn.fraud_score ?? 0) > 60))
        return false;
      if (filters.riskLevel === "low" && (txn.fraud_score ?? 0) > 30) return false;
    }
    return true;
  });

  const handleResolve = async () => {
    if (!selectedTx) return;
    setLoading(true);

    try {
      const response = await fetch(`/admin/oversight/fraud/${selectedTx.id}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify({
          action: resolveAction,
          notes: resolveNotes,
        }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to resolve transaction:", error);
    }

    setLoading(false);
    setResolveModalOpen(false);
    setSelectedTx(null);
    setResolveNotes("");
  };

  const openResolveModal = (tx: Transaction, action: "approve" | "reject") => {
    setSelectedTx(tx);
    setResolveAction(action);
    setResolveModalOpen(true);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Fraud Queue"
        subtitle="Review and investigate flagged transactions"
      />

      <FilterBar onClear={() => setFilters({ search: "", riskLevel: "", status: "" })}>
        <FilterInput
          value={filters.search}
          onChange={(v) => setFilters({ ...filters, search: v })}
          placeholder="Search by ID, user..."
        />
        <FilterSelect
          value={filters.riskLevel}
          onChange={(v) => setFilters({ ...filters, riskLevel: v })}
          options={[
            { value: "high", label: "High Risk (61-100)" },
            { value: "medium", label: "Medium Risk (31-60)" },
            { value: "low", label: "Low Risk (0-30)" },
          ]}
          placeholder="All Risk Levels"
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
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Risk Score
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Flag Reason
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Flagged At
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="group hover:bg-white/5">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-mono text-sm font-medium text-white">
                        {txn.transaction_number}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{txn.type}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-white">{txn.user_name}</p>
                      <p className="text-xs text-slate-500">{txn.user_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-white">{formatCurrency(txn.amount)}</span>
                  </td>
                  <td className="px-4 py-4">
                    {txn.fraud_score !== null ? (
                      <RiskBadge score={txn.fraud_score} />
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-400">{txn.fraud_reason}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-400">{formatDate(txn.flagged_at)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openResolveModal(txn, "approve")}
                        className="rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/20"
                        title="Mark as Safe"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openResolveModal(txn, "reject")}
                        className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/20"
                        title="Reverse Transaction"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg p-2 text-amber-400 hover:bg-amber-500/20"
                        title="Block User"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Shield className="mb-4 h-12 w-12 text-emerald-400" />
            <p className="text-lg font-medium text-white">No flagged transactions</p>
            <p className="text-sm text-slate-400">All transactions appear to be legitimate.</p>
          </div>
        )}
      </motion.div>

      <ConfirmModal
        isOpen={resolveModalOpen}
        onClose={() => {
          setResolveModalOpen(false);
          setSelectedTx(null);
          setResolveNotes("");
        }}
        onConfirm={handleResolve}
        title={resolveAction === "approve" ? "Mark as Safe" : "Reverse Transaction"}
        description={
          resolveAction === "approve"
            ? `Are you sure you want to mark this transaction as safe? It will be processed normally.`
            : `Are you sure you want to reverse this transaction? The amount will be refunded to the sender.`
        }
        confirmLabel={resolveAction === "approve" ? "Mark Safe" : "Reverse"}
        variant={resolveAction === "approve" ? "success" : "danger"}
        loading={loading}
      >
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Notes (optional)
          </label>
          <textarea
            value={resolveNotes}
            onChange={(e) => setResolveNotes(e.target.value)}
            placeholder="Add any notes about this resolution..."
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            rows={3}
          />
        </div>
      </ConfirmModal>
    </AdminLayout>
  );
}
