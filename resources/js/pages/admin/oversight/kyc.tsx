import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Eye,
} from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { PageHeader, FilterBar, FilterInput, FilterSelect } from "@/components/admin/filter-bar";
import { ConfirmModal } from "@/components/admin/confirm-modal";

interface Document {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  document_type: string;
  document_type_label: string;
  file_path: string;
  status: string;
  created_at: string;
}

interface KycStats {
  pending: number;
  approved_today: number;
  rejected_today: number;
}

interface KycPageProps {
  documents: Document[];
  stats: KycStats;
}

const statusTabs = [
  { id: "pending", label: "Pending", count: 0 },
  { id: "approved", label: "Approved", count: 0 },
  { id: "rejected", label: "Rejected", count: 0 },
  { id: "all", label: "All", count: 0 },
] as const;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function KycIndex({ documents, stats }: KycPageProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const filteredDocs = activeTab === "all" 
    ? documents 
    : documents.filter(d => d.status === activeTab);

  const handleApprove = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    
    try {
      const response = await fetch(`/admin/oversight/kyc/${selectedDoc.id}/approve`, {
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
      console.error("Failed to approve document:", error);
    }
    
    setLoading(false);
    setApproveModalOpen(false);
    setSelectedDoc(null);
  };

  const handleReject = async () => {
    if (!selectedDoc || !rejectReason.trim()) return;
    setLoading(true);
    
    try {
      const response = await fetch(`/admin/oversight/kyc/${selectedDoc.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to reject document:", error);
    }
    
    setLoading(false);
    setRejectModalOpen(false);
    setSelectedDoc(null);
    setRejectReason("");
  };

  return (
    <AdminLayout>
      <PageHeader
        title="KYC Oversight"
        subtitle="Review and manage identity verification documents"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Pending Review</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Approved Today</p>
              <p className="text-2xl font-bold text-white">{stats.approved_today}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Rejected Today</p>
              <p className="text-2xl font-bold text-white">{stats.rejected_today}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10">
        {statusTabs.map((tab) => {
          const count = tab.id === "pending" 
            ? stats.pending 
            : tab.id === "all" 
            ? documents.length 
            : documents.filter(d => d.status === tab.id).length;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-1.5 text-xs">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-white">{doc.user_name}</p>
                <p className="text-sm text-slate-500">{doc.user_email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">{doc.document_type_label}</p>
                <p className="text-xs text-slate-500">Submitted {formatDate(doc.created_at)}</p>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  doc.status === "approved"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : doc.status === "rejected"
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {doc.status}
              </span>

              {doc.status === "pending" || doc.status === "submitted" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setApproveModalOpen(true);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setRejectModalOpen(true);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-rose-400 hover:bg-rose-500/30"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              ) : (
                <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
                  <Eye className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-16 text-center">
            <ShieldCheck className="mb-4 h-12 w-12 text-slate-500" />
            <p className="text-lg font-medium text-white">No documents found</p>
            <p className="text-sm text-slate-400">
              {activeTab === "pending" 
                ? "All caught up! No pending documents." 
                : `No ${activeTab} documents.`}
            </p>
          </div>
        )}
      </motion.div>

      <ConfirmModal
        isOpen={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setSelectedDoc(null);
        }}
        onConfirm={handleApprove}
        title="Approve Document"
        description={`Are you sure you want to approve the identity document for ${selectedDoc?.user_name}? This will verify their identity.`}
        confirmLabel="Approve"
        variant="success"
        loading={loading}
      />

      <ConfirmModal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedDoc(null);
          setRejectReason("");
        }}
        onConfirm={handleReject}
        title="Reject Document"
        description={`Are you sure you want to reject the identity document for ${selectedDoc?.user_name}? Please provide a reason.`}
        confirmLabel="Reject"
        variant="danger"
        loading={loading}
      >
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Reason for rejection
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please explain why this document is being rejected..."
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            rows={3}
            required
          />
        </div>
      </ConfirmModal>
    </AdminLayout>
  );
}
