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
import { XIcon } from "lucide-react";

import {
  dcaDataInputType,
  useGetMultipleDcaData,
  dcaDataOutputType,
} from "@/features/get-dca-data";
import { calculateProfitDetails } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

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

export function DcaComparisonChart({
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
    allQueriesReady, // ensure that is updated value
    // userInput.start,
    // userInput.end,
    // userInput.contri,
    // verifiedTickers.length,
  ]);

  return (
    <div>
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

      {hoverData.map((data) => (
        <div key={data.ticker} className="flex flex-row py-3 justify-between place-items-center">
          <span>{data.ticker}</span>
          <span>{data.totalVal}</span>
          <div className="flex flex-row gap-x-10 justify-self-end">
            <span>{data.profit}</span>
            <span>{data.profitPct}</span>
          </div>
          <Button
            disabled={userInput.ticker === data.ticker}
            className={`p-0 ${userInput.ticker === data.ticker && "invisible"}`}
            onClick={() =>
              setComparisonState((prev) => ({
                ...prev,
                verifiedTickers: prev.verifiedTickers.filter(
                  (ticker) => ticker !== data.ticker
                ),
              }))
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
