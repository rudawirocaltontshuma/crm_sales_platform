"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, SortableHeader, type TableFilterDef } from "@/app/(main)/dashboard/nexora/_components/data-table";
import { RecordFormDialog } from "@/app/(main)/dashboard/nexora/_components/record-form-dialog";
import { StatusBadge } from "@/app/(main)/dashboard/nexora/_components/status-badge";
import { Progress } from "@/components/ui/progress";
import { DEAL_STAGES, type Deal, PRIORITIES, repName } from "@/data/nexora";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatCurrency, formatDate } from "@/lib/nexora-format";

const columns: ColumnDef<DataTableFeatures, Deal>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Deal" />,
    cell: ({ row }) => (
      <Link href={`/dashboard/nexora/deals/${row.original.id}`} className="flex max-w-72 flex-col hover:underline">
        <span className="truncate font-medium text-sm">{row.original.name}</span>
        <span className="truncate text-muted-foreground text-xs">{row.original.primaryContactName}</span>
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
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => <StatusBadge status={row.original.stage} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "value",
    header: ({ column }) => <SortableHeader column={column} title="Value" />,
    cell: ({ row }) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.original.value)}</span>,
  },
  {
    accessorKey: "probability",
    header: ({ column }) => <SortableHeader column={column} title="Probability" />,
    cell: ({ row }) => (
      <div className="flex w-24 items-center gap-2">
        <Progress value={row.original.probability} className="h-1.5" />
        <span className="text-sm tabular-nums">{row.original.probability}%</span>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <StatusBadge status={row.original.priority} />,
    filterFn: "equalsString",
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
    accessorKey: "expectedCloseDate",
    header: ({ column }) => <SortableHeader column={column} title="Expected close" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{formatDate(row.original.expectedCloseDate)}</span>
    ),
  },
];

export function DealsTable({ deals, regions }: { deals: Deal[]; regions: string[] }) {
  const filters: TableFilterDef[] = [
    { columnId: "stage", label: "Stage", options: DEAL_STAGES },
    { columnId: "priority", label: "Priority", options: PRIORITIES },
    { columnId: "region", label: "Region", options: regions },
  ];

  return (
    <DataTable
      data={deals}
      columns={columns}
      getRowId={(row) => row.id}
      filters={filters}
      entityLabel="deals"
      searchPlaceholder="Search deals by name or company"
      toolbarActions={
        <RecordFormDialog
          triggerLabel="New deal"
          title="Create deal"
          description="Open a new opportunity and place it on the pipeline board."
          successMessage="Deal created"
          fields={[
            { name: "name", label: "Deal name", required: true, colSpan: 2 },
            { name: "company", label: "Company", required: true },
            { name: "contact", label: "Primary contact" },
            { name: "value", label: "Deal value", type: "number", required: true },
            { name: "stage", label: "Stage", type: "select", options: DEAL_STAGES },
            { name: "priority", label: "Priority", type: "select", options: PRIORITIES },
            { name: "close", label: "Expected close", type: "date" },
            { name: "nextStep", label: "Next step", type: "textarea", colSpan: 2 },
          ]}
        />
      }
    />
  );
}
