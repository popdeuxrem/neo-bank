import { Link, usePage } from "@inertiajs/react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";

const Icons = LucideIcons as Record<string, React.ComponentType<{ className?: string }>>;

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  badgeType?: 'default' | 'warning' | 'danger' | 'success';
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navigation: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    ],
  },
  {
    title: "CUSTOMERS",
    items: [
      { label: "All Customers", href: "/admin/customers", icon: "Users" },
      { label: "Active Customers", href: "/admin/customers?status=active", icon: "UserCheck" },
      { label: "Inactive Customers", href: "/admin/customers?status=inactive", icon: "Users" },
      { label: "KYC Pending", href: "/admin/customers?kyc=pending", icon: "ShieldCheck", badge: 3, badgeType: 'warning' },
      { label: "KYC Verified", href: "/admin/customers?kyc=verified", icon: "ShieldCheck" },
      { label: "Banned Customers", href: "/admin/customers?status=banned", icon: "AlertTriangle", badge: 1, badgeType: 'danger' },
      { label: "Email Customers", href: "/admin/customers/email", icon: "Mail" },
    ],
  },
  {
    title: "FINANCIAL OPERATIONS",
    items: [
      { 
        label: "Fund Transfer", 
        href: "/admin/transfers", 
        icon: "ArrowRightLeft",
        children: [
          { label: "All Transfers", href: "/admin/transfers", icon: "ArrowRightLeft" },
          { label: "Pending Transfers", href: "/admin/transfers?status=pending", icon: "Clock" },
          { label: "Completed Transfers", href: "/admin/transfers?status=completed", icon: "CheckCircle" },
          { label: "Failed Transfers", href: "/admin/transfers?status=failed", icon: "XCircle" },
          { label: "Manual Transfer", href: "/admin/transfers/manual", icon: "Plus" },
          { label: "Transfer Settings", href: "/admin/transfers/settings", icon: "Settings" },
        ]
      },
      { 
        label: "Wire & SWIFT", 
        href: "/admin/wire", 
        icon: "Landmark",
        children: [
          { label: "Wire Transfer Requests", href: "/admin/wire", icon: "ArrowRightLeft" },
          { label: "SWIFT Configuration", href: "/admin/wire/settings", icon: "Settings" },
          { label: "Correspondent Banks", href: "/admin/wire/correspondent-banks", icon: "Building2" },
          { label: "Wire Fees", href: "/admin/wire/fees", icon: "DollarSign" },
        ]
      },
      { 
        label: "Deposits", 
        href: "/admin/deposits", 
        icon: "ArrowDownCircle",
        children: [
          { label: "All Deposits", href: "/admin/deposits", icon: "ArrowDownCircle" },
          { label: "Pending Approval", href: "/admin/deposits/pending", icon: "Clock" },
          { label: "Deposit Methods", href: "/admin/deposits/methods", icon: "Layers" },
        ]
      },
      { 
        label: "Withdrawals", 
        href: "/admin/withdrawals", 
        icon: "ArrowUpCircle",
        children: [
          { label: "All Withdrawals", href: "/admin/withdrawals", icon: "ArrowUpCircle" },
          { label: "Pending Approval", href: "/admin/withdrawals/pending", icon: "Clock" },
          { label: "Withdrawal Methods", href: "/admin/withdrawals/methods", icon: "Layers" },
        ]
      },
      { 
        label: "Bill Payments", 
        href: "/admin/bills", 
        icon: "FileText",
        children: [
          { label: "Transactions", href: "/admin/bills/transactions", icon: "FileText" },
          { label: "Providers", href: "/admin/bills/providers", icon: "Building" },
          { label: "Categories", href: "/admin/bills/categories", icon: "Folder" },
        ]
      },
    ],
  },
  {
    title: "BANKING PRODUCTS",
    items: [
      { 
        label: "DPS Plans", 
        href: "/admin/dps", 
        icon: "PiggyBank",
        children: [
          { label: "DPS Plans", href: "/admin/dps/plans", icon: "FileText" },
          { label: "Active DPS", href: "/admin/dps/subscriptions", icon: "Activity" },
          { label: "Matured DPS", href: "/admin/dps/matured", icon: "CheckCircle" },
          { label: "DPS Settings", href: "/admin/dps/settings", icon: "Settings" },
        ]
      },
      { 
        label: "FDR Plans", 
        href: "/admin/fdr", 
        icon: "Lock",
        children: [
          { label: "FDR Plans", href: "/admin/fdr/plans", icon: "FileText" },
          { label: "Active FDRs", href: "/admin/fdr/subscriptions", icon: "Activity" },
          { label: "Compounding Log", href: "/admin/fdr/compounding", icon: "RefreshCw" },
          { label: "FDR Settings", href: "/admin/fdr/settings", icon: "Settings" },
        ]
      },
      { 
        label: "Loans", 
        href: "/admin/loans", 
        icon: "Landmark",
        children: [
          { label: "Loan Plans", href: "/admin/loans/plans", icon: "FileText" },
          { label: "Loan Applications", href: "/admin/loans/applications", icon: "FileCheck" },
          { label: "Active Loans", href: "/admin/loans/active", icon: "Activity" },
          { label: "Overdue Loans", href: "/admin/loans/overdue", icon: "AlertTriangle" },
          { label: "Loan Settings", href: "/admin/loans/settings", icon: "Settings" },
        ]
      },
    ],
  },
  {
    title: "PORTFOLIO & REWARDS",
    items: [
      { 
        label: "Portfolio", 
        href: "/admin/portfolio", 
        icon: "Briefcase",
        children: [
          { label: "Portfolio Tiers", href: "/admin/portfolio/tiers", icon: "Layers" },
          { label: "Badges", href: "/admin/portfolio/badges", icon: "Award" },
          { label: "User Rankings", href: "/admin/portfolio/rankings", icon: "Trophy" },
        ]
      },
      { 
        label: "Reward Points", 
        href: "/admin/rewards", 
        icon: "Star",
        children: [
          { label: "Reward Settings", href: "/admin/rewards/settings", icon: "Settings" },
          { label: "Point Transactions", href: "/admin/rewards/transactions", icon: "FileText" },
          { label: "Redeem Requests", href: "/admin/rewards/redeem", icon: "Gift" },
        ]
      },
      { 
        label: "Referrals", 
        href: "/admin/referrals", 
        icon: "Users",
        children: [
          { label: "Referral Settings", href: "/admin/referrals/settings", icon: "Settings" },
          { label: "Referral Tree", href: "/admin/referrals/tree", icon: "GitBranch" },
          { label: "Referral Commissions", href: "/admin/referrals/commissions", icon: "DollarSign" },
        ]
      },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { 
        label: "Support Tickets", 
        href: "/admin/support", 
        icon: "MessageCircle",
        children: [
          { label: "All Tickets", href: "/admin/support", icon: "MessageCircle" },
          { label: "Pending Tickets", href: "/admin/support?status=pending", icon: "Clock", badge: 5, badgeType: 'warning' },
          { label: "Answered Tickets", href: "/admin/support?status=answered", icon: "MessageSquare" },
          { label: "Closed Tickets", href: "/admin/support?status=closed", icon: "CheckCircle" },
          { label: "Ticket Categories", href: "/admin/support/categories", icon: "Folder" },
        ]
      },
    ],
  },
  {
    title: "KYC",
    items: [
      { 
        label: "KYC Verification", 
        href: "/admin/kyc", 
        icon: "ShieldCheck",
        children: [
          { label: "KYC Requests (Pending)", href: "/admin/kyc", icon: "Clock", badge: 3, badgeType: 'warning' },
          { label: "Approved KYC", href: "/admin/kyc/approved", icon: "CheckCircle" },
          { label: "Rejected KYC", href: "/admin/kyc/rejected", icon: "XCircle" },
          { label: "KYC Settings", href: "/admin/kyc/settings", icon: "Settings" },
        ]
      },
    ],
  },
  {
    title: "STAFF & ROLES",
    items: [
      { 
        label: "Staff Management", 
        href: "/admin/staff", 
        icon: "Users",
        children: [
          { label: "All Staff", href: "/admin/staff", icon: "Users" },
          { label: "Add New Staff", href: "/admin/staff/create", icon: "UserPlus" },
          { label: "Staff Roles", href: "/admin/roles", icon: "Shield" },
          { label: "Staff Activity Log", href: "/admin/staff/activity", icon: "History" },
        ]
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "Transaction History", href: "/admin/reports/transactions", icon: "FileText" },
      { label: "Profit Report", href: "/admin/profits/overview", icon: "TrendingUp" },
      { label: "Login History", href: "/admin/reports/logins", icon: "LogIn" },
      { label: "Notification History", href: "/admin/notifications/history", icon: "Bell" },
    ],
  },
  {
    title: "MARKETING",
    items: [
      { 
        label: "Notifications", 
        href: "/admin/notifications", 
        icon: "Bell",
        children: [
          { label: "Send User Notification", href: "/admin/notifications/send", icon: "Send" },
          { label: "Send All Users Notification", href: "/admin/notifications/send-all", icon: "BellRing" },
          { label: "Notification History", href: "/admin/notifications/history", icon: "History" },
          { label: "Notification Templates", href: "/admin/notifications/templates", icon: "FileText" },
          { label: "Notification Settings", href: "/admin/notifications/settings", icon: "Settings" },
        ]
      },
      { 
        label: "Newsletter", 
        href: "/admin/marketing", 
        icon: "Mail",
        children: [
          { label: "Campaigns", href: "/admin/marketing/newsletter", icon: "Send" },
          { label: "Subscribers", href: "/admin/marketing/subscribers", icon: "Users" },
        ]
      },
    ],
  },
  {
    title: "PAYMENT GATEWAYS",
    items: [
      { 
        label: "Gateways", 
        href: "/admin/gateways", 
        icon: "Globe",
        children: [
          { label: "Payment Gateways", href: "/admin/gateways", icon: "Globe" },
          { label: "Deposit Gateways", href: "/admin/gateways/deposits", icon: "ArrowDownCircle" },
          { label: "Withdrawal Gateways", href: "/admin/gateways/withdrawals", icon: "ArrowUpCircle" },
          { label: "Gateway Logs", href: "/admin/gateways/logs", icon: "FileText" },
        ]
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "General Settings", href: "/admin/settings/general", icon: "Settings" },
      { label: "System Config", href: "/admin/settings/system", icon: "Server" },
      { 
        label: "Security", 
        href: "/admin/settings/security", 
        icon: "Shield",
        children: [
          { label: "2FA Settings", href: "/admin/settings/security", icon: "Lock" },
          { label: "Admin URL", href: "/admin/settings/admin-url", icon: "Link2" },
          { label: "Passcode", href: "/admin/settings/passcode", icon: "Key" },
        ]
      },
      { 
        label: "Currencies", 
        href: "/admin/currencies", 
        icon: "DollarSign",
        children: [
          { label: "Fiat Currencies", href: "/admin/currencies/fiat", icon: "DollarSign" },
          { label: "Crypto Currencies", href: "/admin/currencies/crypto", icon: "Bitcoin" },
          { label: "Exchange Rates", href: "/admin/currencies/rates", icon: "RefreshCw" },
        ]
      },
      { label: "SMS Settings", href: "/admin/settings/sms", icon: "Smartphone" },
      { label: "Bonuses", href: "/admin/settings/bonuses", icon: "Gift" },
      { 
        label: "Language", 
        href: "/admin/settings/language", 
        icon: "Globe",
        children: [
          { label: "Languages", href: "/admin/settings/language", icon: "Globe" },
          { label: "Translations", href: "/admin/settings/translations", icon: "FileText" },
        ]
      },
      { 
        label: "Theme", 
        href: "/admin/themes", 
        icon: "Palette",
        children: [
          { label: "Active Theme", href: "/admin/themes", icon: "Layout" },
          { label: "Theme Settings", href: "/admin/themes/settings", icon: "Settings" },
          { label: "Color Customizer", href: "/admin/themes/colors", icon: "Palette" },
          { label: "Landing Page Theme", href: "/admin/themes/landing", icon: "Layout" },
        ]
      },
      { 
        label: "Landing Page", 
        href: "/admin/landing", 
        icon: "Layout",
        children: [
          { label: "Hero Section", href: "/admin/landing/hero", icon: "Layout" },
          { label: "Features Section", href: "/admin/landing/features", icon: "Star" },
          { label: "Pricing Section", href: "/admin/landing/pricing", icon: "DollarSign" },
          { label: "Statistics", href: "/admin/landing/stats", icon: "BarChart" },
          { label: "Testimonials", href: "/admin/landing/testimonials", icon: "MessageCircle" },
        ]
      },
      { 
        label: "Pages & Navigation", 
        href: "/admin/pages", 
        icon: "FileText",
        children: [
          { label: "All Pages", href: "/admin/pages", icon: "FileText" },
          { label: "Site Navigation", href: "/admin/pages/navigation", icon: "Menu" },
          { label: "Footer", href: "/admin/pages/footer", icon: "Scroll" },
        ]
      },
      { 
        label: "SEO & Analytics", 
        href: "/admin/settings/seo", 
        icon: "Search",
        children: [
          { label: "SEO Settings", href: "/admin/settings/seo", icon: "Search" },
          { label: "Google Analytics", href: "/admin/settings/analytics", icon: "BarChart" },
        ]
      },
      { 
        label: "Integrations", 
        href: "/admin/settings/integrations", 
        icon: "Plug",
        children: [
          { label: "Google Analytics", href: "/admin/settings/analytics", icon: "BarChart" },
          { label: "Google reCaptcha", href: "/admin/settings/recaptcha", icon: "Shield" },
          { label: "Tawk Chat", href: "/admin/settings/tawk", icon: "MessageCircle" },
          { label: "Messenger", href: "/admin/settings/messenger", icon: "MessageCircle" },
        ]
      },
      { label: "GDPR Settings", href: "/admin/settings/gdpr", icon: "Shield" },
      { label: "Maintenance Mode", href: "/admin/settings/maintenance", icon: "Wrench" },
      { label: "Inactive Users", href: "/admin/settings/inactive-users", icon: "UserMinus" },
      { label: "Custom CSS", href: "/admin/settings/customization", icon: "Code" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "System Info", href: "/admin/system/info", icon: "Server" },
      { label: "Cache Management", href: "/admin/system/cache", icon: "Database" },
      { label: "Queue Monitor", href: "/admin/system/queue", icon: "Clock" },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: "FileText" },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const IconComponent = ({ name, className }: { name?: string; className?: string }) => {
  if (!name || !Icons[name]) {
    return <div className={className} />;
  }

  const Icon = Icons[name];

  return <Icon className={className} />;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigation.forEach((section) => {
      initial[section.title] = section.defaultOpen ?? true;
    });

    return initial;
  });
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const { url } = usePage();

  const currentPath = url;

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
return currentPath === "/admin";
}

    return currentPath.startsWith(href);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode: () => setDarkMode(!darkMode), setDarkMode }}>
      <div className={clsx("min-h-screen", darkMode ? "bg-slate-950" : "bg-gray-50", "text-white dark:text-gray-900")}>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside
          className={clsx(
            "fixed left-0 top-0 z-50 h-screen w-[260px] flex flex-col border-r border-white/10 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <span className="text-lg font-bold text-white">M</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Magnetiq</p>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 hover:bg-white/5 lg:hidden"
            >
              <Icons.X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            {navigation.map((section) => (
              <div key={section.title} className="mb-4">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  <span>{section.title}</span>
                  {expandedSections[section.title] ? (
                    <Icons.ChevronDown className="h-3 w-3" />
                  ) : (
                    <Icons.ChevronRight className="h-3 w-3" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections[section.title] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 space-y-1">
                        {section.items.map((item) => {
                          const active = isActive(item.href);
                          const hasChildren = item.children && item.children.length > 0;

                          return (
                            <div key={item.href}>
                              <Link
                                href={item.href}
                                className={clsx(
                                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                  active
                                    ? "bg-indigo-500/20 text-indigo-400"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                )}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <div className="flex items-center gap-3">
                                  <IconComponent 
                                    name={item.icon} 
                                    className={clsx(
                                      "h-5 w-5",
                                      active ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
                                    )}
                                  />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge !== undefined && item.badge > 0 && (
                                  <span className={clsx(
                                    "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                                    item.badgeType === 'danger' ? "bg-rose-500/20 text-rose-400" :
                                    item.badgeType === 'warning' ? "bg-amber-500/20 text-amber-400" :
                                    "bg-indigo-500/20 text-indigo-400"
                                  )}>
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                              {hasChildren && active && (
                                <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                                  {item.children?.map((child) => {
                                    const childActive = isActive(child.href);

                                    return (
                                      <Link
                                        key={child.href}
                                        href={child.href}
                                        className={clsx(
                                          "group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                                          childActive
                                            ? "bg-indigo-500/20 text-indigo-400"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        )}
                                        onClick={() => setSidebarOpen(false)}
                                      >
                                        <div className="flex items-center gap-3">
                                          <IconComponent 
                                            name={child.icon} 
                                            className={clsx(
                                              "h-4 w-4",
                                              childActive ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
                                            )}
                                          />
                                          <span>{child.label}</span>
                                        </div>
                                        {child.badge !== undefined && child.badge > 0 && (
                                          <span className={clsx(
                                            "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                                            child.badgeType === 'danger' ? "bg-rose-500/20 text-rose-400" :
                                            child.badgeType === 'warning' ? "bg-amber-500/20 text-amber-400" :
                                            "bg-indigo-500/20 text-indigo-400"
                                          )}>
                                            {child.badge}
                                          </span>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                <Icons.User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">admin@magnetiq.com</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
              >
                <Icons.ExternalLink className="h-4 w-4" />
                View Site
              </Link>
              <Link
                href="/logout"
                className="flex items-center justify-center rounded-lg bg-white/5 px-3 py-2 text-slate-300 hover:bg-white/10"
              >
                <Icons.LogOut className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>

        <div className="lg:pl-[260px]">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur-xl px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 hover:bg-white/5 lg:hidden"
              >
                <Icons.Menu className="h-5 w-5" />
              </button>
              <div className="hidden items-center gap-2 text-sm text-slate-400 lg:flex">
                <Link href="/admin" className="hover:text-white">
                  Admin
                </Link>
                {currentPath !== "/admin" && (
                  <>
                    <Icons.ChevronRight className="h-4 w-4" />
                    <span className="text-white capitalize">
                      {currentPath.replace("/admin/", "").split("/").pop()?.replace(/-/g, " ")}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 hover:border-white/20 hover:text-white"
              >
                <Icons.Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-500 sm:inline">
                  ⌘K
                </kbd>
              </button>

              <button className="relative rounded-lg p-2 hover:bg-white/5">
                <Icons.Bell className="h-5 w-5 text-slate-400" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-2 hover:bg-white/5"
              >
                {darkMode ? (
                  <Icons.Sun className="h-5 w-5 text-slate-400" />
                ) : (
                  <Icons.Moon className="h-5 w-5 text-slate-400" />
                )}
              </button>

              <Link
                href="/admin/settings"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1.5 pr-3 hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Icons.User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white hidden sm:inline">Admin</span>
              </Link>
            </div>
          </header>

          <main className="p-4 lg:p-8">{children}</main>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={() => setSearchOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl"
              >
                <div className="flex items-center gap-3 border-b border-white/10 p-4">
                  <Icons.Search className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users, transactions, tickets..."
                    className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                    autoFocus
                  />
                  <kbd className="rounded bg-white/10 px-2 py-1 text-xs text-slate-500">ESC</kbd>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-500">Start typing to search...</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}
