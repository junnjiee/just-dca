import { TickerTrend } from "@/types/ticker";

export const trendColorBg: Record<TickerTrend, string> = {
  positive: "bg-green-100",
  negative: "bg-red-100",
  neutral: "bg-grey-500",
};

export const trendColorText: Record<TickerTrend, string> = {
  positive: "text-green-800",
  negative: "text-red-800",
  neutral: "text-grey-500",
};
