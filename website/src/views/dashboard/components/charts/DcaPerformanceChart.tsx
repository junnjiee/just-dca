import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";

import { formatDateNoDay } from "@/lib/utils";
import { useUserInput } from "@/contexts/user-input/context";
import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";
import { DcaReturnsQueryOutput } from "@/types/financial-queries";

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
  // const filteredData = data.filter((row) => !row.padded_row);

  const filteredData = data.reduce((acc: DcaReturnsQueryOutput, row) => {
    if (!row.padded_row) {
      return [
        ...acc,
        {
          ...row,
          total_val: parseFloat(row.total_val.toFixed(2)),
          date: formatDateNoDay(row.date, "numeric"),
        },
      ];
    }
    return acc;
  }, []);

  const trendColor =
    filteredData[filteredData.length - 1].profit > 0
      ? "#22c55e"
      : filteredData[filteredData.length - 1].profit < 0
        ? "#ef4444"
        : "#a1a1aa";

  return (
    <div>
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
          <XAxis dataKey="date" />
          <YAxis tickLine={false} axisLine={false} dx={-10} />
          <ChartTooltip
            content={<ChartTooltipContent className="w-[170px]" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
