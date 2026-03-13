import * as React from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ButtonPrimary';
import { ButtonSecondary } from '../ButtonSecondary';
import { Menu, X } from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
}

interface NavbarProps {
    className?: string;
}

const navItems: NavItem[] = [
    { label: 'Products', href: '/#products' },
    { label: 'Company', href: '/#company' },
    { label: 'Developers', href: '/#developers' },
    { label: 'Pricing', href: '/#pricing' },
];

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 right-0 left-0 z-50 h-20 transition-all duration-300',
                isScrolled
                    ? 'border-b border-[var(--color-border-light)] bg-[var(--color-surface)]/80 backdrop-blur-xl'
                    : 'bg-transparent',
                className,
            )}
        >
            <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
                {/* Logo - col 1-3 */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]">
                        <span className="text-lg font-bold text-white">N</span>
                    </div>
                    <span className="text-xl font-bold text-[var(--color-text-primary)]">
                        NeoBank
                    </span>
                </Link>

                {/* Nav Menu - col 4-8 */}
                <div className="hidden lg:flex lg:gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Sign In & CTA - col 9-12 */}
                <div className="hidden lg:flex lg:items-center lg:gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                    >
                        Sign In
                    </Link>
                    <Link href="/register">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="flex h-10 w-10 items-center justify-center lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6 text-[var(--color-text-primary)]" />
                    ) : (
                        <Menu className="h-6 w-6 text-[var(--color-text-primary)]" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-[var(--color-border-light)] bg-[var(--color-surface)] px-6 py-4 lg:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-background)]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 pt-2">
                                <Link href="/login" className="w-full">
                                    <ButtonSecondary className="w-full">
                                        Sign In
                                    </ButtonSecondary>
                                </Link>
                                <Link href="/register" className="w-full">
                                    <Button className="w-full">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
