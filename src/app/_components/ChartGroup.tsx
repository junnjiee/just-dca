"use client";

import { useState, useReducer } from "react";
import { SearchIcon, PlusIcon, Loader2, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { tickersReducer } from "@/reducers/index";

import { useGetMultipleDcaReturns } from "@/queries/dcaReturns";

import { DcaReturnsQueryInput } from "@/types/financialQueries";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DcaPerformanceChart } from "./DcaPerformanceChart";
import { DcaComparisonChart } from "./DcaComparisonChart";

type ChartGroupProps = {
  userInput: DcaReturnsQueryInput;
};

export function ChartGroup({ userInput }: ChartGroupProps) {
  const [newTicker, setNewTicker] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [tickers, dispatchTickers] = useReducer(tickersReducer, [
    userInput.ticker,
  ]);
  const removeTicker = (ticker: string) => {
    dispatchTickers({ type: "remove", ticker: ticker });
    setErrorMsg("");
  };
  const clearTickers = () => {
    dispatchTickers({ type: "clear" });
    setErrorMsg("");
  };

  const arr = newTicker === "" ? [] : [{ ...userInput, ticker: newTicker }];
  const newTickerTestQuery = useGetMultipleDcaReturns(arr);
  const newTickerQueryLoading =
    newTickerTestQuery.map((query) => query.isLoading).length > 0;

  if (newTickerTestQuery.length) {
    // wait for query to resolve before resetting newTicker state
    if (newTickerTestQuery[0].isError) {
      setErrorMsg(newTickerTestQuery[0].error?.message!);
      setNewTicker("");
    }
    if (newTickerTestQuery[0].isSuccess) {
      dispatchTickers({ type: "add", ticker: newTicker.toUpperCase() });
      setErrorMsg("");
      setNewTicker("");
    }
  }
  console.log(tickers);

  return (
    <>
      {tickers.length > 1 ? (
        <DcaComparisonChart
          userInput={userInput}
          tickers={tickers}
          removeTicker={removeTicker}
          key={`${userInput.start}${userInput.end}${userInput.contri}${tickers.length}`}
        />
      ) : (
        <DcaPerformanceChart userInput={userInput} />
      )}
      <ComparisonInputButton
        tickers={tickers}
        clearTickers={clearTickers}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        newTickerQueryLoading={newTickerQueryLoading}
        setNewTicker={setNewTicker}
        key={tickers.join()}
      />
    </>
  );
}

type ComparisonInputButtonProps = {
  tickers: string[];
  clearTickers: () => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  newTickerQueryLoading: boolean;
  setNewTicker: React.Dispatch<React.SetStateAction<string>>;
};

function ComparisonInputButton({
  tickers,
  clearTickers,
  errorMsg,
  setErrorMsg,
  newTickerQueryLoading,
  setNewTicker,
}: ComparisonInputButtonProps) {
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
              placeholder="Enter ticker (e.g. AAPL)"
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
            {tickers.length ? (
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

        {tickers.length && (
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
