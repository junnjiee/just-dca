import { useUserInput } from "@/contexts/user-input";

import { formatPrice } from "@/lib/utils";

import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";

import {
  ProfitPctBadge,
  ProfitAmtColored,
} from "@/components/generic/profit-markers";

export function ReturnsSummary() {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  const finalTotalVal = formatPrice(data[data.length - 1].total_val);

  return (
    <div className="pb-2">
      <p className="text-sm">Net Investment Value &bull; (USD)</p>
      <div className="flex flex-col gap-y-2 md:flex-row md:gap-y-0 md:gap-x-6">
        <p className="text-4xl">{finalTotalVal}</p>
        <div className="flex flex-row gap-x-3 place-items-center text-base">
          <ProfitPctBadge profitPct={data[data.length - 1].profitPct} />
          <ProfitAmtColored profit={data[data.length - 1].profit} />
        </div>
      </div>
    </div>
  );
}
