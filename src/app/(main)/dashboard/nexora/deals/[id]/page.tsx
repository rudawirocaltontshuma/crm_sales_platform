import Link from "next/link";
import { notFound } from "next/navigation";

import { CalendarClock, FilePlus2 } from "lucide-react";

import {
  ActivityTimeline,
  BackLink,
  DetailHeader,
  FieldList,
  InfoCard,
  TaskList,
} from "@/app/(main)/dashboard/nexora/_components/detail";
import { StatusBadge } from "@/app/(main)/dashboard/nexora/_components/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  activitiesForDeal,
  DEAL_STAGES,
  deals,
  getDeal,
  getProduct,
  quotesForDeal,
  repName,
  tasksForDeal,
} from "@/data/nexora";
import { formatCurrency, formatDate } from "@/lib/nexora-format";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return deals.slice(0, 24).map((deal) => ({ id: deal.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = getDeal(id);

  if (!deal) notFound();

  const stageIndex = DEAL_STAGES.indexOf(deal.stage);
  const dealProducts = deal.productIds
    .map((productId) => getProduct(productId))
    .filter((product) => product !== undefined);
  const dealQuotes = quotesForDeal(deal.id);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <BackLink href="/dashboard/nexora/deals" label="Back to deals" />

      <DetailHeader
        title={deal.name}
        subtitle={`${formatCurrency(deal.value)} · closing ${formatDate(deal.expectedCloseDate)}`}
        badges={
          <>
            <StatusBadge status={deal.stage} />
            <StatusBadge status={deal.priority} />
            <span className="text-muted-foreground text-xs">Deal ID {deal.id}</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarClock data-icon="inline-start" />
              Log activity
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/nexora/quotes">
                <FilePlus2 data-icon="inline-start" />
                Build quote
              </Link>
            </Button>
          </>
        }
      />

      <InfoCard title="Pipeline stage" description={`Next step: ${deal.nextStep}`}>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {DEAL_STAGES.map((stage, index) => (
              <div
                key={stage}
                className={cn(
                  "rounded-md border px-3 py-2 text-center text-xs",
                  index <= stageIndex && deal.stage !== "Lost"
                    ? "border-primary/30 bg-primary/10 text-foreground"
                    : "text-muted-foreground",
                  deal.stage === "Lost" && stage === "Lost" && "border-rose-500/30 bg-rose-500/10 text-foreground",
                )}
              >
                {stage}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Progress value={deal.probability} className="h-2" />
            <span className="shrink-0 text-sm tabular-nums">{deal.probability}% likely</span>
          </div>
        </div>
      </InfoCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          <InfoCard title="Deal details">
            <FieldList
              items={[
                {
                  label: "Company",
                  value: (
                    <Link href={`/dashboard/nexora/companies/${deal.companyId}`} className="hover:underline">
                      {deal.companyName}
                    </Link>
                  ),
                },
                {
                  label: "Primary contact",
                  value: (
                    <Link href={`/dashboard/nexora/contacts/${deal.primaryContactId}`} className="hover:underline">
                      {deal.primaryContactName}
                    </Link>
                  ),
                },
                { label: "Owner", value: repName(deal.ownerId) },
                { label: "Region", value: deal.region },
                { label: "Source", value: deal.source },
                { label: "Created", value: formatDate(deal.createdAt) },
                { label: "Expected close", value: formatDate(deal.expectedCloseDate) },
                { label: "Closed", value: deal.closedAt ? formatDate(deal.closedAt) : "—" },
                { label: "Age", value: `${deal.ageInDays} days` },
                { label: "Lost reason", value: deal.lostReason ?? "—" },
              ]}
            />
          </InfoCard>

          <InfoCard title="Activity" description="Everything logged against this opportunity.">
            <ActivityTimeline items={activitiesForDeal(deal.id)} />
          </InfoCard>
        </div>

        <div className="space-y-4 md:space-y-6">
          <InfoCard title="Products" description="Line items attached to this opportunity.">
            <ul className="divide-y">
              {dealProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{product.name}</p>
                    <p className="text-muted-foreground text-xs">{product.sku}</p>
                  </div>
                  <span className="text-sm tabular-nums">{formatCurrency(product.price)}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Quotes">
            {dealQuotes.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">No quotes issued yet.</p>
            ) : (
              <ul className="divide-y">
                {dealQuotes.map((quote) => (
                  <li key={quote.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm">{quote.number}</p>
                      <p className="text-muted-foreground text-xs">{formatCurrency(quote.total)}</p>
                    </div>
                    <StatusBadge status={quote.status} />
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <InfoCard title="Tasks">
            <TaskList items={tasksForDeal(deal.id)} />
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
