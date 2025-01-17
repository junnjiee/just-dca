import { useUserInput } from "@/contexts/user-input";

import { formatNumber, formatPrice } from "@/lib/utils";

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

  const cardData = [
    {
      name: "TOTAL VALUE",
      value: formatPrice(data[data.length - 1].total_val),
    },
    {
      name: "CONTRIBUTION",
      value: formatPrice(data[data.length - 1].contribution),
    },
    {
      name: "TOTAL SHARES",
      value: formatNumber(data[data.length - 1].shares_owned),
    },
    { name: "AVG SHARE PRICE", value: formatPrice(avgSharePrice) },
  ];

  return (
    <Card className={className}>
      <CardHeader></CardHeader>
      <CardContent className="grid grid-cols-1 divide-y font-medium">
        {cardData.map((row) => (
          <div className="flex flex-row justify-between py-4 items-center">
            <div className="text-zinc-500 dark:text-zinc-400 text-xs">
              {row.name}
            </div>
            <div className="text-sm">{row.value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
