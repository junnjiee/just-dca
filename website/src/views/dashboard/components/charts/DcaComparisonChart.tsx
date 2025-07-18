import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { XIcon } from "lucide-react";

import { cn, formatPriceString, formatDateNoDay } from "@/lib/utils";

import { ComparisonChartExternalTooltip } from "@/types/chart";
import { useGetMultipleSuspendedDcaReturns } from "@/queries/dca-returns";

import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  ProfitPctBadge,
  ProfitAmtColored,
} from "@/components/generic/profit-markers";
import { useUserInput } from "@/contexts/user-input/context";

const colors = ["#a855f7", "#f59e0b", "#0ea5e9", "#1e3a8a", "#ea580c"];
const bgColors = [
  "bg-[#a855f7]",
  "bg-[#f59e0b]",
  "bg-[#0ea5e9]",
  "bg-[#1e3a8a]",
  "bg-[#ea580c]",
];

const multiInvestmentChartConfig = {
  line1: {},
  line2: {},
  line3: {},
  line4: {},
  line5: {},
} satisfies ChartConfig;

type MultiInvestmentChartProps = {
  tickers: string[];
  removeTicker: (ticker: string) => void;
};

export function DcaComparisonChart({
  tickers,
  removeTicker,
}: MultiInvestmentChartProps) {
  const userInput = useUserInput();
  const mainTicker = userInput.ticker;

  const queryResults = useGetMultipleSuspendedDcaReturns(
    tickers.map((ticker) => ({
      ...userInput,
      ticker: ticker,
    })),
  );

  const filteredQueryData = queryResults.map((query) =>
    query.data.map((row) =>
      row.padded_row
        ? {
            ...row,
            total_val: null,
            date: formatDateNoDay(row.date, "numeric"),
          }
        : { ...row, date: formatDateNoDay(row.date, "numeric") },
    ),
  );

  const defaultHoverData: ComparisonChartExternalTooltip =
    filteredQueryData.map((data, idx) => ({
      ticker: tickers[idx],
      totalVal: data[data.length - 1].total_val,
      profit: data[data.length - 1].profit,
      profitPct: data[data.length - 1].profitPct,
    }));

  const [hoverData, setHoverData] =
    useState<ComparisonChartExternalTooltip | null>(null);

  const hoverDataToRender: ComparisonChartExternalTooltip =
    hoverData === null ? defaultHoverData : hoverData;

  return (
    <div>
      <ChartContainer
        config={multiInvestmentChartConfig}
        className="md:aspect-[3/1]"
      >
        <LineChart
          onMouseMove={(state) => {
            if (state.activePayload) {
              const newHoverData: ComparisonChartExternalTooltip =
                state.activePayload.map((payloadData) => {
                  return {
                    ticker: payloadData.name,
                    totalVal: payloadData.payload.total_val,
                    profit: payloadData.payload.profit,
                    profitPct: payloadData.payload.profitPct,
                  };
                });

              setHoverData(newHoverData);
            }
          }}
          onMouseLeave={() => setHoverData(null)}
        >
          <CartesianGrid vertical={false} />

          {filteredQueryData.map((data, idx) => (
            <Line
              dataKey="total_val"
              data={data}
              name={tickers[idx]}
              key={tickers[idx]}
              type="monotone"
              stroke={colors[idx]}
              strokeWidth={2}
              dot={false}
            />
          ))}
          <XAxis
            dataKey="date"
            type="category"
            allowDuplicatedCategory={false}
          />
          <YAxis
            dataKey="total_val"
            axisLine={false}
            tickLine={false}
            dx={-20}
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ChartContainer>

      <div className="ms-3 mt-4">
        <div className="grid grid-cols-5 text-sm text-muted-foreground justify-items-center">
          <p className="invisible"></p>
          <p className="">Total Value</p>
          <p className="invisible"></p>
          <p className="">Profit</p>
          <p className="invisible"></p>
        </div>
        {hoverDataToRender.map((data, idx) => {
          const totalValFormatted = data.totalVal
            ? formatPriceString(data.totalVal)
            : "--";

          return (
            <div
              key={data.ticker}
              className="grid grid-cols-5 py-1.5 place-items-center border-b text-sm"
            >
              <div className="flex flex-row gap-x-2 justify-self-start">
                <div
                  className={cn("block w-1.5 h-100 rounded-lg", bgColors[idx])}
                >
                  {" "}
                </div>
                <p>{data.ticker}</p>
              </div>

              <p>{totalValFormatted}</p>
              <div className="invisible"></div>

              <div className="flex flex-row gap-x-7 place-items-center">
                <ProfitAmtColored
                  profit={data.profit}
                  className="hidden md:block"
                />
                <ProfitPctBadge profitPct={data.profitPct} />
              </div>

              <Button
                disabled={mainTicker === data.ticker}
                className={cn(
                  "p-0 justify-self-end",
                  mainTicker === data.ticker && "invisible",
                )}
                onClick={() => {
                  removeTicker(data.ticker);
                }}
                variant="ghost"
                asChild
              >
                <XIcon
                  className="cursor-pointer text-gray-600 rounded-full"
                  size={30}
                />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 space-y-1 border rounded-lg dark:bg-black">
        <p className="font-medium">{label}</p>
        {payload.map((data) => (
          <div className="flex flex-row items-center gap-x-1.5" key={data.name}>
            <div className={cn("w-1 h-3 rounded-sm", `bg-[${data.stroke}]`)}>
              {" "}
            </div>
            <p>{data.name}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
