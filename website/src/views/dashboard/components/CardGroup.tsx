import { Area, AreaChart, XAxis } from "recharts";

import { formatPrice, formatNumber, cn, formatDateNoDay } from "@/lib/utils";
import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";
import { useUserInput } from "@/contexts/user-input/context";
import { DcaReturnsQueryOutput } from "@/types/financial-queries";

import {
  ProfitAmtColored,
  ProfitPctBadge,
} from "@/components/generic/profit-markers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type CardGroupProps = {
  className?: string;
};

export function CardGroup({ className }: CardGroupProps) {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  const filteredData = data.filter((row) => !row.padded_row);

  const totalVal = formatPrice(data[data.length - 1].total_val);
  const contri = formatPrice(data[data.length - 1].contribution);
  const sharesOwned = formatNumber(data[data.length - 1].shares_owned);

  const avgSharesBought = formatNumber(
    data[data.length - 1].shares_owned / filteredData.length,
  );

  return (
    <div className={cn("grid gap-3 grid-cols-2 sm:grid-cols-3", className)}>
      <Card className="col-span-2 sm:col-span-1">
        <CardHeader>
          <CardTitle>Current Value</CardTitle>
          <CardDescription className="flex flex-row justify-between items-start">
            <div>
              <p>US{totalVal}</p>
              <ProfitAmtColored
                profit={data[data.length - 1].profit}
                className="text-sm font-normal"
              />
            </div>
            <ProfitPctBadge
              profitPct={data[data.length - 1].profitPct}
              className="text-sm font-normal"
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <SparkChart data={filteredData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Contribution</CardTitle>
          <CardDescription>US{contri}</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs mt-1">
          You invested {formatPrice(userInput.contri)}/month over{" "}
          {filteredData.length} months
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shares Owned</CardTitle>
          <CardDescription>{sharesOwned}</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs mt-1">
          You bought an average of {avgSharesBought} shares per month
        </CardContent>
      </Card>
    </div>
  );
}

const chartConfig = {
  profit: {
    label: "Profit",
  },
} satisfies ChartConfig;

type SparkChartProps = {
  data: DcaReturnsQueryOutput;
};

function SparkChart({ data }: SparkChartProps) {
  const trendColor =
    data[data.length - 1].profit > 0
      ? "#22c55e"
      : data[data.length - 1].profit < 0
        ? "#ef4444"
        : "#a1a1aa";

  const filteredData = data.map((row) => ({
    ...row,
    date: formatDateNoDay(row.date),
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-[4/1]">
      {/* recharts component */}
      <AreaChart data={filteredData}>
        <defs>
          <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={trendColor} stopOpacity={0.8} />
            <stop offset="75%" stopColor={trendColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        <Area
          fillOpacity={0.3}
          dataKey="profit"
          stroke={trendColor}
          fill="url(#profit)"
        />

        <XAxis dataKey="date" offset={0} tick={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
