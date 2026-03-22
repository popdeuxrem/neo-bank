'use client';

import { useState } from 'react';
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

function NavItemWithDropdown({
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
            <DropdownMenuItem asChild>
                <Link
                    href={item.href}
                    className={clsx(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all cursor-pointer',
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
                        <span
                            className={clsx(
                                'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                                item.badgeType === 'danger'
                                    ? 'bg-rose-500/20 text-rose-400'
                                    : item.badgeType === 'warning'
                                      ? 'bg-amber-500/20 text-amber-400'
                                      : 'bg-indigo-500/20 text-indigo-400'
                            )}
                        >
                            {item.badge}
                        </span>
                    )}
                </Link>
            </DropdownMenuItem>
        );
    }

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger
                className={clsx(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all cursor-pointer',
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
                    <span
                        className={clsx(
                            'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold mr-2',
                            item.badgeType === 'danger'
                                ? 'bg-rose-500/20 text-rose-400'
                                : item.badgeType === 'warning'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-indigo-500/20 text-indigo-400'
                        )}
                    >
                        {item.badge}
                    </span>
                )}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="ml-2 min-w-[200px] bg-slate-900 border-slate-800">
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
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="ml-2 min-w-[180px] bg-slate-900 border-slate-800">
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
                                    <span
                                        className={clsx(
                                            'ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                                            child.badgeType === 'danger'
                                                ? 'bg-rose-500/20 text-rose-400'
                                                : child.badgeType === 'warning'
                                                  ? 'bg-amber-500/20 text-amber-400'
                                                  : 'bg-indigo-500/20 text-indigo-400'
                                        )}
                                    >
                                        {child.badge}
                                    </span>
                                )}
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}

function NavSectionGroup({
    section,
    adminPrefix,
    currentPath,
}: {
    section: NavSection;
    adminPrefix: string;
    currentPath: string;
}) {
    const [isOpen, setIsOpen] = useState(section.defaultOpen ?? true);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase"
            >
                <span>{section.title}</span>
                {isOpen ? (
                    <Icons.ChevronDown className="h-3 w-3" />
                ) : (
                    <Icons.ChevronRight className="h-3 w-3" />
                )}
            </button>
            {isOpen && (
                <div className="mt-1 space-y-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="hidden" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-900 border-slate-800" />
                    </DropdownMenu>
                    {section.items.map((item) => (
                        <NavItemWithDropdown
                            key={item.href}
                            item={item}
                            adminPrefix={adminPrefix}
                            currentPath={currentPath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminSidebar({
    navigation,
    adminPrefix,
    currentPath,
}: AdminSidebarProps) {
    return (
        <nav className="flex-1 overflow-y-auto p-4">
            {navigation.map((section) => (
                <NavSectionGroup
                    key={section.title}
                    section={section}
                    adminPrefix={adminPrefix}
                    currentPath={currentPath}
                />
            ))}
        </nav>
    );
}
