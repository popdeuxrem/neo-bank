import { cn } from '@/lib/utils';
import { Skeleton as BaseSkeleton } from './skeleton';

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6', className)}>
      <div className="flex items-center justify-between">
        <BaseSkeleton className="h-4 w-24" />
        <BaseSkeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="mt-4">
        <BaseSkeleton className="h-8 w-32" />
      </div>
      <div className="mt-2">
        <BaseSkeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

function TransactionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-between rounded-lg p-4', className)}>
      <div className="flex items-center gap-4">
        <BaseSkeleton className="h-10 w-10 rounded-full" />
        <div>
          <BaseSkeleton className="h-4 w-32 mb-2" />
          <BaseSkeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="text-right">
        <BaseSkeleton className="h-4 w-20 mb-2" />
        <BaseSkeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6', className)}>
      <BaseSkeleton className="h-6 w-40 mb-6" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <BaseSkeleton className="h-3 w-16" />
              <BaseSkeleton className="h-3 w-12" />
            </div>
            <BaseSkeleton className="h-2 w-full" style={{ width: `${60 + i * 8}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BalanceCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f35] to-[#0d1117] p-6 text-white',
      className
    )}>
      <div className="flex items-center justify-between mb-8">
        <BaseSkeleton className="h-4 w-24 bg-white/20" />
        <BaseSkeleton className="h-10 w-16 rounded-lg bg-white/20" />
      </div>
      <BaseSkeleton className="h-4 w-20 bg-white/20 mb-2" />
      <BaseSkeleton className="h-10 w-40 bg-white/20" />
    </div>
  );
}

function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <BaseSkeleton className="h-4 w-20 mb-2" />
          <BaseSkeleton className="h-8 w-24" />
          <BaseSkeleton className="h-3 w-16 mt-2" />
        </div>
        <BaseSkeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}

function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-[var(--color-border-light)]">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="py-4">
          <BaseSkeleton className="h-4" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export {
  BaseSkeleton,
  CardSkeleton,
  TransactionSkeleton,
  ChartSkeleton,
  BalanceCardSkeleton,
  StatCardSkeleton,
  TableRowSkeleton,
};
