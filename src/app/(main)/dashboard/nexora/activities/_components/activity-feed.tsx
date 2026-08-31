"use client";

import * as React from "react";

import Link from "next/link";

import { CalendarClock, CheckCircle2, Mail, Phone, Search, StickyNote } from "lucide-react";

import { RecordFormDialog } from "@/app/(main)/dashboard/nexora/_components/record-form-dialog";
import { StatusBadge } from "@/app/(main)/dashboard/nexora/_components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACTIVITY_TYPES, type Activity, type ActivityType } from "@/data/nexora";
import { formatDateTime } from "@/lib/nexora-format";

const ICONS: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  Call: Phone,
  Meeting: CalendarClock,
  Email: Mail,
  Note: StickyNote,
  Task: CheckCircle2,
};

const PAGE_SIZE = 20;

export function ActivityFeed({
  activities,
  owners,
}: {
  activities: (Activity & { ownerName: string })[];
  owners: { id: string; name: string }[];
}) {
  const [type, setType] = React.useState<string>("all");
  const [owner, setOwner] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [visible, setVisible] = React.useState(PAGE_SIZE);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return activities.filter(
      (activity) =>
        (type === "all" || activity.type === type) &&
        (owner === "all" || activity.ownerId === owner) &&
        (normalized === "" ||
          activity.subject.toLowerCase().includes(normalized) ||
          activity.companyName.toLowerCase().includes(normalized) ||
          activity.contactName.toLowerCase().includes(normalized)),
    );
  }, [activities, owner, query, type]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={type}
          onValueChange={(value) => {
            setType(value);
            setVisible(PAGE_SIZE);
          }}
        >
          <div className="w-full overflow-x-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {ACTIVITY_TYPES.map((activityType) => (
                <TabsTrigger key={activityType} value={activityType}>
                  {activityType}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <InputGroup className="sm:w-64">
            <InputGroupInput
              type="search"
              placeholder="Search activities"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(PAGE_SIZE);
              }}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Select
            value={owner}
            onValueChange={(value) => {
              setOwner(value);
              setVisible(PAGE_SIZE);
            }}
          >
            <SelectTrigger size="sm" className="sm:w-52">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="all">All owners</SelectItem>
                {owners.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <RecordFormDialog
            triggerLabel="Log activity"
            title="Log activity"
            description="Record a call, meeting, email, or note against an account."
            successMessage="Activity logged"
            fields={[
              { name: "type", label: "Type", type: "select", options: ACTIVITY_TYPES },
              { name: "subject", label: "Subject", required: true },
              { name: "company", label: "Company" },
              { name: "contact", label: "Contact" },
              { name: "duration", label: "Duration (minutes)", type: "number" },
              {
                name: "outcome",
                label: "Outcome",
                type: "select",
                options: ["Positive", "Neutral", "Needs Follow-up", "No Response"],
              },
              { name: "notes", label: "Notes", type: "textarea", colSpan: 2 },
            ]}
          />
        </div>
      </div>

      <Card>
        <CardContent>
          {shown.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground text-sm">No activities match these filters.</p>
          ) : (
            <ol className="relative space-y-6 border-border/70 border-l pl-6">
              {shown.map((activity) => {
                const Icon = ICONS[activity.type];

                return (
                  <li key={activity.id} className="relative">
                    <span className="-left-[2.05rem] absolute top-0 flex size-7 items-center justify-center rounded-full border bg-background text-muted-foreground">
                      <Icon className="size-3.5" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">{activity.subject}</span>
                        <StatusBadge status={activity.type} />
                        <StatusBadge status={activity.outcome} />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        <Link href={`/dashboard/nexora/companies/${activity.companyId}`} className="hover:underline">
                          {activity.companyName}
                        </Link>
                        {" · "}
                        <Link href={`/dashboard/nexora/contacts/${activity.contactId}`} className="hover:underline">
                          {activity.contactName}
                        </Link>
                        {activity.dealId ? (
                          <>
                            {" · "}
                            <Link href={`/dashboard/nexora/deals/${activity.dealId}`} className="hover:underline">
                              {activity.dealName}
                            </Link>
                          </>
                        ) : null}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatDateTime(activity.occurredAt)} · {activity.ownerName}
                        {activity.durationMinutes > 0 ? ` · ${activity.durationMinutes} min` : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {visible < filtered.length ? (
            <div className="flex justify-center pt-6">
              <Button variant="outline" onClick={() => setVisible((current) => current + PAGE_SIZE)}>
                Load more activities
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
