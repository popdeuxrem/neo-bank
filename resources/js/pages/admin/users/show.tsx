import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Shield,
  Ban,
  Eye,
  Key,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  LogIn,
  FileText,
  Send,
} from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { PageHeader } from "@/components/admin/filter-bar";
import AdminLayout from "@/layouts/admin-layout";

interface User {
  id: number;
  name: string;
  email: string;
  account_status: string;
  kyc_status: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: { name: string }[];
  accounts: { id: number; name: string; balance: number; currency: string }[];
  total_balance: number;
  metadata: Record<string, unknown>;
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
}

interface LoginLog {
  id: number;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface Document {
  id: number;
  document_type: string;
  document_type_label: string;
  status: string;
  file_path: string;
  created_at: string;
}

interface UserShowProps {
  user: User;
  transactions: Transaction[];
  loginHistory: LoginLog[];
  documents: Document[];
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  pending_kyc: "bg-amber-500/20 text-amber-400",
  suspended: "bg-rose-500/20 text-rose-400",
  closed: "bg-slate-500/20 text-slate-400",
};

const kycColors: Record<string, string> = {
  approved: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  submitted: "bg-amber-500/20 text-amber-400",
  under_review: "bg-amber-500/20 text-amber-400",
  rejected: "bg-rose-500/20 text-rose-400",
};

const transactionStatusColors: Record<string, string> = {
  completed: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  failed: "bg-rose-500/20 text-rose-400",
  flagged: "bg-orange-500/20 text-orange-400",
  reversed: "bg-slate-500/20 text-slate-400",
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

export default function UserShow({ user, transactions, loginHistory, documents }: UserShowProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "accounts" | "kyc" | "logins" | "notes">("overview");
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const isBlocked = user.account_status === "suspended";

  const handleBlockToggle = async () => {
    const endpoint = isBlocked
      ? `/admin/users/${user.id}/unblock`
      : `/admin/users/${user.id}/block`;
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
      });
      
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
    
    setBlockModalOpen(false);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "Transactions" },
    { id: "accounts", label: "Accounts" },
    { id: "kyc", label: "KYC Documents" },
    { id: "logins", label: "Login History" },
    { id: "notes", label: "Notes" },
  ] as const;

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: user.name },
        ]}
        actions={
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        }
        title={user.name}
        subtitle={user.email}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setBlockModalOpen(true)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            isBlocked
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
          }`}
        >
          <Ban className="h-4 w-4" />
          {isBlocked ? "Unblock User" : "Block User"}
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
          <Key className="h-4 w-4" />
          Reset Password
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
          <Bell className="h-4 w-4" />
          Send Notification
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
          <Mail className="h-4 w-4" />
          Force Verify Email
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:col-span-4"
        >
          <div className="mb-6 flex flex-wrap border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-indigo-500 text-indigo-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Account Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${
                    statusColors[user.account_status] || "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {user.account_status?.replace("_", " ") || "unknown"}
                </span>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">KYC Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${
                    kycColors[user.kyc_status] || "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {user.kyc_status?.replace("_", " ") || "none"}
                </span>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Total Balance</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {formatCurrency(user.total_balance)}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Joined</p>
                <p className="mt-2 text-lg font-medium text-white">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Transaction
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-white/5">
                      <td className="py-4">
                        <p className="font-medium text-white">{txn.transaction_number}</p>
                        <p className="text-sm text-slate-500">{txn.description}</p>
                      </td>
                      <td className="py-4 capitalize text-slate-300">{txn.type}</td>
                      <td className="py-4 font-medium text-white">{formatCurrency(txn.amount)}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            transactionStatusColors[txn.status] || "bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-slate-400">{formatDate(txn.created_at)}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "accounts" && (
            <div className="grid gap-4">
              {user.accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{account.name}</p>
                      <p className="text-sm text-slate-500">{account.currency}</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-white">{formatCurrency(account.balance)}</p>
                </div>
              ))}
              {user.accounts.length === 0 && (
                <div className="py-8 text-center text-slate-400">No accounts found</div>
              )}
            </div>
          )}

          {activeTab === "kyc" && (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{doc.document_type_label}</p>
                      <p className="text-sm text-slate-500">Submitted {formatDate(doc.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        kycColors[doc.status] || "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {doc.status}
                    </span>
                    {doc.status === "pending" || doc.status === "submitted" ? (
                      <>
                        <button className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30">
                          Approve
                        </button>
                        <button className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-rose-400 hover:bg-rose-500/30">
                          Reject
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="py-8 text-center text-slate-400">No documents submitted</div>
              )}
            </div>
          )}

          {activeTab === "logins" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      IP Address
                    </th>
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Device
                    </th>
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loginHistory.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="py-4 font-mono text-sm text-slate-300">{log.ip_address}</td>
                      <td className="py-4 text-sm text-slate-400">{log.user_agent}</td>
                      <td className="py-4 text-sm text-slate-400">{formatDate(log.created_at)}</td>
                    </tr>
                  ))}
                  {loginHistory.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
                        No login history
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <form className="mb-6">
                <textarea
                  placeholder="Add a note about this user..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-4 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  rows={3}
                />
                <button
                  type="submit"
                  className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
                >
                  <Send className="h-4 w-4" />
                  Add Note
                </button>
              </form>
              <div className="space-y-4">
                {(user.metadata?.admin_notes as { note: string; created_at: string }[])?.map((note, i) => (
                  <div key={i} className="rounded-xl bg-white/5 p-4">
                    <p className="text-white">{note.note}</p>
                    <p className="mt-2 text-sm text-slate-500">{formatDate(note.created_at)}</p>
                  </div>
                ))}
                {(!user.metadata?.admin_notes || (user.metadata.admin_notes as unknown[]).length === 0) && (
                  <div className="py-8 text-center text-slate-400">No notes yet</div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={handleBlockToggle}
        title={isBlocked ? "Unblock User" : "Block User"}
        description={
          isBlocked
            ? `Are you sure you want to unblock ${user.name}? They will regain access to their account.`
            : `Are you sure you want to block ${user.name}? They will lose access to their account immediately.`
        }
        confirmLabel={isBlocked ? "Unblock" : "Block"}
        variant={isBlocked ? "success" : "danger"}
      />
    </AdminLayout>
  );
}
