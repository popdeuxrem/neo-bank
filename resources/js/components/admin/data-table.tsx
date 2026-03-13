import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (item: T) => void;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyState,
  onRowClick,
  sortKey,
  sortOrder,
  onSort,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
}: DataTableProps<T>) {
  const skeletonRows = Array.from({ length: pageSize || 5 });

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={twMerge(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400",
                    column.sortable && "cursor-pointer hover:text-white",
                    column.className
                  )}
                  onClick={() => column.sortable && onSort?.(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <motion.span
                        animate={{ rotate: sortOrder === "desc" ? 180 : 0 }}
                        className="text-indigo-400"
                      >
                        ▼
                      </motion.span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading
              ? skeletonRows.map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((column) => (
                      <td key={column.key} className="whitespace-nowrap px-4 py-4">
                        <div className="h-4 w-24 rounded bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.length === 0
              ? emptyState || (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                          <span className="text-2xl">📭</span>
                        </div>
                        <p>No data available</p>
                      </div>
                    </td>
                  </tr>
                )
              : data.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={twMerge(
                      "group transition-colors hover:bg-white/5",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={twMerge(
                          "whitespace-nowrap px-4 py-4 text-sm text-slate-300",
                          column.className
                        )}
                      >
                        {column.render
                          ? column.render(item)
                          : String(item[column.key] ?? "-")}
                      </td>
                    ))}
                  </motion.tr>
                ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
