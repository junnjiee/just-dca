"use client";

import { CartesianGrid, Area, AreaChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useGetDCAData, dcaDataInputType } from "@/features/get-dca-data";

const chartConfig = {
  total_val: {
    label: "Investment Value",
    color: "#22c55e",
  },
  contribution: {
    label: "Contribution",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type LineChartProps = {
  userInput: dcaDataInputType;
  className?: string;
};

export function CustomLineChart({ userInput, className }: LineChartProps) {
  const { data, error, isError, isLoading } = useGetDCAData(userInput);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Line Chart - Linear</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
                  offset="70%"
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
                  offset="70%"
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
              type="linear"
            />
            <Area
              fillOpacity={0.3}
              dataKey="contribution"
              stroke="var(--color-contribution)"
              fill="url(#fillContribution)"
              type="linear"
            />

            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
