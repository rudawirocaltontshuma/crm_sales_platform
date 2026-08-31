"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  SortableHeader,
  type TableFilterDef,
} from "@/app/(main)/dashboard/dimension/_components/data-table";
import { RecordFormDialog } from "@/app/(main)/dashboard/dimension/_components/record-form-dialog";
import { StatusBadge } from "@/app/(main)/dashboard/dimension/_components/status-badge";
import { Progress } from "@/components/ui/progress";
import { COMPANY_SIZES, type Company, repName } from "@/data/dimension";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatCompactCurrency, formatNumber } from "@/lib/dimension-format";

const columns: ColumnDef<DataTableFeatures, Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Company" />,
    cell: ({ row }) => (
      <Link href={`/dashboard/dimension/companies/${row.original.id}`} className="flex flex-col hover:underline">
        <span className="font-medium text-sm">{row.original.name}</span>
        <span className="text-muted-foreground text-xs">{row.original.domain}</span>
      </Link>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => <span className="text-sm">{row.original.industry}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: "equalsString",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.size}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "employees",
    header: ({ column }) => <SortableHeader column={column} title="Employees" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{formatNumber(row.original.employees)}</span>,
  },
  {
    accessorKey: "annualRevenue",
    header: ({ column }) => <SortableHeader column={column} title="Annual revenue" />,
    cell: ({ row }) => (
      <span className="font-medium text-sm tabular-nums">{formatCompactCurrency(row.original.annualRevenue)}</span>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original.region}</span>
        <span className="text-muted-foreground text-xs">{row.original.city}</span>
      </div>
    ),
    filterFn: "equalsString",
  },
  {
    accessorKey: "healthScore",
    header: ({ column }) => <SortableHeader column={column} title="Health" />,
    cell: ({ row }) => (
      <div className="flex w-24 items-center gap-2">
        <Progress value={row.original.healthScore} className="h-1.5" />
        <span className="text-sm tabular-nums">{row.original.healthScore}</span>
      </div>
    ),
  },
  {
    accessorKey: "ownerId",
    header: "Owner",
    cell: ({ row }) => <span className="text-sm">{repName(row.original.ownerId)}</span>,
  },
];

export function CompaniesTable({
  companies,
  industries,
  regions,
}: {
  companies: Company[];
  industries: string[];
  regions: string[];
}) {
  const filters: TableFilterDef[] = [
    { columnId: "status", label: "Status", options: ["Prospect", "Active Customer", "Partner", "Churned"] },
    { columnId: "industry", label: "Industry", options: industries },
    { columnId: "region", label: "Region", options: regions },
    { columnId: "size", label: "Size", options: COMPANY_SIZES },
  ];

  return (
    <DataTable
      data={companies}
      columns={columns}
      getRowId={(row) => row.id}
      filters={filters}
      entityLabel="companies"
      searchPlaceholder="Search companies by name, domain, or city"
      toolbarActions={
        <RecordFormDialog
          triggerLabel="New company"
          title="Create company"
          description="Register a new account in the DIMENSION workspace."
          successMessage="Company created"
          fields={[
            { name: "name", label: "Company name", required: true },
            { name: "domain", label: "Domain" },
            { name: "industry", label: "Industry", type: "select", options: industries },
            { name: "size", label: "Company size", type: "select", options: COMPANY_SIZES },
            { name: "region", label: "Region", type: "select", options: regions },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Prospect", "Active Customer", "Partner", "Churned"],
            },
            { name: "phone", label: "Phone" },
            { name: "revenue", label: "Annual revenue", type: "number" },
            { name: "description", label: "Description", type: "textarea", colSpan: 2 },
          ]}
        />
      }
    />
  );
}
