import { ColumnDef } from "@tanstack/react-table";

import { useUserInputStore } from "@/lib/stores";

import { useGetDcaReturns } from "@/queries/dca-returns";

import { DcaReturnsQueryOutputRow } from "@/types/financial-queries";
import { DcaReturnsQueryInputSchema } from "@/schemas/financial-queries";

import { DataTable } from "@/components/generic/data-table";

const tableColumns: ColumnDef<DcaReturnsQueryOutputRow>[] = [
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
  const userInput = DcaReturnsQueryInputSchema.parse(useUserInputStore());
  const { data: queryData, isSuccess } = useGetDcaReturns(userInput);

  const data = isSuccess ? queryData.filter((row) => !row.padded_row) : [];

  return <DataTable columns={tableColumns} data={data} />;
}
