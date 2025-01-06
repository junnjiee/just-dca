import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createDate = (monthsToSubtract: number) => {
  const today = new Date();
  let monthsAgoDate = new Date();
  monthsAgoDate.setMonth(today.getMonth() - monthsToSubtract);

  return String(monthsAgoDate.getFullYear()).concat(
    "-",
    String(monthsAgoDate.getMonth() + 1).padStart(2, "0"),
    "-",
    String(monthsAgoDate.getDate()).padStart(2, "0")
  );
};

export const calculateProfitDetails = (
  totalVal: number,
  contri: number
): {
  profit: number;
  profitStr: string;
  profitPct: string;
  trend: "positive" | "negative" | "neutral";
} => {
  const profit = totalVal - contri;
  return {
    profit: profit,
    profitStr: `${profit > 0 ? "+" : ""}${profit.toFixed(2)}`,
    profitPct: `${((Math.abs(profit) / contri) * 100).toFixed(2)}%`,
    trend: profit > 0 ? "positive" : profit < 0 ? "negative" : "neutral",
  };
};
