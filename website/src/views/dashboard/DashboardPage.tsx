import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useUserInput } from "@/contexts/user-input";

import { useGetStockInfo } from "@/queries/stock-info";

import { ErrorFallback } from "@/views/fallbacks/error";
import { LoadingFallback } from "@/views/fallbacks/loading";

import { DashboardFormButton } from "./components/DashboardForm";
import { ChartGroup } from "./components/charts/ChartGroup";
import { DcaReturnsTable } from "./components/DcaReturnsTable";
import { CardGroup } from "./components/CardGroup";

export function DashboardPage() {
  const userInput = useUserInput();

  return (
    <>
      <div className="border-b pb-3 mb-3 flex flex-col-reverse gap-y-3 md:flex-row md:items-center md:justify-between">
        <DashboardHeader />
        <DashboardFormButton className="w-fit" />
      </div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        resetKeys={[userInput.ticker, userInput.start, userInput.end]}
      >
        <Suspense fallback={<LoadingFallback />}>
          <CardGroup className="mb-3" />
          <ChartGroup key={userInput.ticker} />
          <DcaReturnsTable />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function DashboardHeader() {
  const userInput = useUserInput();
  const { data, isSuccess } = useGetStockInfo(userInput.ticker);
  const tickerName = isSuccess ? data.longName : "";

  return (
    <div>
      <h1 className="text-2xl">{tickerName}</h1>
      <p className="text-muted-foreground text-sm">
        Ticker: {userInput.ticker}
      </p>
    </div>
  );
}
