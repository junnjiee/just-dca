"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import {
  dcaDataInputType,
  dcaDataOutputRowType,
  useGetDcaData,
} from "@/features/get-dca-data";
import { createDate } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { DashboardForm } from "./_components/DashboardForm";
import {
  InvestmentChart,
  MultiInvestmentChart,
} from "./_components/DashboardCharts";
import { TickerInfoCard, DataCard } from "./_components/DataScreens";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tableColumns: ColumnDef<dcaDataOutputRowType>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "stock_price", header: "Stock Price" },
  { accessorKey: "shares_bought", header: "Shares Bought" },
  { accessorKey: "shares_owned", header: "Shares Owned" },
  { accessorKey: "contribution", header: "Contribution" },
  { accessorKey: "total_val", header: "Total Value" },
];

// NOTE: check how to create fallback components
// NOTE: show error page if error occur in backend when retrieving data
export default function DashboardPage() {
  // NOTE: ensure start date < end date
  const [userInput, setUserInput] = useState<dcaDataInputType>({
    ticker: "RDDT",
    contri: 50,
    start: createDate(12),
    end: createDate(0),
  });

  const { data, error, isError, isLoading, isSuccess } =
    useGetDcaData(userInput);

  const [comparisonState, setComparisonState] = useState<{
    currInput: string;
    verifiedTickers: string[];
  }>({
    currInput: "",
    verifiedTickers: [],
  });
  console.log(comparisonState);

  // cached results are returned, even when auto refetching is disabled, so success/error
  // booleans will be activated when the cached keys matches input
  const {
    error: newTickerQueryError,
    fetchStatus,
    isSuccess: newTickerQueryIsSuccess,
    isError: newTickerQueryIsError,
    refetch,
  } = useGetDcaData(
    {
      ...userInput,
      ticker: comparisonState.currInput,
    },
    false
  );

  // reset comparisonState everytime userInput ticker changes
  useEffect(() => {
    console.log("CHANGE DETECTED");
    setComparisonState({
      currInput: "",
      verifiedTickers: [],
    });
  }, [userInput.ticker]);

  // for updating verifiedTickers array in comparisonState
  useEffect(() => {
    console.log("ACTIVATE");
    // checks done
    // 1. successful query 2. ticker not in verified array 3. input ticker is not main ticker
    if (
      newTickerQueryIsSuccess &&
      comparisonState.verifiedTickers.find(
        (element) => element === comparisonState.currInput.toUpperCase()
      ) === undefined &&
      comparisonState.currInput.toUpperCase() !== userInput.ticker
    ) {
      console.log("SUCCESS");

      // max 4 tickers only
      setComparisonState((prev) => ({
        verifiedTickers:
          prev.verifiedTickers.length < 4
            ? [...prev.verifiedTickers, prev.currInput.toUpperCase()]
            : [
                ...prev.verifiedTickers.slice(0, 3),
                prev.currInput.toUpperCase(),
              ],
        currInput: "",
      }));
    }
  }, [fetchStatus]);

  // needed for toast
  // NOTE: toast is buggy
  useEffect(() => {
    if (isLoading) {
      // hacky way to ensure that toast transitions are smooth if user submits another form
      // when the toast is still shown
      // NOTE: toast does not load when submit is immediately clicked during disappearing animation
      console.log("LOAD");
      toast.update(1, {
        render: "Generating Dashboard",
        isLoading: true,
      });
      toast.loading("Generating Dashboard", {
        position: "top-center",
        toastId: 1,
      });
    } else if (isSuccess) {
      console.log("GOOD");
      toast.update(1, {
        render: "Generated",
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });
    } else if (isError) {
      toast.update(1, {
        render: error.message,
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
    }
  }, [isLoading]);

  return (
    <>
      <div className="my-5">
        <DashboardForm userInput={userInput} setUserInput={setUserInput} />
      </div>
      <TickerInfoCard ticker={userInput.ticker} className="mb-3" />
      <div className="flex flex-row gap-x-4 mb-3">
        <div className="basis-2/3">
          <div>
            <div className="pb-2">
              <span>Net Investment Value &bull; (USD)</span>
              <div className="flex flex-row">
                <span className="text-3xl">${data?.at(-1)?.total_val}</span>
              </div>
            </div>
            <DateRangeTabs userInput={userInput} setUserInput={setUserInput} />
            {comparisonState.verifiedTickers.length ? (
              <MultiInvestmentChart
                userInput={userInput}
                verifiedTickers={comparisonState.verifiedTickers}
                setComparisonState={setComparisonState}
              />
            ) : (
              <InvestmentChart data={isSuccess ? data : []} />
            )}
          </div>
          {/* comparison input */}
          <div>
            <Input
              value={comparisonState.currInput}
              onChange={(e) =>
                setComparisonState((prev) => ({
                  ...prev,
                  currInput: e.target.value,
                }))
              }
            />
            <Button
              onClick={() => {
                refetch();
              }}
            >
              Add Comparison
            </Button>
            {newTickerQueryIsError && (
              <span className="text-red-500">
                {newTickerQueryError.message}
              </span>
            )}
            {comparisonState.verifiedTickers.length ? (
              <Button
                onClick={() =>
                  setComparisonState((prev) => ({
                    ...prev,
                    verifiedTickers: [],
                  }))
                }
              >
                Clear All
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* <StockChart data={isSuccess ? data : []} className="basis-1/2" /> */}
        <DataCard data={isSuccess ? data : []} className="basis-1/3" />
      </div>
      {/* NOTE: export to excel? */}
      <DataTable columns={tableColumns} data={isSuccess ? data : []} />
    </>
  );
}

type DateRangeTabsProps = {
  userInput: dcaDataInputType;
  setUserInput: React.Dispatch<React.SetStateAction<dcaDataInputType>>;
};

function DateRangeTabs({ userInput, setUserInput }: DateRangeTabsProps) {
  // NOTE: can memoize this
  const datePresets = [
    { dateRange: "3M", start: createDate(3), end: createDate(0) },
    { dateRange: "6M", start: createDate(6), end: createDate(0) },
    { dateRange: "YTD", start: createDate(12), end: createDate(0) },
    { dateRange: "3Y", start: createDate(36), end: createDate(0) },
    { dateRange: "5Y", start: createDate(60), end: createDate(0) },
    { dateRange: "10Y", start: createDate(120), end: createDate(0) },
  ];

  // if date chosen matches preset, select that tab
  const chosenPreset = () => {
    const preset = datePresets.find(
      (preset) => userInput.start == preset.start && userInput.end == preset.end
    )?.dateRange;

    return preset ? preset : "";
  };

  return (
    <Tabs value={chosenPreset()}>
      <TabsList>
        {datePresets.map((preset) => (
          <TabsTrigger
            key={preset.dateRange}
            value={preset.dateRange}
            onClick={() =>
              setUserInput((prev) => ({
                ...prev,
                start: preset.start,
                end: preset.end,
              }))
            }
          >
            {preset.dateRange}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
