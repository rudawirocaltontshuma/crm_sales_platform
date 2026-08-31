import { Flame, Target, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/nexora/_components/stat-card";
import { leadConversionRate, leads } from "@/data/nexora";
import { formatCompactCurrency, formatNumber } from "@/lib/nexora-format";

import { LeadsTable } from "./_components/leads-table";

export const metadata = { title: "Leads | NEXORA CRM" };

export default function Page() {
  const sources = [...new Set(leads.map((lead) => lead.source))].sort();
  const regions = [...new Set(leads.map((lead) => lead.region))].sort();
  const hotLeads = leads.filter((lead) => lead.rating === "Hot").length;
  const qualified = leads.filter((lead) => lead.status === "Qualified").length;
  const pipelineValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Leads"
        description="Every inbound and outbound lead in NEXORA, scored and routed to an owner for qualification."
      />

      <StatGrid>
        <StatCard
          label="Total leads"
          value={formatNumber(leads.length)}
          delta={9}
          icon={Users}
          hint="Across all sources"
        />
        <StatCard
          label="Hot leads"
          value={formatNumber(hotLeads)}
          delta={14}
          icon={Flame}
          hint="Score of 70 or higher"
        />
        <StatCard
          label="Qualified"
          value={formatNumber(qualified)}
          delta={4}
          icon={Target}
          hint="Ready for discovery"
        />
        <StatCard
          label="Conversion rate"
          value={`${leadConversionRate}%`}
          delta={-2}
          icon={TrendingUp}
          hint={`${formatCompactCurrency(pipelineValue)} estimated value`}
        />
      </StatGrid>

      <LeadsTable leads={leads} sources={sources} regions={regions} />
    </div>
  );
}
