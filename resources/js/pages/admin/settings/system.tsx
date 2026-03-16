import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Save, Shield, Users, Mail, Lock, Wrench, GitBranch, MessageSquare, Key } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/filter-bar";
import AdminLayout from "@/layouts/admin-layout";

interface SystemSettings {
  user_registration: boolean;
  require_kyc: boolean;
  require_email_verification: boolean;
  enable_2fa: boolean;
  maintenance_mode: boolean;
  referral_system: boolean;
  support_tickets: boolean;
  api_access: boolean;
}

interface SystemSettingsProps {
  settings: SystemSettings;
}

function Toggle({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
      <div>
        <p className="font-medium text-white">{label}</p>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? "bg-indigo-500" : "bg-slate-600"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SystemSettingsPage({ settings: initialSettings }: SystemSettingsProps) {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings || {
    user_registration: true,
    require_kyc: true,
    require_email_verification: true,
    enable_2fa: false,
    maintenance_mode: false,
    referral_system: true,
    support_tickets: true,
    api_access: true,
  });
  const [saving, setSaving] = useState(false);
  const { props } = usePage();
  const csrfToken = (props as { csrf_token?: string }).csrf_token;

  const handleToggle = (key: keyof SystemSettings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
    
    fetch("/admin/settings/system", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken || "",
      },
      body: JSON.stringify({ [key]: value }),
    }).catch(console.error);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="System Configuration"
        subtitle="Enable or disable system features and modules"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Users className="h-5 w-5 text-indigo-400" />
            User Management
          </h3>
          <div className="space-y-3">
            <Toggle
              enabled={settings.user_registration}
              onChange={(v) => handleToggle("user_registration", v)}
              label="User Registration"
              description="Allow new users to register on the platform"
            />
            <Toggle
              enabled={settings.require_kyc}
              onChange={(v) => handleToggle("require_kyc", v)}
              label="Require KYC Verification"
              description="Users must verify their identity before using the platform"
            />
            <Toggle
              enabled={settings.require_email_verification}
              onChange={(v) => handleToggle("require_email_verification", v)}
              label="Require Email Verification"
              description="Users must verify their email address"
            />
            <Toggle
              enabled={settings.enable_2fa}
              onChange={(v) => handleToggle("enable_2fa", v)}
              label="Two-Factor Authentication"
              description="Enable 2FA for enhanced security"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Wrench className="h-5 w-5 text-indigo-400" />
            System
          </h3>
          <div className="space-y-3">
            <Toggle
              enabled={settings.maintenance_mode}
              onChange={(v) => handleToggle("maintenance_mode", v)}
              label="Maintenance Mode"
              description="Put the site in maintenance mode (users cannot access)"
            />
            <Toggle
              enabled={settings.referral_system}
              onChange={(v) => handleToggle("referral_system", v)}
              label="Referral System"
              description="Enable user referral program"
            />
            <Toggle
              enabled={settings.support_tickets}
              onChange={(v) => handleToggle("support_tickets", v)}
              label="Support Tickets"
              description="Enable support ticket system"
            />
            <Toggle
              enabled={settings.api_access}
              onChange={(v) => handleToggle("api_access", v)}
              label="API Access"
              description="Allow third-party API access"
            />
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
