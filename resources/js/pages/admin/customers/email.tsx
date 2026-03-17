import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Send,
  Users,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/filter-bar";
import AdminLayout from "@/layouts/admin-layout";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
}

interface EmailPageProps {
  templates: EmailTemplate[];
  recipientCount: number;
}

export default function CustomersEmail({ templates, recipientCount }: EmailPageProps) {
  const [recipients, setRecipients] = useState<"all" | "active" | "inactive" | "kyc_verified" | "by_country">("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === parseInt(templateId));
    if (template) {
      setSubject(template.subject);
    }
  };

  const handleSend = async () => {
    if (!subject || !body) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/admin/customers/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify({
          recipients,
          subject,
          body,
        }),
      });

      if (response.ok) {
        setSent(true);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    }

    setSending(false);
  };

  const getRecipientLabel = () => {
    switch (recipients) {
      case "all":
        return "All Customers";
      case "active":
        return "Active Customers";
      case "inactive":
        return "Inactive Customers";
      case "kyc_verified":
        return "KYC Verified Customers";
      case "by_country":
        return "Customers by Country";
      default:
        return "Select Recipients";
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers", href: "/admin/customers" },
          { label: "Email" },
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
        title="Email Customers"
        subtitle="Send bulk emails to your customer base"
      />

      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white">Emails Queued!</h3>
          <p className="mt-2 text-slate-400">
            Your email has been queued for delivery to {recipientCount} recipients.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            Send Another Email
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:col-span-2"
          >
            <h3 className="mb-6 text-lg font-semibold text-white">Compose Email</h3>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Recipients</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(["all", "active", "inactive", "kyc_verified"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setRecipients(type)}
                      className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                        recipients === type
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      {type === "all" && "All Customers"}
                      {type === "active" && "Active Customers"}
                      {type === "inactive" && "Inactive Customers"}
                      {type === "kyc_verified" && "KYC Verified"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Template (Optional)</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Select a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your message here..."
                  rows={10}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={handleSend}
                  disabled={!subject || !body || sending}
                  className="flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Delivery Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recipients</span>
                  <span className="font-medium text-white">{recipientCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Estimated Delivery</span>
                  <span className="text-white">Immediate</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Available Variables</h3>
              <div className="space-y-2">
                {["{name}", "{email}", "{first_name}", "{last_name}", "{balance}", "{account_status}"].map(
                  (variable) => (
                    <button
                      key={variable}
                      onClick={() => setBody((prev) => prev + variable)}
                      className="block w-full rounded-lg bg-white/5 px-3 py-2 text-left text-sm font-mono text-indigo-400 hover:bg-white/10"
                    >
                      {variable}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Sending Limit</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Emails are sent in batches of 100 to avoid spam filters. Large campaigns may take longer to deliver.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
