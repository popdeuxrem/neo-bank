import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/filter-bar";
import AdminLayout from "@/layouts/admin-layout";

interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  user: {
    name: string;
    email: string;
  };
  priority: "urgent" | "high" | "normal" | "low";
  status: "pending" | "answered" | "closed";
  last_reply: string;
  created_at: string;
}

interface SupportIndexProps {
  tickets: Ticket[];
}

const priorityColors: Record<string, string> = {
  urgent: "bg-rose-500/20 text-rose-400",
  high: "bg-amber-500/20 text-amber-400",
  normal: "bg-blue-500/20 text-blue-400",
  low: "bg-slate-500/20 text-slate-400",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  answered: "bg-emerald-500/20 text-emerald-400",
  closed: "bg-slate-500/20 text-slate-400",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SupportIndex({ tickets }: SupportIndexProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "answered" | "closed" | "all">("pending");

  const filteredTickets = activeTab === "all" 
    ? tickets 
    : tickets.filter(t => t.status === activeTab);

  const tabCounts = {
    pending: tickets.filter(t => t.status === "pending").length,
    answered: tickets.filter(t => t.status === "answered").length,
    closed: tickets.filter(t => t.status === "closed").length,
    all: tickets.length,
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Support Tickets"
        subtitle="Manage and respond to user support requests"
      />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10">
        {(["pending", "answered", "closed", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {tab === "pending" && <Clock className="h-4 w-4" />}
            {tab === "answered" && <Send className="h-4 w-4" />}
            {tab === "closed" && <CheckCircle className="h-4 w-4" />}
            {tab === "all" && <MessageSquare className="h-4 w-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-1.5 text-xs">
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {filteredTickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/admin/support/${ticket.id}`}
            className="block rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-400">#{ticket.ticket_number}</span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      priorityColors[ticket.priority]
                    }`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[ticket.status]
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-medium text-white">{ticket.subject}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                  <span>{ticket.user.name}</span>
                  <span>{ticket.user.email}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">{formatDate(ticket.last_reply)}</p>
                <p className="text-xs text-slate-500 mt-1">Created {formatDate(ticket.created_at)}</p>
              </div>
            </div>
          </Link>
        ))}

        {filteredTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-16 text-center">
            <MessageSquare className="mb-4 h-12 w-12 text-slate-500" />
            <p className="text-lg font-medium text-white">No tickets found</p>
            <p className="text-sm text-slate-400">
              {activeTab === "pending" 
                ? "All caught up! No pending tickets." 
                : `No ${activeTab} tickets.`}
            </p>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
