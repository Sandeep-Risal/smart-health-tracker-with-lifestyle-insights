"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import TableSkeleton from "../../skeleton-loading/table-skeleton";
import NotFoundLottie from "@/src/svg/not-found";
import { cn } from "../../lib/utils";

interface TotalColumn<TData> {
  columnId: keyof TData;
  format?: (value: number) => React.ReactNode;
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | any;
  border?: boolean;
  hover?: boolean;
  loading?: boolean;
  height?: string;
  headerSticky?: boolean;
  lottieWidth?: number;
  lottieHeight?: number;
  total?: TotalColumn<TData>[];
  loadingDataNum?: number | 1;
  selectedId?: string | number;
  showManageColumn?: boolean;
  children?: React.ReactNode;
  module?: string;
  applyColumns?: (arg: string) => void;
  headerBgClass?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  border,
  hover,
  loading,
  height,
  headerSticky,
  lottieWidth,
  lottieHeight,
  total,
  loadingDataNum,
  selectedId,
  showManageColumn,
  children,
  module,
  applyColumns,
  headerBgClass,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Initialize column visibility based on enableHiding property
  const initialVisibility = columns.reduce((acc, column) => {
    if (column.id !== undefined) {
      acc[column.id] = !column.enableHiding;
    }
    return acc;
  }, {} as Record<string, boolean>);

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility);

  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const calculateTotals = (
    data: TData[],
    totalColumns: TotalColumn<TData>[]
  ) => {
    return totalColumns.map((totalColumn) => {
      const sum = data.reduce((acc, curr) => {
        const value = curr[totalColumn.columnId];
        return acc + Number(value);
      }, 0);
      return {
        columnId: totalColumn.columnId,
        value: totalColumn.format ? totalColumn.format(sum) : sum,
      };
    });
  };
  const showColumnHandler = (newVisibility?: VisibilityState) => {
    if (newVisibility) {
      const parsedColumns = Object.keys(newVisibility)
        .filter((key) => newVisibility[key] === true && key !== "sn")
        .join(",");
      setColumnVisibility(newVisibility);
      applyColumns && applyColumns(parsedColumns);
    } else {
      const storedVisibility = localStorage.getItem(
        `columnVisibility_${module}`
      );
      if (storedVisibility) {
        const parsedVisibility = JSON.parse(storedVisibility);
        setColumnVisibility((prev) => ({
          ...prev,
          ...parsedVisibility,
        }));
        applyColumns && applyColumns(parsedVisibility);
      }
    }
  };
  const totals = total ? calculateTotals(data, total) : [];

  // Load column visibility from localStorage
  useEffect(() => {
    if (module) {
      showColumnHandler();
    }
  }, [module]);

  return (
    <div>
      {(showManageColumn || children) && (
        <div className="flex justify-between items-center">{children}</div>
      )}
      <div
        className={cn(
          "overflow-x-auto rounded-md mt-6",
          border && "border-2 border-gray-200",
          height && height
        )}
      >
        <Table className="rounded-md bg-light-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead
                      className={cn(
                        border
                          ? "border-b-2 border-r-2 border-gray-2 00 last:border-r-0 text-zinc-800 font-medium "
                          : "",
                        headerSticky &&
                          "sticky top-[0px] z-[10] bg-light-white",
                        "whitespace-nowrap",
                        headerBgClass && headerBgClass,
                        header.column.columnDef.meta?.sticky &&
                          `sticky ${header.column.columnDef.meta?.sticky} z-[20]`,
                        header.column.columnDef.size &&
                          `max-w-[${header.column.columnDef.size}px] w-[${header.column.columnDef.size}px] min-w-[${header.column.columnDef.size}px]`
                      )}
                      key={header.id}
                    >
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
            {loading ? (
              Array.from(
                { length: loadingDataNum ? loadingDataNum : 1 },
                (_, index) => (
                  <TableRow className="[&>*]:last:border-b-0" key={index}>
                    {Array.from(
                      {
                        length: table.getAllColumns().length,
                      },
                      (_, index) => (
                        <TableSkeleton key={index} />
                      )
                    )}
                  </TableRow>
                )
              )
            ) : table?.getRowModel().rows?.length ? (
              <>
                {table?.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.id === selectedId && "selected"}
                    className={`[&>*]:last:border-b-0 ${
                      hover ? "group cursor-pointer" : ""
                    }`}
                  >
                    {row?.getVisibleCells().map((cell: any) => (
                      <TableCell
                        key={cell.id}
                        className={`${
                          border
                            ? "border-r-2 border-b-2 border-gray-2 00 last:border-r-0"
                            : ""
                        } ${
                          cell.column.columnDef.meta?.sticky &&
                          `sticky ${cell.column.columnDef.meta?.sticky} z-[10] bg-white`
                        } ${
                          hover
                            ? "group-hover:bg-blue-50 group-hover:border-r-blue-100 group-hover:border-l-blue-100"
                            : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {totals.length > 0 && (
                  <TableRow className={cn("font-semibold !bg-gray-200")}>
                    {columns.map((column, index) => {
                      const totalColumn = totals.find(
                        (t) => t.columnId === column?.id
                      );
                      return (
                        <>
                          <TableCell key={index}>
                            {totalColumn ? totalColumn.value : ""}
                          </TableCell>
                        </>
                      );
                    })}
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={border ? "h-24 text-center" : "h-24 text-center"}
                >
                  <NotFoundLottie width={lottieWidth} height={lottieHeight} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
