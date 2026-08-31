import { CheckCircle2, FileText, Send, XCircle } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/dimension/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/dimension/_components/stat-card";
import { companies, products, quotes } from "@/data/dimension";
import { formatCompactCurrency, formatNumber } from "@/lib/dimension-format";

import { QuotesTable } from "./_components/quotes-table";

export const metadata = { title: "Quotes | Dimension CRM" };

export default function Page() {
  const countOf = (status: string) => quotes.filter((quote) => quote.status === status).length;
  const acceptedValue = quotes
    .filter((quote) => quote.status === "Accepted")
    .reduce((sum, quote) => sum + quote.total, 0);

  const builderProducts = products
    .filter((product) => product.status === "Active")
    .slice(0, 40)
    .map((product) => ({ id: product.id, name: product.name, price: product.price }));
  const companyNames = companies.slice(0, 60).map((company) => company.name);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Quotes"
        description="Proposals from draft through acceptance, with a live quote builder for new pricing scenarios."
      />

      <StatGrid>
        <StatCard label="Drafts" value={formatNumber(countOf("Draft"))} icon={FileText} />
        <StatCard label="Sent" value={formatNumber(countOf("Sent"))} icon={Send} delta={6} />
        <StatCard
          label="Accepted"
          value={formatNumber(countOf("Accepted"))}
          icon={CheckCircle2}
          delta={9}
          hint={`${formatCompactCurrency(acceptedValue)} booked`}
        />
        <StatCard label="Rejected" value={formatNumber(countOf("Rejected"))} icon={XCircle} delta={-4} />
      </StatGrid>

      <QuotesTable quotes={quotes} products={builderProducts} companies={companyNames} />
    </div>
  );
}
