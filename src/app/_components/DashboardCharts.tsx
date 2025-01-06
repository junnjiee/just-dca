"use client";

import { useEffect, useRef, useState } from "react";
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

  const paramsArr = allTickers.map((ticker) => ({
    ...userInput,
    ticker: ticker,
  }));
  const queryResults = useGetMultipleDcaData(paramsArr);

  const defaultHoverData = queryResults.map((query, idx) => {
    const profitDetails = calculateProfitDetails(
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
  const [hoverData, setHoverData] = useState(defaultHoverData);

  // check if all queries success, then update default hover data
  const allReady = useRef(false);
  allReady.current = queryResults.every((query) => query.isSuccess);
  console.log(allReady);

  useEffect(() => {
    setHoverData(defaultHoverData);
  }, [
    allReady.current,
    userInput.start,
    userInput.end,
    userInput.contri,
    verifiedTickers.length,
  ]);

  return (
    <div>
      <ChartContainer config={multiInvestmentChartConfig}>
        <LineChart
          onMouseMove={(state) => {
            if (state.activePayload) {
              const newHoverData = state.activePayload.map((data) => {
                const profitDetails = calculateProfitDetails(
                  data.payload.total_val,
                  data.payload.contribution
                );

                return {
                  ticker: String(data.name),
                  totalVal: data.payload.total_val,
                  profit: profitDetails.profitStr,
                  profitPct: profitDetails.profitPct,
                  trend: profitDetails.trend,
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
          <XAxis dataKey="date" allowDuplicatedCategory={false} />
          <YAxis dataKey="total_val" />
          <Tooltip />
        </LineChart>
      </ChartContainer>
      {hoverData.map((data) => (
        <div
          className="border-b flex flex-row justify-between"
          key={data.ticker}
        >
          {data.ticker}
          <div>{data.totalVal}</div>
          <div>{data.profit}</div>
          <Button
            onClick={() =>
              setComparisonState((prev) => ({
                ...prev,
                verifiedTickers: prev.verifiedTickers.filter(
                  (ticker) => ticker !== data.ticker
                ),
              }))
            }
          >
            Clear
          </Button>
        </div>
      ))}
    </div>
  );
}
