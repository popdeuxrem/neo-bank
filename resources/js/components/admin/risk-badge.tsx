import { clsx } from "clsx";
import { motion } from "framer-motion";

interface RiskBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({ score, showLabel = true, size = "md" }: RiskBadgeProps) {
  const getRiskLevel = (score: number) => {
    if (score <= 30) {
return { level: "Low", color: "bg-emerald-500", textColor: "text-emerald-400", bgColor: "bg-emerald-500/10" };
}

    if (score <= 60) {
return { level: "Medium", color: "bg-amber-500", textColor: "text-amber-400", bgColor: "bg-amber-500/10" };
}

    return { level: "High", color: "bg-rose-500", textColor: "text-rose-400", bgColor: "bg-rose-500/10" };
  };

  const risk = getRiskLevel(score);
  const isHighRisk = score > 60;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full font-medium",
        risk.bgColor,
        risk.textColor,
        sizeClasses[size]
      )}
    >
      <span
        className={clsx(
          "h-2 w-2 rounded-full",
          risk.color,
          isHighRisk && "animate-pulse"
        )}
      />
      {showLabel && <span>{risk.level}</span>}
      <span className="opacity-75">({score})</span>
    </motion.div>
  );
}
