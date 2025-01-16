import { ColumnDef } from "@tanstack/react-table";

import { useUserInput } from "@/contexts/user-input";

import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";

import { InferArrayType } from "@/types/utils";
import { DcaReturnsQueryOutput } from "@/types/financial-queries";

import { DataTable } from "@/components/generic/data-table";
import {
  ProfitAmtColored,
  ProfitPctBadge,
} from "@/components/generic/profit-markers";

const tableColumns: ColumnDef<InferArrayType<DcaReturnsQueryOutput>>[] = [
  { accessorKey: "date", header: "Date" },
  {
    accessorKey: "contribution",
    header: "Total Contribution",
    cell: ({ row }) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("contribution"));
    },
  },
  {
    accessorKey: "total_val",
    header: "Total Value",
    cell: ({ row }) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("total_val"));
    },
  },
  {
    accessorKey: "profit",
    header: "Overall Profit",
    cell: ({ row }) => {
      const profit: number = row.getValue("profit");
      return <ProfitAmtColored profit={profit} />;
    },
  },
  {
    accessorKey: "profitPct",
    header: "Overall Profit",
    cell: ({ row }) => {
      const profitPct: number = row.getValue("profitPct");
      return <ProfitPctBadge profitPct={profitPct} />;
    },
  },
  {
    accessorKey: "stock_price",
    header: "Share Price",
    cell: ({ row }) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("stock_price"));
    },
  },
  { accessorKey: "shares_bought", header: "Shares Bought" },
  { accessorKey: "shares_owned", header: "Shares Owned" },
];

export function DcaReturnsTable() {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  const filteredData = data.filter((row) => !row.padded_row);

  return <DataTable columns={tableColumns} data={filteredData} />;
}
