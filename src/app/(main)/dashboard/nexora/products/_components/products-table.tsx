"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import { DataTable, SortableHeader, type TableFilterDef } from "@/app/(main)/dashboard/nexora/_components/data-table";
import { RecordFormDialog } from "@/app/(main)/dashboard/nexora/_components/record-form-dialog";
import { StatusBadge } from "@/app/(main)/dashboard/nexora/_components/status-badge";
import type { Product } from "@/data/nexora";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/nexora-format";

const columns: ColumnDef<DataTableFeatures, Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Product" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.name}</span>
        <span className="text-muted-foreground text-xs">{row.original.sku}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="text-sm">{row.original.category}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "billing",
    header: "Billing",
    cell: ({ row }) => <span className="text-sm">{row.original.billing}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} title="Price" />,
    cell: ({ row }) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.original.price)}</span>,
  },
  {
    accessorKey: "margin",
    header: ({ column }) => <SortableHeader column={column} title="Margin" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.margin}%</span>,
  },
  {
    accessorKey: "unitsSold",
    header: ({ column }) => <SortableHeader column={column} title="Units sold" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{formatNumber(row.original.unitsSold)}</span>,
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => <SortableHeader column={column} title="Revenue" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{formatCompactCurrency(row.original.revenue)}</span>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="flex items-center gap-1 text-sm tabular-nums">
        <Star className="size-3.5 fill-amber-400 text-amber-400" />
        {row.original.rating.toFixed(1)}
      </span>
    ),
  },
];

export function ProductsTable({ products, categories }: { products: Product[]; categories: string[] }) {
  const filters: TableFilterDef[] = [
    { columnId: "category", label: "Category", options: categories },
    { columnId: "status", label: "Status", options: ["Active", "Draft", "Retired"] },
    { columnId: "billing", label: "Billing", options: ["One-time", "Monthly", "Annual"] },
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      getRowId={(row) => row.id}
      filters={filters}
      entityLabel="products"
      searchPlaceholder="Search products by name or SKU"
      toolbarActions={
        <RecordFormDialog
          triggerLabel="New product"
          title="Create product"
          description="Add a catalog item that can be attached to deals and quotes."
          successMessage="Product created"
          fields={[
            { name: "name", label: "Product name", required: true },
            { name: "sku", label: "SKU" },
            { name: "category", label: "Category", type: "select", options: categories },
            { name: "billing", label: "Billing", type: "select", options: ["One-time", "Monthly", "Annual"] },
            { name: "price", label: "List price", type: "number", required: true },
            { name: "cost", label: "Unit cost", type: "number" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Draft", "Retired"] },
            { name: "description", label: "Description", type: "textarea", colSpan: 2 },
          ]}
        />
      }
    />
  );
}
