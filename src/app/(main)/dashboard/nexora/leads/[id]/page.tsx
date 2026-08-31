import Link from "next/link";
import { notFound } from "next/navigation";

import { Mail, Phone } from "lucide-react";

import {
  ActivityTimeline,
  BackLink,
  DetailHeader,
  FieldList,
  InfoCard,
} from "@/app/(main)/dashboard/nexora/_components/detail";
import { InitialsAvatar, StatusBadge } from "@/app/(main)/dashboard/nexora/_components/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { activities, getLead, leads, repName } from "@/data/nexora";
import { formatCurrency, formatDate } from "@/lib/nexora-format";

export function generateStaticParams() {
  return leads.slice(0, 24).map((lead) => ({ id: lead.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = getLead(id);

  if (!lead) notFound();

  const relatedActivities = activities
    .filter((activity) => activity.contactName === lead.fullName || activity.companyName === lead.companyName)
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <BackLink href="/dashboard/nexora/leads" label="Back to leads" />

      <DetailHeader
        title={lead.fullName}
        subtitle={`${lead.title} at ${lead.companyName}`}
        media={<InitialsAvatar initials={lead.initials} className="size-12 text-base" />}
        badges={
          <>
            <StatusBadge status={lead.status} />
            <StatusBadge status={lead.rating} />
            <span className="text-muted-foreground text-xs">Lead ID {lead.id}</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Mail data-icon="inline-start" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Phone data-icon="inline-start" />
              Call
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/nexora/deals">Convert to deal</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          <InfoCard title="Lead details" description="Everything captured during intake and qualification.">
            <FieldList
              items={[
                { label: "Email", value: lead.email },
                { label: "Phone", value: lead.phone },
                { label: "Company", value: lead.companyName },
                { label: "Industry", value: lead.industry },
                { label: "Source", value: lead.source },
                { label: "Owner", value: repName(lead.ownerId) },
                { label: "Region", value: `${lead.city}, ${lead.country}` },
                { label: "Estimated value", value: formatCurrency(lead.estimatedValue) },
                { label: "Created", value: formatDate(lead.createdAt) },
                { label: "Last contacted", value: formatDate(lead.lastContactedAt) },
              ]}
            />
          </InfoCard>

          <InfoCard title="Activity" description="Recent touchpoints connected to this lead.">
            <ActivityTimeline items={relatedActivities} emptyMessage="No touchpoints logged for this lead yet." />
          </InfoCard>
        </div>

        <div className="space-y-4 md:space-y-6">
          <InfoCard title="Lead score">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-3xl tabular-nums">{lead.score}</span>
                <StatusBadge status={lead.rating} />
              </div>
              <Progress value={lead.score} />
              <p className="text-muted-foreground text-sm">
                Scored from firmographic fit, engagement recency, and channel intent signals.
              </p>
            </div>
          </InfoCard>

          <InfoCard title="Notes">
            <p className="text-muted-foreground text-sm">{lead.notes}</p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
