import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';

const Icons = {
    LayoutDashboard: LucideIcons.LayoutDashboard,
    CreditCard: LucideIcons.CreditCard,
    ArrowRightLeft: LucideIcons.ArrowRightLeft,
    Wallet: LucideIcons.Wallet,
    Send: LucideIcons.Send,
    Landmark: LucideIcons.Landmark,
    Receipt: LucideIcons.Receipt,
    HandCoins: LucideIcons.HandCoins,
    PiggyBank: LucideIcons.PiggyBank,
    TrendingUp: LucideIcons.TrendingUp,
    Banknote: LucideIcons.Banknote,
    Layers: LucideIcons.Layers,
    Award: LucideIcons.Award,
    Star: LucideIcons.Star,
    GitBranch: LucideIcons.GitBranch,
    BarChart3: LucideIcons.BarChart3,
    Settings: LucideIcons.Settings,
    MessageCircle: LucideIcons.MessageCircle,
    ChevronDown: LucideIcons.ChevronDown,
    ChevronRight: LucideIcons.ChevronRight,
    ChevronLeft: LucideIcons.ChevronLeft,
    Search: LucideIcons.Search,
    Bell: LucideIcons.Bell,
    LogOut: LucideIcons.LogOut,
    User: LucideIcons.User,
    HelpCircle: LucideIcons.HelpCircle,
    Hexagon: LucideIcons.Hexagon,
    DollarSign: LucideIcons.DollarSign,
    X: LucideIcons.X,
    Command: LucideIcons.Command,
    Sun: LucideIcons.Sun,
    Moon: LucideIcons.Moon,
    Repeat: LucideIcons.Repeat,
    Target: LucideIcons.Target,
    SlidersHorizontal: LucideIcons.SlidersHorizontal,
};

interface NavItem {
    label: string;
    href?: string;
    icon?: keyof typeof Icons;
    action?: string;
    children?: NavItem[];
}

interface NavSection {
    section: string;
    items: NavItem[];
}

