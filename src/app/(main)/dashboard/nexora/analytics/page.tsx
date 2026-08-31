import {
  ActivityVolumeChart,
  DealDistributionChart,
  LeadConversionChart,
  LeadSourceChart,
  PipelineTrendChart,
  RevenueByIndustryChart,
  RevenueTrendChart,
  SalesByRegionChart,
  SalesByRepChart,
  TeamPerformanceRadar,
} from "@/app/(main)/dashboard/nexora/_components/charts";
import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/nexora/_components/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  averageDealSize,
  leadConversionRate,
  leadsBySource,
  monthlyTrend,
  pipelineValue,
  retentionRate,
  revenueByIndustry,
  revenueByRegion,
  revenueByRep,
  stageDistribution,
  totalRevenue,
  weightedPipelineValue,
  winRate,
} from "@/data/nexora";
import { formatCompactCurrency } from "@/lib/nexora-format";

export const metadata = { title: "Analytics | NEXORA CRM" };

export default function Page() {
  const topReps = revenueByRep.slice(0, 8).map((rep) => ({ name: rep.name, revenue: rep.revenue }));
  const topIndustries = revenueByIndustry.slice(0, 8);

  const radarData = [
    { metric: "Win rate", score: winRate },
    { metric: "Conversion", score: leadConversionRate * 4 },
    { metric: "Retention", score: retentionRate },
    { metric: "Coverage", score: Math.min(Math.round((pipelineValue / Math.max(totalRevenue, 1)) * 60), 100) },
    { metric: "Velocity", score: 72 },
    { metric: "Expansion", score: 64 },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Analytics"
        description="Cross-sectional analysis of sales, leads, pipeline, customers, and representative performance."
      />

      <StatGrid>
        <StatCard label="Revenue" value={formatCompactCurrency(totalRevenue)} delta={12} />
        <StatCard label="Weighted pipeline" value={formatCompactCurrency(weightedPipelineValue)} delta={6} />
        <StatCard label="Average deal size" value={formatCompactCurrency(averageDealSize)} delta={4} />
        <StatCard label="Win rate" value={`${winRate}%`} delta={3} />
      </StatGrid>

      <Tabs defaultValue="sales" className="gap-4">
        <div className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="reps">Representatives</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="sales" className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          <RevenueTrendChart data={monthlyTrend} />
          <SalesByRegionChart data={revenueByRegion} />
          <RevenueByIndustryChart data={topIndustries} className="xl:col-span-2" />
        </TabsContent>

        <TabsContent value="leads" className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          <LeadConversionChart data={monthlyTrend} />
          <ActivityVolumeChart data={monthlyTrend} />
          <LeadSourceChart data={leadsBySource} className="xl:col-span-2" />
        </TabsContent>

        <TabsContent value="pipeline" className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          <PipelineTrendChart data={monthlyTrend} />
          <DealDistributionChart data={stageDistribution} />
        </TabsContent>

        <TabsContent value="customers" className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          <RevenueByIndustryChart data={topIndustries} />
          <SalesByRegionChart data={revenueByRegion} />
        </TabsContent>

        <TabsContent value="reps" className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          <SalesByRepChart data={topReps} />
          <TeamPerformanceRadar data={radarData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
