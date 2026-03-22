'use client';

import { Link, usePage } from '@inertiajs/react';
import { clsx } from 'clsx';
import * as LucideIcons from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

const Icons = LucideIcons as Record<
    string,
    React.ComponentType<{ className?: string }>
>;

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

interface AdminSidebarProps {
    navigation: NavSection[];
    adminPrefix: string;
    currentPath: string;
    isOpen: boolean;
    onClose: () => void;
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

function isActive(href: string, currentPath: string, adminPrefix: string): boolean {
    const dashboardPath = `/${adminPrefix}`;
    if (href === dashboardPath) {
        return currentPath === dashboardPath;
    }
    return currentPath.startsWith(href);
}

function getBadgeStyles(badgeType?: string) {
    return clsx(
        'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
        badgeType === 'danger'
            ? 'bg-rose-500/20 text-rose-400'
            : badgeType === 'warning'
              ? 'bg-amber-500/20 text-amber-400'
              : badgeType === 'success'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-indigo-500/20 text-indigo-400'
    );
}

function SidebarItem({
    item,
    adminPrefix,
    currentPath,
}: {
    item: NavItem;
    adminPrefix: string;
    currentPath: string;
}) {
    const active = isActive(item.href, currentPath, adminPrefix);
    const hasChildren = item.children && item.children.length > 0;

    if (!hasChildren) {
        return (
            <Link
                href={item.href}
                className={clsx(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    active
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
            >
                <div className="flex items-center gap-3">
                    <IconComponent
                        name={item.icon}
                        className={clsx(
                            'h-5 w-5',
                            active ? 'text-indigo-400' : 'text-slate-500'
                        )}
                    />
                    <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                    <span className={getBadgeStyles(item.badgeType)}>
                        {item.badge}
                    </span>
                )}
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={clsx(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        active
                            ? 'bg-indigo-500/20 text-indigo-400'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <IconComponent
                            name={item.icon}
                            className={clsx(
                                'h-5 w-5',
                                active ? 'text-indigo-400' : 'text-slate-500'
                            )}
                        />
                        <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {item.badge !== undefined && item.badge > 0 && (
                            <span className={getBadgeStyles(item.badgeType)}>
                                {item.badge}
                            </span>
                        )}
                        <Icons.ChevronRight className="h-4 w-4 text-slate-500" />
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                sideOffset={8}
                className="min-w-[240px] bg-slate-900 border-slate-800 p-1"
                alignOffset={-5}
            >
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {item.label}
                </div>
                <DropdownMenuSeparator className="bg-slate-800" />
                {item.children?.map((child) => {
                    const childActive = isActive(child.href, currentPath, adminPrefix);
                    const hasGrandChildren = child.children && child.children.length > 0;

                    if (hasGrandChildren) {
                        return (
                            <DropdownMenuSub key={child.href}>
                                <DropdownMenuSubTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white">
                                    <div className="flex items-center gap-3">
                                        <IconComponent
                                            name={child.icon}
                                            className="h-4 w-4 text-slate-500"
                                        />
                                        <span>{child.label}</span>
                                    </div>
                                    <Icons.ChevronRight className="h-3 w-3 text-slate-500" />
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent
                                    sideOffset={8}
                                    className="min-w-[200px] bg-slate-900 border-slate-800 p-1"
                                >
                                    {child.children?.map((grandChild) => (
                                        <DropdownMenuItem key={grandChild.href} asChild>
                                            <Link
                                                href={grandChild.href}
                                                className={clsx(
                                                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer',
                                                    isActive(grandChild.href, currentPath, adminPrefix)
                                                        ? 'bg-indigo-500/20 text-indigo-400'
                                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                                )}
                                            >
                                                <IconComponent
                                                    name={grandChild.icon}
                                                    className="h-4 w-4"
                                                />
                                                <span>{grandChild.label}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        );
                    }

                    return (
                        <DropdownMenuItem key={child.href} asChild>
                            <Link
                                href={child.href}
                                className={clsx(
                                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer',
                                    childActive
                                        ? 'bg-indigo-500/20 text-indigo-400'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <IconComponent
                                    name={child.icon}
                                    className="h-4 w-4"
                                />
                                <span>{child.label}</span>
                                {child.badge !== undefined && child.badge > 0 && (
                                    <span className={clsx('ml-auto', getBadgeStyles(child.badgeType))}>
                                        {child.badge}
                                    </span>
                                )}
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function AdminSidebar({
    navigation,
    adminPrefix,
    currentPath,
    isOpen,
    onClose,
}: AdminSidebarProps) {
    return (
        <aside
            className={clsx(
                'fixed top-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r border-white/10 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300',
                isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
        >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <Link href={`/${adminPrefix}`} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                        <span className="text-lg font-bold text-white">M</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">Magnetiq</p>
                        <p className="text-xs text-slate-400">Admin Panel</p>
                    </div>
                </Link>
                <button
                    onClick={onClose}
                    className="rounded-lg p-2 hover:bg-white/5 lg:hidden"
                >
                    <Icons.X className="h-5 w-5 text-slate-400" />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
                {navigation.map((section) => (
                    <div key={section.title} className="mb-4">
                        <div className="px-3 py-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            {section.title}
                        </div>
                        <div className="mt-1 space-y-1">
                            {section.items.map((item) => (
                                <SidebarItem
                                    key={item.href}
                                    item={item}
                                    adminPrefix={adminPrefix}
                                    currentPath={currentPath}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
