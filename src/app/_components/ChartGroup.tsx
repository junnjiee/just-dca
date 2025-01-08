"use client";

import { useState, useEffect } from "react";
import { SearchIcon, PlusIcon, Loader2, XIcon } from "lucide-react";

import { dcaDataInputType, useGetDcaData } from "@/features/get-dca-data";

import { DcaPerformanceChart } from "./DcaPerformanceChart";
import { DcaComparisonChart } from "./DcaComparisonChart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ChartGroupProps = {
  userInput: dcaDataInputType;
};

type ComparisonType = {
  currInput: string;
  verifiedTickers: string[];
};

export function ChartGroup({ userInput }: ChartGroupProps) {
  const [comparisonState, setComparisonState] = useState<ComparisonType>({
    currInput: "",
    verifiedTickers: [],
  });
  console.log(comparisonState);

  return (
    <>
      {comparisonState.verifiedTickers.length ? (
        <DcaComparisonChart
          userInput={userInput}
          verifiedTickers={comparisonState.verifiedTickers}
          setComparisonState={setComparisonState}
          key={`${userInput.start}${userInput.end}${userInput.contri}${comparisonState.verifiedTickers.length}`}
        />
      ) : (
        <DcaPerformanceChart userInput={userInput} />
      )}
      <ComparisonInputButton
        userInput={userInput}
        comparisonState={comparisonState}
        setComparisonState={setComparisonState}
      />
    </>
  );
}

type ComparisonInputButtonProps = {
  userInput: dcaDataInputType;
  comparisonState: ComparisonType;
  setComparisonState: React.Dispatch<React.SetStateAction<ComparisonType>>;
};

function ComparisonInputButton({
  userInput,
  comparisonState,
  setComparisonState,
}: ComparisonInputButtonProps) {
  const [openInput, setOpenInput] = useState(false);

  // cached results are returned, even when auto refetching is disabled, so success/error
  // booleans will be activated when the cached keys matches input
  const { error, fetchStatus, isLoading, isSuccess, isError, refetch } =
    useGetDcaData(
      {
        ...userInput,
        ticker: comparisonState.currInput,
      },
      false
    );

  // for updating verifiedTickers array in comparisonState
  useEffect(() => {
    console.log("ACTIVATE");
    // checks done
    // 1. successful query 2. ticker not in verified array 3. input ticker is not main ticker
    if (
      isSuccess &&
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

      setOpenInput(false);
    }
  }, [fetchStatus]);

  return (
    <>
      <div className="flex flex-row justify-between">
        {openInput ? (
          <div className="flex flex-row gap-x-3">
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
              disabled={
                !comparisonState.currInput.length || isError || isLoading
              }
              onClick={() => {
                refetch();
              }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Add"}
            </Button>
            <Button
              variant="ghost"
              className="p-0"
              asChild
              onClick={() => {
                setOpenInput(false);
                setComparisonState((prev) => ({ ...prev, currInput: "" }));
              }}
            >
              <XIcon className="cursor-pointer text-gray-600" size={45} />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setOpenInput(true)}>
            {comparisonState.verifiedTickers.length ? (
              <>
                <PlusIcon />
                Add Comparison
              </>
            ) : (
              <>
                <SearchIcon />
                Compare to
              </>
            )}
          </Button>
        )}

        {comparisonState.verifiedTickers.length ? (
          <Button
            variant="ghost"
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
      <p className={`text-red-500 ${!isError && "invisible"}`}>
        Error: {error?.message}
      </p>
    </>
  );
}
