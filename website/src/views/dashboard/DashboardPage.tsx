import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useUserInput } from "@/contexts/user-input";

import { useGetSuspendedStockInfo } from "@/queries/stock-info";

import { ErrorFallback } from "@/views/fallbacks/error";
import { LoadingFallback } from "@/views/fallbacks/loading";

import { DashboardForm } from "./components/DashboardForm";
import { ReturnsSummary } from "./components/ReturnsSummary";
import { DataCard } from "./components/DataCard";
import { ChartGroup } from "./components/charts/ChartGroup";
import { DcaReturnsTable } from "./components/DcaReturnsTable";

export function DashboardPage() {
  const userInput = useUserInput();

  return (
    <>
      <div className="my-5">
        <DashboardForm />
      </div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        resetKeys={[userInput.ticker, userInput.start, userInput.end]}
      >
        <Suspense fallback={<LoadingFallback />}>
          <NameBar ticker={userInput.ticker} />
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

type NameBarProps = {
  ticker: string;
};

function NameBar({ ticker }: NameBarProps) {
  const { data } = useGetSuspendedStockInfo(ticker);

  return (
    <div className="border-b pb-3 space-y-0.5 mb-3">
      <div className="text-2xl">{data.longName}</div>
    </div>
  );
}
