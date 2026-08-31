"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  SortableHeader,
  type TableFilterDef,
} from "@/app/(main)/dashboard/dimension/_components/data-table";
import { RecordFormDialog } from "@/app/(main)/dashboard/dimension/_components/record-form-dialog";
import { InitialsAvatar, StatusBadge } from "@/app/(main)/dashboard/dimension/_components/status-badge";
import { Progress } from "@/components/ui/progress";
import { LEAD_STATUSES, type Lead, repName } from "@/data/dimension";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatCurrency, formatDate } from "@/lib/dimension-format";

const columns: ColumnDef<DataTableFeatures, Lead>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => <SortableHeader column={column} title="Lead" />,
    cell: ({ row }) => (
      <Link href={`/dashboard/dimension/leads/${row.original.id}`} className="flex items-center gap-3 hover:underline">
        <InitialsAvatar initials={row.original.initials} />
        <span className="flex flex-col">
          <span className="font-medium text-sm">{row.original.fullName}</span>
          <span className="text-muted-foreground text-xs">{row.original.title}</span>
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => <SortableHeader column={column} title="Company" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original.companyName}</span>
        <span className="text-muted-foreground text-xs">{row.original.industry}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <StatusBadge status={row.original.rating} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => <span className="text-sm">{row.original.source}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "score",
    header: ({ column }) => <SortableHeader column={column} title="Score" />,
    cell: ({ row }) => (
      <div className="flex w-28 items-center gap-2">
        <Progress value={row.original.score} className="h-1.5" />
        <span className="text-sm tabular-nums">{row.original.score}</span>
      </div>
    ),
  },
  {
    accessorKey: "estimatedValue",
    header: ({ column }) => <SortableHeader column={column} title="Est. value" />,
    cell: ({ row }) => (
      <span className="font-medium text-sm tabular-nums">{formatCurrency(row.original.estimatedValue)}</span>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => <span className="text-sm">{row.original.region}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "ownerId",
    header: "Owner",
    cell: ({ row }) => <span className="text-sm">{repName(row.original.ownerId)}</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Created" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt)}</span>,
  },
];

export function LeadsTable({ leads, sources, regions }: { leads: Lead[]; sources: string[]; regions: string[] }) {
  const filters: TableFilterDef[] = [
    { columnId: "status", label: "Status", options: LEAD_STATUSES },
    { columnId: "rating", label: "Rating", options: ["Hot", "Warm", "Cold"] },
    { columnId: "source", label: "Source", options: sources },
    { columnId: "region", label: "Region", options: regions },
  ];

  return (
    <DataTable
      data={leads}
      columns={columns}
      getRowId={(row) => row.id}
      filters={filters}
      entityLabel="leads"
      searchPlaceholder="Search leads by name, company, or email"
      toolbarActions={
        <RecordFormDialog
          triggerLabel="New lead"
          title="Create lead"
          description="Capture a new inbound or outbound lead for qualification."
          successMessage="Lead captured"
          fields={[
            { name: "firstName", label: "First name", required: true },
            { name: "lastName", label: "Last name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone" },
            { name: "company", label: "Company" },
            { name: "title", label: "Job title" },
            { name: "status", label: "Status", type: "select", options: LEAD_STATUSES },
            { name: "source", label: "Source", type: "select", options: sources },
            { name: "value", label: "Estimated value", type: "number" },
            { name: "region", label: "Region", type: "select", options: regions },
            { name: "notes", label: "Notes", type: "textarea", colSpan: 2 },
          ]}
        />
      }
    />
  );
}
