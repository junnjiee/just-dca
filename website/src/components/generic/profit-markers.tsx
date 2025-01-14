import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ProfitPctBadgeProps = {
  profitPct: number;
  className?: string;
};

const getTrend = (amount: number) => {
  return amount > 0 ? "positive" : amount < 0 ? "negative" : "neutral";
};

export function ProfitPctBadge({ profitPct, className }: ProfitPctBadgeProps) {
  const trend = getTrend(profitPct);

  const profitPctFormatted = Math.abs(profitPct).toFixed(2) + "%";

  return (
    <div
      className={cn(
        "flex flex-row w-fit px-2 py-1 rounded-lg place-items-center",
        trend === "positive"
          ? "bg-green-100"
          : trend === "negative"
            ? "bg-red-100"
            : "bg-gray-100",
        trend === "positive"
          ? "text-green-800"
          : trend === "negative"
            ? "text-red-800"
            : "text-gray-500",
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
  const profitFormatted = profit.toFixed(2);

  return (
    <p
      className={cn(
        trend === "positive"
          ? "text-green-800"
          : trend === "negative"
            ? "text-red-800"
            : "text-gray-500",
        className
      )}
    >
      {trend === "positive" && "+"}
      {profitFormatted}
    </p>
  );
}
