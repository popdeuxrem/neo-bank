import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Mail,
  Trash2,
  LogIn,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader, FilterBar, FilterInput, FilterSelect } from "@/components/admin/filter-bar";
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
  [key: string]: string | number | null;
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface CustomersPageProps {
  customers: Customer[];
  pagination: Pagination;
  stats: {
    total: number;
    active: number;
    inactive: number;
    kyc_pending: number;
  };
  filters: {
    search: string;
    status: string;
    kyc: string;
    country: string;
    page: number;
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
  not_submitted: "bg-slate-500/20 text-slate-400",
  none: "bg-slate-500/20 text-slate-400",
};

const countryFlags: Record<string, string> = {
  US: "🇺🇸",
  GB: "🇬🇧",
  EU: "🇪🇺",
  NG: "🇳🇬",
  GH: "🇬🇭",
  KE: "🇰🇪",
  SA: "🇸🇦",
  AE: "🇦🇪",
  IN: "🇮🇳",
  CN: "🇨🇳",
  JP: "🇯🇵",
  CA: "🇨🇦",
  AU: "🇦🇺",
  BR: "🇧🇷",
  MX: "🇲🇽",
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

export default function CustomersIndex({
  customers,
  pagination,
  stats,
  filters: initialFilters,
}: CustomersPageProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [actionType, setActionType] = useState<"block" | "delete" | "login" | null>(null);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && k !== "page") {
        params.set(k, String(v));
      }
    });
    
    window.location.href = `/admin/customers?${params.toString()}`;
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      kyc: "",
      country: "",
      page: 1,
    });
    window.location.href = "/admin/customers";
  };

  const activeFilterCount = [filters.search, filters.status, filters.kyc, filters.country].filter(Boolean).length;

  const handleAction = async () => {
    if (!selectedCustomer || !actionType || !csrfToken) {
      return;
    }
    
    let endpoint = "";
    let method = "POST";
    
    switch (actionType) {
      case "block":
        endpoint = selectedCustomer.account_status === "active" 
          ? `/admin/users/${selectedCustomer.id}/block`
          : `/admin/users/${selectedCustomer.id}/unblock`;
        break;
      case "delete":
        endpoint = `/admin/users/${selectedCustomer.id}`;
        method = "DELETE";
        break;
      case "login":
        endpoint = `/admin/customers/${selectedCustomer.id}/login-as`;
        break;
      default:
        return;
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
        if (actionType === "login") {
          window.location.href = "/dashboard";
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
    
    setActionModalOpen(false);
    setSelectedCustomer(null);
    setActionType(null);
  };

  const columns = [
    {
      key: "customer",
      label: "Customer",
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            {customer.avatar ? (
              <img src={customer.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-white">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-white">{customer.name}</p>
            <p className="text-sm text-slate-500">{customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (customer: Customer) => (
        <span className="text-sm text-slate-400">{customer.phone || "—"}</span>
      ),
    },
    {
      key: "country",
      label: "Country",
      render: (customer: Customer) => (
        <div className="flex items-center gap-2">
          <span>{countryFlags[customer.country] || "🌍"}</span>
          <span className="text-sm text-slate-400">{customer.country}</span>
        </div>
      ),
    },
    {
      key: "kyc_status",
      label: "KYC",
      render: (customer: Customer) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            kycColors[customer.kyc_status] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {customer.kyc_status === "approved" || customer.kyc_status === "verified" ? (
            <CheckCircle className="h-3 w-3" />
          ) : customer.kyc_status === "pending" || customer.kyc_status === "submitted" ? (
            <Clock className="h-3 w-3" />
          ) : customer.kyc_status === "rejected" ? (
            <XCircle className="h-3 w-3" />
          ) : null}
          {(customer.kyc_status || "not_submitted").replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "account_status",
      label: "Status",
      render: (customer: Customer) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[customer.account_status] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {customer.account_status === "active" ? (
            <CheckCircle className="h-3 w-3" />
          ) : customer.account_status === "banned" || customer.account_status === "suspended" ? (
            <AlertTriangle className="h-3 w-3" />
          ) : null}
          {(customer.account_status || "active").replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: true,
      render: (customer: Customer) => (
        <span className="font-medium text-white">
          {formatCurrency(customer.balance, customer.currency)}
        </span>
      ),
    },
    {
      key: "joined_at",
      label: "Joined",
      sortable: true,
      render: (customer: Customer) => (
        <span className="text-sm text-slate-400">{formatDate(customer.joined_at)}</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (customer: Customer) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/customers/${customer.id}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              setSelectedCustomer(customer);
              setActionType("login");
              setActionModalOpen(true);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="Login as User"
          >
            <LogIn className="h-4 w-4" />
          </button>
          <Link
            href={`/admin/customers/email?user=${customer.id}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              setSelectedCustomer(customer);
              setActionType("block");
              setActionModalOpen(true);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title={customer.account_status === "active" ? "Block" : "Unblock"}
          >
            {customer.account_status === "active" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Customers"
        subtitle="Manage and monitor all registered customers"
        actions={
          <div className="flex gap-2">
            <Link
              href="/admin/customers/email"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              Email All
            </Link>
            <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Total Customers</p>
          <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.active.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Inactive</p>
          <p className="text-2xl font-bold text-slate-400">{stats.inactive.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">KYC Pending</p>
          <p className="text-2xl font-bold text-amber-400">{stats.kyc_pending.toLocaleString()}</p>
        </div>
      </motion.div>

      <FilterBar onClear={clearFilters} activeCount={activeFilterCount}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <FilterSelect
          value={filters.status}
          onChange={(v) => handleFilterChange("status", v)}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "banned", label: "Banned" },
            { value: "suspended", label: "Suspended" },
          ]}
          placeholder="All Statuses"
        />
        <FilterSelect
          value={filters.kyc}
          onChange={(v) => handleFilterChange("kyc", v)}
          options={[
            { value: "verified", label: "KYC Verified" },
            { value: "pending", label: "KYC Pending" },
            { value: "rejected", label: "KYC Rejected" },
            { value: "not_submitted", label: "Not Submitted" },
          ]}
          placeholder="KYC Status"
        />
      </FilterBar>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <DataTable
          columns={columns}
          data={customers}
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          totalItems={pagination.total}
          pageSize={pagination.per_page}
          onPageChange={(page) => {
            const params = new URLSearchParams(window.location.search);
            params.set("page", String(page));
            window.location.href = `/admin/customers?${params.toString()}`;
          }}
          onRowClick={(customer) => (window.location.href = `/admin/customers/${customer.id}`)}
        />
      </motion.div>

      <ConfirmModal
        isOpen={actionModalOpen}
        onClose={() => {
          setActionModalOpen(false);
          setSelectedCustomer(null);
          setActionType(null);
        }}
        onConfirm={handleAction}
        title={
          actionType === "block"
            ? selectedCustomer?.account_status === "active"
              ? "Block Customer"
              : "Unblock Customer"
            : actionType === "login"
            ? "Login as User"
            : actionType === "delete"
            ? "Delete Customer"
            : "Confirm Action"
        }
        description={
          actionType === "block"
            ? selectedCustomer?.account_status === "active"
              ? `Are you sure you want to block ${selectedCustomer?.name}? They will lose access to their account immediately.`
              : `Are you sure you want to unblock ${selectedCustomer?.name}? They will regain access to their account.`
            : actionType === "login"
            ? `You will be logged in as ${selectedCustomer?.name}. Click confirm to continue.`
            : actionType === "delete"
            ? `Are you sure you want to permanently delete ${selectedCustomer?.name}'s account? This action cannot be undone.`
            : "Are you sure you want to perform this action?"
        }
        confirmLabel={
          actionType === "block"
            ? selectedCustomer?.account_status === "active"
              ? "Block"
              : "Unblock"
            : actionType === "login"
            ? "Login"
            : actionType === "delete"
            ? "Delete"
            : "Confirm"
        }
        variant={
          actionType === "block"
            ? selectedCustomer?.account_status === "active"
              ? "danger"
              : "success"
            : actionType === "login"
            ? "default"
            : actionType === "delete"
            ? "danger"
            : "default"
        }
      />
    </AdminLayout>
  );
}
