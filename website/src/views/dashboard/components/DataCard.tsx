import { useUserInput } from "@/contexts/user-input";

import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type DataCardProps = {
  className?: string;
};

export function DataCard({ className }: DataCardProps) {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  const avgSharePrice =
    data.reduce(
      (accumulator, currentRow) =>
        accumulator + (currentRow.padded_row ? 0 : currentRow.stock_price),
      0
    ) / data.filter((row) => !row.padded_row).length;

  const formattedTotalVal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data[data.length - 1].total_val);

  const formattedContri = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data[data.length - 1].contribution);

  const formattedAvgSharePrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(avgSharePrice);

  return (
    <Card className={className}>
      <CardHeader></CardHeader>
      <CardContent className="grid grid-cols-1 divide-y text-sm">
        <div className="flex flex-row justify-between py-4">
          <div className="text-zinc-500">TOTAL VALUE</div>
          <div className="font-medium">{formattedTotalVal}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div className="text-zinc-500">CONTRIBUTION</div>
          <div className="font-medium">{formattedContri}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div className="text-zinc-500">TOTAL SHARES</div>
          <div className="font-medium">{data[data.length - 1].shares_owned}</div>
        </div>
        <div className="flex flex-row justify-between py-4">
          <div className="text-zinc-500">AVG SHARE PRICE</div>
          <div className="font-medium">{formattedAvgSharePrice}</div>
        </div>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
