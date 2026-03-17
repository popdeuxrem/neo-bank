import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Shield,
  Eye,
  Key,
  Bell,
  CreditCard,
  LogIn,
  FileText,
  Send,
  Plus,
  Minus,
  Users,
  Gift,
  Star,
  TrendingUp,
  MapPin,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { PageHeader } from "@/components/admin/filter-bar";
import AdminLayout from "@/layouts/admin-layout";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  country_flag: string;
  kyc_status: string;
  account_status: string;
  balance: number;
  currency: string;
  joined_at: string;
  avatar: string | null;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
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

interface Account {
  id: number;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
}

interface KycDocument {
  id: number;
  document_type: string;
  document_type_label: string;
  status: string;
  file_path: string;
  created_at: string;
  reviewed_at?: string;
}

interface LoginLog {
  id: number;
  ip_address: string;
  user_agent: string;
  created_at: string;
  location?: string;
}

interface Referral {
  id: number;
  name: string;
  email: string;
  status: string;
  joined_at: string;
  commission_earned: number;
}

interface RewardTransaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface CustomerShowProps {
  customer: Customer;
  transactions: Transaction[];
  accounts: Account[];
  documents: KycDocument[];
  loginHistory: LoginLog[];
  referrals: Referral[];
  rewardTransactions: RewardTransaction[];
  stats: {
    total_transactions: number;
    total_deposits: number;
    total_withdrawals: number;
    referral_earnings: number;
    reward_points: number;
  };
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  inactive: "bg-slate-500/20 text-slate-400",
  suspended: "bg-rose-500/20 text-rose-400",
  banned: "bg-rose-500/20 text-rose-400",
  closed: "bg-slate-500/20 text-slate-400",
};

