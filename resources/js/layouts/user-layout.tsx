import { useState, useEffect, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CreditCard,
    ArrowRightLeft,
    Send,
    Repeat,
    BookOpen,
    FileText,
    BarChart3,
    Target,
    Layers,
    Sliders,
    GitBranch,
    MessageCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    LogOut,
    User,
    HelpCircle,
    Hexagon,
    DollarSign,
    X,
    Command,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';
import { useInitials } from '@/hooks/use-initials';
import {
    TourProvider,
    TourProgress,
    TourSpotlight,
    TourTooltip,
    TourOverlay,
    TourWelcome,
    TourComplete,
    useTour,
} from '@/components/tour';

const mainNavItems = [
    { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Accounts', href: '/accounts', icon: CreditCard },
    { title: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
    { title: 'Payments', href: '/payments', icon: Send },
    { title: 'Transfers', href: '/transfers', icon: Repeat },
];

const financeNavItems = [
    { title: 'Ledger', href: '/ledger', icon: BookOpen },
    { title: 'Statements', href: '/statements', icon: FileText },
    { title: 'Analytics', href: '/analytics', icon: BarChart3 },
    { title: 'Budgets', href: '/budgets', icon: Target },
];

const cardsNavItems = [
    { title: 'Virtual Cards', href: '/cards', icon: Layers },
    { title: 'Card Controls', href: '/cards/controls', icon: Sliders },
];

const moreNavItems = [
    { title: 'Referrals', href: '/referrals', icon: GitBranch },
    { title: 'Support', href: '/support', icon: MessageCircle },
    { title: 'Settings', href: '/settings/profile', icon: Settings },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } }
};

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

function UserSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
    const page = usePage();
    const currentPath = page.url;

    const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + '/');

    const NavGroup = ({ title, items }: { title: string; items: typeof mainNavItems }) => (
        <div className="mb-4">
            {!collapsed && <div className="px-3 pb-2 pt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">{title}</div>}
            <nav className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isActive(item.href)
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50'
                        }`}
                    >
                        <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.href) ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
                        {!collapsed && <span>{item.title}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 64 : 240 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-zinc-900/95 backdrop-blur-xl dark:bg-black/50"
            data-tour="sidebar"
        >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
                        <Hexagon className="h-5 w-5 text-white" />
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
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
                <NavGroup title="MAIN" items={mainNavItems} />
                <NavGroup title="FINANCE" items={financeNavItems} />
                <NavGroup title="CARDS" items={cardsNavItems} />
                <NavGroup title="MORE" items={moreNavItems} />
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
    const [notifications, setNotifications] = useState([
        { id: '1', type: 'transaction', title: 'Payment Received', message: 'You received $500.00 from John D.', read: false, created_at: '2 min ago' },
        { id: '2', type: 'alert', title: 'Large Transaction', message: '$2,500 spent at Amazon', read: false, created_at: '1 hour ago' },
        { id: '3', type: 'system', title: 'Statement Ready', message: 'Your February statement is ready', read: true, created_at: 'Yesterday' },
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

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
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-zinc-900/80 px-6 backdrop-blur-xl">
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
                        <Search className="mr-2 h-4 w-4" />
                        <span className="text-xs">Search...</span>
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white" data-tour="notifications">
                                <Bell className="h-5 w-5" />
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
                                <User className="mr-2 h-4 w-4" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300">
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300">
                                <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="text-rose-400">
                                <LogOut className="mr-2 h-4 w-4" /> Log out
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
                                <Search className="h-5 w-5 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search pages, actions, transactions..."
                                    className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
                                    autoFocus
                                />
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400" onClick={() => setSearchOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="max-h-96 overflow-y-auto p-2">
                                <div className="px-3 py-2 text-xs font-medium text-zinc-500">Pages</div>
                                {['Dashboard', 'Accounts', 'Transactions', 'Payments', 'Cards'].map((item) => (
                                    <button
                                        key={item}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
                                    >
                                        <Command className="h-4 w-4" /> {item}
                                    </button>
                                ))}
                                <div className="mt-2 px-3 py-2 text-xs font-medium text-zinc-500">Recent Transactions</div>
                                {['Stripe Payment', 'Amazon Purchase', 'Netflix'].map((item) => (
                                    <button
                                        key={item}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
                                    >
                                        <DollarSign className="h-4 w-4" /> {item}
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

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/10 bg-zinc-900/95 px-2 backdrop-blur-xl md:hidden">
                {[
                    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
                    { href: '/accounts', icon: CreditCard, label: 'Accounts' },
                    { href: '/payments', icon: Send, label: 'Pay' },
                    { href: '/cards', icon: Layers, label: 'Cards' },
                ].map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 p-2 ${isActive(item.href) ? 'text-indigo-400' : 'text-zinc-500'}`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="text-[10px]">{item.label}</span>
                    </Link>
                ))}
                <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center gap-1 p-2 text-zinc-500">
                    <Settings className="h-5 w-5" />
                    <span className="text-[10px]">More</span>
                </button>
            </nav>

            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl border-t border-white/10 bg-zinc-900">
                    <SheetHeader>
                        <SheetTitle className="text-white">More Options</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-3 gap-4 p-4">
                        {moreNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMoreOpen(false)}
                                className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 text-zinc-300"
                            >
                                <item.icon className="h-6 w-6" />
                                <span className="text-xs">{item.title}</span>
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

function UserLayoutInner({ children, user }: UserLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const page = usePage();
    const currentPath = page.url;

    const getPageTitle = () => {
        const path = currentPath.split('?')[0];
        const allItems = [...mainNavItems, ...financeNavItems, ...cardsNavItems, ...moreNavItems];
        const item = allItems.find(i => path.startsWith(i.href) && i.href !== '/dashboard');
        return item?.title || 'Overview';
    };

    return (
        <SidebarProvider defaultOpen>
            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950">
                <UserSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <motion.div
                    initial={false}
                    animate={{ marginLeft: collapsed ? 64 : 240 }}
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

export default function UserLayout({ children, user }: UserLayoutProps) {
    const page = usePage();
    const { onboarding, user: pageUser } = page.props as {
        onboarding?: { completed: boolean; lastStep: number };
        user?: { id: string; first_name: string; kyc_verified?: boolean };
    };

    return (
        <TourProvider
            autoStart={!onboarding?.completed}
            initialStep={onboarding?.lastStep ?? 0}
        >
            <TourProgress />
            <TourWelcome />
            <TourComplete />
            <TourOverlay />
            <UserLayoutInner user={user}>
                {children}
            </UserLayoutInner>
        </TourProvider>
    );
}
