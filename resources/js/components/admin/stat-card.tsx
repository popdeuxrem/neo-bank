import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

const cardVariants = cva(
  "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6",
  {
    variants: {
      color: {
        default: "text-white",
        indigo: "bg-indigo-500/10 text-indigo-400",
        emerald: "bg-emerald-500/10 text-emerald-400",
        amber: "bg-amber-500/10 text-amber-400",
        rose: "bg-rose-500/10 text-rose-400",
        blue: "bg-blue-500/10 text-blue-400",
        slate: "bg-slate-500/10 text-slate-400",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

interface StatCardProps
  extends VariantProps<typeof cardVariants> {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = "default",
  trend,
}: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      className={twMerge(cardVariants({ color }))}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold"
          >
            {value}
          </motion.p>
          {change !== undefined && (
            <div className={clsx("flex items-center gap-1 text-sm", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>{change > 0 ? "+" : ""}{change}%</span>
              {changeLabel && <span className="text-slate-500">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            color === "indigo" && "bg-indigo-500/20 text-indigo-400",
            color === "emerald" && "bg-emerald-500/20 text-emerald-400",
            color === "amber" && "bg-amber-500/20 text-amber-400",
            color === "rose" && "bg-rose-500/20 text-rose-400",
            color === "blue" && "bg-blue-500/20 text-blue-400",
            color === "slate" && "bg-slate-500/20 text-slate-400",
            color === "default" && "bg-white/10 text-white"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 h-1 opacity-50",
          color === "indigo" && "bg-indigo-500",
          color === "emerald" && "bg-emerald-500",
          color === "amber" && "bg-amber-500",
          color === "rose" && "bg-rose-500",
          color === "blue" && "bg-blue-500",
          color === "slate" && "bg-slate-500",
          color === "default" && "bg-white/20"
        )}
      />
    </motion.div>
  );
}
