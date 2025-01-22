import { useState, useReducer, useDeferredValue } from "react";
import { useBoolean } from "usehooks-ts";
import { SearchIcon, PlusIcon, Loader2, XIcon } from "lucide-react";

import { useUserInput } from "@/contexts/user-input";

import { cn, formatDateNoDay } from "@/lib/utils";
import { tickersReducer } from "@/lib/reducers";

import { useGetMultipleDcaReturns } from "@/queries/dca-returns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DcaPerformanceChart } from "./DcaPerformanceChart";
import { DcaComparisonChart } from "./DcaComparisonChart";
import { CostPerShareChart } from "./CostPerShareChart";
import { PctGrowthChart } from "./PctGrowthChart";
import { DateRangeTabs } from "../DateRangeTabs";

type ChartGroupProps = {
  className?: string;
};

export function ChartGroup({ className }: ChartGroupProps) {
  const userInput = useUserInput();
  const [newTicker, setNewTicker] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [tickers, tickerDispatch] = useReducer(tickersReducer, [
    userInput.ticker,
  ]);
  const deferredTickers = useDeferredValue(tickers);

  const removeTicker = (ticker: string) => {
    tickerDispatch({ type: "remove", ticker: ticker });
    setErrorMsg("");
  };
  const clearTickers = () => {
    tickerDispatch({ type: "clear" });
    setErrorMsg("");
  };

  const queryArr =
    newTicker === "" ? [] : [{ ...userInput, ticker: newTicker }];
  const newTickerTestQuery = useGetMultipleDcaReturns(queryArr);
  const newTickerQueryLoading =
    newTickerTestQuery.map((query) => query.isLoading).length > 0;

  if (newTickerTestQuery.length) {
    // wait for query to resolve before resetting newTicker state
    if (newTickerTestQuery[0].isError) {
      setErrorMsg(newTickerTestQuery[0].error.message);
      setNewTicker("");
    }
    if (newTickerTestQuery[0].isSuccess) {
      tickerDispatch({ type: "add", ticker: newTicker.toUpperCase() });
      setErrorMsg("");
      setNewTicker("");
    }
  }

  return (
    <div className={cn("grid grid-cols-1 gap-3 md:grid-cols-2", className)}>
      <div className="md:col-span-2 md:mx-4">
        <div className="mb-2 ms-2">
          <p className="font-medium text-lg">
            {tickers.length > 1 ? (
              <>Comparing DCA Performances</>
            ) : (
              <>Your DCA Performance</>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDateNoDay(userInput.start, "numeric")} -{" "}
            {formatDateNoDay(userInput.end, "numeric")}
          </p>
        </div>
        <DateRangeTabs className="my-3" />
        {tickers.length > 1 ? (
          <div className={cn(tickers !== deferredTickers && "opacity-50")}>
            <DcaComparisonChart
              tickers={deferredTickers}
              removeTicker={removeTicker}
              key={`${userInput.start}${userInput.end}${userInput.contri}`}
            />
          </div>
        ) : (
          <DcaPerformanceChart />
        )}
        <ComparisonInputButtonGroup
          tickers={tickers}
          clearTickers={clearTickers}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          newTickerQueryLoading={newTickerQueryLoading}
          setNewTicker={setNewTicker}
          key={tickers.join()}
        />
      </div>
      <PctGrowthChart />
      <CostPerShareChart />
    </div>
  );
}

type ComparisonInputButtonGroupProps = {
  tickers: string[];
  clearTickers: () => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setNewTicker: React.Dispatch<React.SetStateAction<string>>;
  newTickerQueryLoading: boolean;
};

function ComparisonInputButtonGroup({
  tickers,
  clearTickers,
  errorMsg,
  setErrorMsg,
  setNewTicker,
  newTickerQueryLoading,
}: ComparisonInputButtonGroupProps) {
  const {
    value: inputIsOpen,
    setTrue: openInput,
    setFalse: closeInput,
  } = useBoolean(false);

  const [input, setInput] = useState("");

  const handleCloseInput = () => {
    closeInput();
    setInput("");
    setErrorMsg("");
  };

  const handleSubmit = () => {
    if (tickers.includes(input.toUpperCase())) {
      setErrorMsg("Ticker already shown");
    } else {
      setNewTicker(input);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between mt-1">
        {inputIsOpen ? (
          <div className="flex flex-row gap-x-3">
            <Input
              className="text-sm"
              placeholder="Enter ticker (e.g. META)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              disabled={!input.length || newTickerQueryLoading}
              onClick={handleSubmit}
            >
              {newTickerQueryLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>Add</>
              )}
            </Button>
            <Button
              variant="ghost"
              className="p-0"
              asChild
              onClick={handleCloseInput}
            >
              <XIcon className="cursor-pointer text-gray-600" size={45} />
            </Button>
          </div>
        ) : (
          <Button className="text-primary" variant="link" onClick={openInput}>
            {tickers.length > 1 ? (
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

        {tickers.length > 1 && (
          <Button
            className="text-primary"
            variant="link"
            onClick={clearTickers}
          >
            Clear All
          </Button>
        )}
      </div>
      <p className={cn("text-red-500", !errorMsg.length && "invisible")}>
        Error: {errorMsg}
      </p>
    </>
  );
}
