import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useUserInput } from '@/contexts/user-input';

import { useGetSuspendedStockInfo } from '@/queries/stock-info';

import { ErrorFallback } from '@/views/fallbacks/error';
import { LoadingFallback } from '@/views/fallbacks/loading';

import { DashboardForm } from './components/DashboardForm';
import { ReturnsSummary } from './components/ReturnsSummary';
import { DataCard } from './components/DataCard';
import { ChartGroup } from './components/charts/ChartGroup';
import { DcaReturnsTable } from './components/DcaReturnsTable';

export function DashboardPage() {
  const userInput = useUserInput();

  return (
    <>
      <DashboardForm className="mb-6 md:mb-0" />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        resetKeys={[userInput.ticker, userInput.start, userInput.end]}
      >
        <Suspense fallback={<LoadingFallback />}>
          <TickerName />
          <div className="flex flex-col mb-8 md:flex-row md:mb-3 gap-x-5">
            <div className="md:basis-2/3">
              <ReturnsSummary />
              <ChartGroup key={userInput.ticker} />
            </div>
            <DataCard className="h-fit md:basis-1/3" />
          </div>
          <DcaReturnsTable />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function TickerName() {
  const userInput = useUserInput();
  const { data } = useGetSuspendedStockInfo(userInput.ticker);

  return (
    <div className="border-b pb-3 space-y-0.5 mb-3">
      <div className="text-2xl">{data.longName}</div>
    </div>
  );
}
