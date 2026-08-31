import Link from "next/link";
import { notFound } from "next/navigation";

import { Printer, Send } from "lucide-react";

import { BackLink, DetailHeader, FieldList, InfoCard } from "@/app/(main)/dashboard/dimension/_components/detail";
import { StatusBadge } from "@/app/(main)/dashboard/dimension/_components/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getQuote, quotes, repName } from "@/data/dimension";
import { formatCurrency, formatDate } from "@/lib/dimension-format";

export function generateStaticParams() {
  return quotes.slice(0, 24).map((quote) => ({ id: quote.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = getQuote(id);

  if (!quote) notFound();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <BackLink href="/dashboard/dimension/quotes" label="Back to quotes" />

      <DetailHeader
        title={quote.number}
        subtitle={`${quote.title} · ${formatCurrency(quote.total)}`}
        badges={
          <>
            <StatusBadge status={quote.status} />
            <span className="text-muted-foreground text-xs">Expires {formatDate(quote.expiresAt)}</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Printer data-icon="inline-start" />
              Print preview
            </Button>
            <Button size="sm" disabled>
              <Send data-icon="inline-start" />
              Send (disabled in demo)
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          <InfoCard title="Line items" description="Products and services included in this proposal.">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quote.lineItems.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="text-sm">{item.productName}</TableCell>
                      <TableCell className="text-right text-sm tabular-nums">{item.quantity}</TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums">{item.discount}%</TableCell>
                      <TableCell className="text-right text-sm tabular-nums">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </InfoCard>

          <InfoCard title="Notes">
            <p className="text-muted-foreground text-sm">{quote.notes}</p>
          </InfoCard>
        </div>

        <div className="space-y-4 md:space-y-6">
          <InfoCard title="Summary">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatCurrency(quote.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="tabular-nums">-{formatCurrency(quote.discount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="tabular-nums">{formatCurrency(quote.tax)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <dt>Total ({quote.currency})</dt>
                <dd className="tabular-nums">{formatCurrency(quote.total)}</dd>
              </div>
            </dl>
          </InfoCard>

          <InfoCard title="Details">
            <FieldList
              items={[
                {
                  label: "Company",
                  value: (
                    <Link href={`/dashboard/dimension/companies/${quote.companyId}`} className="hover:underline">
                      {quote.companyName}
                    </Link>
                  ),
                },
                {
                  label: "Deal",
                  value: (
                    <Link href={`/dashboard/dimension/deals/${quote.dealId}`} className="hover:underline">
                      {quote.dealName}
                    </Link>
                  ),
                },
                { label: "Contact", value: quote.contactName },
                { label: "Owner", value: repName(quote.ownerId) },
                { label: "Issued", value: formatDate(quote.issuedAt) },
                { label: "Expires", value: formatDate(quote.expiresAt) },
              ]}
            />
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
