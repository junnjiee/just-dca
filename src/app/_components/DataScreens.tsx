"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { dcaDataOutputType } from "@/features/get-dca-data";
import { useGetStockInfo } from "@/features/get-stock-info";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TickerInfoCardProps = {
  ticker: string;
  className?: string;
};

export function TickerInfoCard({ ticker, className }: TickerInfoCardProps) {
  const { data, isSuccess } = useGetStockInfo(ticker);

  return (
    <div className={cn("border-b pb-3 space-y-0.5", className)}>
      {isSuccess ? (
        <>
          <div className="text-xl">{data.longName}</div>
          {/* <div className="text-xs">
            {data.underlyingSymbol} &bull; {data.quoteType}
          </div> */}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

type DataCardProps = {
  data: dcaDataOutputType;
  className?: string;
};

export function DataCard({ data, className }: DataCardProps) {
  const avgSharePrice = () =>
    (
      data.reduce(
        (accumulator, currentRow) => accumulator + currentRow.stock_price,
        0
      ) / data.length
    ).toFixed(2);

  const profit = data.at(-1)?.total_val! - data.at(-1)?.contribution!;

  const profitData = {
    amount: `${profit > 0 ? "+" : profit < 0 ? "-" : ""}${Math.abs(
      profit
    ).toFixed(2)}`,
    pct: `${((Math.abs(profit) / data.at(-1)?.contribution!) * 100).toFixed(
      2
    )}%`,
    color: profit > 0 ? "green" : profit < 0 ? "red" : "gray",
    icon:
      profit > 0 ? <ArrowUpRight /> : profit < 0 ? <ArrowDownRight /> : <></>,
  };

  return (
    <Card className={className}>
      <CardHeader></CardHeader>
      <CardContent className="grid grid-cols-1 divide-y">
        <div className="flex flex-row justify-between py-4">
          <div>Profit/Loss</div>
          {data.length ? (
            <div
              className={`flex flex-row gap-x-2 text-${profitData.color}-500 `}
            >
              <span>{profitData.amount}</span>
              <span className="flex flex-row">
                {profitData.icon}
                {profitData.pct}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Total Value</div>
          <div>{data.at(-1)?.total_val}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Contribution</div>
          <div>{data.at(-1)?.contribution}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Total Shares</div>
          <div>{data.at(-1)?.shares_owned}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Average Share Price</div>
          <div>{data.length ? avgSharePrice() : ""}</div>
        </div>
      </CardContent>
      {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
    </Card>
  );
}
