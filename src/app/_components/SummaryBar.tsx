import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUserInputStore } from "@/lib/stores";
import { trendColorBg, trendColorText } from "@/lib/styles";

import { TickerTrend } from "@/types/ticker";
import { useGetDcaReturns } from "@/queries/dcaReturns";

import { DcaReturnsQueryInputSchema } from "@/schemas/financialQueries";

export function SummaryBar() {
  const userInput = DcaReturnsQueryInputSchema.parse(useUserInputStore());
  const { data, isSuccess } = useGetDcaReturns(userInput);

  let trend: TickerTrend;
  if (isSuccess && data.at(-1)?.profit) {
    trend =
      data.at(-1)!.profit! > 0
        ? "positive"
        : data.at(-1)!.profit! < 0
        ? "negative"
        : "neutral";
  } else {
    trend = "neutral";
  }
  const finalTotalVal = isSuccess ? "$" + data[data.length - 1].total_val : "";
  const finalProfit = isSuccess ? data[data.length - 1].profit : "";
  const finalProfitPct = isSuccess ? data[data.length - 1].profitPct + "%" : "";

  return (
    <div className="pb-2">
      <p>Net Investment Value &bull; (USD)</p>
      <div className="flex flex-row gap-x-6">
        <p className="text-4xl">{finalTotalVal}</p>
        <div className="flex flex-row gap-x-3 text-xl place-items-center">
          <div
            className={cn(
              "flex flex-row p-1 rounded-lg place-items-center",
              trendColorBg[trend],
              trendColorText[trend]
            )}
          >
            {trend === "positive" && <ArrowUpRight />}
            {trend === "negative" && <ArrowDownRight />}
            {finalProfitPct}
          </div>
          <p className={trendColorText[trend]}>
            {trend === "positive" && "+"}
            {finalProfit}
          </p>
        </div>
      </div>
    </div>
  );
}
