"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCompactCurrency } from "@/lib/dimension-format";

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export interface TrendPoint {
  label: string;
  revenue: number;
  pipeline: number;
  deals: number;
  leads: number;
  converted: number;
  activities: number;
}

const revenueConfig = {
  revenue: { label: "Closed-won revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function RevenueTrendChart({ data, className }: { data: TrendPoint[]; className?: string }) {
  return (
    <ChartCard title="Revenue trend" description="Closed-won revenue over the last 12 months." className={className}>
      <ChartContainer config={revenueConfig} className="h-72 w-full">
        <AreaChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <defs>
            <linearGradient id="dimension-revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.45} />
              <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="revenue"
            type="monotone"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            fill="url(#dimension-revenue)"
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}

const pipelineConfig = {
  pipeline: { label: "Pipeline created", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function PipelineTrendChart({ data, className }: { data: TrendPoint[]; className?: string }) {
  return (
    <ChartCard title="Pipeline trend" description="New pipeline created each month." className={className}>
      <ChartContainer config={pipelineConfig} className="h-72 w-full">
        <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="pipeline" fill="var(--color-pipeline)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

const conversionConfig = {
  leads: { label: "Leads created", color: "var(--chart-3)" },
  converted: { label: "Converted", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function LeadConversionChart({ data, className }: { data: TrendPoint[]; className?: string }) {
  return (
    <ChartCard title="Lead conversion" description="Leads created versus converted each month." className={className}>
      <ChartContainer config={conversionConfig} className="h-72 w-full">
        <LineChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="leads" type="monotone" stroke="var(--color-leads)" strokeWidth={2} dot={false} />
          <Line dataKey="converted" type="monotone" stroke="var(--color-converted)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}

const repConfig = {
  revenue: { label: "Closed-won", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function SalesByRepChart({
  data,
  className,
}: {
  data: { name: string; revenue: number }[];
  className?: string;
}) {
  return (
    <ChartCard
      title="Sales by representative"
      description="Top performers by closed-won revenue."
      className={className}
    >
      <ChartContainer config={repConfig} className="h-80 w-full">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

const regionConfig = {
  revenue: { label: "Revenue" },
} satisfies ChartConfig;

export function SalesByRegionChart({
  data,
  className,
}: {
  data: { region: string; revenue: number }[];
  className?: string;
}) {
  return (
    <ChartCard title="Sales by region" description="Closed-won revenue split across regions." className={className}>
      <ChartContainer config={regionConfig} className="mx-auto aspect-square max-h-72">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="region" hideLabel />} />
          <Pie data={data} dataKey="revenue" nameKey="region" innerRadius={60} strokeWidth={2}>
            {data.map((entry, index) => (
              <Cell key={entry.region} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="region" />} className="flex-wrap" />
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
}

const stageConfig = {
  count: { label: "Deals", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function DealDistributionChart({
  data,
  className,
}: {
  data: { stage: string; count: number; value: number }[];
  className?: string;
}) {
  return (
    <ChartCard title="Deal distribution" description="Open and closed deals by pipeline stage." className={className}>
      <ChartContainer config={stageConfig} className="h-72 w-full">
        <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="stage" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.stage} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

const activityConfig = {
  activities: { label: "Activities", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function ActivityVolumeChart({ data, className }: { data: TrendPoint[]; className?: string }) {
  return (
    <ChartCard
      title="Activity volume"
      description="Logged calls, meetings, emails, and notes per month."
      className={className}
    >
      <ChartContainer config={activityConfig} className="h-72 w-full">
        <AreaChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="activities"
            type="monotone"
            stroke="var(--color-activities)"
            fill="var(--color-activities)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}

const sourceConfig = {
  leads: { label: "Leads", color: "var(--chart-2)" },
  converted: { label: "Converted", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function LeadSourceChart({
  data,
  className,
}: {
  data: { source: string; leads: number; converted: number }[];
  className?: string;
}) {
  return (
    <ChartCard
      title="Leads by source"
      description="Volume and conversion by acquisition channel."
      className={className}
    >
      <ChartContainer config={sourceConfig} className="h-80 w-full">
        <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="source"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            angle={-20}
            height={60}
            textAnchor="end"
          />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="leads" fill="var(--color-leads)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="converted" fill="var(--color-converted)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

const industryConfig = {
  revenue: { label: "Revenue", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function RevenueByIndustryChart({
  data,
  className,
}: {
  data: { industry: string; revenue: number }[];
  className?: string;
}) {
  return (
    <ChartCard
      title="Revenue by industry"
      description="Where closed-won revenue is concentrated."
      className={className}
    >
      <ChartContainer config={industryConfig} className="h-80 w-full">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <YAxis type="category" dataKey="industry" tickLine={false} axisLine={false} width={130} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

const radarConfig = {
  score: { label: "Score", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TeamPerformanceRadar({
  data,
  className,
}: {
  data: { metric: string; score: number }[];
  className?: string;
}) {
  return (
    <ChartCard
      title="Team performance profile"
      description="Normalized scores across execution metrics."
      className={className}
    >
      <ChartContainer config={radarConfig} className="mx-auto aspect-square max-h-72">
        <RadarChart data={data}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <Radar dataKey="score" stroke="var(--color-score)" fill="var(--color-score)" fillOpacity={0.3} />
        </RadarChart>
      </ChartContainer>
    </ChartCard>
  );
}
