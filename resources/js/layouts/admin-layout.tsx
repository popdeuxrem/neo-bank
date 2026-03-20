import { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useEffect, createContext, useContext } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';

const Icons = LucideIcons as Record<
    string,
    React.ComponentType<{ className?: string }>
>;

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

interface AdminLayoutProps {
    children: React.ReactNode;
}

const IconComponent = ({
    name,
    className,
}: {
    name?: string;
    className?: string;
}) => {
    if (!name || !Icons[name]) {
        return <div className={className} />;
    }

    const Icon = Icons[name];

    return <Icon className={className} />;
};

function buildNavigation(adminPrefix: string): NavSection[] {
    return [
        {
            title: 'OVERVIEW',
            items: [
                {
                    label: 'Dashboard',
                    href: `/${adminPrefix}`,
                    icon: 'LayoutDashboard',
                },
            ],
        },
        {
            title: 'CUSTOMERS',
            items: [
                {
                    label: 'All Customers',
                    href: `/${adminPrefix}/customers`,
                    icon: 'Users',
                },
                {
                    label: 'Active Customers',
                    href: `/${adminPrefix}/customers?status=active`,
                    icon: 'UserCheck',
                },
                {
                    label: 'Inactive Customers',
                    href: `/${adminPrefix}/customers?status=inactive`,
                    icon: 'Users',
                },
                {
                    label: 'KYC Pending',
                    href: `/${adminPrefix}/customers?kyc=pending`,
                    icon: 'ShieldCheck',
                    badge: 3,
                    badgeType: 'warning',
                },
                {
                    label: 'KYC Verified',
                    href: `/${adminPrefix}/customers?kyc=verified`,
                    icon: 'ShieldCheck',
                },
                {
                    label: 'Banned Customers',
                    href: `/${adminPrefix}/customers?status=banned`,
                    icon: 'AlertTriangle',
                    badge: 1,
                    badgeType: 'danger',
                },
                {
                    label: 'Email Customers',
                    href: `/${adminPrefix}/customers/email`,
                    icon: 'Mail',
                },
            ],
        },
        {
            title: 'FINANCIAL OPERATIONS',
            items: [
                {
                    label: 'Fund Transfer',
                    href: `/${adminPrefix}/transfers`,
                    icon: 'ArrowRightLeft',
                    children: [
                        {
                            label: 'All Transfers',
                            href: `/${adminPrefix}/transfers`,
                            icon: 'ArrowRightLeft',
                        },
                        {
                            label: 'Pending Transfers',
                            href: `/${adminPrefix}/transfers?status=pending`,
                            icon: 'Clock',
                        },
                        {
                            label: 'Completed Transfers',
                            href: `/${adminPrefix}/transfers?status=completed`,
                            icon: 'CheckCircle',
                        },
                        {
                            label: 'Failed Transfers',
                            href: `/${adminPrefix}/transfers?status=failed`,
                            icon: 'XCircle',
                        },
                        {
                            label: 'Manual Transfer',
                            href: `/${adminPrefix}/transfers/manual`,
                            icon: 'Plus',
                        },
                        {
                            label: 'Transfer Settings',
                            href: `/${adminPrefix}/transfers/settings`,
                            icon: 'Settings',
                        },
                    ],
                },
                {
                    label: 'Wire & SWIFT',
                    href: `/${adminPrefix}/wire`,
                    icon: 'Landmark',
                    children: [
                        {
                            label: 'Wire Transfer Requests',
                            href: `/${adminPrefix}/wire`,
                            icon: 'ArrowRightLeft',
                        },
                        {
                            label: 'SWIFT Configuration',
                            href: `/${adminPrefix}/wire/settings`,
                            icon: 'Settings',
                        },
                        {
                            label: 'Correspondent Banks',
                            href: `/${adminPrefix}/wire/correspondent-banks`,
                            icon: 'Building2',
                        },
                        {
                            label: 'Wire Fees',
                            href: `/${adminPrefix}/wire/fees`,
                            icon: 'DollarSign',
                        },
                    ],
                },
                {
                    label: 'Deposits',
                    href: `/${adminPrefix}/deposits`,
                    icon: 'ArrowDownCircle',
                    children: [
                        {
                            label: 'All Deposits',
                            href: `/${adminPrefix}/deposits`,
                            icon: 'ArrowDownCircle',
                        },
                        {
                            label: 'Pending Approval',
                            href: `/${adminPrefix}/deposits/pending`,
                            icon: 'Clock',
                        },
                        {
                            label: 'Deposit Methods',
                            href: `/${adminPrefix}/deposits/methods`,
                            icon: 'Layers',
                        },
                    ],
                },
                {
                    label: 'Withdrawals',
                    href: `/${adminPrefix}/withdrawals`,
                    icon: 'ArrowUpCircle',
                    children: [
                        {
                            label: 'All Withdrawals',
                            href: `/${adminPrefix}/withdrawals`,
                            icon: 'ArrowUpCircle',
                        },
                        {
                            label: 'Pending Approval',
                            href: `/${adminPrefix}/withdrawals/pending`,
                            icon: 'Clock',
                        },
                        {
                            label: 'Withdrawal Methods',
                            href: `/${adminPrefix}/withdrawals/methods`,
                            icon: 'Layers',
                        },
                    ],
                },
                {
                    label: 'Bill Payments',
                    href: `/${adminPrefix}/bills`,
                    icon: 'FileText',
                    children: [
                        {
                            label: 'Transactions',
                            href: `/${adminPrefix}/bills/transactions`,
                            icon: 'FileText',
                        },
                        {
                            label: 'Providers',
                            href: `/${adminPrefix}/bills/providers`,
                            icon: 'Building',
                        },
                        {
                            label: 'Categories',
                            href: `/${adminPrefix}/bills/categories`,
                            icon: 'Folder',
                        },
                    ],
                },
            ],
        },
        {
            title: 'BANKING PRODUCTS',
            items: [
                {
                    label: 'DPS Plans',
                    href: `/${adminPrefix}/dps`,
                    icon: 'PiggyBank',
                    children: [
                        {
                            label: 'DPS Plans',
                            href: `/${adminPrefix}/dps/plans`,
                            icon: 'FileText',
                        },
                        {
                            label: 'Active DPS',
                            href: `/${adminPrefix}/dps/subscriptions`,
                            icon: 'Activity',
                        },
                        {
                            label: 'Matured DPS',
                            href: `/${adminPrefix}/dps/matured`,
                            icon: 'CheckCircle',
                        },
                        {
                            label: 'DPS Settings',
                            href: `/${adminPrefix}/dps/settings`,
                            icon: 'Settings',
                        },
                    ],
                },
                {
                    label: 'FDR Plans',
                    href: `/${adminPrefix}/fdr`,
                    icon: 'Lock',
                    children: [
                        {
                            label: 'FDR Plans',
                            href: `/${adminPrefix}/fdr/plans`,
                            icon: 'FileText',
                        },
                        {
                            label: 'Active FDRs',
                            href: `/${adminPrefix}/fdr/subscriptions`,
                            icon: 'Activity',
                        },
                        {
                            label: 'Compounding Log',
                            href: `/${adminPrefix}/fdr/compounding`,
                            icon: 'RefreshCw',
                        },
                        {
                            label: 'FDR Settings',
                            href: `/${adminPrefix}/fdr/settings`,
                            icon: 'Settings',
                        },
                    ],
                },
                {
                    label: 'Loans',
                    href: `/${adminPrefix}/loans`,
                    icon: 'Landmark',
                    children: [
                        {
                            label: 'Loan Plans',
                            href: `/${adminPrefix}/loans/plans`,
                            icon: 'FileText',
                        },
                        {
                            label: 'Loan Applications',
                            href: `/${adminPrefix}/loans/applications`,
                            icon: 'FileCheck',
                        },
                        {
                            label: 'Active Loans',
                            href: `/${adminPrefix}/loans/active`,
                            icon: 'Activity',
                        },
                        {
                            label: 'Overdue Loans',
                            href: `/${adminPrefix}/loans/overdue`,
                            icon: 'AlertTriangle',
                        },
                        {
                            label: 'Loan Settings',
                            href: `/${adminPrefix}/loans/settings`,
                            icon: 'Settings',
                        },
                    ],
                },
            ],
        },
        {
            title: 'PORTFOLIO & REWARDS',
            items: [
                {
                    label: 'Portfolio',
                    href: `/${adminPrefix}/portfolio`,
                    icon: 'Briefcase',
                    children: [
                        {
                            label: 'Portfolio Tiers',
                            href: `/${adminPrefix}/portfolio/tiers`,
                            icon: 'Layers',
                        },
                        {
                            label: 'Badges',
                            href: `/${adminPrefix}/portfolio/badges`,
                            icon: 'Award',
                        },
                        {
                            label: 'User Rankings',
                            href: `/${adminPrefix}/portfolio/rankings`,
                            icon: 'Trophy',
                        },
                    ],
                },
                {
                    label: 'Reward Points',
                    href: `/${adminPrefix}/rewards`,
                    icon: 'Star',
                    children: [
                        {
                            label: 'Reward Settings',
                            href: `/${adminPrefix}/rewards/settings`,
                            icon: 'Settings',
                        },
                        {
                            label: 'Point Transactions',
                            href: `/${adminPrefix}/rewards/transactions`,
                            icon: 'FileText',
                        },
                        {
                            label: 'Redeem Requests',
                            href: `/${adminPrefix}/rewards/redeem`,
                            icon: 'Gift',
                        },
                    ],
                },
                {
                    label: 'Referrals',
                    href: `/${adminPrefix}/referrals`,
                    icon: 'Users',
                    children: [
                        {
                            label: 'Referral Settings',
                            href: `/${adminPrefix}/referrals/settings`,
                            icon: 'Settings',
                        },
                        {
                            label: 'Referral Tree',
                            href: `/${adminPrefix}/referrals/tree`,
                            icon: 'GitBranch',
                        },
                        {
                            label: 'Referral Commissions',
                            href: `/${adminPrefix}/referrals/commissions`,
                            icon: 'DollarSign',
                        },
                    ],
                },
            ],
        },
        {
            title: 'SUPPORT',
            items: [
                {
                    label: 'Support Tickets',
                    href: `/${adminPrefix}/support`,
                    icon: 'MessageCircle',
                    children: [
                        {
                            label: 'All Tickets',
                            href: `/${adminPrefix}/support`,
                            icon: 'MessageCircle',
                        },
                        {
                            label: 'Pending Tickets',
                            href: `/${adminPrefix}/support?status=pending`,
                            icon: 'Clock',
                            badge: 5,
                            badgeType: 'warning',
                        },
                        {
                            label: 'Answered Tickets',
                            href: `/${adminPrefix}/support?status=answered`,
                            icon: 'MessageSquare',
                        },
                        {
                            label: 'Closed Tickets',
                            href: `/${adminPrefix}/support?status=closed`,
                            icon: 'CheckCircle',
                        },
                        {
                            label: 'Ticket Categories',
                            href: `/${adminPrefix}/support/categories`,
                            icon: 'Folder',
                        },
                    ],
                },
            ],
        },
        {
            title: 'KYC',
            items: [
                {
                    label: 'KYC Verification',
                    href: `/${adminPrefix}/kyc`,
                    icon: 'ShieldCheck',
                    children: [
                        {
                            label: 'KYC Requests (Pending)',
                            href: `/${adminPrefix}/kyc`,
                            icon: 'Clock',
                            badge: 3,
                            badgeType: 'warning',
                        },
                        {
                            label: 'Approved KYC',
                            href: `/${adminPrefix}/kyc/approved`,
                            icon: 'CheckCircle',
                        },
                        {
                            label: 'Rejected KYC',
                            href: `/${adminPrefix}/kyc/rejected`,
                            icon: 'XCircle',
                        },
                        {
                            label: 'KYC Settings',
                            href: `/${adminPrefix}/kyc/settings`,
                            icon: 'Settings',
                        },
                    ],
                },
            ],
        },
        {
            title: 'STAFF & ROLES',
            items: [
                {
                    label: 'Staff Management',
                    href: `/${adminPrefix}/staff`,
                    icon: 'Users',
                    children: [
                        {
                            label: 'All Staff',
                            href: `/${adminPrefix}/staff`,
                            icon: 'Users',
                        },
                        {
                            label: 'Add New Staff',
                            href: `/${adminPrefix}/staff/create`,
                            icon: 'UserPlus',
                        },
                        {
                            label: 'Staff Roles',
                            href: `/${adminPrefix}/roles`,
                            icon: 'Shield',
                        },
                        {
                            label: 'Staff Activity Log',
                            href: `/${adminPrefix}/staff/activity`,
                            icon: 'History',
                        },
                    ],
                },
            ],
        },
        {
            title: 'REPORTS',
            items: [
                {
                    label: 'Transaction History',
                    href: `/${adminPrefix}/reports/transactions`,
                    icon: 'FileText',
                },
                {
                    label: 'Profit Report',
                    href: `/${adminPrefix}/profits/overview`,
                    icon: 'TrendingUp',
                },
                {
                    label: 'Login History',
                    href: `/${adminPrefix}/reports/logins`,
                    icon: 'LogIn',
                },
                {
                    label: 'Notification History',
                    href: `/${adminPrefix}/notifications/history`,
                    icon: 'Bell',
                },
            ],
        },
        {
            title: 'MARKETING',
            items: [
                {
                    label: 'Notifications',
                    href: `/${adminPrefix}/notifications`,
                    icon: 'Bell',
                    children: [
                        {
                            label: 'Send User Notification',
                            href: `/${adminPrefix}/notifications/send`,
                            icon: 'Send',
                        },
                        {
                            label: 'Send All Users Notification',
                            href: `/${adminPrefix}/notifications/send-all`,
                            icon: 'BellRing',
                        },
                        {
                            label: 'Notification History',
                            href: `/${adminPrefix}/notifications/history`,
                            icon: 'History',
                        },
                        {
                            label: 'Notification Templates',
                            href: `/${adminPrefix}/notifications/templates`,
                            icon: 'FileText',
                        },
                        {
                            label: 'Notification Settings',
                            href: `/${adminPrefix}/notifications/settings`,
                            icon: 'Settings',
                        },
                    ],
                },
                {
                    label: 'Newsletter',
                    href: `/${adminPrefix}/marketing`,
                    icon: 'Mail',
                    children: [
                        {
                            label: 'Campaigns',
                            href: `/${adminPrefix}/marketing/newsletter`,
                            icon: 'Send',
                        },
                        {
                            label: 'Subscribers',
                            href: `/${adminPrefix}/marketing/subscribers`,
                            icon: 'Users',
                        },
                    ],
                },
            ],
        },
        {
            title: 'PAYMENT GATEWAYS',
            items: [
                {
                    label: 'Gateways',
                    href: `/${adminPrefix}/gateways`,
                    icon: 'Globe',
                    children: [
                        {
                            label: 'Payment Gateways',
                            href: `/${adminPrefix}/gateways`,
                            icon: 'Globe',
                        },
                        {
                            label: 'Deposit Gateways',
                            href: `/${adminPrefix}/gateways/deposits`,
                            icon: 'ArrowDownCircle',
                        },
                        {
                            label: 'Withdrawal Gateways',
                            href: `/${adminPrefix}/gateways/withdrawals`,
                            icon: 'ArrowUpCircle',
                        },
                        {
                            label: 'Gateway Logs',
                            href: `/${adminPrefix}/gateways/logs`,
                            icon: 'FileText',
                        },
                    ],
                },
            ],
        },
        {
            title: 'SETTINGS',
            items: [
                {
                    label: 'General Settings',
                    href: `/${adminPrefix}/settings/general`,
                    icon: 'Settings',
                },
                {
                    label: 'System Config',
                    href: `/${adminPrefix}/settings/system`,
                    icon: 'Server',
                },
                {
                    label: 'Security',
                    href: `/${adminPrefix}/settings/security`,
                    icon: 'Shield',
                    children: [
                        {
                            label: '2FA Settings',
                            href: `/${adminPrefix}/settings/security`,
                            icon: 'Lock',
                        },
                        {
                            label: 'Admin URL',
                            href: `/${adminPrefix}/settings/admin-url`,
                            icon: 'Link2',
                        },
                        {
                            label: 'Passcode',
                            href: `/${adminPrefix}/settings/passcode`,
                            icon: 'Key',
                        },
                    ],
                },
                {
                    label: 'Currencies',
                    href: `/${adminPrefix}/currencies`,
                    icon: 'DollarSign',
                    children: [
                        {
                            label: 'Fiat Currencies',
                            href: `/${adminPrefix}/currencies/fiat`,
                            icon: 'DollarSign',
                        },
                        {
                            label: 'Crypto Currencies',
                            href: `/${adminPrefix}/currencies/crypto`,
                            icon: 'Bitcoin',
                        },
                        {
                            label: 'Exchange Rates',
                            href: `/${adminPrefix}/currencies/rates`,
                            icon: 'RefreshCw',
                        },
                    ],
                },
                {
                    label: 'SMS Settings',
                    href: `/${adminPrefix}/settings/sms`,
                    icon: 'Smartphone',
                },
                {
                    label: 'Bonuses',
                    href: `/${adminPrefix}/settings/bonuses`,
                    icon: 'Gift',
                },
                {
                    label: 'Language',
                    href: `/${adminPrefix}/settings/language`,
                    icon: 'Globe',
                    children: [
                        {
                            label: 'Languages',
                            href: `/${adminPrefix}/settings/language`,
                            icon: 'Globe',
                        },
                        {
                            label: 'Translations',
                            href: `/${adminPrefix}/settings/translations`,
                            icon: 'FileText',
                        },
                    ],
                },
                {
                    label: 'Theme',
                    href: `/${adminPrefix}/themes`,
                    icon: 'Palette',
                    children: [
                        {
                            label: 'Active Theme',
                            href: `/${adminPrefix}/themes`,
                            icon: 'Layout',
                        },
                        {
                            label: 'Theme Settings',
                            href: `/${adminPrefix}/themes/settings`,
                            icon: 'Settings',
                        },
                        {
                            label: 'Color Customizer',
                            href: `/${adminPrefix}/themes/colors`,
                            icon: 'Palette',
                        },
                        {
                            label: 'Landing Page Theme',
                            href: `/${adminPrefix}/themes/landing`,
                            icon: 'Layout',
                        },
                    ],
                },
                {
                    label: 'Landing Page',
                    href: `/${adminPrefix}/landing`,
                    icon: 'Layout',
                    children: [
                        {
                            label: 'Hero Section',
                            href: `/${adminPrefix}/landing/hero`,
                            icon: 'Layout',
                        },
                        {
                            label: 'Features Section',
                            href: `/${adminPrefix}/landing/features`,
                            icon: 'Star',
                        },
                        {
                            label: 'Pricing Section',
                            href: `/${adminPrefix}/landing/pricing`,
                            icon: 'DollarSign',
                        },
                        {
                            label: 'Statistics',
                            href: `/${adminPrefix}/landing/stats`,
                            icon: 'BarChart',
                        },
                        {
                            label: 'Testimonials',
                            href: `/${adminPrefix}/landing/testimonials`,
                            icon: 'MessageCircle',
                        },
                    ],
                },
                {
                    label: 'Pages & Navigation',
                    href: `/${adminPrefix}/pages`,
                    icon: 'FileText',
                    children: [
                        {
                            label: 'All Pages',
                            href: `/${adminPrefix}/pages`,
                            icon: 'FileText',
                        },
                        {
                            label: 'Site Navigation',
                            href: `/${adminPrefix}/pages/navigation`,
                            icon: 'Menu',
                        },
                        {
                            label: 'Footer',
                            href: `/${adminPrefix}/pages/footer`,
                            icon: 'Scroll',
                        },
                    ],
                },
                {
                    label: 'SEO & Analytics',
                    href: `/${adminPrefix}/settings/seo`,
                    icon: 'Search',
                    children: [
                        {
                            label: 'SEO Settings',
                            href: `/${adminPrefix}/settings/seo`,
                            icon: 'Search',
                        },
                        {
                            label: 'Google Analytics',
                            href: `/${adminPrefix}/settings/analytics`,
                            icon: 'BarChart',
                        },
                    ],
                },
                {
                    label: 'Integrations',
                    href: `/${adminPrefix}/settings/integrations`,
                    icon: 'Plug',
                    children: [
                        {
                            label: 'Google Analytics',
                            href: `/${adminPrefix}/settings/analytics`,
                            icon: 'BarChart',
                        },
                        {
                            label: 'Google reCaptcha',
                            href: `/${adminPrefix}/settings/recaptcha`,
                            icon: 'Shield',
                        },
                        {
                            label: 'Tawk Chat',
                            href: `/${adminPrefix}/settings/tawk`,
                            icon: 'MessageCircle',
                        },
                        {
                            label: 'Messenger',
                            href: `/${adminPrefix}/settings/messenger`,
                            icon: 'MessageCircle',
                        },
                    ],
                },
                {
                    label: 'GDPR Settings',
                    href: `/${adminPrefix}/settings/gdpr`,
                    icon: 'Shield',
                },
                {
                    label: 'Maintenance Mode',
                    href: `/${adminPrefix}/settings/maintenance`,
                    icon: 'Wrench',
                },
                {
                    label: 'Inactive Users',
                    href: `/${adminPrefix}/settings/inactive-users`,
                    icon: 'UserMinus',
                },
                {
                    label: 'Custom CSS',
                    href: `/${adminPrefix}/settings/customization`,
                    icon: 'Code',
                },
            ],
        },
        {
            title: 'SYSTEM',
            items: [
                {
                    label: 'System Info',
                    href: `/${adminPrefix}/system/info`,
                    icon: 'Server',
                },
                {
                    label: 'Cache Management',
                    href: `/${adminPrefix}/system/cache`,
                    icon: 'Database',
                },
                {
                    label: 'Queue Monitor',
                    href: `/${adminPrefix}/system/queue`,
                    icon: 'Clock',
                },
                {
                    label: 'Audit Logs',
                    href: `/${adminPrefix}/audit-logs`,
                    icon: 'FileText',
                },
            ],
        },
    ];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const page = usePage();
    const adminPrefix = (page.props as any).adminPrefix ?? 'secure-admin';
    const { url } = page;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<
        Record<string, boolean>
    >({});
    const [darkMode, setDarkMode] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
        {},
    );

    const navigation = buildNavigation(adminPrefix);

    useEffect(() => {
        const initial: Record<string, boolean> = {};
        navigation.forEach((section) => {
            initial[section.title] = section.defaultOpen ?? true;
        });
        setExpandedSections(initial);
    }, [navigation]);

    const currentPath = url;

    const toggleSection = (title: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const isActive = (href: string) => {
        const dashboardPath = `/${adminPrefix}`;
        if (href === dashboardPath) {
            return currentPath === dashboardPath;
        }
        return currentPath.startsWith(href);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                toggleDarkMode: () => setDarkMode(!darkMode),
                setDarkMode,
            }}
        >
            <div
                className={clsx(
                    'min-h-screen',
                    darkMode ? 'bg-slate-950' : 'bg-gray-50',
                    'text-white dark:text-gray-900',
                )}
            >
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
                        'fixed top-0 left-0 z-50 flex h-screen w-[260px] flex-col border-r border-white/10 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300',
                        sidebarOpen
                            ? 'translate-x-0'
                            : '-translate-x-full lg:translate-x-0',
                    )}
                >
                    <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                        <Link
                            href={`/${adminPrefix}`}
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                                <span className="text-lg font-bold text-white">
                                    M
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Magnetiq
                                </p>
                                <p className="text-xs text-slate-400">
                                    Admin Panel
                                </p>
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
                                    className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase"
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
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-1 space-y-1">
                                                {section.items.map((item) => {
                                                    const active = isActive(
                                                        item.href,
                                                    );
                                                    const hasChildren =
                                                        item.children &&
                                                        item.children.length >
                                                            0;
                                                    const dropdownOpen =
                                                        openDropdowns[
                                                            item.href
                                                        ] ?? false;
                                                    const toggleDropdown =
                                                        () => {
                                                            setOpenDropdowns(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [item.href]:
                                                                        !prev[
                                                                            item
                                                                                .href
                                                                        ],
                                                                }),
                                                            );
                                                        };

                                                    return (
                                                        <div key={item.href}>
                                                            {hasChildren ? (
                                                                <>
                                                                    <button
                                                                        onClick={
                                                                            toggleDropdown
                                                                        }
                                                                        className={clsx(
                                                                            'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                                                            active
                                                                                ? 'bg-indigo-500/20 text-indigo-400'
                                                                                : 'text-slate-400 hover:bg-white/5 hover:text-white',
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <IconComponent
                                                                                name={
                                                                                    item.icon
                                                                                }
                                                                                className={clsx(
                                                                                    'h-5 w-5',
                                                                                    active
                                                                                        ? 'text-indigo-400'
                                                                                        : 'text-slate-500 group-hover:text-white',
                                                                                )}
                                                                            />
                                                                            <span>
                                                                                {
                                                                                    item.label
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            {item.badge !==
                                                                                undefined &&
                                                                                item.badge >
                                                                                    0 && (
                                                                                    <span
                                                                                        className={clsx(
                                                                                            'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                                                                                            item.badgeType ===
                                                                                                'danger'
                                                                                                ? 'bg-rose-500/20 text-rose-400'
                                                                                                : item.badgeType ===
                                                                                                    'warning'
                                                                                                  ? 'bg-amber-500/20 text-amber-400'
                                                                                                  : 'bg-indigo-500/20 text-indigo-400',
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            item.badge
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                            <motion.span
                                                                                animate={{
                                                                                    rotate: dropdownOpen
                                                                                        ? 90
                                                                                        : 0,
                                                                                }}
                                                                                transition={{
                                                                                    duration: 0.2,
                                                                                }}
                                                                            >
                                                                                <Icons.ChevronRight className="h-4 w-4" />
                                                                            </motion.span>
                                                                        </div>
                                                                    </button>
                                                                    <AnimatePresence>
                                                                        {(dropdownOpen ||
                                                                            active) && (
                                                                            <motion.div
                                                                                initial={{
                                                                                    height: 0,
                                                                                    opacity: 0,
                                                                                }}
                                                                                animate={{
                                                                                    height: 'auto',
                                                                                    opacity: 1,
                                                                                }}
                                                                                exit={{
                                                                                    height: 0,
                                                                                    opacity: 0,
                                                                                }}
                                                                                transition={{
                                                                                    duration: 0.2,
                                                                                }}
                                                                                className="overflow-hidden"
                                                                            >
                                                                                <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2">
                                                                                    {item.children?.map(
                                                                                        (
                                                                                            child,
                                                                                        ) => {
                                                                                            const childActive =
                                                                                                isActive(
                                                                                                    child.href,
                                                                                                );
                                                                                            return (
                                                                                                <Link
                                                                                                    key={
                                                                                                        child.href
                                                                                                    }
                                                                                                    href={
                                                                                                        child.href
                                                                                                    }
                                                                                                    className={clsx(
                                                                                                        'group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all',
                                                                                                        childActive
                                                                                                            ? 'bg-indigo-500/20 text-indigo-400'
                                                                                                            : 'text-slate-400 hover:bg-white/5 hover:text-white',
                                                                                                    )}
                                                                                                    onClick={() =>
                                                                                                        setSidebarOpen(
                                                                                                            false,
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <div className="flex items-center gap-3">
                                                                                                        <IconComponent
                                                                                                            name={
                                                                                                                child.icon
                                                                                                            }
                                                                                                            className={clsx(
                                                                                                                'h-4 w-4',
                                                                                                                childActive
                                                                                                                    ? 'text-indigo-400'
                                                                                                                    : 'text-slate-500 group-hover:text-white',
                                                                                                            )}
                                                                                                        />
                                                                                                        <span>
                                                                                                            {
                                                                                                                child.label
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    {child.badge !==
                                                                                                        undefined &&
                                                                                                        child.badge >
                                                                                                            0 && (
                                                                                                            <span
                                                                                                                className={clsx(
                                                                                                                    'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                                                                                                                    child.badgeType ===
                                                                                                                        'danger'
                                                                                                                        ? 'bg-rose-500/20 text-rose-400'
                                                                                                                        : child.badgeType ===
                                                                                                                            'warning'
                                                                                                                          ? 'bg-amber-500/20 text-amber-400'
                                                                                                                          : 'bg-indigo-500/20 text-indigo-400',
                                                                                                                )}
                                                                                                            >
                                                                                                                {
                                                                                                                    child.badge
                                                                                                                }
                                                                                                            </span>
                                                                                                        )}
                                                                                                </Link>
                                                                                            );
                                                                                        },
                                                                                    )}
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </>
                                                            ) : (
                                                                <Link
                                                                    href={
                                                                        item.href
                                                                    }
                                                                    className={clsx(
                                                                        'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                                                        active
                                                                            ? 'bg-indigo-500/20 text-indigo-400'
                                                                            : 'text-slate-400 hover:bg-white/5 hover:text-white',
                                                                    )}
                                                                    onClick={() =>
                                                                        setSidebarOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <IconComponent
                                                                            name={
                                                                                item.icon
                                                                            }
                                                                            className={clsx(
                                                                                'h-5 w-5',
                                                                                active
                                                                                    ? 'text-indigo-400'
                                                                                    : 'text-slate-500 group-hover:text-white',
                                                                            )}
                                                                        />
                                                                        <span>
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    {item.badge !==
                                                                        undefined &&
                                                                        item.badge >
                                                                            0 && (
                                                                            <span
                                                                                className={clsx(
                                                                                    'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                                                                                    item.badgeType ===
                                                                                        'danger'
                                                                                        ? 'bg-rose-500/20 text-rose-400'
                                                                                        : item.badgeType ===
                                                                                            'warning'
                                                                                          ? 'bg-amber-500/20 text-amber-400'
                                                                                          : 'bg-indigo-500/20 text-indigo-400',
                                                                                )}
                                                                            >
                                                                                {
                                                                                    item.badge
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </Link>
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
                                <p className="text-sm font-medium text-white">
                                    Admin User
                                </p>
                                <p className="text-xs text-slate-400">
                                    admin@magnetiq.com
                                </p>
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
                                href={`/${adminPrefix}/logout`}
                                method="post"
                                as="button"
                                className="flex items-center justify-center rounded-lg bg-white/5 px-3 py-2 text-slate-300 hover:bg-white/10"
                            >
                                <Icons.LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </aside>

                <div className="lg:pl-[260px]">
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 backdrop-blur-xl lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg p-2 hover:bg-white/5 lg:hidden"
                            >
                                <Icons.Menu className="h-5 w-5" />
                            </button>
                            <div className="hidden items-center gap-2 text-sm text-slate-400 lg:flex">
                                <Link
                                    href={`/${adminPrefix}`}
                                    className="hover:text-white"
                                >
                                    Admin
                                </Link>
                                {currentPath !== `/${adminPrefix}` && (
                                    <>
                                        <Icons.ChevronRight className="h-4 w-4" />
                                        <span className="text-white capitalize">
                                            {currentPath
                                                .replace(`/${adminPrefix}/`, '')
                                                .split('/')
                                                .pop()
                                                ?.replace(/-/g, ' ')}
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
                                <span className="hidden sm:inline">
                                    Search...
                                </span>
                                <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-500 sm:inline">
                                    ⌘K
                                </kbd>
                            </button>

                            <button className="relative rounded-lg p-2 hover:bg-white/5">
                                <Icons.Bell className="h-5 w-5 text-slate-400" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
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
                                href={`/${adminPrefix}/settings`}
                                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1.5 pr-3 hover:bg-white/10"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                                    <Icons.User className="h-4 w-4 text-white" />
                                </div>
                                <span className="hidden text-sm font-medium text-white sm:inline">
                                    Admin
                                </span>
                            </Link>
                        </div>
                    </header>

                    <main className="p-4 pb-20 lg:p-8 lg:pb-8">
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </main>
                </div>

                <nav className="pb-safe fixed right-0 bottom-0 left-0 z-30 flex items-center justify-around border-t border-white/10 bg-slate-900/95 px-2 pt-2 backdrop-blur-xl lg:hidden">
                    {[
                        {
                            icon: 'LayoutDashboard',
                            label: 'Dashboard',
                            href: `/${adminPrefix}`,
                        },
                        {
                            icon: 'Users',
                            label: 'Customers',
                            href: `/${adminPrefix}/customers`,
                        },
                        {
                            icon: 'ArrowRightLeft',
                            label: 'Transfers',
                            href: `/${adminPrefix}/transfers`,
                        },
                        {
                            icon: 'ShieldCheck',
                            label: 'KYC',
                            href: `/${adminPrefix}/kyc`,
                        },
                        {
                            icon: 'Menu',
                            label: 'More',
                            action: () => setSidebarOpen(true),
                        },
                    ].map((item) => {
                        const isActive = item.href
                            ? url === item.href ||
                              (item.href !== `/${adminPrefix}` &&
                                  url.startsWith(item.href))
                            : false;
                        const IconComponent = Icons[item.icon];

                        return (
                            <button
                                key={item.label}
                                onClick={() => {
                                    if (item.action) {
                                        item.action();
                                    } else if (item.href) {
                                        router.visit(item.href);
                                    }
                                }}
                                className={clsx(
                                    'flex min-w-0 flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all',
                                    isActive
                                        ? 'text-indigo-400'
                                        : 'text-slate-500 hover:text-slate-300',
                                )}
                            >
                                <IconComponent className="h-5 w-5 flex-shrink-0" />
                                <span className="truncate text-xs font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

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
                                className="fixed top-[20%] left-1/2 z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl"
                            >
                                <div className="flex items-center gap-3 border-b border-white/10 p-4">
                                    <Icons.Search className="h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users, transactions, tickets..."
                                        className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                                        autoFocus
                                    />
                                    <kbd className="rounded bg-white/10 px-2 py-1 text-xs text-slate-500">
                                        ESC
                                    </kbd>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-slate-500">
                                        Start typing to search...
                                    </p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </ThemeContext.Provider>
    );
}
