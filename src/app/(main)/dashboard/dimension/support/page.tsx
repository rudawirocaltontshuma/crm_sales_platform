import { CheckCircle2, Clock, Smile, TicketIcon } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/dimension/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/dimension/_components/stat-card";
import { openTickets, repName, tickets } from "@/data/dimension";
import { formatNumber } from "@/lib/dimension-format";

import { TicketsView } from "./_components/tickets-view";

export const metadata = { title: "Support | Dimension CRM" };

export default function Page() {
  const rows = tickets.map((ticket) => ({ ...ticket, assigneeName: repName(ticket.assigneeId) }));
  const categories = [...new Set(tickets.map((ticket) => ticket.category))].sort();
  const resolved = tickets.filter((ticket) => ticket.status === "Resolved" || ticket.status === "Closed");
  const averageFirstResponse = Math.round(
    tickets.reduce((sum, ticket) => sum + ticket.firstResponseMinutes, 0) / Math.max(tickets.length, 1),
  );
  const rated = tickets.filter((ticket) => ticket.satisfaction !== null);
  const satisfaction = (
    rated.reduce((sum, ticket) => sum + (ticket.satisfaction ?? 0), 0) / Math.max(rated.length, 1)
  ).toFixed(1);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Support"
        description="Customer issues tracked from intake through resolution, with priority, channel, and SLA context."
      />

      <StatGrid>
        <StatCard label="Open tickets" value={formatNumber(openTickets.length)} icon={TicketIcon} delta={-6} />
        <StatCard label="Resolved" value={formatNumber(resolved.length)} icon={CheckCircle2} delta={8} />
        <StatCard label="Avg. first response" value={`${averageFirstResponse} min`} icon={Clock} delta={-12} />
        <StatCard label="Satisfaction" value={`${satisfaction} / 5`} icon={Smile} delta={3} />
      </StatGrid>

      <TicketsView tickets={rows} categories={categories} />
    </div>
  );
}
