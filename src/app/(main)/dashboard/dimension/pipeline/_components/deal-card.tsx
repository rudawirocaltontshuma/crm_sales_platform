"use client";

import Link from "next/link";

import { CalendarClock } from "lucide-react";

import { InitialsAvatar, StatusBadge } from "@/app/(main)/dashboard/dimension/_components/status-badge";
import { Progress } from "@/components/ui/progress";
import { type Deal, getRep } from "@/data/dimension";
import { formatCurrency, formatDate } from "@/lib/dimension-format";
import { cn } from "@/lib/utils";

export function DealCard({ deal, isOverlay = false }: { deal: Deal; isOverlay?: boolean }) {
  const owner = getRep(deal.ownerId);

  return (
    <article
      className={cn(
        "space-y-3 rounded-lg border bg-card p-3 shadow-xs transition-shadow",
        isOverlay && "shadow-lg ring-1 ring-primary/30",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link href={`/dashboard/dimension/deals/${deal.id}`} className="min-w-0 font-medium text-sm hover:underline">
          {deal.name}
        </Link>
        <StatusBadge status={deal.priority} />
      </div>

      <p className="truncate text-muted-foreground text-xs">{deal.companyName}</p>

      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm tabular-nums">{formatCurrency(deal.value)}</span>
        <span className="text-muted-foreground text-xs tabular-nums">{deal.probability}%</span>
      </div>
      <Progress value={deal.probability} className="h-1" />

      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="flex items-center gap-2">
          <InitialsAvatar initials={owner?.initials ?? "NX"} tone={owner?.avatarTone} className="size-6 text-[10px]" />
          <span className="truncate text-muted-foreground text-xs">{owner?.name ?? "Unassigned"}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-muted-foreground text-xs">
          <CalendarClock className="size-3" />
          {formatDate(deal.expectedCloseDate)}
        </span>
      </div>
    </article>
  );
}
