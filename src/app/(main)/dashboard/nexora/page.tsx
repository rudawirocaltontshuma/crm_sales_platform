import Link from "next/link";

import { Briefcase, CircleDollarSign, Gauge, Percent, Target, Timer, TrendingUp, Trophy } from "lucide-react";

import {
  DealDistributionChart,
  LeadConversionChart,
  PipelineTrendChart,
  RevenueTrendChart,
  SalesByRegionChart,
  SalesByRepChart,
} from "@/app/(main)/dashboard/nexora/_components/charts";
import { ActivityTimeline, InfoCard, TaskList } from "@/app/(main)/dashboard/nexora/_components/detail";
import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { StatCard } from "@/app/(main)/dashboard/nexora/_components/stat-card";
import { Button } from "@/components/ui/button";
import {
  averageDealSize,
  averageSalesCycleDays,
  deals,
  leadConversionRate,
  monthlyTrend,
  newLeadsCount,
  pipelineValue,
  recentActivities,
  revenueByRegion,
  revenueByRep,
  stageDistribution,
  totalRevenue,
  upcomingTasks,
} from "@/data/nexora";
import { formatCompactCurrency, formatNumber } from "@/lib/nexora-format";

export const metadata = { title: "Overview | NEXORA CRM" };

export default function Page() {
  const wonDeals = deals.filter((deal) => deal.stage === "Won").length;
  const openDeals = deals.filter((deal) => deal.stage !== "Won" && deal.stage !== "Lost").length;
  const topReps = revenueByRep.slice(0, 8).map((rep) => ({ name: rep.name, revenue: rep.revenue }));

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="NEXORA CRM"
        description="Enterprise Customer Relationship & Sales Platform — a live snapshot of revenue, pipeline, and team execution."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/nexora/pipeline">Open pipeline</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard/nexora/deals">View deals</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatCompactCurrency(totalRevenue)}
          delta={12}
          icon={CircleDollarSign}
          hint="Closed-won, trailing 12 months"
        />
        <StatCard
          label="Pipeline value"
          value={formatCompactCurrency(pipelineValue)}
          delta={7}
          icon={Gauge}
          hint="All open opportunities"
        />
        <StatCard label="Won deals" value={formatNumber(wonDeals)} delta={9} icon={Trophy} />
        <StatCard label="Open deals" value={formatNumber(openDeals)} delta={4} icon={Briefcase} />
        <StatCard label="New leads" value={formatNumber(newLeadsCount)} delta={15} icon={Target} />
        <StatCard label="Conversion rate" value={`${leadConversionRate}%`} delta={-2} icon={Percent} />
        <StatCard
          label="Average deal size"
          value={formatCompactCurrency(averageDealSize)}
          delta={6}
          icon={TrendingUp}
        />
        <StatCard label="Sales cycle" value={`${averageSalesCycleDays} days`} delta={-5} icon={Timer} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        <RevenueTrendChart data={monthlyTrend} />
        <PipelineTrendChart data={monthlyTrend} />
        <LeadConversionChart data={monthlyTrend} />
        <SalesByRegionChart data={revenueByRegion} />
        <SalesByRepChart data={topReps} />
        <DealDistributionChart data={stageDistribution} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <InfoCard title="Recent activity" description="The latest touchpoints logged across the team.">
          <ActivityTimeline items={recentActivities.slice(0, 8)} />
        </InfoCard>
        <InfoCard title="Upcoming tasks" description="Next follow-ups due across open opportunities.">
          <TaskList items={upcomingTasks} />
        </InfoCard>
      </div>
    </div>
  );
}
