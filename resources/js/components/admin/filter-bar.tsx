import { clsx } from "clsx";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4 flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-600">/</span>}
              {item.href ? (
                <a
                  href={item.href}
                  className="text-slate-400 transition-colors hover:text-indigo-400"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-slate-300">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-slate-400">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </motion.div>
  );
}

interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  activeCount?: number;
}

export function FilterBar({ children, onClear, activeCount = 0 }: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
    >
      <div className="flex flex-wrap items-center gap-4 flex-1">{children}</div>
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-sm text-rose-400 transition-colors hover:bg-rose-500/30"
        >
          <X className="h-3 w-3" />
          Clear ({activeCount})
        </button>
      )}
    </motion.div>
  );
}

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function FilterInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: FilterInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={clsx(
        "rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none",
        className
      )}
    />
  );
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterBadge({ label, value, onRemove }: FilterBadgeProps) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-300">
      <span className="text-slate-400">{label}:</span>
      <span className="font-medium">{value}</span>
      <button
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-indigo-500/30"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
