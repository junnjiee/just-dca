"use client";

import { useUserInputStore } from "@/lib/stores";

import { DcaReturnsQueryOutput } from "@/types/financialQueries";
import { DcaReturnsQueryInputSchema } from "@/schemas/financialQueries";

import { useGetDcaReturns } from "@/queries/dcaReturnsQuery";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DataCardProps = {
  className?: string;
};

export function DataCard({ className }: DataCardProps) {
  const userInput = DcaReturnsQueryInputSchema.parse(useUserInputStore());

  const { data: queryData, isSuccess } = useGetDcaReturns(userInput);
  const data: DcaReturnsQueryOutput = isSuccess ? queryData : [];

  const avgSharePrice = data.length
    ? (
        data.reduce(
          (accumulator, currentRow) =>
            accumulator + (currentRow.padded_row ? 0 : currentRow.stock_price),
          0
        ) / data.filter((row) => !row.padded_row).length
      ).toFixed(2)
    : "";

  return (
    <Card className={className}>
      <CardHeader></CardHeader>
      <CardContent className="grid grid-cols-1 divide-y">
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
          <div>Avg Share Price</div>
          <div>{avgSharePrice}</div>
        </div>
      </CardContent>
      {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
    </Card>
  );
}
