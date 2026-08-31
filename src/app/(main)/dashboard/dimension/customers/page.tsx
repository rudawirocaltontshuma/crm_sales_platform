import Link from "next/link";

import { Coins, Repeat, ShoppingCart, TrendingUp, Users } from "lucide-react";

import {
  RevenueByIndustryChart,
  RevenueTrendChart,
  SalesByRegionChart,
} from "@/app/(main)/dashboard/dimension/_components/charts";
import { InfoCard } from "@/app/(main)/dashboard/dimension/_components/detail";
import { PageHeader } from "@/app/(main)/dashboard/dimension/_components/page-header";
import { StatCard } from "@/app/(main)/dashboard/dimension/_components/stat-card";
import { Progress } from "@/components/ui/progress";
import {
  customerCompanies,
  deals,
  monthlyTrend,
  retentionRate,
  revenueByIndustry,
  revenueByRegion,
  topCustomers,
  totalRevenue,
} from "@/data/dimension";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/dimension-format";

export const metadata = { title: "Customers | Dimension CRM" };

export default function Page() {
  const wonDeals = deals.filter((deal) => deal.stage === "Won");
  const averageOrderValue = Math.round(totalRevenue / Math.max(wonDeals.length, 1));
  const growth = Math.round(
    ((monthlyTrend[monthlyTrend.length - 1].revenue - monthlyTrend[0].revenue) / Math.max(monthlyTrend[0].revenue, 1)) *
      100,
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Customers"
        description="Customer base health — revenue, orders, average value, retention, and growth across accounts."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Customers" value={formatNumber(customerCompanies.length)} delta={8} icon={Users} />
        <StatCard label="Revenue" value={formatCompactCurrency(totalRevenue)} delta={12} icon={Coins} />
        <StatCard label="Orders" value={formatNumber(wonDeals.length)} delta={9} icon={ShoppingCart} />
        <StatCard label="Average value" value={formatCompactCurrency(averageOrderValue)} delta={4} icon={TrendingUp} />
        <StatCard label="Retention" value={`${retentionRate}%`} delta={2} icon={Repeat} />
        <StatCard
          label="Growth"
          value={`${growth > 0 ? "+" : ""}${growth}%`}
          delta={growth}
          icon={TrendingUp}
          hint="Year-over-year revenue"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        <RevenueTrendChart data={monthlyTrend} />
        <SalesByRegionChart data={revenueByRegion} />
        <RevenueByIndustryChart data={revenueByIndustry.slice(0, 8)} className="xl:col-span-2" />
      </div>

      <InfoCard title="Top customers" description="Accounts contributing the most closed-won revenue.">
        <ul className="divide-y">
          {topCustomers.map((customer) => (
            <li
              key={customer.id}
              className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link href={`/dashboard/dimension/companies/${customer.id}`} className="min-w-0 hover:underline">
                <p className="truncate font-medium text-sm">{customer.name}</p>
                <p className="text-muted-foreground text-xs">
                  {customer.industry} · {customer.region}
                </p>
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm tabular-nums">{formatCurrency(customer.revenue)}</span>
                <span className="text-muted-foreground text-xs tabular-nums">{customer.orders} deals</span>
                <div className="flex w-24 items-center gap-2">
                  <Progress value={customer.healthScore} className="h-1.5" />
                  <span className="text-xs tabular-nums">{customer.healthScore}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}
