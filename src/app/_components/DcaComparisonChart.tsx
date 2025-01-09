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
import {
  dcaDataInputType,
  useGetMultipleDcaData,
} from "@/features/get-dca-data";

import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const lines = ["line1", "line2", "line3", "line4", "line5"];

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
  userInput: dcaDataInputType;
  tickers: string[];
  setTickers: React.Dispatch<React.SetStateAction<string[]>>;
};

export function DcaComparisonChart({
  userInput,
  tickers,
  setTickers,
}: MultiInvestmentChartProps) {
  const queryResults = useGetMultipleDcaData(
    tickers.map((ticker) => ({
      ...userInput,
      ticker: ticker,
    }))
  ).slice(0, 5);

  type HoverDataType = {
    ticker: string;
    totalVal: string;
    profit: string;
    profitPct: string;
  }[];

  const [hoverData, setHoverData] = useState<HoverDataType | null>(null);

  const defaultHoverData = queryResults.map((query, idx) => ({
    ticker: tickers[idx],
    totalVal: query.data?.at(-1)?.total_val,
    profit: query.data?.at(-1)?.profit,
    profitPct: query.data?.at(-1)?.profitPct,
  }));

  const hoverDataToRender = hoverData === null ? defaultHoverData : hoverData;

  return (
    <div>
      <ChartContainer config={multiInvestmentChartConfig}>
        <LineChart
          onMouseMove={(state) => {
            console.log(state);
            if (state.activePayload) {
              const newHoverData = state.activePayload.map((payloadData) => {
                return {
                  ticker: payloadData.name,
                  totalVal:
                    payloadData.value === null
                      ? 0
                      : payloadData.payload.total_val,
                  profit:
                    payloadData.value === null
                      ? "--"
                      : payloadData.payload.profit,
                  profitPct:
                    payloadData.value === null
                      ? "0.00%"
                      : payloadData.payload.profitPct,
                };
              });

              setHoverData(newHoverData);
            }
          }}
          onMouseLeave={() => setHoverData(null)}
        >
          <CartesianGrid vertical={false} />

          {queryResults.map((query, idx) => (
            <Line
              dataKey="total_val"
              data={query.data}
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
          <YAxis dataKey="total_val" axisLine={false} tickLine={false} />
          <Tooltip />
        </LineChart>
      </ChartContainer>

      {hoverDataToRender.map((data) => (
        <div
          key={data.ticker}
          className="flex flex-row py-3 justify-between place-items-center"
        >
          <span>{data.ticker}</span>
          <span>{data.totalVal}</span>
          <div className="flex flex-row gap-x-10 justify-self-end">
            <span>{data.profit}</span>
            <span>{data.profitPct}</span>
          </div>
          <Button
            disabled={userInput.ticker === data.ticker}
            className={cn(
              "p-0",
              userInput.ticker === data.ticker && "invisible"
            )}
            onClick={() =>
              setTickers((prev) =>
                prev.filter((ticker) => ticker !== data.ticker)
              )
            }
            variant="ghost"
            asChild
          >
            <XIcon className="cursor-pointer text-gray-600" size={30} />
          </Button>
        </div>
      ))}
    </div>
  );
}
