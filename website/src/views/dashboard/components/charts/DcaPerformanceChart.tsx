import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import {
  formatDate,
  formatDateNoDay,
  formatNumber,
  formatPrice,
} from "@/lib/utils";

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

  const totalValColor =
    filteredData[filteredData.length - 1].profit > 0
      ? "#22c55e"
      : filteredData[filteredData.length - 1].profit < 0
        ? "#ef4444"
        : "#a1a1aa";

  return (
    <div>
      <ChartContainer config={dcaPerformanceChartConfig}>
        {/* recharts component */}
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillTotalVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={totalValColor} stopOpacity={0.8} />
              <stop offset="75%" stopColor={totalValColor} stopOpacity={0} />
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
            stroke={totalValColor}
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
          {formatDate(new Date(filteredData[0].date))} to{" "}
          {formatDate(new Date(filteredData[filteredData.length - 1].date))}.
        </p>
      </div>
    </div>
  );
}
