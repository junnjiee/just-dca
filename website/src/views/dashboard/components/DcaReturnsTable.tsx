import { ColumnDef } from "@tanstack/react-table";

import { useUserInput } from "@/contexts/user-input";

import { useGetSuspendedDcaReturns } from "@/queries/dca-returns";

import { InferArrayType } from "@/types/utils";
import { DcaReturnsQueryOutput } from "@/types/financial-queries";

import { DataTable } from "@/components/generic/data-table";

const tableColumns: ColumnDef<InferArrayType<DcaReturnsQueryOutput>>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "stock_price", header: "Stock Price" },
  { accessorKey: "shares_bought", header: "Shares Bought" },
  { accessorKey: "shares_owned", header: "Shares Owned" },
  { accessorKey: "contribution", header: "Contribution" },
  { accessorKey: "total_val", header: "Total Value" },
  { accessorKey: "profit", header: "Profit" },
  { accessorKey: "profitPct", header: "Profit (%)" },
];

export function DcaReturnsTable() {
  const userInput = useUserInput();
  const { data } = useGetSuspendedDcaReturns(userInput);

  const filteredData = data.filter((row) => !row.padded_row);

  return <DataTable columns={tableColumns} data={filteredData} />;
}
