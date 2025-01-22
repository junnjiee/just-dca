import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { formatDateNoDay, formatPct, formatPrice } from "@/lib/utils";
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

const dcaPerformanceChartConfig = {
  total_val: {
    label: "Total Value",
  },
  contribution: {
    label: "Contribution",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function DcaPerformanceChart() {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);
  const filteredData = data.filter((row) => !row.padded_row);

  const finalProfitPct = data[data.length - 1].profitPct;

  const trendColor =
    filteredData[filteredData.length - 1].profit > 0
      ? "#22c55e"
      : filteredData[filteredData.length - 1].profit < 0
      ? "#ef4444"
      : "#a1a1aa";

  return (
    <div>
      <p className="font-medium text-lg ms-4 mb-5">Your DCA Performance</p>
      <ChartContainer
        config={dcaPerformanceChartConfig}
        className="md:aspect-[3/1]"
      >
        {/* recharts component */}
        <AreaChart data={filteredData} height={10}>
          <defs>
            <linearGradient id="fillTotalVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={trendColor} stopOpacity={0.8} />
              <stop offset="75%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>

            <linearGradient id="fillContribution" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-contribution)"
                stopOpacity={0.8}
              />
              <stop
                offset="75%"
                stopColor="var(--color-contribution)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <Area
            fillOpacity={0.3}
            dataKey="total_val"
            stroke={trendColor}
            fill="url(#fillTotalVal)"
          />
          <Area
            fillOpacity={0.3}
            dataKey="contribution"
            stroke="var(--color-contribution)"
            fill="url(#fillContribution)"
          />

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
        </AreaChart>
      </ChartContainer>

      <div className="text-sm ps-5 pt-3 space-y-2">
        <div className="flex font-medium">
          Your contributions{" "}
          {finalProfitPct > 0
            ? "grew by " + formatPct(finalProfitPct)
            : finalProfitPct < 0
            ? "dipped by " + formatPct(Math.abs(finalProfitPct))
            : "stagnated"}
          {finalProfitPct > 0 && <TrendingUpIcon className="ps-1 w-5 h-5" />}
          {finalProfitPct < 0 && <TrendingDownIcon className="ps-1 w-5 h-5" />}
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
