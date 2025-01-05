"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import {
  dcaDataInputType,
  dcaDataOutputRowType,
  useGetDCAData,
} from "@/features/get-dca-data";
import { DataTable } from "@/components/data-table";
import { DashboardForm } from "./_components/DashboardForm";
import { InvestmentChart } from "./_components/DashboardCharts";
import { TickerInfoCard, DataCard } from "./_components/DataScreens";

// NOTE: check how to create fallback components
// NOTE: show error page if error occur in backend when retrieving data
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

  // maybe useref or memoize this?
  const columns: ColumnDef<dcaDataOutputRowType>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "stock_price", header: "Stock Price" },
    { accessorKey: "shares_bought", header: "Shares Bought" },
    { accessorKey: "shares_owned", header: "Shares Owned" },
    { accessorKey: "contribution", header: "Contribution" },
    { accessorKey: "total_val", header: "Total Value" },
  ];

  // needed
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
        <InvestmentChart userInput={userInput} className="basis-2/3" />
        <DataCard data={isSuccess ? data : []} className="basis-1/3" />
      </div>
      {/* NOTE: export to excel? */}
      <DataTable columns={columns} data={isSuccess ? data : []} />
    </>
  );
}
