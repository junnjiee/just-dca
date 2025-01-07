"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Area,
  AreaChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  dcaDataInputType,
  useGetMultipleDcaData,
  dcaDataOutputType,
} from "@/features/get-dca-data";
import { calculateProfitDetails } from "@/lib/utils";

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

const lines = ["line1", "line2", "line3", "line4", "line5"];

const multiInvestmentChartConfig = {
  line1: {
    label: "",
    color: "#a855f7",
  },
  line2: {
    label: "",
    color: "#f59e0b",
  },
  line3: {
    label: "",
    color: "#0ea5e9",
  },
  line4: {
    label: "",
    color: "#1e3a8a",
  },
  line5: {
    label: "",
    color: "#ea580c",
  },
} satisfies ChartConfig;

type MultiInvestmentChartProps = {
  userInput: dcaDataInputType;
  verifiedTickers: string[];
  setComparisonState: React.Dispatch<
    React.SetStateAction<{
      currInput: string;
      verifiedTickers: string[];
    }>
  >;
};

export function MultiInvestmentChart({
  userInput,
  verifiedTickers,
  setComparisonState,
}: MultiInvestmentChartProps) {
  const allTickers = [userInput.ticker, ...verifiedTickers];

  const queryResults = useGetMultipleDcaData(
    allTickers.map((ticker) => ({
      ...userInput,
      ticker: ticker,
    }))
  );
  const allQueriesReady = queryResults.every((query) => query.isSuccess);

  // default hoverData state is built using queryResults
  // hoverData state during tooltip hover is built using chart payload

  // during hover, state will be set to track payload data depending on hover position
  // when mouse leaves chart, state will be set to default data

  // during chart payload change, need to preserve all ticker data in the case payload does not contain all tickers
  const defaultHoverData = queryResults.map((query, idx) => {
    const profitDetails = calculateProfitDetails(
      // zod parse ensures these keys exist
      query.data?.at(-1)?.total_val!,
      query.data?.at(-1)?.contribution!
    );
    return {
      ticker: allTickers[idx],
      totalVal: query.data?.at(-1)?.total_val,
      profit: profitDetails.profitStr,
      profitPct: profitDetails.profitPct,
      trend: profitDetails.trend,
    };
  });

  type HoverDataType = {
    ticker: string;
    totalVal: number | null | undefined;
    profit: string;
    profitPct: string;
    trend: "positive" | "negative" | "neutral";
  }[];
  const [hoverData, setHoverData] = useState<HoverDataType>(defaultHoverData);

  // immediately render the default data if any of these dependencies change
  // NOTE: try make main page use useQueries hook to cache on first success
  useEffect(() => {
    setHoverData(defaultHoverData);
  }, [
    allQueriesReady,
    userInput.start,
    userInput.end,
    userInput.contri,
    verifiedTickers.length,
  ]);

  return (
    <div>
      {/* <ResponsiveContainer height={400}> */}
      <ChartContainer config={multiInvestmentChartConfig}>
        <LineChart
          onMouseMove={(state) => {
            console.log(state);
            if (state.activePayload) {
              const newHoverData = state.activePayload.map((payloadData) => {
                const { profitStr, profitPct, trend } = calculateProfitDetails(
                  payloadData.payload.total_val,
                  payloadData.payload.contribution
                );

                return {
                  ticker: payloadData.name,
                  totalVal:
                    payloadData.value === null
                      ? 0
                      : payloadData.payload.total_val,
                  profit: payloadData.value === null ? "--" : profitStr,
                  profitPct: payloadData.value === null ? "0.00%" : profitPct,
                  trend: payloadData.value === null ? "neutral" : trend,
                };
              });

              setHoverData(newHoverData);
            }
          }}
          onMouseLeave={() => setHoverData(defaultHoverData)}
        >
          <CartesianGrid vertical={false} />
          {/* <ChartTooltip cursor={false} content={<ChartTooltipContent />} /> */}
          {queryResults.map((query, idx) => (
            <Line
              dataKey="total_val"
              data={query.data}
              name={allTickers[idx]}
              key={allTickers[idx]}
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
      {/* </ResponsiveContainer> */}

      {hoverData.map((data) => (
        <div key={data.ticker} className="flex flex-row py-3 justify-between">
          <span>{data.ticker}</span>
          <span>{data.totalVal}</span>
          <div className="flex flex-row gap-x-10 justify-self-end">
            <span>{data.profit}</span>
            <span>{data.profitPct}</span>
          </div>
          <Button
            disabled={userInput.ticker == data.ticker}
            className={`w-5 ${userInput.ticker == data.ticker && "invisible"}`}
            onClick={() =>
              setComparisonState((prev) => ({
                ...prev,
                verifiedTickers: prev.verifiedTickers.filter(
                  (ticker) => ticker !== data.ticker
                ),
              }))
            }
          >
            X
          </Button>
        </div>
      ))}
    </div>
  );
}
