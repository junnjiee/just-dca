"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { dcaDataInputType, useGetDCAData } from "@/features/get-dca-data";
import { DashboardForm } from "./_components/DashboardForm";
import { InvestmentChart } from "./_components/DashboardCharts";
import { TickerInfoCard, DataCard, DataTable } from "./_components/DataScreens";

// NOTE: check how to create fallback components
// NOTE: show error page if error occur in backend when retrieving data
// How to keep previous data till new data is loaded?
export default function DashboardPage() {
  // NOTE: ensure start date < end date
  const [userInput, setUserInput] = useState<dcaDataInputType>({
    ticker: "AAPL",
    contri: 50,
    start: "2024-01-01",
    end: "2024-12-01",
  });

  const { data, error, isError, isLoading, isSuccess } =
    useGetDCAData(userInput);

  // needed
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
        <InvestmentChart userInput={userInput} className="basis-2/3" />
        <DataCard data={isSuccess ? data : []} className="basis-1/3" />
      </div>
      <DataTable data={isSuccess ? data : []} />
    </>
  );
}
