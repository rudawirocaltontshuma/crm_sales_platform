"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, SortableHeader, type TableFilterDef } from "@/app/(main)/dashboard/nexora/_components/data-table";
import { StatusBadge } from "@/app/(main)/dashboard/nexora/_components/status-badge";
import { QUOTE_STATUSES, type Quote, repName } from "@/data/nexora";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatCurrency, formatDate } from "@/lib/nexora-format";

import { type BuilderProduct, QuoteBuilder } from "./quote-builder";

const columns: ColumnDef<DataTableFeatures, Quote>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => <SortableHeader column={column} title="Quote" />,
    cell: ({ row }) => (
      <Link href={`/dashboard/nexora/quotes/${row.original.id}`} className="flex flex-col hover:underline">
        <span className="font-medium text-sm">{row.original.number}</span>
        <span className="text-muted-foreground text-xs">{row.original.title}</span>
      </Link>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => <SortableHeader column={column} title="Company" />,
    cell: ({ row }) => (
      <Link href={`/dashboard/nexora/companies/${row.original.companyId}`} className="text-sm hover:underline">
        {row.original.companyName}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "total",
    header: ({ column }) => <SortableHeader column={column} title="Total" />,
    cell: ({ row }) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.original.total)}</span>,
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => <span className="text-sm tabular-nums">{formatCurrency(row.original.discount)}</span>,
  },
  {
    accessorKey: "contactName",
    header: "Contact",
    cell: ({ row }) => <span className="text-sm">{row.original.contactName}</span>,
  },
  {
    accessorKey: "ownerId",
    header: "Owner",
    cell: ({ row }) => <span className="text-sm">{repName(row.original.ownerId)}</span>,
  },
  {
    accessorKey: "issuedAt",
    header: ({ column }) => <SortableHeader column={column} title="Issued" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{formatDate(row.original.issuedAt)}</span>,
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{formatDate(row.original.expiresAt)}</span>,
  },
];

const filters: TableFilterDef[] = [{ columnId: "status", label: "Status", options: QUOTE_STATUSES }];

export function QuotesTable({
  quotes,
  products,
  companies,
}: {
  quotes: Quote[];
  products: BuilderProduct[];
  companies: string[];
}) {
  return (
    <DataTable
      data={quotes}
      columns={columns}
      getRowId={(row) => row.id}
      filters={filters}
      entityLabel="quotes"
      searchPlaceholder="Search quotes by number or company"
      toolbarActions={<QuoteBuilder products={products} companies={companies} />}
    />
  );
}
