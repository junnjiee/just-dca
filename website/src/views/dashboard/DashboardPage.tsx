import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useUserInput } from "@/contexts/user-input";

import { useGetStockInfo } from "@/queries/stock-info";

import { DashboardForm } from "./components/DashboardForm";
import { ReturnsSummary } from "./components/ReturnsSummary";
import { DataCard } from "./components/DataCard";
import { ChartGroup } from "./components/charts/ChartGroup";
import { DcaReturnsTable } from "./components/DcaReturnsTable";

// NOTE: check how to create fallback components
// NOTE: show error page if error occur in backend when retrieving data
export function DashboardPage() {
  const userInput = useUserInput();

  const { data: stockData, isSuccess: stockDataIsSuccess } = useGetStockInfo(
    userInput.ticker
  );

  return (
    <>
      <div className="my-5">
        <DashboardForm />
      </div>
      <ErrorBoundary
        fallback={<>error</>}
        resetKeys={[userInput.ticker, userInput.start, userInput.end]}
      >
        <Suspense fallback={<>loadin</>}>
          <div className="border-b pb-3 space-y-0.5 mb-3">
            {stockDataIsSuccess && (
              <div className="text-2xl">{stockData.longName}</div>
            )}
          </div>
          <div className="flex flex-col mb-8 md:flex-row md:mb-3 gap-x-5">
            <div className="md:basis-2/3">
              <ReturnsSummary />
              <ChartGroup key={userInput.ticker} />
            </div>
            <DataCard className="h-fit md:basis-1/3" />
          </div>
          {/* NOTE: export to excel? */}
          <DcaReturnsTable />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
