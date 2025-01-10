"use client";

import { useUserInputStore } from "@/lib/stores";

import { useGetDcaReturns } from "@/queries/dcaReturns";
import { useGetStockInfo } from "@/queries/stockInfo";

import { DcaReturnsQueryInputSchema } from "@/schemas/financialQueries";

import { DashboardForm } from "./_components/DashboardForm";
import { SummaryBar } from "./_components/SummaryBar";
import { DateRangeTabs } from "./_components/DateRangeTabs";
import { DataCard } from "./_components/DataScreens";
import { ChartGroup } from "./_components/ChartGroup";
import { DcaReturnsTable } from "./_components/DcaReturnsTable";

// NOTE: check how to create fallback components
// NOTE: show error page if error occur in backend when retrieving data
export default function DashboardPage() {
  const userInput = DcaReturnsQueryInputSchema.parse(useUserInputStore());

  const { data, error, isError, isLoading, isSuccess } =
    useGetDcaReturns(userInput);

  const { data: stockData, isSuccess: stockDataIsSuccess } = useGetStockInfo(
    userInput.ticker
  );

  return (
    <>
      <div className="my-5">
        <DashboardForm />
      </div>
      <div className="border-b pb-3 space-y-0.5 mb-3">
        {stockDataIsSuccess && (
          <div className="text-2xl">{stockData.longName}</div>
        )}
      </div>
      <SummaryBar />
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