const kycColors: Record<string, string> = {
  approved: "bg-emerald-500/20 text-emerald-400",
  verified: "bg-emerald-500/20 text-emerald-400",
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

export default function CustomerShow({
  customer,
  transactions,
  accounts,
  documents,
  loginHistory,
  referrals,
  rewardTransactions,
  stats,
}: CustomerShowProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "accounts" | "kyc" | "logins" | "notes" | "referrals" | "rewards"
  >("overview");
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [balanceAction, setBalanceAction] = useState<"add" | "subtract">("add");
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const isBlocked = customer.account_status === "banned" || customer.account_status === "suspended";

  const handleBlockToggle = async () => {
    const endpoint = isBlocked
      ? `/admin/users/${customer.id}/unblock`
      : `/admin/users/${customer.id}/block`;

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

  const handleBalanceAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount");
    const reason = formData.get("reason");

    try {
      const response = await fetch(`/admin/customers/${customer.id}/balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify({
          action: balanceAction,
          amount: amount,
          reason: reason,
        }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Balance action failed:", error);
    }

    setBalanceModalOpen(false);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "Transactions" },
    { id: "accounts", label: "Accounts" },
    { id: "kyc", label: "KYC Docs" },
    { id: "logins", label: "Login History" },
    { id: "notes", label: "Notes" },
    { id: "referrals", label: "Referrals" },
    { id: "rewards", label: "Rewards" },
  ] as const;

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers", href: "/admin/customers" },
          { label: customer.name },
        ]}
        actions={
          <Link
            href="/admin/customers"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Link>
        }
        title={customer.name}
        subtitle={customer.email}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => {
            setBalanceAction("add");
            setBalanceModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30"
        >
          <Plus className="h-4 w-4" />
          Add Balance
        </button>
        <button
          onClick={() => {
            setBalanceAction("subtract");
            setBalanceModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/30"
        >
          <Minus className="h-4 w-4" />
          Subtract Balance
        </button>
        <button
          onClick={() => setBlockModalOpen(true)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            isBlocked
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          {isBlocked ? "Unblock" : "Block"}
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
          <LogIn className="h-4 w-4" />
          Login as User
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
          Send Email
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
          <Shield className="h-4 w-4" />
          Force KYC Approve
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
                  className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${
                    statusColors[customer.account_status] || "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {customer.account_status === "active" ? <CheckCircle className="h-3 w-3" /> : null}
                  {(customer.account_status || "active").replace("_", " ")}
                </span>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">KYC Status</p>
                <span
                  className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${
                    kycColors[customer.kyc_status] || "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {customer.kyc_status === "approved" || customer.kyc_status === "verified" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : customer.kyc_status === "pending" ? (
                    <Clock className="h-3 w-3" />
                  ) : null}
                  {(customer.kyc_status || "not_submitted").replace("_", " ")}
                </span>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Total Balance</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {formatCurrency(customer.balance, customer.currency)}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Joined</p>
                <p className="mt-2 text-lg font-medium text-white">{formatDate(customer.joined_at)}</p>
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
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Type</th>
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Amount
                    </th>
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Date</th>
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
                      <td className="py-4 font-medium text-white">{formatCurrency(txn.amount, txn.currency)}</td>
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
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {account.account_type} - {account.account_number}
                      </p>
                      <p className="text-sm text-slate-500">{account.currency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{formatCurrency(account.balance, account.currency)}</p>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[account.status] || "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {account.status}
                    </span>
                  </div>
                </div>
              ))}
              {accounts.length === 0 && <div className="py-8 text-center text-slate-400">No accounts found</div>}
            </div>
          )}

          {activeTab === "kyc" && (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
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
                    {(doc.status === "pending" || doc.status === "submitted") && (
                      <>
                        <button className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30">
                          Approve
                        </button>
                        <button className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-rose-400 hover:bg-rose-500/30">
                          Reject
                        </button>
                      </>
                    )}
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
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Device</th>
                    <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      Location
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
                      <td className="py-4 text-sm text-slate-400">{log.location || "Unknown"}</td>
                      <td className="py-4 text-sm text-slate-400">{formatDate(log.created_at)}</td>
                    </tr>
                  ))}
                  {loginHistory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
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
                  placeholder="Add a note about this customer..."
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
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-white">Sample note about this customer...</p>
                  <p className="mt-2 text-sm text-slate-500">{formatDate(new Date().toISOString())}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "referrals" && (
            <div>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Total Referrals</p>
                  <p className="text-2xl font-bold text-white">{referrals.length}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Active Referrals</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {referrals.filter((r) => r.status === "active").length}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.referral_earnings)}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Name</th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Email</th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Status</th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Joined</th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {referrals.map((ref) => (
                      <tr key={ref.id} className="hover:bg-white/5">
                        <td className="py-4 font-medium text-white">{ref.name}</td>
                        <td className="py-4 text-sm text-slate-400">{ref.email}</td>
                        <td className="py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              ref.status === "active"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-slate-500/20 text-slate-400"
                            }`}
                          >
                            {ref.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-slate-400">{formatDate(ref.joined_at)}</td>
                        <td className="py-4 font-medium text-white">{formatCurrency(ref.commission_earned)}</td>
                      </tr>
                    ))}
                    {referrals.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No referrals yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "rewards" && (
            <div>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Points Balance</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.reward_points.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Total Earned</p>
                  <p className="text-2xl font-bold text-white">
                    {rewardTransactions
                      .filter((t) => t.type === "earned")
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}{" "}
                    pts
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Total Redeemed</p>
                  <p className="text-2xl font-bold text-white">
                    {rewardTransactions
                      .filter((t) => t.type === "redeemed")
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}{" "}
                    pts
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Type</th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Amount</th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Description</th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rewardTransactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-white/5">
                        <td className="py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              txn.type === "earned"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : txn.type === "redeemed"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-slate-500/20 text-slate-400"
                            }`}
                          >
                            {txn.type}
                          </span>
                        </td>
                        <td className="py-4 font-medium text-white">
                          {txn.type === "earned" ? "+" : "-"}{txn.amount} pts
                        </td>
                        <td className="py-4 text-sm text-slate-400">{txn.description}</td>
                        <td className="py-4 text-sm text-slate-400">{formatDate(txn.created_at)}</td>
                      </tr>
                    ))}
                    {rewardTransactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          No reward transactions
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={handleBlockToggle}
        title={isBlocked ? "Unblock Customer" : "Block Customer"}
        description={
          isBlocked
            ? `Are you sure you want to unblock ${customer.name}? They will regain access to their account.`
            : `Are you sure you want to block ${customer.name}? They will lose access to their account immediately.`
        }
        confirmLabel={isBlocked ? "Unblock" : "Block"}
        variant={isBlocked ? "success" : "danger"}
      />

      {balanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBalanceModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">
              {balanceAction === "add" ? "Add Balance" : "Subtract Balance"}
            </h3>
            <form onSubmit={handleBalanceAction}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-slate-400">Amount</label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-400">Reason</label>
                <textarea
                  name="reason"
                  required
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Reason for this action..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBalanceModalOpen(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                    balanceAction === "add"
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-rose-500 hover:bg-rose-600"
                  }`}
                >
                  {balanceAction === "add" ? "Add" : "Subtract"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
