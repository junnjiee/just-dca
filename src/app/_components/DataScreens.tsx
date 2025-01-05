"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  dcaDataOutputType,
  dcaDataOutputRowType,
} from "@/features/get-dca-data";
import { useGetStockInfo } from "@/features/get-stock-info";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function TickerInfoCard({ ticker, className }: TickerInfoCardProps) {
  const { data, isSuccess } = useGetStockInfo(ticker);

  return (
    <div className={cn("border-b pb-3 space-y-0.5", className)}>
      {isSuccess ? (
        <>
          <div className="text-2xl">{data.longName}</div>
          <div className="text-xs">
            {data.underlyingSymbol} &bull; {data.quoteType}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

type DataCardProps = {
  data: dcaDataOutputType;
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

  const profit = parseFloat(
    (data.at(-1)?.total_val! - data.at(-1)?.contribution!).toFixed(2)
  );
  const profitData = {
    amount: `${profit > 0 ? "+" : profit < 0 ? "-" : ""}${Math.abs(profit)}`,
    pct: `${((Math.abs(profit) / data.at(-1)?.contribution!) * 100).toFixed(
      2
    )}%`,
    color: profit > 0 ? "green" : profit < 0 ? "red" : "gray",
    icon:
      profit > 0 ? <ArrowUpRight /> : profit < 0 ? <ArrowDownRight /> : <></>,
  };

  return (
    <Card className={className}>
      <CardHeader></CardHeader>
      <CardContent className="grid grid-cols-1 divide-y">
        <div className="flex flex-row justify-between py-4">
          <div>Profit/Loss</div>
          {data.length ? (
            <div className={`text-${profitData.color}-500`}>
              <div className="flex flex-row gap-x-2">
                {profitData.amount}
                <div className="flex flex-row">
                  {profitData.icon}
                  {profitData.pct}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-row justify-between py-4">
          <div>Investment Value</div>
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

type DataTableProps = {
  data: dcaDataOutputType;
  className?: string;
};

// stable column reference
const columns: ColumnDef<dcaDataOutputRowType>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "stock_price", header: "Stock Price" },
  { accessorKey: "shares_bought", header: "Shares Bought" },
  { accessorKey: "shares_owned", header: "Shares Owned" },
  { accessorKey: "contribution", header: "Contribution" },
  { accessorKey: "total_val", header: "Total Value" },
];

// https://tanstack.com/table/latest/docs/faq
// pass a stable reference to the table to prevent infinite re-rendering
export function DataTable({ data, className }: DataTableProps) {
  const defaultPageSize = 10;
  const pageSizeOptions = ["10", "20", "30", "40", "50"];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div>
      <Table className={className}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-row justify-between items-center py-4">
        <div className="text-sm text-gray-600">
          Showing pages {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex flex-row space-x-2">
          <Select
            onValueChange={(e) => {
              table.setPageSize(Number(e));
            }}
            defaultValue={defaultPageSize.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize}>
                    {pageSize} rows
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
