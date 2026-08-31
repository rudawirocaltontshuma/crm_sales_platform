import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface ReportColumn {
  key: string;
  label: string;
  align?: "left" | "right";
}

export function ReportTable({
  title,
  description,
  columns,
  rows,
}: {
  title: string;
  description: string;
  columns: ReportColumn[];
  rows: Record<string, string>[];
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <div className="w-full overflow-x-auto">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={column.align === "right" ? "whitespace-nowrap text-right" : "whitespace-nowrap"}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id ?? row[columns[0].key]}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={
                        column.align === "right"
                          ? "whitespace-nowrap py-3 text-right text-sm tabular-nums"
                          : "whitespace-nowrap py-3 text-sm"
                      }
                    >
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
