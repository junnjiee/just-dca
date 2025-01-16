import { useState, useReducer, useDeferredValue } from "react";
import { SearchIcon, PlusIcon, Loader2, XIcon } from "lucide-react";

import { useUserInput } from "@/contexts/user-input";

import { cn } from "@/lib/utils";
import { tickersReducer } from "@/lib/reducers";

import { useGetMultipleDcaReturns } from "@/queries/dca-returns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DcaPerformanceChart } from "./DcaPerformanceChart";
import { DcaComparisonChart } from "./DcaComparisonChart";
import { ChartDateRangeTabs } from "./ChartDateRangeTabs";

export function ChartGroup() {
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
      setErrorMsg(newTickerTestQuery[0].error?.message!);
      setNewTicker("");
    }
    if (newTickerTestQuery[0].isSuccess) {
      tickerDispatch({ type: "add", ticker: newTicker.toUpperCase() });
      setErrorMsg("");
      setNewTicker("");
    }
  }

  return (
    <div className="space-y-3">
      <ChartDateRangeTabs />
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
  const [openInput, setOpenInput] = useState(false);
  const [input, setInput] = useState("");

  const handleCloseInput = () => {
    setOpenInput(false);
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
      <div className="flex flex-row justify-between">
        {openInput ? (
          <div className="flex flex-row gap-x-3">
            <Input
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
                "Add"
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
          <Button variant="ghost" onClick={() => setOpenInput(true)}>
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
          <Button variant="ghost" onClick={clearTickers}>
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
