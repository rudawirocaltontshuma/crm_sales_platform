import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportCard() {
  return (
    <Card size="sm" className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 px-4">
        <CardTitle className="truncate text-sm">Need a hand?</CardTitle>
        <CardDescription className="line-clamp-3">
          Browse the source or open an issue on{" "}
          <Link
            href="https://github.com/rudawirocaltontshuma/crm_sales_platform"
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:underline"
          >
            GitHub
          </Link>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
