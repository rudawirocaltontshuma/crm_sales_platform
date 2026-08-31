import { CalendarClock, Mail, Phone, StickyNote } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/nexora/_components/stat-card";
import { activities, repName, salesReps } from "@/data/nexora";
import { formatNumber } from "@/lib/nexora-format";

import { ActivityFeed } from "./_components/activity-feed";

export const metadata = { title: "Activities | NEXORA CRM" };

export default function Page() {
  const enriched = activities.map((activity) => ({ ...activity, ownerName: repName(activity.ownerId) }));
  const owners = salesReps.map((rep) => ({ id: rep.id, name: rep.name }));
  const countOf = (type: string) => activities.filter((activity) => activity.type === type).length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Activities"
        description="A unified timeline of calls, meetings, emails, notes, and tasks across every account."
      />

      <StatGrid>
        <StatCard label="Total activities" value={formatNumber(activities.length)} delta={12} />
        <StatCard label="Calls" value={formatNumber(countOf("Call"))} icon={Phone} delta={5} />
        <StatCard label="Meetings" value={formatNumber(countOf("Meeting"))} icon={CalendarClock} delta={8} />
        <StatCard
          label="Emails & notes"
          value={formatNumber(countOf("Email") + countOf("Note"))}
          icon={Mail}
          delta={-3}
        />
      </StatGrid>

      <ActivityFeed activities={enriched} owners={owners} />

      <p className="flex items-center gap-2 text-muted-foreground text-xs">
        <StickyNote className="size-3.5" />
        Demo data — activities are generated deterministically and never persisted.
      </p>
    </div>
  );
}
