import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  Save,
} from "lucide-react";
import { clsx } from "clsx";
import AdminLayout from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const notificationTypes = [
  { id: "deposits", name: "Deposits", description: "When you receive a deposit", enabled: true },
  { id: "withdrawals", name: "Withdrawals", description: "When a withdrawal is made", enabled: true },
  { id: "transfers", name: "Transfers", description: "When you send or receive money", enabled: true },
  { id: "kyc", name: "KYC Verification", description: "KYC status updates", enabled: true },
  { id: "security", name: "Security Alerts", description: "Login alerts, password changes", enabled: true },
];

export default function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
          <p className="text-slate-400">Configure how notifications are sent to users</p>
        </div>

        {/* Global Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/10 bg-slate-900/50 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Notification Channels</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-400">Send notifications via email</p>
                </div>
              </div>
              <button
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={clsx(
                  "relative h-6 w-11 rounded-full transition-colors",
                  emailEnabled ? "bg-indigo-500" : "bg-slate-600"
                )}
              >
                <span
                  className={clsx(
                    "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    emailEnabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                  <Smartphone className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">SMS Notifications</p>
                  <p className="text-sm text-slate-400">Send notifications via SMS</p>
                </div>
              </div>
              <button
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={clsx(
                  "relative h-6 w-11 rounded-full transition-colors",
                  smsEnabled ? "bg-indigo-500" : "bg-slate-600"
                )}
              >
                <span
                  className={clsx(
                    "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    smsEnabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                  <Bell className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-sm text-slate-400">Send in-app push notifications</p>
                </div>
              </div>
              <button
                onClick={() => setPushEnabled(!pushEnabled)}
                className={clsx(
                  "relative h-6 w-11 rounded-full transition-colors",
                  pushEnabled ? "bg-indigo-500" : "bg-slate-600"
                )}
              >
                <span
                  className={clsx(
                    "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    pushEnabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notification Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-white/10 bg-slate-900/50 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Notification Types</h2>
          <div className="space-y-3">
            {notificationTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <div>
                  <p className="text-white font-medium">{type.name}</p>
                  <p className="text-sm text-slate-400">{type.description}</p>
                </div>
                <Badge variant="outline" className={type.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}>
                  {type.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
