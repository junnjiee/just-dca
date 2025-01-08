"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { dcaDataOutputType } from "@/features/get-dca-data";
import { useGetStockInfo } from "@/features/get-stock-info";
import { cn, calculateProfitDetails } from "@/lib/utils";
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

export function DataCard({ data, className }: DataCardProps) {
  const avgSharePrice = () =>
    (
      data.reduce(
        (accumulator, currentRow) => accumulator + currentRow.stock_price,
        0
      ) / data.length
    ).toFixed(2);

  const profitData = calculateProfitDetails(
    data.at(-1)?.total_val!,
    data.at(-1)?.contribution!
  );

  const color = { positive: "green", negative: "red", neutral: "grey" };
  const arrowIcon = {
    positive: <ArrowUpRight />,
    negative: <ArrowDownRight />,
    neutral: <></>,
  };

  return (
    <Card className={className}>
      <CardHeader></CardHeader>
      <CardContent className="grid grid-cols-1 divide-y">
        <div className="flex flex-row justify-between py-4">
          <div>Profit/Loss</div>
          {data.length ? (
            <div
              className={`flex flex-row gap-x-2 text-${
                color[profitData.trend]
              }-500 `}
            >
              <span>{profitData.profitStr}</span>
              <span className="flex flex-row">
                {arrowIcon[profitData.trend]}
                {profitData.profitPct}
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
