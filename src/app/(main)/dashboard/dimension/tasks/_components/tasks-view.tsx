"use client";

import * as React from "react";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  SortableHeader,
  type TableFilterDef,
} from "@/app/(main)/dashboard/dimension/_components/data-table";
import { RecordFormDialog } from "@/app/(main)/dashboard/dimension/_components/record-form-dialog";
import { StatusBadge } from "@/app/(main)/dashboard/dimension/_components/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type CrmTask, PRIORITIES, TASK_STATUSES } from "@/data/dimension";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatDate } from "@/lib/dimension-format";

type TaskRow = CrmTask & { ownerName: string };

const columns: ColumnDef<DataTableFeatures, TaskRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} title="Task" />,
    cell: ({ row }) => (
      <div className="flex max-w-80 flex-col">
        <span className="truncate font-medium text-sm">{row.original.title}</span>
        <span className="truncate text-muted-foreground text-xs">{row.original.description}</span>
      </div>
    ),
  },
  {
    accessorKey: "relatedName",
    header: "Related to",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/dimension/deals/${row.original.relatedId}`}
        className="max-w-56 truncate text-sm hover:underline"
      >
        {row.original.relatedName}
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
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <StatusBadge status={row.original.priority} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    cell: ({ row }) => <span className="text-sm">{row.original.ownerName}</span>,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <SortableHeader column={column} title="Due" />,
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.dueDate)}</span>,
  },
  {
    accessorKey: "completedAt",
    header: "Completed",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{formatDate(row.original.completedAt)}</span>,
  },
];

const filters: TableFilterDef[] = [
  { columnId: "status", label: "Status", options: TASK_STATUSES },
  { columnId: "priority", label: "Priority", options: PRIORITIES },
];

export function TasksView({ tasks }: { tasks: TaskRow[] }) {
  const [tab, setTab] = React.useState("All");

  const visible = React.useMemo(
    () => (tab === "All" ? tasks : tasks.filter((task) => task.status === tab)),
    [tab, tasks],
  );

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="All">All ({tasks.length})</TabsTrigger>
            {TASK_STATUSES.map((status) => (
              <TabsTrigger key={status} value={status}>
                {status} ({tasks.filter((task) => task.status === status).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <DataTable
        key={tab}
        data={visible}
        columns={columns}
        getRowId={(row) => row.id}
        filters={filters}
        entityLabel="tasks"
        searchPlaceholder="Search tasks by title or account"
        toolbarActions={
          <RecordFormDialog
            triggerLabel="New task"
            title="Create task"
            description="Add a follow-up for yourself or a teammate."
            successMessage="Task created"
            fields={[
              { name: "title", label: "Title", required: true, colSpan: 2 },
              { name: "related", label: "Related deal" },
              { name: "owner", label: "Owner" },
              { name: "status", label: "Status", type: "select", options: TASK_STATUSES },
              { name: "priority", label: "Priority", type: "select", options: PRIORITIES },
              { name: "due", label: "Due date", type: "date" },
              { name: "description", label: "Description", type: "textarea", colSpan: 2 },
            ]}
          />
        }
      />
    </div>
  );
}
