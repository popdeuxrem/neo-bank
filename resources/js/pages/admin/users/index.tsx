import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Ban,
  Mail,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { PageHeader, FilterBar, FilterInput, FilterSelect } from "@/components/admin/filter-bar";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmModal } from "@/components/admin/confirm-modal";

interface User {
  id: number;
  name: string;
  email: string;
  account_status: string;
  kyc_status: string;
  email_verified_at: string | null;
  created_at: string;
  roles: { name: string }[];
  balance: number;
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface UsersPageProps {
  users: User[];
  roles: string[];
  pagination: Pagination;
  filters: {
    search: string;
    status: string;
    role: string;
    sort: string;
    dir: string;
  };
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
  none: "bg-slate-500/20 text-slate-400",
};

const roleColors: Record<string, string> = {
  admin: "bg-rose-500/20 text-rose-400",
  auditor: "bg-amber-500/20 text-amber-400",
  user: "bg-slate-500/20 text-slate-400",
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

export default function UsersIndex({
  users,
  roles,
  pagination,
  filters: initialFilters,
}: UsersPageProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    
    window.location.href = `/admin/users?${params.toString()}`;
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      role: "",
      sort: "created_at",
      dir: "desc",
    });
    window.location.href = "/admin/users";
  };

  const activeFilterCount = [filters.search, filters.status, filters.role].filter(Boolean).length;

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    
    const endpoint = selectedUser.account_status === "suspended" 
      ? `/admin/users/${selectedUser.id}/unblock`
      : `/admin/users/${selectedUser.id}/block`;
    
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
    setSelectedUser(null);
  };

  const columns = [
    {
      key: "user",
      label: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <span className="text-sm font-medium text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user: User) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[user.account_status] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {user.account_status?.replace("_", " ") || "unknown"}
        </span>
      ),
    },
    {
      key: "kyc_status",
      label: "KYC",
      render: (user: User) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            kycColors[user.kyc_status] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {user.kyc_status?.replace("_", " ") || "none"}
        </span>
      ),
    },
    {
      key: "roles",
      label: "Role",
      render: (user: User) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            roleColors[user.roles[0]?.name] || "bg-slate-500/20 text-slate-400"
          }`}
        >
          {user.roles[0]?.name || "user"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      sortable: true,
      render: (user: User) => (
        <span className="text-sm text-slate-400">{formatDate(user.created_at)}</span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: true,
      render: (user: User) => (
        <span className="font-medium text-white">{formatCurrency(user.balance)}</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (user: User) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/users/${user.id}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              setSelectedUser(user);
              setBlockModalOpen(true);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            title={user.account_status === "suspended" ? "Unblock" : "Block"}
          >
            <Ban className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        subtitle="Manage and monitor all registered users"
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link
              href="/admin/users/invite"
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" />
              Invite User
            </Link>
          </div>
        }
      />

      <FilterBar onClear={clearFilters} activeCount={activeFilterCount}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <FilterSelect
          value={filters.status}
          onChange={(v) => handleFilterChange("status", v)}
          options={[
            { value: "active", label: "Active" },
            { value: "pending_kyc", label: "Pending KYC" },
            { value: "suspended", label: "Suspended" },
            { value: "closed", label: "Closed" },
          ]}
          placeholder="All Statuses"
        />
        <FilterSelect
          value={filters.role}
          onChange={(v) => handleFilterChange("role", v)}
          options={roles.map((r) => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))}
          placeholder="All Roles"
        />
      </FilterBar>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <DataTable
          columns={columns}
          data={users}
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          totalItems={pagination.total}
          pageSize={pagination.per_page}
          onPageChange={(page) => {
            const params = new URLSearchParams(window.location.search);
            params.set("page", String(page));
            window.location.href = `/admin/users?${params.toString()}`;
          }}
          onRowClick={(user) => (window.location.href = `/admin/users/${user.id}`)}
        />
      </motion.div>

      <ConfirmModal
        isOpen={blockModalOpen}
        onClose={() => {
          setBlockModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleBlockUser}
        title={selectedUser?.account_status === "suspended" ? "Unblock User" : "Block User"}
        description={
          selectedUser?.account_status === "suspended"
            ? `Are you sure you want to unblock ${selectedUser?.name}? They will regain access to their account.`
            : `Are you sure you want to block ${selectedUser?.name}? They will lose access to their account immediately.`
        }
        confirmLabel={selectedUser?.account_status === "suspended" ? "Unblock" : "Block"}
        variant={selectedUser?.account_status === "suspended" ? "success" : "danger"}
      />
    </AdminLayout>
  );
}
