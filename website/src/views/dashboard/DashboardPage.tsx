import { Suspense } from "react";

import { useUserInputStore } from "@/lib/stores";

// import { useGetDcaReturns } from "@/queries/dcaReturns";
import { useGetStockInfo } from "@/queries/stock-info";

import { DcaReturnsQueryInputSchema } from "@/schemas/financial-queries";

import { DashboardForm } from "./components/DashboardForm";
import { ReturnsSummary } from "./components/ReturnsSummary";
import { DataCard } from "./components/DataCard";
import { ChartGroup } from "./components/charts/ChartGroup";
import { DcaReturnsTable } from "./components/DcaReturnsTable";

// NOTE: check how to create fallback components
// NOTE: show error page if error occur in backend when retrieving data
export function DashboardPage() {
  const userInput = DcaReturnsQueryInputSchema.parse(useUserInputStore());

  // const { data, error, isError, isLoading, isSuccess } =
  //   useGetDcaReturns(userInput);

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
      <ReturnsSummary />
      <div className="flex flex-col mb-8 md:flex-row md:mb-3 gap-x-5">
        <div className="flex flex-col gap-y-5 md:basis-2/3">
          <ChartGroup key={userInput.ticker} />
        </div>
        <Suspense fallback={<Loading />}>
          <DataCard className="h-fit md:basis-1/3" />
        </Suspense>
      </div>
      {/* NOTE: export to excel? */}
      <DcaReturnsTable />
    </>
  );
}

function Loading() {
  return <div>Loading</div>;
}
