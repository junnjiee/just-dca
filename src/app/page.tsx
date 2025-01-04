"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { DashboardForm } from "./_components/DashboardForm";
import { CustomLineChart } from "./_components/CustomLineChart";
import { dcaDataInputType, useGetDCAData } from "@/features/get-dca-data";
import { useGetStockInfo } from "@/features/get-stock-info";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const { error, isError, isLoading, isSuccess } = useGetDCAData(userInput);

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
        <CustomLineChart userInput={userInput} className="basis-2/3" />
        <DataCard userInput={userInput} className="basis-1/3" />
      </div>
      <DataTable userInput={userInput} />
    </>
  );
}

type TickerInfoCardProps = {
  ticker: string;
  className?: string;
};

function TickerInfoCard({ ticker, className }: TickerInfoCardProps) {
  const { data } = useGetStockInfo(ticker);

  return (
    <div className={cn("border-b pb-3 space-y-0.5", className)}>
      <div className="text-2xl">{data?.longName}</div>
      <div className="text-xs">
        {data ? (
          <>
            {data?.underlyingSymbol} &bull; {data?.quoteType}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

type DataCardProps = {
  userInput: dcaDataInputType;
  className?: string;
};

function DataCard({ userInput, className }: DataCardProps) {
  const { data, isError, isLoading, isSuccess } = useGetDCAData(userInput);

  const getDcaPrice = () =>
    isSuccess
      ? (
          data.reduce(
            (accumulator, currentVal) => accumulator + currentVal.stock_price,
            0
          ) / data?.length
        ).toFixed(2)
      : 0;

  const getTotalShares = () =>
    isSuccess
      ? data
          .reduce(
            (accumulator, currentVal) => accumulator + currentVal.shares_bought,
            0
          )
          .toFixed(2)
      : 0;

  const getProfit = () =>
    isSuccess
      ? parseFloat(
          (data.at(-1)?.total_val! - data.at(-1)?.contribution!).toFixed(2)
        )
      : 0;

  return (
    <Card className={className}>
      <CardHeader></CardHeader>
      <CardContent className="grid grid-cols-1 divide-y">
        <div className="flex flex-row justify-between py-4">
          <div>Profit/Loss</div>
          <div className={getProfit() > 0 ? "text-green-500" : "text-red-500"}>
            {isSuccess && getProfit()}
          </div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Investment Value</div>{" "}
          <div>{isSuccess && data.at(-1)?.total_val}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Contribution</div>
          <div>{isSuccess && data.at(-1)?.contribution}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Shares Bought</div>
          <div>{isSuccess && getTotalShares()}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Average Stock Price</div>
          <div>{isSuccess && getDcaPrice()}</div>
        </div>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}

type DataTableProps = {
  userInput: dcaDataInputType;
  className?: string;
};

// NOTE: add pagination
function DataTable({ userInput, className }: DataTableProps) {
  const { data } = useGetDCAData(userInput);

  return (
    <Table className={className}>
      <TableCaption>All prices are shown in the US Dollar.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Stock Price</TableHead>
          <TableHead>Shares Bought</TableHead>
          <TableHead>Shares Owned</TableHead>
          <TableHead>Contribution</TableHead>
          <TableHead className="text-right">Total Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((row) => (
          <TableRow key={row.date}>
            <TableCell className="font-medium">{row.date}</TableCell>
            <TableCell>{row.stock_price}</TableCell>
            <TableCell>{row.shares_bought}</TableCell>
            <TableCell>{row.shares_owned}</TableCell>
            <TableCell>{row.contribution}</TableCell>
            <TableCell className="text-right">{row.total_val}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
