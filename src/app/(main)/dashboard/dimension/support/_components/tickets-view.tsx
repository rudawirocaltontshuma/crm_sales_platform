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
import { PRIORITIES, TICKET_STATUSES, type Ticket } from "@/data/dimension";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatDate } from "@/lib/dimension-format";

type TicketRow = Ticket & { assigneeName: string };

const columns: ColumnDef<DataTableFeatures, TicketRow>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => <SortableHeader column={column} title="Ticket" />,
    cell: ({ row }) => (
      <div className="flex max-w-80 flex-col">
        <span className="font-medium text-sm">{row.original.number}</span>
        <span className="truncate text-muted-foreground text-xs">{row.original.subject}</span>
      </div>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => <SortableHeader column={column} title="Company" />,
    cell: ({ row }) => (
      <Link href={`/dashboard/dimension/companies/${row.original.companyId}`} className="text-sm hover:underline">
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
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <StatusBadge status={row.original.priority} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="text-sm">{row.original.category}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => <span className="text-sm">{row.original.channel}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "assigneeName",
    header: "Assignee",
    cell: ({ row }) => <span className="text-sm">{row.original.assigneeName}</span>,
  },
  {
    accessorKey: "firstResponseMinutes",
    header: ({ column }) => <SortableHeader column={column} title="First response" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.firstResponseMinutes} min</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Created" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt)}</span>,
  },
];

export function TicketsView({ tickets, categories }: { tickets: TicketRow[]; categories: string[] }) {
  const [tab, setTab] = React.useState("All");

  const visible = React.useMemo(
    () => (tab === "All" ? tickets : tickets.filter((ticket) => ticket.status === tab)),
    [tab, tickets],
  );

  const filters: TableFilterDef[] = [
    { columnId: "priority", label: "Priority", options: PRIORITIES },
    { columnId: "category", label: "Category", options: categories },
    { columnId: "channel", label: "Channel", options: ["Email", "Phone", "Chat", "Portal"] },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="All">All ({tickets.length})</TabsTrigger>
            {TICKET_STATUSES.map((status) => (
              <TabsTrigger key={status} value={status}>
                {status} ({tickets.filter((ticket) => ticket.status === status).length})
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
        entityLabel="tickets"
        searchPlaceholder="Search tickets by number, subject, or company"
        toolbarActions={
          <RecordFormDialog
            triggerLabel="New ticket"
            title="Create support ticket"
            description="Log a customer issue and route it to the right queue."
            successMessage="Ticket created"
            fields={[
              { name: "subject", label: "Subject", required: true, colSpan: 2 },
              { name: "company", label: "Company" },
              { name: "contact", label: "Contact" },
              { name: "status", label: "Status", type: "select", options: TICKET_STATUSES },
              { name: "priority", label: "Priority", type: "select", options: PRIORITIES },
              { name: "category", label: "Category", type: "select", options: categories },
              { name: "channel", label: "Channel", type: "select", options: ["Email", "Phone", "Chat", "Portal"] },
              { name: "description", label: "Description", type: "textarea", colSpan: 2 },
            ]}
          />
        }
      />
    </div>
  );
}
