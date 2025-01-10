"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUserInputStore } from "@/lib/stores";

import { useGetDcaReturns } from "@/queries/dcaReturns";
import { useGetStockInfo } from "@/queries/stockInfo";

import { DcaReturnsQueryInputSchema } from "@/schemas/financialQueries";

import { DateRangeTabs } from "./_components/DateRangeTabs";
import { DashboardForm } from "./_components/DashboardForm";
import { ChartGroup } from "./_components/ChartGroup";
import { DataCard } from "./_components/DataScreens";
import { DcaReturnsTable } from "./_components/DcaReturnsTable";

const trendColorBg = {
  positive: "bg-green-100",
  negative: "bg-red-100",
  neutral: "bg-grey-500",
};

const trendColorText = {
  positive: "text-green-800",
  negative: "text-red-800",
  neutral: "text-grey-500",
};
type trendType = "positive" | "negative" | "neutral";

// NOTE: check how to create fallback components
// NOTE: show error page if error occur in backend when retrieving data
export default function DashboardPage() {
  const userInput = DcaReturnsQueryInputSchema.parse(useUserInputStore());
  const ticker = useUserInputStore((state) => state.ticker);

  const { data, error, isError, isLoading, isSuccess } =
    useGetDcaReturns(userInput);

  const { data: stockData, isSuccess: stockDataIsSuccess } =
    useGetStockInfo(ticker);

  const isNullOrUndefined = (variable: string | number | null | undefined) => {
    return variable === null || variable === undefined;
  };

  let trend: trendType;
  if (isSuccess && !isNullOrUndefined(data.at(-1)?.profit)) {
    trend =
      data.at(-1)!.profit! > 0
        ? "positive"
        : data.at(-1)!.profit! < 0
        ? "negative"
        : "neutral";
  } else {
    trend = "neutral";
  }

  return (
    <>
      <div className="my-5">
        <DashboardForm />
      </div>
      <div className="border-b pb-3 space-y-0.5 mb-3">
        {stockDataIsSuccess ? (
          <div className="text-2xl">{stockData.longName}</div>
        ) : (
          <></>
        )}
      </div>
      {/* <SummaryCard trend={trend} total_val={data[data.length -1] } /> */}
      <div className="flex flex-row mb-3 gap-x-5">
        <div className="basis-2/3">
          <DateRangeTabs />
          <ChartGroup key={userInput.ticker} />
        </div>
        <DataCard data={isSuccess ? data : []} className="basis-1/3 h-fit" />
      </div>
      {/* NOTE: export to excel? */}
      <DcaReturnsTable />
    </>
  );
}

type SummaryCardProps = {
  trend: trendType;
  total_val: number;
  profit: number;
  profitPct: number;
};

function SummaryCard({
  trend,
  total_val,
  profit,
  profitPct,
}: SummaryCardProps) {
  return (
    <div className="pb-2">
      <p>Net Investment Value &bull; (USD)</p>
      <div className="flex flex-row gap-x-6">
        <p className="text-4xl">${total_val}</p>
        <div className="flex flex-row gap-x-3 text-xl place-items-center">
          <div
            className={cn(
              "flex flex-row p-1 rounded-lg place-items-center",
              trendColorBg[trend],
              trendColorText[trend]
            )}
          >
            {trend === "positive" && <ArrowUpRight />}
            {trend === "negative" && <ArrowDownRight />}
            {profitPct ? Math.abs(profitPct!) : ""}%
          </div>
          <p className={trendColorText[trend]}>
            {trend === "positive" && "+"}
            {profit ? profit : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
