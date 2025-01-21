import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

import { cn, formatPrice, formatPct } from "@/lib/utils";

type ProfitPctBadgeProps = {
  profitPct: number;
  className?: string;
};

const getTrend = (amount: number) => {
  return amount > 0 ? "positive" : amount < 0 ? "negative" : "neutral";
};

export function ProfitPctBadge({ profitPct, className }: ProfitPctBadgeProps) {
  const trend = getTrend(profitPct);

  const profitPctFormatted = formatPct(Math.abs(profitPct));

  return (
    <div
      className={cn(
        "flex flex-row w-fit px-1 py-0.5 rounded-lg place-items-center",
        trend === "positive"
          ? "bg-green-100 text-green-800 dark:bg-green-300 dark:text-green-900"
          : trend === "negative"
          ? "bg-red-100 text-red-800 dark:bg-red-300 dark:text-red-900"
          : "bg-gray-100 text-gray-500 dark:bg-gray-300 dark:text-gray-600",
        className
      )}
    >
      {trend === "positive" && <ArrowUpRight />}
      {trend === "negative" && <ArrowDownRight />}
      {trend === "neutral" && <ArrowRight />}
      {profitPctFormatted}
    </div>
  );
}

type ProfitAmtColoredProps = {
  profit: number;
  className?: string;
};

export function ProfitAmtColored({ profit, className }: ProfitAmtColoredProps) {
  const trend = getTrend(profit);

  return (
    <p
      className={cn(
        trend === "positive"
          ? "text-green-800 dark:text-green-600"
          : trend === "negative"
          ? "text-red-800 dark:text-red-600"
          : "text-gray-500 dark:text-gray-400",
        className
      )}
    >
      {trend === "positive" && "+"}
      {formatPrice(profit)}
    </p>
  );
}
