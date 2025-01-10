"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { cn, createDate } from "@/lib/utils";

import { useGetDcaReturns } from "@/queries/dcaReturns";
import { useGetStockInfo } from "@/queries/stockInfo";

import {
  DcaReturnsQueryInput,
  DcaReturnsQueryOutputRow,
} from "@/types/financialQueries";

import { DataTable } from "@/components/data-table";
import { DateRangeTabs } from "./_components/DateRangeTabs";
import { DashboardForm } from "./_components/DashboardForm";
import { ChartGroup } from "./_components/ChartGroup";
import { DataCard } from "./_components/DataScreens";

const tableColumns: ColumnDef<DcaReturnsQueryOutputRow>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "stock_price", header: "Stock Price" },
  { accessorKey: "shares_bought", header: "Shares Bought" },
  { accessorKey: "shares_owned", header: "Shares Owned" },
  { accessorKey: "contribution", header: "Contribution" },
  { accessorKey: "total_val", header: "Total Value" },
  { accessorKey: "profit", header: "Profit" },
  { accessorKey: "profitPct", header: "Profit (%)" },
];

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
  // NOTE: ensure start date < end date
  const [userInput, setUserInput] = useState<DcaReturnsQueryInput>({
    ticker: "RDDT",
    contri: 50,
    start: createDate(12),
    end: createDate(0),
  });

  const { data, error, isError, isLoading, isSuccess } =
    useGetDcaReturns(userInput);

  const { data: stockData, isSuccess: stockDataIsSuccess } = useGetStockInfo(
    userInput.ticker
  );

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
        <DashboardForm userInput={userInput} setUserInput={setUserInput} />
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
          <DateRangeTabs userInput={userInput} setUserInput={setUserInput} />
          <ChartGroup userInput={userInput} key={userInput.ticker} />
        </div>
        <DataCard data={isSuccess ? data : []} className="basis-1/3 h-fit" />
      </div>
      {/* NOTE: export to excel? */}
      <DataTable columns={tableColumns} data={isSuccess ? data : []} />
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
