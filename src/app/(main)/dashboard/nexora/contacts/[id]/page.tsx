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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activitiesForContact, contacts, dealsForCompany, getContact, repName } from "@/data/nexora";
import { formatCurrency, formatDate } from "@/lib/nexora-format";

export function generateStaticParams() {
  return contacts.slice(0, 24).map((contact) => ({ id: contact.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = getContact(id);

  if (!contact) notFound();

  const contactActivities = activitiesForContact(contact.id).slice(0, 10);
  const companyDeals = dealsForCompany(contact.companyId).slice(0, 6);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <BackLink href="/dashboard/nexora/contacts" label="Back to contacts" />

      <DetailHeader
        title={contact.fullName}
        subtitle={`${contact.title} · ${contact.companyName}`}
        media={<InitialsAvatar initials={contact.initials} className="size-12 text-base" />}
        badges={
          <>
            <StatusBadge status={contact.status} />
            {contact.isPrimary ? <Badge variant="outline">Primary contact</Badge> : null}
            {contact.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
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
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          <InfoCard title="Contact information">
            <FieldList
              items={[
                { label: "Email", value: contact.email },
                { label: "Phone", value: contact.phone },
                { label: "Department", value: contact.department },
                {
                  label: "Company",
                  value: (
                    <Link href={`/dashboard/nexora/companies/${contact.companyId}`} className="hover:underline">
                      {contact.companyName}
                    </Link>
                  ),
                },
                { label: "Location", value: `${contact.city}, ${contact.country}` },
                { label: "Owner", value: repName(contact.ownerId) },
                { label: "Created", value: formatDate(contact.createdAt) },
                { label: "Last contacted", value: formatDate(contact.lastContactedAt) },
              ]}
            />
          </InfoCard>

          <InfoCard title="Activity history" description="Calls, meetings, emails, and notes involving this contact.">
            <ActivityTimeline items={contactActivities} />
          </InfoCard>
        </div>

        <div className="space-y-4 md:space-y-6">
          <InfoCard title="Related deals" description={`Open and closed deals at ${contact.companyName}.`}>
            {companyDeals.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">No deals for this account.</p>
            ) : (
              <ul className="divide-y">
                {companyDeals.map((deal) => (
                  <li key={deal.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <Link href={`/dashboard/nexora/deals/${deal.id}`} className="min-w-0 flex-1 hover:underline">
                      <p className="truncate text-sm">{deal.name}</p>
                      <p className="text-muted-foreground text-xs">{formatCurrency(deal.value)}</p>
                    </Link>
                    <StatusBadge status={deal.stage} />
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