const navigation: NavSection[] = [
    {
        section: 'MAIN',
        items: [
            { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
            {
                label: 'Accounts',
                icon: 'CreditCard',
                children: [
                    { label: 'All Accounts', href: '/accounts' },
                    { label: 'Open New Account', href: '/accounts/new' },
                    { label: 'Account Statements', href: '/statements' },
                ]
            },
            { label: 'Transactions', href: '/transactions', icon: 'ArrowRightLeft' },
            {
                label: 'Wallet',
                icon: 'Wallet',
                children: [
                    { label: 'Main Wallet', href: '/wallet' },
                    { label: 'Add Funds', href: '/wallet/deposit' },
                    { label: 'Withdraw', href: '/wallet/withdraw' },
                ]
            },
        ]
    },
    {
        section: 'PAYMENTS',
        items: [
            {
                label: 'Send Money',
                icon: 'Send',
                children: [
                    { label: 'Local Transfer', href: '/payments/local' },
                    { label: 'International', href: '/payments/international' },
                    { label: 'Between My Accounts', href: '/transfers' },
                    { label: 'Scheduled Payments', href: '/payments/scheduled' },
                    { label: 'Payment History', href: '/payments/history' },
                ]
            },
            {
                label: 'Wire Transfer',
                icon: 'Landmark',
                children: [
                    { label: 'New Wire Transfer', href: '/wire/new' },
                    { label: 'SWIFT Transfer', href: '/wire/swift' },
                    { label: 'Wire History', href: '/wire/history' },
                ]
            },
            {
                label: 'Bill Payments',
                icon: 'Receipt',
                children: [
                    { label: 'Pay a Bill', href: '/bills' },
                    { label: 'Saved Billers', href: '/bills/saved' },
                    { label: 'Bill History', href: '/bills/history' },
                ]
            },
            {
                label: 'Request Money',
                icon: 'HandCoins',
                children: [
                    { label: 'Send Request', href: '/requests/new' },
                    { label: 'Incoming Requests', href: '/requests/incoming' },
                    { label: 'Outgoing Requests', href: '/requests/outgoing' },
                ]
            },
        ]
    },
    {
        section: 'BANKING',
        items: [
            {
                label: 'DPS',
                icon: 'PiggyBank',
                children: [
                    { label: 'Available Plans', href: '/dps' },
                    { label: 'My DPS Accounts', href: '/dps/mine' },
                    { label: 'DPS Calculator', href: '/dps/calculator' },
                ]
            },
            {
                label: 'Fixed Deposit (FDR)',
                icon: 'TrendingUp',
                children: [
                    { label: 'Available Plans', href: '/fdr' },
                    { label: 'My FDR Accounts', href: '/fdr/mine' },
                    { label: 'FDR Calculator', href: '/fdr/calculator' },
                ]
            },
            {
                label: 'Loans',
                icon: 'Banknote',
                children: [
                    { label: 'Loan Products', href: '/loans' },
                    { label: 'Apply for Loan', href: '/loans/apply' },
                    { label: 'My Loans', href: '/loans/mine' },
                    { label: 'EMI Schedule', href: '/loans/emi' },
                    { label: 'Loan Calculator', href: '/loans/calculator' },
                ]
            },
        ]
    },
    {
        section: 'CARDS',
        items: [
            {
                label: 'Virtual Cards',
                icon: 'Layers',
                children: [
                    { label: 'My Cards', href: '/cards' },
                    { label: 'Issue New Card', href: '/cards/new' },
                    { label: 'Card Transactions', href: '/cards/transactions' },
                    { label: 'Card Controls', href: '/cards/controls' },
                ]
            },
        ]
    },
    {
        section: 'PORTFOLIO & REWARDS',
        items: [
            {
                label: 'Portfolio',
                icon: 'Award',
                children: [
                    { label: 'My Portfolio', href: '/portfolio' },
                    { label: 'My Badges', href: '/portfolio/badges' },
                    { label: 'Global Rankings', href: '/portfolio/rankings' },
                    { label: 'Portfolio Earnings', href: '/portfolio/earnings' },
                ]
            },
            {
                label: 'Reward Points',
                icon: 'Star',
                children: [
                    { label: 'My Points', href: '/rewards' },
                    { label: 'Earn Points', href: '/rewards/earn' },
                    { label: 'Redeem Points', href: '/rewards/redeem' },
                    { label: 'Points History', href: '/rewards/history' },
                ]
            },
            {
                label: 'Referrals',
                icon: 'GitBranch',
                children: [
                    { label: 'My Referral Link', href: '/referrals' },
                    { label: 'Referral Network', href: '/referrals/network' },
                    { label: 'Commission History', href: '/referrals/commissions' },
                    { label: 'Referral Leaderboard', href: '/referrals/leaderboard' },
                ]
            },
        ]
    },
    {
        section: 'INSIGHTS',
        items: [
            {
                label: 'Analytics',
                icon: 'BarChart3',
                children: [
                    { label: 'Overview', href: '/analytics' },
                    { label: 'Spending Analysis', href: '/analytics/spending' },
                    { label: 'Income Analysis', href: '/analytics/income' },
                    { label: 'Budget Tracker', href: '/analytics/budgets' },
                    { label: 'Net Worth', href: '/analytics/net-worth' },
                ]
            },
        ]
    },
    {
        section: 'ACCOUNT',
        items: [
            {
                label: 'Settings',
                icon: 'Settings',
                children: [
                    { label: 'Profile', href: '/settings/profile' },
                    { label: 'Security', href: '/settings/security' },
                    { label: 'Two-Factor Auth', href: '/settings/2fa' },
                    { label: 'Passcode', href: '/settings/passcode' },
                    { label: 'Notifications', href: '/settings/notifications' },
                    { label: 'KYC Verification', href: '/settings/kyc' },
                    { label: 'Linked Accounts', href: '/settings/linked' },
                    { label: 'Privacy & GDPR', href: '/settings/privacy' },
                    { label: 'Language', href: '/settings/language' },
                    { label: 'Appearance', href: '/settings/appearance' },
                ]
            },
            {
                label: 'Support',
                icon: 'MessageCircle',
                children: [
                    { label: 'Help Center', href: '/support' },
                    { label: 'My Tickets', href: '/support/tickets' },
                    { label: 'New Ticket', href: '/support/new' },
                    { label: 'Replay Tour', action: 'replayTour' },
                ]
            },
        ]
    },
];

interface UserLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        tier: 'free' | 'pro' | 'business';
        account_status: 'active' | 'pending_kyc' | 'suspended';
    };
    notifications?: Array<{
        id: string;
        type: 'transaction' | 'alert' | 'system';
        title: string;
        message: string;
        read: boolean;
        created_at: string;
    }>;
}

