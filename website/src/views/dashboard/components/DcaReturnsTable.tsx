import { ColumnDef } from "@tanstack/react-table";

import { formatDateNoDay, formatPriceString, formatNumberString } from "@/lib/utils";

import { useUserInput } from "@/contexts/user-input/context";

import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";

import { InferArrayType } from "@/types/utils";
import { DcaReturnsQueryOutput } from "@/types/financial-queries";

import { DataTable } from "@/components/generic/data-table";
import {
  ProfitAmtColored,
  ProfitPctBadge,
} from "@/components/generic/profit-markers";

const tableColumns: ColumnDef<InferArrayType<DcaReturnsQueryOutput>>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDateNoDay(row.getValue("date")),
  },
  {
    accessorKey: "contribution",
    header: "Total Contribution",
    cell: ({ row }) => formatPriceString(row.getValue("contribution")),
  },
  {
    accessorKey: "total_val",
    header: "Total Value",
    cell: ({ row }) => formatPriceString(row.getValue("total_val")),
  },
  {
    accessorKey: "profit",
    header: "Overall Profit",
    cell: ({ row }) => <ProfitAmtColored profit={row.getValue("profit")} />,
  },
  {
    accessorKey: "profitPct",
    header: "Overall Profit (%)",
    cell: ({ row }) => <ProfitPctBadge profitPct={row.getValue("profitPct")} />,
  },
  {
    accessorKey: "stock_price",
    header: "Share Price",
    cell: ({ row }) => formatPriceString(row.getValue("stock_price")),
  },
  {
    accessorKey: "shares_bought",
    header: "Shares Bought",
    cell: ({ row }) => formatNumberString(row.getValue("shares_bought")),
  },
  {
    accessorKey: "shares_owned",
    header: "Shares Owned",
    cell: ({ row }) => formatNumberString(row.getValue("shares_owned")),
  },
];

export function DcaReturnsTable() {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  const filteredData = data.filter((row) => !row.padded_row);

  return (
    <div>
      <p className="text-lg font-medium mb-2 ms-2">Data Table</p>
      <DataTable columns={tableColumns} data={filteredData} />
    </div>
  );
}
