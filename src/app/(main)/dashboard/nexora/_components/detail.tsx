import type { ReactNode } from "react";

import Link from "next/link";

import { ArrowLeft, CalendarClock, CheckCircle2, FileText, Mail, MessageSquare, Phone, StickyNote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Activity, CrmTask } from "@/data/nexora";
import { repName } from "@/data/nexora";
import { formatDate, formatDateTime } from "@/lib/nexora-format";

import { StatusBadge } from "./status-badge";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground">
      <Link href={href}>
        <ArrowLeft data-icon="inline-start" />
        {label}
      </Link>
    </Button>
  );
}

export function DetailHeader({
  title,
  subtitle,
  badges,
  actions,
  media,
}: {
  title: string;
  subtitle: string;
  badges?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          {media}
          <div className="space-y-1.5">
            <h1 className="font-medium text-2xl tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
            {badges ? <div className="flex flex-wrap items-center gap-2 pt-1">{badges}</div> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </CardContent>
    </Card>
  );
}

export function FieldList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <dt className="text-muted-foreground text-xs uppercase tracking-wide">{item.label}</dt>
          <dd className="break-words text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function InfoCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const ACTIVITY_ICONS = {
  Call: Phone,
  Meeting: CalendarClock,
  Email: Mail,
  Note: StickyNote,
  Task: CheckCircle2,
} as const;

export function ActivityTimeline({
  items,
  emptyMessage = "No activity logged yet.",
}: {
  items: Activity[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-muted-foreground text-sm">{emptyMessage}</p>;
  }

  return (
    <ol className="relative space-y-6 border-border/70 border-l pl-6">
      {items.map((activity) => {
        const Icon = ACTIVITY_ICONS[activity.type] ?? MessageSquare;

        return (
          <li key={activity.id} className="relative">
            <span className="absolute top-0 -left-[2.05rem] flex size-7 items-center justify-center rounded-full border bg-background text-muted-foreground">
              <Icon className="size-3.5" />
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-sm">{activity.subject}</span>
                <StatusBadge status={activity.type} />
                <StatusBadge status={activity.outcome} />
              </div>
              <p className="text-muted-foreground text-sm">{activity.description}</p>
              <p className="text-muted-foreground text-xs">
                {formatDateTime(activity.occurredAt)} · {repName(activity.ownerId)}
                {activity.durationMinutes > 0 ? ` · ${activity.durationMinutes} min` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function TaskList({ items, emptyMessage = "No tasks assigned." }: { items: CrmTask[]; emptyMessage?: string }) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-muted-foreground text-sm">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y">
      {items.map((task) => (
        <li
          key={task.id}
          className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <p className="truncate font-medium text-sm">{task.title}</p>
            <p className="truncate text-muted-foreground text-xs">{task.relatedName}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={task.priority} />
            <StatusBadge status={task.status} />
            <span className="text-muted-foreground text-xs">{formatDate(task.dueDate)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DocumentList({ items }: { items: { id: string; label: string; meta: string }[] }) {
  return (
    <ul className="divide-y">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <FileText className="size-4 text-muted-foreground" />
          <div className="min-w-0">
            <p className="truncate text-sm">{item.label}</p>
            <p className="text-muted-foreground text-xs">{item.meta}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SectionSeparator() {
  return <Separator className="my-2" />;
}
