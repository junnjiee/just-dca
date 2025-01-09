"use client";

import { useState, useEffect } from "react";
import { SearchIcon, PlusIcon, Loader2, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { dcaDataInputType, useGetDcaData } from "@/features/get-dca-data";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DcaPerformanceChart } from "./DcaPerformanceChart";
import { DcaComparisonChart } from "./DcaComparisonChart";

// TEMP
import { useGetMultipleDcaData } from "@/features/get-dca-data";

type ChartGroupProps = {
  userInput: dcaDataInputType;
};

export function ChartGroup({ userInput }: ChartGroupProps) {
  const [tempInput, setTempInput] = useState("");
  const [tickers, setTickers] = useState([userInput.ticker]);
  const [errorMsg, setErrorMsg] = useState("");

  let arr: dcaDataInputType[];
  if (tempInput === "") {
    arr = [];
  } else {
    arr = [{ ...userInput, ticker: tempInput }];
  }
  const queryResults = useGetMultipleDcaData(arr);

  if (queryResults.length) {
    if (queryResults[0].isError) {
      setErrorMsg(queryResults[queryResults.length - 1].error?.message!);
      setTempInput("");
    }
    if (queryResults[0].isSuccess) {
      if (tickers.length >= 5) {
        setTickers((prev) =>
          prev.map((val, idx) => (idx === 4 ? tempInput : val))
        );
      } else {
        setTickers((prev) => [...prev, tempInput]);
      }
      setTempInput("");
    }
  }
  console.log(tickers);

  return (
    <>
      {tickers.length > 1 ? (
        <DcaComparisonChart
          userInput={userInput}
          tickers={tickers}
          setTickers={setTickers}
          key={`${userInput.start}${userInput.end}${userInput.contri}${tickers.length}`}
        />
      ) : (
        <DcaPerformanceChart userInput={userInput} />
      )}
      <ComparisonInputButton
        userInput={userInput}
        tickers={tickers}
        setTickers={setTickers}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        tempInput={tempInput}
        setTempInput={setTempInput}
      />
    </>
  );
}

type ComparisonInputButtonProps = {
  userInput: dcaDataInputType;
  tickers: string[];
  setTickers: React.Dispatch<React.SetStateAction<string[]>>;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  tempInput: string;
  setTempInput: React.Dispatch<React.SetStateAction<string>>;
};

function ComparisonInputButton({
  userInput,
  tickers,
  setTickers,
  errorMsg,
  setErrorMsg,
  tempInput,
  setTempInput,
}: ComparisonInputButtonProps) {
  const [tickerInput, setTickerInput] = useState("");
  const [openInput, setOpenInput] = useState(false);

  let arr: dcaDataInputType[];
  if (tempInput === "") {
    arr = [];
  } else {
    arr = [{ ...userInput, ticker: tempInput }];
  }

  const queryResults = useGetMultipleDcaData(arr);
  const loading = queryResults.length ? queryResults[0].isLoading : false;

  return (
    <>
      <div className="flex flex-row justify-between">
        {openInput ? (
          <div className="flex flex-row gap-x-3">
            <Input
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
            />
            <Button
              disabled={!tickerInput.length || loading}
              onClick={() => {
                if (tickers.includes(tickerInput)) {
                  setErrorMsg("Ticker already shown");
                } else {
                  setTempInput(tickerInput);
                }
              }}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Add"}
            </Button>
            <Button
              variant="ghost"
              className="p-0"
              asChild
              onClick={() => {
                setOpenInput(false);
                setTickerInput("");
              }}
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

        {tickers.length ? (
          <Button
            variant="ghost"
            onClick={() => setTickers((prev) => [prev[0]])}
          >
            Clear All
          </Button>
        ) : (
          <></>
        )}
      </div>
      <p className={cn("text-red-500")}>{errorMsg}</p>
    </>
  );
}
