import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { formatDateNoDay, formatNumber, formatPrice } from "@/lib/utils";

import { useUserInput } from "@/contexts/user-input";

import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { DcaReturnsQueryOutput } from "@/types/financial-queries";
import { InferArrayType } from "@/types/utils";

const dcaPerformanceChartConfig = {
  stockPct: {
    label: "Stock Growth",
  },
  profitPct: {
    label: "DCA Growth",
  },
} satisfies ChartConfig;

export function DcaVsStockChart() {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  type DcaReturnsQueryOutputMutated = InferArrayType<DcaReturnsQueryOutput> & {
    stockPct: number;
  };

  const firstNonPaddedRow = data.find((row) => !row.padded_row);
  const initialStockPrice = firstNonPaddedRow
    ? firstNonPaddedRow.stock_price
    : 0;

  // filter padded rows + create dca_price key
  const filteredData = data.reduce(
    (
      acc: DcaReturnsQueryOutputMutated[],
      row: InferArrayType<DcaReturnsQueryOutput>
    ) => {
      if (!row.padded_row) {
        return [
          ...acc,
          {
            ...row,
            stockPct: parseFloat(
              formatNumber(row.stock_price / initialStockPrice - 1)
            ),
          },
        ];
      }
      return acc;
    },
    []
  );

  const finalProfitPct = data[data.length - 1].profitPct;

  const trendColor =
    filteredData[filteredData.length - 1].profit > 0
      ? "#22c55e"
      : filteredData[filteredData.length - 1].profit < 0
      ? "#ef4444"
      : "#a1a1aa";

  return (
    <div>
      <ChartContainer config={dcaPerformanceChartConfig}>
        {/* recharts component */}
        <LineChart data={filteredData}>
          <Line dataKey="profitPct" stroke={trendColor} dot={false} />
          <Line dataKey="stockPct" stroke="#6b7280" dot={false} />

          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDateNoDay(new Date(value))}
          />
          <YAxis tickLine={false} axisLine={false} dx={-10} />
          <ChartTooltip
            content={<ChartTooltipContent className="w-[170px]" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
      <div className="text-sm ps-5 pt-3 space-y-2">
        <div className="flex font-medium">
          Your contributions{" "}
          {finalProfitPct > 0
            ? "grew by " + formatNumber(finalProfitPct) + "%"
            : finalProfitPct < 0
            ? "dipped by " + formatNumber(Math.abs(finalProfitPct)) + "%"
            : "stagnated"}
          {finalProfitPct > 0 ? (
            <TrendingUpIcon className="ps-1 w-5 h-5" />
          ) : finalProfitPct < 0 ? (
            <TrendingDownIcon className="ps-1 w-5 h-5" />
          ) : (
            <></>
          )}
        </div>
        <p>
          By investing {formatPrice(userInput.contri)} each month in{" "}
          <span className="font-medium">{userInput.ticker}</span> from{" "}
          {formatDateNoDay(new Date(filteredData[0].date))} to{" "}
          {formatDateNoDay(
            new Date(filteredData[filteredData.length - 1].date)
          )}
          .
        </p>
      </div>
    </div>
  );
}
