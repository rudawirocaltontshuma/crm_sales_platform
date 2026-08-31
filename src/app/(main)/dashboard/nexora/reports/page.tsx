import { Download } from "lucide-react";

import {
  ActivityVolumeChart,
  DealDistributionChart,
  LeadSourceChart,
  RevenueTrendChart,
} from "@/app/(main)/dashboard/nexora/_components/charts";
import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  activityTypeBreakdown,
  leadsBySource,
  leadsByStatus,
  monthlyTrend,
  revenueByIndustry,
  revenueByRegion,
  revenueByRep,
  stageDistribution,
  topCustomers,
} from "@/data/nexora";
import { formatCompactCurrency, formatNumber } from "@/lib/nexora-format";

import { ReportTable } from "./_components/report-table";

export const metadata = { title: "Reports | NEXORA CRM" };

export default function Page() {
  const salesRows = monthlyTrend.map((point) => ({
    id: point.month,
    month: point.label,
    revenue: formatCompactCurrency(point.revenue),
    deals: formatNumber(point.deals),
    pipeline: formatCompactCurrency(point.pipeline),
    activities: formatNumber(point.activities),
  }));

  const leadRows = leadsBySource.map((source) => ({
    id: source.source,
    source: source.source,
    leads: formatNumber(source.leads),
    converted: formatNumber(source.converted),
    rate: `${Math.round((source.converted / Math.max(source.leads, 1)) * 100)}%`,
    value: formatCompactCurrency(source.value),
  }));

  const pipelineRows = stageDistribution.map((stage) => ({
    id: stage.stage,
    stage: stage.stage,
    count: formatNumber(stage.count),
    value: formatCompactCurrency(stage.value),
    average: formatCompactCurrency(Math.round(stage.value / Math.max(stage.count, 1))),
  }));

  const revenueRows = revenueByRegion.map((region) => ({
    id: region.region,
    region: region.region,
    revenue: formatCompactCurrency(region.revenue),
    pipeline: formatCompactCurrency(region.pipeline),
    deals: formatNumber(region.deals),
  }));

  const repRows = revenueByRep.slice(0, 15).map((rep) => ({
    id: rep.id,
    name: rep.name,
    team: rep.team,
    revenue: formatCompactCurrency(rep.revenue),
    pipeline: formatCompactCurrency(rep.pipeline),
    won: formatNumber(rep.won),
    winRate: `${rep.winRate}%`,
  }));

  const customerRows = topCustomers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    industry: customer.industry,
    region: customer.region,
    revenue: formatCompactCurrency(customer.revenue),
    orders: formatNumber(customer.orders),
    health: `${customer.healthScore}`,
  }));

  const activityRows = activityTypeBreakdown.map((entry) => ({
    id: entry.type,
    type: entry.type,
    count: formatNumber(entry.count),
    share: `${Math.round(
      (entry.count /
        Math.max(
          activityTypeBreakdown.reduce((sum, item) => sum + item.count, 0),
          1,
        )) *
        100,
    )}%`,
  }));

  const industryRows = revenueByIndustry.slice(0, 10).map((entry) => ({
    id: entry.industry,
    industry: entry.industry,
    revenue: formatCompactCurrency(entry.revenue),
    customers: formatNumber(entry.customers),
  }));

  const statusRows = leadsByStatus.map((entry) => ({
    id: entry.status,
    status: entry.status,
    count: formatNumber(entry.count),
  }));

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Reports"
        description="Standard NEXORA reporting pack — sales, leads, pipeline, revenue, representatives, customers, and activity."
        actions={
          <Button variant="outline" size="sm" disabled>
            <Download data-icon="inline-start" />
            Export (demo)
          </Button>
        }
      />

      <Tabs defaultValue="sales" className="gap-4">
        <div className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="leads">Lead</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="reps">Representative</TabsTrigger>
            <TabsTrigger value="customers">Customer</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="sales" className="flex flex-col gap-4 md:gap-6">
          <RevenueTrendChart data={monthlyTrend} />
          <ReportTable
            title="Monthly sales report"
            description="Closed-won revenue, deal counts, and pipeline generated per month."
            columns={[
              { key: "month", label: "Month" },
              { key: "revenue", label: "Revenue", align: "right" },
              { key: "deals", label: "Deals won", align: "right" },
              { key: "pipeline", label: "Pipeline created", align: "right" },
              { key: "activities", label: "Activities", align: "right" },
            ]}
            rows={salesRows}
          />
        </TabsContent>

        <TabsContent value="leads" className="flex flex-col gap-4 md:gap-6">
          <LeadSourceChart data={leadsBySource} />
          <ReportTable
            title="Lead source report"
            description="Volume, conversion, and estimated value by acquisition channel."
            columns={[
              { key: "source", label: "Source" },
              { key: "leads", label: "Leads", align: "right" },
              { key: "converted", label: "Converted", align: "right" },
              { key: "rate", label: "Conversion", align: "right" },
              { key: "value", label: "Est. value", align: "right" },
            ]}
            rows={leadRows}
          />
          <ReportTable
            title="Lead status breakdown"
            description="Where leads currently sit in the qualification funnel."
            columns={[
              { key: "status", label: "Status" },
              { key: "count", label: "Leads", align: "right" },
            ]}
            rows={statusRows}
          />
        </TabsContent>

        <TabsContent value="pipeline" className="flex flex-col gap-4 md:gap-6">
          <DealDistributionChart data={stageDistribution} />
          <ReportTable
            title="Pipeline stage report"
            description="Deal counts and value at each stage of the funnel."
            columns={[
              { key: "stage", label: "Stage" },
              { key: "count", label: "Deals", align: "right" },
              { key: "value", label: "Total value", align: "right" },
              { key: "average", label: "Average value", align: "right" },
            ]}
            rows={pipelineRows}
          />
        </TabsContent>

        <TabsContent value="revenue" className="flex flex-col gap-4 md:gap-6">
          <ReportTable
            title="Revenue by region"
            description="Closed-won revenue and open pipeline split by geography."
            columns={[
              { key: "region", label: "Region" },
              { key: "revenue", label: "Revenue", align: "right" },
              { key: "pipeline", label: "Pipeline", align: "right" },
              { key: "deals", label: "Deals won", align: "right" },
            ]}
            rows={revenueRows}
          />
          <ReportTable
            title="Revenue by industry"
            description="Vertical concentration across the customer base."
            columns={[
              { key: "industry", label: "Industry" },
              { key: "revenue", label: "Revenue", align: "right" },
              { key: "customers", label: "Accounts", align: "right" },
            ]}
            rows={industryRows}
          />
        </TabsContent>

        <TabsContent value="reps" className="flex flex-col gap-4 md:gap-6">
          <ReportTable
            title="Representative performance"
            description="Top sellers by closed-won revenue, pipeline, and win rate."
            columns={[
              { key: "name", label: "Representative" },
              { key: "team", label: "Team" },
              { key: "revenue", label: "Revenue", align: "right" },
              { key: "pipeline", label: "Pipeline", align: "right" },
              { key: "won", label: "Won", align: "right" },
              { key: "winRate", label: "Win rate", align: "right" },
            ]}
            rows={repRows}
          />
        </TabsContent>

        <TabsContent value="customers" className="flex flex-col gap-4 md:gap-6">
          <ReportTable
            title="Top customers"
            description="Highest-revenue accounts with order counts and health scores."
            columns={[
              { key: "name", label: "Customer" },
              { key: "industry", label: "Industry" },
              { key: "region", label: "Region" },
              { key: "revenue", label: "Revenue", align: "right" },
              { key: "orders", label: "Closed deals", align: "right" },
              { key: "health", label: "Health", align: "right" },
            ]}
            rows={customerRows}
          />
        </TabsContent>

        <TabsContent value="activity" className="flex flex-col gap-4 md:gap-6">
          <ActivityVolumeChart data={monthlyTrend} />
          <ReportTable
            title="Activity mix"
            description="Distribution of logged activity types across the team."
            columns={[
              { key: "type", label: "Activity type" },
              { key: "count", label: "Logged", align: "right" },
              { key: "share", label: "Share", align: "right" },
            ]}
            rows={activityRows}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
