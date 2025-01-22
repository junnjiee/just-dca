import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { formatDateNoDay, formatPct } from "@/lib/utils";
import { useUserInput } from "@/contexts/user-input";
import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";
import { DcaReturnsQueryOutput } from "@/types/financial-queries";
import { InferArrayType } from "@/types/utils";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dcaPerformanceChartConfig = {
  stockPct: {
    label: "Stock Growth (%)",
  },
  profitPct: {
    label: "DCA Growth (%)",
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
            stockPct: row.stock_price / initialStockPrice - 1,
          },
        ];
      }
      return acc;
    },
    []
  );

  const trend =
    filteredData[filteredData.length - 1].profit > 0
      ? "positive"
      : filteredData[filteredData.length - 1].profit < 0
      ? "negative"
      : "neutral";

  const trendColor =
    trend === "positive"
      ? "#22c55e"
      : trend === "negative"
      ? "#ef4444"
      : "#a1a1aa";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-inherit">
          Investment Growth
        </CardTitle>
        <CardDescription className="text-sm font-normal text-muted-foreground">
          View your dollar-cost averaging growth relative to {userInput.ticker}
          's growth, from x to y
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex-col text-sm items-start gap-y-1">
        <p className="flex font-medium">
          Dollar-cost averaging generated a{" "}
          {(trend === "positive" || trend === "neutral") && <>growth</>}
          {trend === "negative" && <>loss</>} of{" "}
          {formatPct(Math.abs(filteredData[filteredData.length - 1].profitPct))}
          {trend === "positive" && <TrendingUpIcon className="ps-1 w-5 h-5" />}
          {trend === "negative" && (
            <TrendingDownIcon className="ps-1 w-5 h-5" />
          )}
        </p>
        <p>
          In the same period, {userInput.ticker}{" "}
          {(trend === "positive" || trend === "neutral") && <>grew</>}
          {trend === "negative" && <>fell</>} by{" "}
          {formatPct(Math.abs(filteredData[filteredData.length - 1].stockPct))}
        </p>
      </CardFooter>
    </Card>
  );
}
