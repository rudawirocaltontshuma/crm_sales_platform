"use client";

import * as React from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowData,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, ListFilter, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type DataTableFeatures, dataTableFeatures } from "@/lib/data-table-features";
import { cn } from "@/lib/utils";

export interface TableFilterDef {
  columnId: string;
  label: string;
  options: readonly string[];
}

interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<DataTableFeatures, TData>[];
  getRowId: (row: TData) => string;
  searchPlaceholder?: string;
  filters?: readonly TableFilterDef[];
  toolbarActions?: React.ReactNode;
  emptyMessage?: string;
  pageSize?: number;
  entityLabel?: string;
}

/** Reusable header cell that toggles sorting for the column. */
export function SortableHeader({
  column,
  title,
  align = "left",
}: {
  // biome-ignore lint/suspicious/noExplicitAny: header context column type is table-feature specific
  column: any;
  title: string;
  align?: "left" | "right";
}) {
  const sorted = column.getIsSorted() as false | "asc" | "desc";

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-2 h-8 gap-1 px-2 font-medium", align === "right" && "-mr-2 ml-auto")}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      {sorted === "asc" ? <ArrowUp /> : null}
      {sorted === "desc" ? <ArrowDown /> : null}
      {sorted === false ? <ChevronsUpDown className="opacity-50" /> : null}
    </Button>
  );
}

const ALL = "__all__";

export function DataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  searchPlaceholder = "Search...",
  filters = [],
  toolbarActions,
  emptyMessage = "No records match the current filters.",
  pageSize = 10,
  entityLabel = "records",
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize });

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: { columnFilters, sorting, globalFilter, pagination },
    getRowId: (row) => getRowId(row as TData),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
  });

  const pageCount = table.getPageCount();
  const currentPage = table.state.pagination.pageIndex + 1;
  const filteredCount = table.getFilteredRowModel().rows.length;

  const pageNumbers = React.useMemo(() => {
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= pageCount - 2) return [pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }, [currentPage, pageCount]);

  const filterControls = filters.map((filter) => {
    const value = (table.getColumn(filter.columnId)?.getFilterValue() as string | undefined) ?? ALL;

    return (
      <Select
        key={filter.columnId}
        value={value}
        onValueChange={(next) => {
          table.getColumn(filter.columnId)?.setFilterValue(next === ALL ? undefined : next);
          table.setPageIndex(0);
        }}
      >
        <SelectTrigger size="sm" className="w-full sm:w-auto sm:min-w-36">
          <ListFilter className="text-muted-foreground" />
          <SelectValue placeholder={filter.label} />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectItem value={ALL}>All {filter.label.toLowerCase()}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  });

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <InputGroup className="lg:w-72">
          <InputGroupInput
            type="search"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value || undefined);
              table.setPageIndex(0);
            }}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2">
          {filters.length > 0 ? (
            <>
              <div className="hidden flex-wrap items-center gap-2 lg:flex">{filterControls}</div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal data-icon="inline-start" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[80svh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow the list down to the {entityLabel} you care about.</SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-3 px-4 pb-6">{filterControls}</div>
                </SheetContent>
              </Sheet>
            </>
          ) : null}
          {toolbarActions}
        </div>
      </div>

      <CardContent className="flex flex-col gap-4 px-0 py-0">
        <div className="w-full overflow-x-auto">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4">
            <TableHeader className="**:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan} className="whitespace-nowrap">
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap py-3">
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            {table.getRowModel().rows.length} of {filteredCount.toLocaleString()} {entityLabel}
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    table.previousPage();
                  }}
                />
              </PaginationItem>
              {pageNumbers.map((pageNumber) => (
                <PaginationItem key={`page-${pageNumber}`} className="hidden sm:block">
                  <PaginationLink
                    href="#"
                    isActive={currentPage === pageNumber}
                    onClick={(event) => {
                      event.preventDefault();
                      table.setPageIndex(pageNumber - 1);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
