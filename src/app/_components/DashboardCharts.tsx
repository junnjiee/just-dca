"use client";

import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";

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
import { dcaDataOutputType } from "@/features/get-dca-data";

const investmentChartConfig = {
  total_val: {
    label: "Investment Value",
    color: "#22c55e",
  },
  contribution: {
    label: "Contribution",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type ChartProps = {
  data: dcaDataOutputType;
  className?: string;
};

export function InvestmentChart({ data, className }: ChartProps) {
  return (
    <ChartContainer config={investmentChartConfig}>
      {/* recharts component */}
      <AreaChart data={data} syncId={"w"}>
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
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickCount={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

// export function MultiInvestmentChart({mainData, new}) {
// return ()
// }

const stockChartConfig = {
  stock_price: {
    label: "Price",
    color: "#22c55e",
  },
} satisfies ChartConfig;

export function StockChart({ data, className }: ChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ticker Performance</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={stockChartConfig}>
          {/* recharts component */}
          <AreaChart data={data} syncId={"w"}>
            <defs>
              <linearGradient id="fillStockPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-stock_price)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="75%"
                  stopColor="var(--color-stock_price)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <Area
              fillOpacity={0.3}
              dataKey="stock_price"
              stroke="var(--color-stock_price)"
              fill="url(#fillStockPrice)"
            />

            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickCount={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
