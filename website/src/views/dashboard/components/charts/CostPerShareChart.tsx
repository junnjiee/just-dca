import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { formatDateNoDay } from "@/lib/utils";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dcaPerformanceChartConfig = {
  stock_price: {
    label: "Share Price (at Open)",
  },
  dca_price: {
    label: "DCA Price",
  },
} satisfies ChartConfig;

export function CostPerShareChart() {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  type DcaReturnsQueryOutputMutated = InferArrayType<DcaReturnsQueryOutput> & {
    dca_price: number;
  };

  // filter padded rows + create dca_price key
  const filteredData = data.reduce(
    (
      acc: DcaReturnsQueryOutputMutated[],
      row: InferArrayType<DcaReturnsQueryOutput>
    ) => {
      if (!row.padded_row) {
        console.log(row.contribution / row.shares_owned);
        return [
          ...acc,
          {
            ...row,
            dca_price: parseFloat(
              (row.contribution / row.shares_owned).toFixed(2)
            ),
          },
        ];
      }
      return acc;
    },
    []
  );

  const trendColor =
    filteredData[filteredData.length - 1].profit > 0
      ? "#22c55e"
      : filteredData[filteredData.length - 1].profit < 0
      ? "#ef4444"
      : "#a1a1aa";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-inherit">
          Price per share
        </CardTitle>
        <CardDescription className="text-sm font-normal text-muted-foreground">
          DCA helps to smoothen price fluctuations. View how your dollar-cost
          averaged price evolved compared to the price of{" "}
          <span className="font-medium">{userInput.ticker}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={dcaPerformanceChartConfig}>
          {/* recharts component */}
          <LineChart data={filteredData}>
            <Line dataKey="dca_price" stroke={trendColor} dot={false} />
            <Line dataKey="stock_price" stroke="#6b7280" dot={false} />

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
    </Card>
  );
}
