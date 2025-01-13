"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUserInputStore } from "@/lib/stores";

import { TickerTrend } from "@/types/ticker";
import { ComparisonChartExternalTooltip } from "@/types/chart";
import { useGetMultipleDcaReturns } from "@/queries/dca-returns";

import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  TrendBadge,
  ProfitLossColored,
} from "@/components/generic/profit-markers";

const lines = ["line1", "line2", "line3", "line4", "line5"];

const lineColors = [
  "bg-[#a855f7]",
  "bg-[#f59e0b]",
  "bg-[#0ea5e9]",
  "bg-[#1e3a8a]",
  "bg-[#ea580c]",
];

const multiInvestmentChartConfig = {
  line1: {
    color: "#a855f7",
  },
  line2: {
    color: "#f59e0b",
  },
  line3: {
    color: "#0ea5e9",
  },
  line4: {
    color: "#1e3a8a",
  },
  line5: {
    color: "#ea580c",
  },
} satisfies ChartConfig;

type MultiInvestmentChartProps = {
  tickers: string[];
  removeTicker: (ticker: string) => void;
};

export function DcaComparisonChart({
  tickers,
  removeTicker,
}: MultiInvestmentChartProps) {
  const mainTicker = useUserInputStore((state) => state.ticker);
  const incompleteUserInput = {
    contri: useUserInputStore((state) => state.contri),
    start: useUserInputStore((state) => state.start),
    end: useUserInputStore((state) => state.end),
  };
  const queryResults = useGetMultipleDcaReturns(
    tickers.map((ticker) => ({
      ...incompleteUserInput,
      ticker: ticker,
    }))
  );
  const allSuccess = queryResults.every((query) => query.isSuccess);

  const filteredQueryData = allSuccess
    ? queryResults.map((query) =>
        query.data.map((row) =>
          row.padded_row ? { ...row, total_val: null } : row
        )
      )
    : [];

  const defaultHoverData: ComparisonChartExternalTooltip = allSuccess
    ? filteredQueryData.map((data, idx) => ({
        ticker: tickers[idx],
        totalVal: data[data.length - 1].total_val,
        profit: data[data.length - 1].profit,
        profitPct: data[data.length - 1].profitPct,
      }))
    : [];

  const [hoverData, setHoverData] =
    useState<ComparisonChartExternalTooltip | null>(null);

  const hoverDataToRender: ComparisonChartExternalTooltip =
    hoverData === null ? defaultHoverData : hoverData;

  return (
    <div>
      <ChartContainer config={multiInvestmentChartConfig}>
        <LineChart
          onMouseMove={(state) => {
            console.log(state);
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
              stroke={`var(--color-${lines[idx]})`}
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
            dx={-10}
          />
          <Tooltip />
        </LineChart>
      </ChartContainer>

      {hoverDataToRender.map((data, idx) => {
        const trend: TickerTrend =
          data.profit > 0
            ? "positive"
            : data.profit < 0
            ? "negative"
            : "neutral";

        return (
          <div
            key={data.ticker}
            className="flex flex-row py-3 justify-between place-items-center border-b"
          >
            <div className="flex flex-row gap-x-2">
              <div
                className={cn(
                  "block w-1.5 h-100 rounded-lg bg-red-500 ",
                  lineColors[idx]
                )}
              >
                {" "}
              </div>
              <p>{data.ticker}</p>
            </div>
            <p>{data.totalVal === null ? "--" : data.totalVal}</p>
            <div className="flex flex-row gap-x-7 place-items-center">
              <ProfitLossColored
                profitStr={
                  data.totalVal === null ? "--" : data.profit.toFixed(2)
                }
                trend={trend}
                className="hidden md:block"
              />
              <TrendBadge
                profitPct={Math.abs(data.profitPct).toFixed(2) + "%"}
                trend={trend}
              />
              <Button
                disabled={mainTicker === data.ticker}
                className={cn("p-0", mainTicker === data.ticker && "invisible")}
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
          </div>
        );
      })}
    </div>
  );
}
