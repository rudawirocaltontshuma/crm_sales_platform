"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, SortableHeader, type TableFilterDef } from "@/app/(main)/dashboard/nexora/_components/data-table";
import { RecordFormDialog } from "@/app/(main)/dashboard/nexora/_components/record-form-dialog";
import { InitialsAvatar, StatusBadge } from "@/app/(main)/dashboard/nexora/_components/status-badge";
import { type Contact, repName } from "@/data/nexora";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatDate } from "@/lib/nexora-format";

const columns: ColumnDef<DataTableFeatures, Contact>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => <SortableHeader column={column} title="Contact" />,
    cell: ({ row }) => (
      <Link href={`/dashboard/nexora/contacts/${row.original.id}`} className="flex items-center gap-3 hover:underline">
        <InitialsAvatar initials={row.original.initials} />
        <span className="flex flex-col">
          <span className="font-medium text-sm">{row.original.fullName}</span>
          <span className="text-muted-foreground text-xs">{row.original.email}</span>
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="text-sm">{row.original.title}</span>,
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
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <span className="text-sm">{row.original.department}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-muted-foreground text-sm tabular-nums">{row.original.phone}</span>,
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => <span className="text-sm">{row.original.country}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "ownerId",
    header: "Owner",
    cell: ({ row }) => <span className="text-sm">{repName(row.original.ownerId)}</span>,
  },
  {
    accessorKey: "lastContactedAt",
    header: ({ column }) => <SortableHeader column={column} title="Last contact" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{formatDate(row.original.lastContactedAt)}</span>
    ),
  },
];

export function ContactsTable({
  contacts,
  departments,
  countries,
}: {
  contacts: Contact[];
  departments: string[];
  countries: string[];
}) {
  const filters: TableFilterDef[] = [
    { columnId: "status", label: "Status", options: ["Active", "Inactive", "Do Not Contact"] },
    { columnId: "department", label: "Department", options: departments },
    { columnId: "country", label: "Country", options: countries },
  ];

  return (
    <DataTable
      data={contacts}
      columns={columns}
      getRowId={(row) => row.id}
      filters={filters}
      entityLabel="contacts"
      searchPlaceholder="Search contacts by name, email, or company"
      toolbarActions={
        <RecordFormDialog
          triggerLabel="New contact"
          title="Create contact"
          description="Add a person to an existing account record."
          successMessage="Contact created"
          fields={[
            { name: "firstName", label: "First name", required: true },
            { name: "lastName", label: "Last name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone" },
            { name: "title", label: "Job title" },
            { name: "department", label: "Department", type: "select", options: departments },
            { name: "country", label: "Country", type: "select", options: countries },
            { name: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Do Not Contact"] },
            { name: "notes", label: "Notes", type: "textarea", colSpan: 2 },
          ]}
        />
      }
    />
  );
}
