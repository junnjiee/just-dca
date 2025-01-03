"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { DashboardForm } from "./_components/DashboardForm";
import { CustomLineChart } from "./_components/CustomLineChart";
import { DCADataTable } from "./_components/DCADataTable";
import { useGetDCAData } from "@/features/get-dca-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const [userInput, setUserInput] = useState({
    ticker: "AAPL",
    contri: 50,
    start: "2024-01-01",
    end: "2024-12-01",
  });

  const { data, error, isError, isLoading, isSuccess, promise } =
    useGetDCAData(userInput);
  console.log(data);

  useEffect(() => {
    if (isLoading) {
      // hacky way to ensure that toast transitions are smooth if user submits another form
      // when the toast is still shown
      toast.loading("Generating Dashboard", {
        position: "top-center",
        toastId: 1,
      });
      toast.update(1, {
        render: "Generating Dashboard",
        isLoading: true,
      });
    } else if (isSuccess) {
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
      <div className="border-b px-4 py-3 space-y-0.5 mb-3">
        <div className="text-2xl">Apple Inc.</div>
        <div className="text-xs">AAPL &bull; NASDAQ</div>
      </div>
      <div className="flex flex-row gap-x-4 mb-3">
        <CustomLineChart userInput={userInput} className="basis-2/3" />
        <DataCard className="basis-1/3" />
      </div>
      <DCADataTable />
    </>
  );
}

function DataCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader></CardHeader>
      <CardContent>
        <div className="border-t py-2">Profit/Loss</div>
        <div className="border-t py-2">Investment Value</div>
        <div className="border-t py-2">Contribution</div>
        <div className="border-t py-2">Shares Bought</div>
        <div className="border-y py-2">Average Stock Price</div>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
