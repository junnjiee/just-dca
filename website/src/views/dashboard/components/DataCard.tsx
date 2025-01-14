import { useUserInput } from "@/contexts/user-input";

import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type DataCardProps = {
  className?: string;
};

export function DataCard({ className }: DataCardProps) {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  const avgSharePrice = (
    data.reduce(
      (accumulator, currentRow) =>
        accumulator + (currentRow.padded_row ? 0 : currentRow.stock_price),
      0
    ) / data.filter((row) => !row.padded_row).length
  ).toFixed(2);

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
