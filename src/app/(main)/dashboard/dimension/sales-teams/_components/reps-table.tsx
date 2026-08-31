"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  SortableHeader,
  type TableFilterDef,
} from "@/app/(main)/dashboard/dimension/_components/data-table";
import { RecordFormDialog } from "@/app/(main)/dashboard/dimension/_components/record-form-dialog";
import { InitialsAvatar } from "@/app/(main)/dashboard/dimension/_components/status-badge";
import { Progress } from "@/components/ui/progress";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatCompactCurrency } from "@/lib/dimension-format";

export interface RepRow {
  id: string;
  name: string;
  initials: string;
  avatarTone: string;
  title: string;
  email: string;
  team: string;
  region: string;
  quota: number;
  revenue: number;
  attainment: number;
  won: number;
  open: number;
  winRate: number;
}

const columns: ColumnDef<DataTableFeatures, RepRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Representative" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <InitialsAvatar initials={row.original.initials} tone={row.original.avatarTone} />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.original.name}</span>
          <span className="text-muted-foreground text-xs">{row.original.title}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => <span className="text-sm">{row.original.team}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => <span className="text-sm">{row.original.region}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "quota",
    header: ({ column }) => <SortableHeader column={column} title="Quota" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{formatCompactCurrency(row.original.quota)}</span>,
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => <SortableHeader column={column} title="Closed-won" />,
    cell: ({ row }) => (
      <span className="font-medium text-sm tabular-nums">{formatCompactCurrency(row.original.revenue)}</span>
    ),
  },
  {
    accessorKey: "attainment",
    header: ({ column }) => <SortableHeader column={column} title="Attainment" />,
    cell: ({ row }) => (
      <div className="flex w-28 items-center gap-2">
        <Progress value={Math.min(row.original.attainment, 100)} className="h-1.5" />
        <span className="text-sm tabular-nums">{row.original.attainment}%</span>
      </div>
    ),
  },
  {
    accessorKey: "won",
    header: ({ column }) => <SortableHeader column={column} title="Won" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.won}</span>,
  },
  {
    accessorKey: "open",
    header: ({ column }) => <SortableHeader column={column} title="Open" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.open}</span>,
  },
  {
    accessorKey: "winRate",
    header: ({ column }) => <SortableHeader column={column} title="Win rate" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.winRate}%</span>,
  },
];

export function RepsTable({ reps, teams, regions }: { reps: RepRow[]; teams: string[]; regions: string[] }) {
  const filters: TableFilterDef[] = [
    { columnId: "team", label: "Team", options: teams },
    { columnId: "region", label: "Region", options: regions },
  ];

  return (
    <DataTable
      data={reps}
      columns={columns}
      getRowId={(row) => row.id}
      filters={filters}
      entityLabel="representatives"
      searchPlaceholder="Search representatives"
      toolbarActions={
        <RecordFormDialog
          triggerLabel="Add representative"
          title="Add representative"
          description="Invite a seller to a team and assign their quota."
          successMessage="Representative added"
          fields={[
            { name: "name", label: "Full name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "title", label: "Title" },
            { name: "team", label: "Team", type: "select", options: teams },
            { name: "region", label: "Region", type: "select", options: regions },
            { name: "quota", label: "Annual quota", type: "number" },
          ]}
        />
      }
    />
  );
}
