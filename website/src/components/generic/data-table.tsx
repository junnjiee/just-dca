import {
  Table as TanstackTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  SheetIcon,
  ChevronLeftIcon,
  ChevronsLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { saveAs } from "file-saver";

import { DcaReturnsQueryOutput } from "@/types/financial-queries";
import { InferArrayType } from "@/types/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// pass a stable reference to the table to prevent infinite re-rendering
// https://tanstack.com/table/latest/docs/faq
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const pageSizeOptions = ["5", "10", "20", "30", "40", "50"];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const exportToCsv = () => {
    const headers = table.getAllColumns().map((col) => col.id);

    const commaSeperatedData = data
      .map((row) => {
        const assertedRow = row as InferArrayType<DcaReturnsQueryOutput>;
        return headers
          .map((header) => {
            const assertedHeader =
              header as keyof InferArrayType<DcaReturnsQueryOutput>;
            return assertedRow[assertedHeader];
          })
          .join(",");
      })
      .join("\n");

    const csv = headers.join(",").concat("\n" + commaSeperatedData);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    saveAs(csvData, "data.csv");
  };

  return (
    <div>
      <ExportCsvDialog
        exportToCsv={exportToCsv}
        className="mb-4 hidden md:flex"
      />
      <ExportCsvDrawer exportToCsv={exportToCsv} className="mb-4 md:hidden" />
      <Table>
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
          {table.getRowModel().rows.length ? (
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
      <TableInteraction table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  );
}

interface TableInteractionProps<TData> {
  table: TanstackTable<TData>;
  pageSizeOptions: string[];
}

function TableInteraction<TData>({
  table,
  pageSizeOptions,
}: TableInteractionProps<TData>) {
  return (
    <div className="flex flex-col gap-y-3 md:flex-row md:justify-between md:items-center py-3">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </p>
      <div className="space-x-2 self-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeftIcon />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRightIcon />
        </Button>
      </div>
      <div className="flex flex-row items-center gap-x-2 text-sm self-center">
        <p>Rows per page</p>
        <Select
          onValueChange={(e) => {
            table.setPageSize(Number(e));
          }}
          defaultValue={table.initialState.pagination.pageSize.toString()}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

type ExportCsvComponentProps = {
  exportToCsv: () => void;
  className?: string;
};

function ExportCsvDialog({ exportToCsv, className }: ExportCsvComponentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className}>
          <SheetIcon />
          Export as CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download CSV</DialogTitle>
          <DialogDescription>
            You are about to export the table's data as a csv file.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => exportToCsv()}>Download</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ExportCsvDrawer({ exportToCsv, className }: ExportCsvComponentProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className={className}>
          <SheetIcon />
          Export as CSV
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Download CSV</DrawerTitle>
          <DrawerDescription>
            You are about to export the table's data as a csv file.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button onClick={() => exportToCsv()}>Download</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
