import { ColumnDef } from "@tanstack/react-table";

import { useUserInput } from "@/contexts/user-input";

import { useGetDcaReturns } from "@/queries/dca-returns";

import { DcaReturnsQueryOutputRow } from "@/types/financial-queries";

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
  const userInput = useUserInput();
  const { data: queryData, isSuccess } = useGetDcaReturns(userInput);

  const data = isSuccess ? queryData.filter((row) => !row.padded_row) : [];

  return <DataTable columns={tableColumns} data={data} />;
}
