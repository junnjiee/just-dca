import { useUserInput } from "@/contexts/user-input";

import { TickerTrend } from "@/types/ticker";
import { useGetDcaReturns } from "@/queries/dca-returns";

import {
  TrendBadge,
  ProfitLossColored,
} from "@/components/generic/profit-markers";

export function ReturnsSummary() {
  const userInput = useUserInput();
  const { data, isSuccess } = useGetDcaReturns(userInput);

  const finalTotalVal = isSuccess ? "$" + data[data.length - 1].total_val : "";
  const finalProfit = isSuccess ? data[data.length - 1].profit.toFixed(2) : "";
  const finalProfitPct = isSuccess
    ? Math.abs(data[data.length - 1].profitPct).toFixed(2) + "%"
    : "";

  let trend: TickerTrend = "neutral";
  if (isSuccess && data.at(-1)?.profit) {
    trend =
      data.at(-1)!.profit! > 0
        ? "positive"
        : data.at(-1)!.profit! < 0
          ? "negative"
          : "neutral";
  }

  return (
    <div className="pb-2">
      <p>Net Investment Value &bull; (USD)</p>
      <div className="flex flex-col gap-y-2 md:flex-row md:gap-y-0 md:gap-x-6">
        <p className="text-4xl">{finalTotalVal}</p>
        <div className="flex flex-row gap-x-3 text-xl place-items-center">
          <TrendBadge profitPct={finalProfitPct} trend={trend} />
          <ProfitLossColored profitStr={finalProfit} trend={trend} />
        </div>
      </div>
    </div>
  );
}
