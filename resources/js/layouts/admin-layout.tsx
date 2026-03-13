import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  Send,
  BookOpen,
  Landmark,
  CreditCard,
  Layers,
  Wallet,
  Banknote,
  Building2,
  Smartphone,
  BarChart3,
  LogIn,
  Bell,
  MessageSquare,
  Mail,
  Settings,
  BellRing,
  UserCheck,
  Globe,
  GitBranch,
  Server,
  Wrench,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  User as UserIcon,
} from "lucide-react";
import { clsx } from "clsx";

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "USER MANAGEMENT",
    items: [
      { label: "All Users", href: "/admin/users", icon: Users },
      { label: "KYC Oversight", href: "/admin/oversight/kyc", icon: ShieldCheck, badge: 0 },
      { label: "Fraud Queue", href: "/admin/oversight/fraud", icon: AlertTriangle, badge: 0 },
    ],
  },
  {
    title: "FINANCIAL",
    items: [
      { label: "Transactions", href: "/admin/reports/transactions", icon: ArrowRightLeft },
      { label: "Payments", href: "/admin/payments", icon: Send },
      { label: "Ledger", href: "/admin/ledger", icon: BookOpen },
      { label: "Wire Transfers", href: "/admin/wire-transfers", icon: Landmark },
      { label: "Virtual Cards", href: "/admin/virtual-cards", icon: CreditCard },
    ],
  },
  {
    title: "PRODUCTS",
    items: [
      { label: "Manage Plans", href: "/admin/settings/plans", icon: Layers },
      { label: "Payment Gateways", href: "/admin/settings/payment-gateways", icon: Wallet },
      { label: "Withdrawal Methods", href: "/admin/settings/withdrawal-methods", icon: Banknote },
      { label: "Other Banks", href: "/admin/settings/other-banks", icon: Building2 },
      { label: "Manage Branches", href: "/admin/settings/branches", icon: Building2 },
      { label: "Airtime", href: "/admin/settings/airtime", icon: Smartphone },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "Transaction History", href: "/admin/reports/transactions", icon: BarChart3 },
      { label: "Login History", href: "/admin/reports/logins", icon: LogIn },
      { label: "Notification History", href: "/admin/reports/notifications", icon: Bell },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { label: "Support Tickets", href: "/admin/support", icon: MessageSquare, badge: 0 },
      { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "General Settings", href: "/admin/settings/general", icon: Settings },
      { label: "Notifications", href: "/admin/settings/notifications", icon: BellRing },
      { label: "KYC Settings", href: "/admin/settings/kyc", icon: UserCheck },
      { label: "SEO & Frontend", href: "/admin/settings/seo", icon: Globe },
      { label: "Referral Settings", href: "/admin/settings/referral", icon: GitBranch },
      { label: "System Info", href: "/admin/system/info", icon: Server },
      { label: "Maintenance Mode", href: "/admin/settings/maintenance", icon: Wrench },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

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
    if (href === "/admin") return currentPath === "/admin";
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
    <div className="min-h-screen bg-slate-950 text-white">
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
            <X className="h-5 w-5" />
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
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
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
                        return (
                          <Link
                            key={item.href}
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
                              <item.icon
                                className={clsx(
                                  "h-5 w-5",
                                  active ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
                                )}
                              />
                              <span>{item.label}</span>
                            </div>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500/20 px-1.5 text-xs font-semibold text-rose-400">
                                {item.badge}
                              </span>
                            )}
                          </Link>
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
              <UserIcon className="h-5 w-5 text-white" />
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
              <ExternalLink className="h-4 w-4" />
              View Site
            </Link>
            <Link
              href="/logout"
              className="flex items-center justify-center rounded-lg bg-white/5 px-3 py-2 text-slate-300 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
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
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 text-sm text-slate-400 lg:flex">
              <Link href="/admin" className="hover:text-white">
                Admin
              </Link>
              {currentPath !== "/admin" && (
                <>
                  <ChevronRight className="h-4 w-4" />
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
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-500 sm:inline">
                ⌘K
              </kbd>
            </button>

            <button className="relative rounded-lg p-2 hover:bg-white/5">
              <Bell className="h-5 w-5 text-slate-400" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 hover:bg-white/5"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-slate-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-400" />
              )}
            </button>

            <Link
              href="/admin/settings"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1.5 pr-3 hover:bg-white/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <UserIcon className="h-4 w-4 text-white" />
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
                <Search className="h-5 w-5 text-slate-400" />
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
  );
}
