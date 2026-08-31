import { Briefcase, CircleDollarSign, Timer, Trophy } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/nexora/_components/stat-card";
import { averageSalesCycleDays, deals, pipelineValue, totalRevenue, winRate } from "@/data/nexora";
import { formatCompactCurrency, formatNumber } from "@/lib/nexora-format";

import { DealsTable } from "./_components/deals-table";

export const metadata = { title: "Deals | NEXORA CRM" };

export default function Page() {
  const regions = [...new Set(deals.map((deal) => deal.region))].sort();
  const openDeals = deals.filter((deal) => deal.stage !== "Won" && deal.stage !== "Lost").length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Deals"
        description="Every opportunity in the NEXORA pipeline with stage, value, probability, and owner."
      />

      <StatGrid>
        <StatCard
          label="Open deals"
          value={formatNumber(openDeals)}
          delta={7}
          icon={Briefcase}
          hint={`${formatCompactCurrency(pipelineValue)} in pipeline`}
        />
        <StatCard
          label="Closed-won revenue"
          value={formatCompactCurrency(totalRevenue)}
          delta={11}
          icon={CircleDollarSign}
        />
        <StatCard label="Win rate" value={`${winRate}%`} delta={3} icon={Trophy} hint="Won vs. closed deals" />
        <StatCard label="Avg. sales cycle" value={`${averageSalesCycleDays} days`} delta={-4} icon={Timer} />
      </StatGrid>

      <DealsTable deals={deals} regions={regions} />
    </div>
  );
}
