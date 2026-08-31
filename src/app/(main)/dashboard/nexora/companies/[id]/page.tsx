import Link from "next/link";
import { notFound } from "next/navigation";

import { Globe, Phone } from "lucide-react";

import {
  ActivityTimeline,
  BackLink,
  DetailHeader,
  FieldList,
  InfoCard,
  TaskList,
} from "@/app/(main)/dashboard/nexora/_components/detail";
import { InitialsAvatar, StatusBadge } from "@/app/(main)/dashboard/nexora/_components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  activitiesForCompany,
  companies,
  contactsForCompany,
  dealsForCompany,
  getCompany,
  repName,
  tasksForCompany,
  ticketsForCompany,
} from "@/data/nexora";
import { formatCompactCurrency, formatCurrency, formatDate, formatNumber } from "@/lib/nexora-format";

export function generateStaticParams() {
  return companies.slice(0, 24).map((company) => ({ id: company.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = getCompany(id);

  if (!company) notFound();

  const companyContacts = contactsForCompany(company.id);
  const companyDeals = dealsForCompany(company.id);
  const companyActivities = activitiesForCompany(company.id);
  const companyTasks = tasksForCompany(company.id);
  const companyTickets = ticketsForCompany(company.id);

  const wonValue = companyDeals.filter((deal) => deal.stage === "Won").reduce((sum, deal) => sum + deal.value, 0);
  const openValue = companyDeals
    .filter((deal) => deal.stage !== "Won" && deal.stage !== "Lost")
    .reduce((sum, deal) => sum + deal.value, 0);

  const timeline = [
    {
      id: "created",
      label: "Account created",
      date: company.createdAt,
      detail: `Owned by ${repName(company.ownerId)}`,
    },
    ...companyDeals.slice(0, 5).map((deal) => ({
      id: deal.id,
      label: `Deal opened — ${deal.name}`,
      date: deal.createdAt,
      detail: `${formatCurrency(deal.value)} · ${deal.stage}`,
    })),
    ...companyTickets.slice(0, 3).map((ticket) => ({
      id: ticket.id,
      label: `Support ticket ${ticket.number}`,
      date: ticket.createdAt,
      detail: `${ticket.subject} · ${ticket.status}`,
    })),
    { id: "last", label: "Last activity", date: company.lastActivityAt, detail: "Most recent logged touchpoint" },
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <BackLink href="/dashboard/nexora/companies" label="Back to companies" />

      <DetailHeader
        title={company.name}
        subtitle={`${company.industry} · ${company.city}, ${company.country}`}
        media={<InitialsAvatar initials={company.name.slice(0, 2).toUpperCase()} className="size-12 text-base" />}
        badges={
          <>
            <StatusBadge status={company.status} />
            {company.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Phone data-icon="inline-start" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Globe data-icon="inline-start" />
              Website
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="space-y-1">
            <p className="text-muted-foreground text-sm">Closed-won revenue</p>
            <p className="font-medium text-2xl tabular-nums">{formatCompactCurrency(wonValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-muted-foreground text-sm">Open pipeline</p>
            <p className="font-medium text-2xl tabular-nums">{formatCompactCurrency(openValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-muted-foreground text-sm">Contacts</p>
            <p className="font-medium text-2xl tabular-nums">{companyContacts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm">Health score</p>
            <div className="flex items-center gap-3">
              <span className="font-medium text-2xl tabular-nums">{company.healthScore}</span>
              <Progress value={company.healthScore} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="gap-4">
        <div className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <InfoCard title="Company profile" description={company.description}>
            <FieldList
              items={[
                { label: "Domain", value: company.domain },
                { label: "Phone", value: company.phone },
                { label: "Address", value: `${company.address}, ${company.city}, ${company.state}` },
                { label: "Country", value: company.country },
                { label: "Region", value: company.region },
                { label: "Industry", value: company.industry },
                { label: "Employees", value: formatNumber(company.employees) },
                { label: "Annual revenue", value: formatCurrency(company.annualRevenue) },
                { label: "Account owner", value: repName(company.ownerId) },
                { label: "Customer since", value: formatDate(company.createdAt) },
              ]}
            />
          </InfoCard>
        </TabsContent>

        <TabsContent value="contacts">
          <InfoCard title="Contacts" description={`${companyContacts.length} people mapped to this account.`}>
            <ul className="divide-y">
              {companyContacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/dashboard/nexora/contacts/${contact.id}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    <InitialsAvatar initials={contact.initials} />
                    <span className="flex flex-col">
                      <span className="text-sm">{contact.fullName}</span>
                      <span className="text-muted-foreground text-xs">{contact.title}</span>
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    {contact.isPrimary ? <Badge variant="outline">Primary</Badge> : null}
                    <StatusBadge status={contact.status} />
                  </div>
                </li>
              ))}
            </ul>
          </InfoCard>
        </TabsContent>

        <TabsContent value="deals">
          <InfoCard title="Deals" description={`${companyDeals.length} opportunities linked to this account.`}>
            {companyDeals.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground text-sm">No deals yet for this account.</p>
            ) : (
              <ul className="divide-y">
                {companyDeals.map((deal) => (
                  <li
                    key={deal.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Link href={`/dashboard/nexora/deals/${deal.id}`} className="min-w-0 flex-1 hover:underline">
                      <p className="truncate text-sm">{deal.name}</p>
                      <p className="text-muted-foreground text-xs">
                        Expected {formatDate(deal.expectedCloseDate)} · {repName(deal.ownerId)}
                      </p>
                    </Link>
                    <div className="flex items-center gap-3">
                      <span className="text-sm tabular-nums">{formatCurrency(deal.value)}</span>
                      <StatusBadge status={deal.stage} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>
        </TabsContent>

        <TabsContent value="activities">
          <InfoCard title="Activities" description="Chronological log of every touchpoint with this account.">
            <ActivityTimeline items={companyActivities.slice(0, 20)} />
          </InfoCard>
        </TabsContent>

        <TabsContent value="tasks">
          <InfoCard title="Tasks" description="Open and completed follow-ups tied to this account.">
            <TaskList items={companyTasks} />
          </InfoCard>
        </TabsContent>

        <TabsContent value="timeline">
          <InfoCard title="Relationship timeline" description="Key milestones across the customer lifecycle.">
            <ol className="relative space-y-6 border-border/70 border-l pl-6">
              {timeline.map((entry) => (
                <li key={entry.id} className="relative">
                  <span className="-left-[1.65rem] absolute top-1.5 size-2.5 rounded-full bg-primary" />
                  <p className="font-medium text-sm">{entry.label}</p>
                  <p className="text-muted-foreground text-sm">{entry.detail}</p>
                  <p className="text-muted-foreground text-xs">{formatDate(entry.date)}</p>
                </li>
              ))}
            </ol>
          </InfoCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
