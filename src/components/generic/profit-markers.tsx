import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { TickerTrend } from "@/types/ticker";

type ProfitMarkerProps = {
  trend: TickerTrend;
  profitPct: string;
};

export function TrendBadge({ profitPct, trend }: ProfitMarkerProps) {
  return (
    <div
      className={cn(
        "flex flex-row p-1 rounded-lg place-items-center",
        trend === "positive"
          ? "bg-green-100"
          : trend === "negative"
          ? "bg-red-100"
          : "bg-gray-100",
        trend === "positive"
          ? "text-green-800"
          : trend === "negative"
          ? "text-red-800"
          : "text-gray-500"
      )}
    >
      {trend === "positive" && <ArrowUpRight />}
      {trend === "negative" && <ArrowDownRight />}
      {trend === "neutral" && <ArrowRight />}
      {profitPct}
    </div>
  );
}

type ProfitLossColoredProps = {
  trend: TickerTrend;
  profitStr: string;
  className?: string;
};

export function ProfitLossColored({
  trend,
  profitStr,
  className,
}: ProfitLossColoredProps) {
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
      {profitStr}
    </p>
  );
}
