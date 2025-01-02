"use client";

import { useState } from "react";
import { DashboardForm } from "./_components/DashboardForm";
import { DataCard } from "./_components/DataCard";
import { CustomLineChart } from "./_components/CustomLineChart";
import { DCADataTable } from "./_components/DCADataTable";
import { useGetDCAData } from "@/features/get-dca-data";

export default function DashboardPage() {
  const [userInput, setUserInput] = useState({
    ticker: "AAPL",
    contri: 50,
    start: "2024-01-01",
    end: "2024-12-01",
  });

  const { data, error, isError, isLoading } = useGetDCAData(userInput);
  // console.log(userInput);
  console.log(data);
  console.log(`${isError} ${error}`);

  return (
    <>
      {isError && <p>{error.message}</p>}
      <div className="my-5">
        <DashboardForm userInput={userInput} setUserInput={setUserInput} />
      </div>
      <div className="border-b px-4 py-3 space-y-0.5 mb-3">
        <div className="text-2xl">Apple Inc.</div>
        <div className="text-xs">AAPL &bull; NASDAQ</div>
      </div>
      <div className="flex flex-row gap-x-4 mb-3">
        <CustomLineChart className="basis-2/3" />
        <DataCard className="basis-1/3" />
      </div>
      <DCADataTable />
    </>
  );
}