function NavItemComponent({ 
    item, 
    depth = 0,
    isActive,
    collapsed 
}: { 
    item: NavItem; 
    depth?: number;
    isActive: boolean;
    collapsed: boolean;
}) {
    const [isOpen, setIsOpen] = useState(isActive);
    const hasChildren = item.children && item.children.length > 0;
    const page = usePage();

    useEffect(() => {
        if (hasChildren) {
            const isChildActive = item.children?.some(
                child => page.url === child.href || 
                (child.href && page.url.startsWith(child.href))
            );

            if (isChildActive) {
                setIsOpen(true);
            }
        }
    }, [page.url, hasChildren, item.children]);

    const IconComponent = item.icon ? Icons[item.icon] : null;

    if (hasChildren) {
        return (
            <div className="w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive || isOpen
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {IconComponent && (
                            <IconComponent className={`h-5 w-5 flex-shrink-0 ${
                                isActive || isOpen 
                                    ? 'text-indigo-600 dark:text-indigo-400' 
                                    : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
                            }`} />
                        )}
                        {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && hasChildren && (
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Icons.ChevronDown className="h-4 w-4 text-zinc-400" />
                        </motion.div>
                    )}
                </button>
                <AnimatePresence initial={false}>
                    {hasChildren && isOpen && !collapsed && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={{
                                open: { height: 'auto', opacity: 1 },
                                closed: { height: 0, opacity: 0 }
                            }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: 'hidden' }}
                        >
                            <ul className="ml-4 mt-1 space-y-1 border-l-2 border-indigo-500/20 pl-2">
                                {item.children!.map((child) => {
                                    const childIsActive = child.href 
                                        ? page.url === child.href || page.url.startsWith(child.href + '/')
                                        : false;

                                    return (
                                        <li key={child.label}>
                                            {child.href ? (
                                                <Link
                                                    href={child.href}
                                                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                                                        childIsActive
                                                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/5'
                                                            : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                                                    }`}
                                                >
                                                    {childIsActive && (
                                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                    )}
                                                    {child.label}
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        if (child.action === 'replayTour') {
                                                            window.location.reload();
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                                >
                                                    {child.label}
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    if (item.href) {
        return (
            <Link
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50'
                }`}
            >
                {IconComponent && (
                    <IconComponent className={`h-5 w-5 flex-shrink-0 ${
                        isActive 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
                    }`} />
                )}
                {!collapsed && <span>{item.label}</span>}
            </Link>
        );
    }

    return null;
}

function UserSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
    const page = usePage();
    const currentPath = page.url;

    const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + '/');

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 64 : 260 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-zinc-900/95 backdrop-blur-xl dark:bg-black/50"
            data-tour="sidebar"
        >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
                        <Icons.Hexagon className="h-5 w-5 text-white" />
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-lg font-bold text-white"
                        >
                            Magnetiq
                        </motion.span>
                    )}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                >
                    {collapsed ? <Icons.ChevronRight className="h-4 w-4" /> : <Icons.ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
                {navigation.map((section) => (
                    <div key={section.section} className="mb-4">
                        {!collapsed && (
                            <div className="px-3 pb-2 pt-4 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                {section.section}
                            </div>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <NavItemComponent
                                    key={item.label}
                                    item={item}
                                    isActive={item.href ? isActive(item.href) : false}
                                    collapsed={collapsed}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/10 p-3">
                {!collapsed && (
                    <div className="mb-3 rounded-lg bg-amber-500/10 px-3 py-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                            </span>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                Complete KYC to unlock all features
                            </span>
                        </div>
                    </div>
                )}
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <Avatar className="h-9 w-9 ring-2 ring-indigo-500/20">
                        <AvatarImage src={page.props.auth?.user?.avatar} />
                        <AvatarFallback className="bg-indigo-500/20 text-indigo-400">JD</AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-white">John Doe</p>
                            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 text-[10px]">
                                PRO
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
}

function TopBar({ title }: { title?: string }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [notifications] = useState([
        { id: '1', type: 'transaction' as const, title: 'Payment Received', message: 'You received $500.00 from John D.', read: false, created_at: '2 min ago' },
        { id: '2', type: 'alert' as const, title: 'Large Transaction', message: '$2,500 spent at Amazon', read: false, created_at: '1 hour ago' },
        { id: '3', type: 'system' as const, title: 'Statement Ready', message: 'Your February statement is ready', read: true, created_at: 'Yesterday' },
    ]);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-zinc-900/80 px-6 backdrop-blur-xl dark:bg-black/50">
                <div className="flex items-center gap-4">
                    {title && (
                        <motion.h1
                            key={title}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xl font-semibold text-white"
                        >
                            {title}
                        </motion.h1>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="hidden h-9 w-64 border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white md:flex"
                        onClick={() => setSearchOpen(true)}
                        data-tour="command"
                    >
                        <Icons.Search className="mr-2 h-4 w-4" />
                        <span className="text-xs">Search...</span>
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="text-zinc-400 hover:text-white"
                    >
                        {theme === 'dark' ? (
                            <Icons.Sun className="h-5 w-5" />
                        ) : (
                            <Icons.Moon className="h-5 w-5" />
                        )}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white" data-tour="notifications">
                                <Icons.Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 border-white/10 bg-zinc-900">
                            <DropdownMenuLabel className="text-zinc-300">Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            {notifications.map((n) => (
                                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3">
                                    <div className="flex w-full items-center justify-between">
                                        <span className="font-medium text-white">{n.title}</span>
                                        {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                                    </div>
                                    <span className="text-xs text-zinc-400">{n.message}</span>
                                    <span className="text-[10px] text-zinc-500">{n.created_at}</span>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="text-indigo-400">
                                View all notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={undefined} />
                                    <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-sm">JD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 border-white/10 bg-zinc-900">
                            <DropdownMenuLabel className="text-zinc-300">
                                <div className="flex flex-col">
                                    <span>John Doe</span>
                                    <span className="text-xs font-normal text-zinc-500">john@example.com</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="text-zinc-300">
                                <Icons.User className="mr-2 h-4 w-4" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300">
                                <Icons.Settings className="mr-2 h-4 w-4" /> Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300">
                                <Icons.HelpCircle className="mr-2 h-4 w-4" /> Help & Support
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="text-rose-400">
                                <Icons.LogOut className="mr-2 h-4 w-4" /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 border-b border-white/10 p-4">
                                <Icons.Search className="h-5 w-5 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search pages, actions, transactions..."
                                    className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
                                    autoFocus
                                />
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400" onClick={() => setSearchOpen(false)}>
                                    <Icons.X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="max-h-96 overflow-y-auto p-2">
                                <div className="px-3 py-2 text-xs font-medium text-zinc-500">Pages</div>
                                {['Dashboard', 'Accounts', 'Transactions', 'Payments', 'Cards', 'Wallet', 'Loans', 'DPS', 'FDR'].map((item) => (
                                    <button
                                        key={item}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
                                    >
                                        <Icons.Command className="h-4 w-4" /> {item}
                                    </button>
                                ))}
                                <div className="mt-2 px-3 py-2 text-xs font-medium text-zinc-500">Recent Transactions</div>
                                {['Stripe Payment', 'Amazon Purchase', 'Netflix'].map((item) => (
                                    <button
                                        key={item}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
                                    >
                                        <Icons.DollarSign className="h-4 w-4" /> {item}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function MobileNav() {
    const page = usePage();
    const currentPath = page.url;
    const [moreOpen, setMoreOpen] = useState(false);

    const isActive = (href: string) => currentPath === href;

    const mobileMainItems = [
        { href: '/dashboard', icon: 'LayoutDashboard' as const, label: 'Home' },
        { href: '/accounts', icon: 'CreditCard' as const, label: 'Accounts' },
        { href: '/payments/local', icon: 'Send' as const, label: 'Pay' },
        { href: '/cards', icon: 'Layers' as const, label: 'Cards' },
    ];

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/10 bg-zinc-900/95 px-2 backdrop-blur-xl md:hidden">
                {mobileMainItems.map((item) => {
                    const IconComponent = Icons[item.icon];

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 p-2 ${
                                isActive(item.href) ? 'text-indigo-400' : 'text-zinc-500'
                            }`}
                        >
                            <IconComponent className="h-5 w-5" />
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    );
                })}
                <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center gap-1 p-2 text-zinc-500">
                    <Icons.Settings className="h-5 w-5" />
                    <span className="text-[10px]">More</span>
                </button>
            </nav>

            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl border-t border-white/10 bg-zinc-900">
                    <SheetHeader>
                        <SheetTitle className="text-white">More Options</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-3 gap-4 p-4">
                        {[
                            { href: '/wallet', label: 'Wallet', icon: 'Wallet' as const },
                            { href: '/loans', label: 'Loans', icon: 'Banknote' as const },
                            { href: '/referrals', label: 'Referrals', icon: 'GitBranch' as const },
                            { href: '/analytics', label: 'Analytics', icon: 'BarChart3' as const },
                            { href: '/support', label: 'Support', icon: 'MessageCircle' as const },
                            { href: '/settings/profile', label: 'Settings', icon: 'Settings' as const },
                        ].map((item) => {
                            const IconComponent = Icons[item.icon];

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMoreOpen(false)}
                                    className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 text-zinc-300"
                                >
                                    <IconComponent className="h-6 w-6" />
                                    <span className="text-xs">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

function UserLayoutInner({ children }: UserLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const page = usePage();
    const currentPath = page.url;

    const getPageTitle = () => {
        const path = currentPath.split('?')[0];
        
        for (const section of navigation) {
            for (const item of section.items) {
                if (item.children) {
                    const child = item.children.find(c => c.href && (path === c.href || path.startsWith(c.href + '/')));

                    if (child) {
return child.label;
}
                }

                if (item.href && path === item.href) {
                    return item.label;
                }
            }
        }

        return 'Overview';
    };

    return (
        <SidebarProvider defaultOpen>
            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950">
                <UserSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <motion.div
                    initial={false}
                    animate={{ marginLeft: collapsed ? 64 : 260 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-screen flex-col"
                >
                    <TopBar title={getPageTitle()} />
                    <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
                        {children}
                    </main>
                </motion.div>
                <MobileNav />
            </div>
        </SidebarProvider>
    );
}

export default function UserLayout({ children }: UserLayoutProps) {
    const page = usePage();
    const { onboarding } = page.props as {
        onboarding?: { completed: boolean; lastStep: number };
    };

    return (
        <UserLayoutInner>
            {children}
        </UserLayoutInner>
    );
}
