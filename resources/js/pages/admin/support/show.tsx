import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import { PageHeader } from "@/components/admin/filter-bar";

interface Message {
  id: number;
  is_admin: boolean;
  message: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  status: "pending" | "answered" | "closed";
  priority: "urgent" | "high" | "normal" | "low";
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

interface SupportShowProps {
  ticket: Ticket;
  messages: Message[];
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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SupportShow({ ticket, messages }: SupportShowProps) {
  const [reply, setReply] = useState("");
  const [closeAfter, setCloseAfter] = useState(false);
  const [sending, setSending] = useState(false);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`/admin/support/${ticket.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify({
          message: reply,
          close_ticket: closeAfter,
        }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
    setSending(false);
  };

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Support", href: "/admin/support" },
          { label: `#${ticket.ticket_number}` },
        ]}
        actions={
          <Link
            href="/admin/support"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </Link>
        }
        title={ticket.subject}
        subtitle={`Ticket #${ticket.ticket_number}`}
      />

      <div className="mb-6 flex flex-wrap gap-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            priorityColors[ticket.priority]
          }`}
        >
          {ticket.priority}
        </span>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            statusColors[ticket.status]
          }`}
        >
          {ticket.status}
        </span>
        <span className="text-sm text-slate-400">
          Created {formatDate(ticket.created_at)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-1"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">User Information</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-white">{ticket.user.name}</p>
              <p className="text-sm text-slate-400">{ticket.user.email}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-3"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">Conversation</h3>
          
          <div className="mb-6 max-h-[400px] space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_admin ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.is_admin
                      ? "bg-indigo-500/20 text-indigo-100"
                      : "bg-white/5 text-slate-200"
                  }`}
                >
                  {!message.is_admin && (
                    <p className="mb-1 text-xs font-medium text-slate-400">
                      {message.user?.name}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{message.message}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {formatDate(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {ticket.status !== "closed" && (
            <form onSubmit={handleSubmit}>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 p-4 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    checked={closeAfter}
                    onChange={(e) => setCloseAfter(e.target.checked)}
                    className="rounded border-white/10 bg-white/5 text-indigo-500"
                  />
                  Close ticket after reply
                </label>
                <button
                  type="submit"
                  disabled={!reply.trim() || sending}
                  className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
