"use client";

import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";

import { useUserInputStore } from "@/lib/stores";

import { useGetDcaReturns } from "@/queries/dcaReturns";

import { DcaReturnsQueryInputSchema } from "@/schemas/financialQueries";

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
    label: "Investment Value",
    color: "#22c55e",
  },
  contribution: {
    label: "Contribution",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function DcaPerformanceChart() {
  const userInput = DcaReturnsQueryInputSchema.parse(useUserInputStore());
  const { data: queryData, isSuccess } = useGetDcaReturns(userInput);
  const data = isSuccess ? queryData.filter((row) => !row.padded_row) : [];

  return (
    <ChartContainer config={dcaPerformanceChartConfig}>
      {/* recharts component */}
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillTotalVal" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-total_val)"
              stopOpacity={0.8}
            />
            <stop
              offset="75%"
              stopColor="var(--color-total_val)"
              stopOpacity={0}
            />
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
          stroke="var(--color-total_val)"
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
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
