import { Target, TrendingUp, Users, UsersRound } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/dimension/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/dimension/_components/stat-card";
import { InitialsAvatar } from "@/app/(main)/dashboard/dimension/_components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRep, revenueByRep, salesReps, salesTeams } from "@/data/dimension";
import { formatCompactCurrency, formatNumber } from "@/lib/dimension-format";

import { RepsTable } from "./_components/reps-table";

export const metadata = { title: "Sales Teams | Dimension CRM" };

export default function Page() {
  const repRows = revenueByRep.map((rep) => {
    const record = getRep(rep.id);

    return {
      id: rep.id,
      name: rep.name,
      initials: rep.initials,
      avatarTone: rep.avatarTone,
      title: record?.title ?? "Account Executive",
      email: record?.email ?? "",
      team: rep.team,
      region: rep.region,
      quota: rep.quota,
      revenue: rep.revenue,
      attainment: Math.round((rep.revenue / Math.max(rep.quota, 1)) * 100),
      won: rep.won,
      open: rep.open,
      winRate: rep.winRate,
    };
  });

  const teams = salesTeams.map((team) => team.name);
  const regions = [...new Set(salesReps.map((rep) => rep.region))].sort();
  const totalQuota = salesTeams.reduce((sum, team) => sum + team.quota, 0);
  const totalRevenue = repRows.reduce((sum, rep) => sum + rep.revenue, 0);
  const attainment = Math.round((totalRevenue / Math.max(totalQuota, 1)) * 100);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Sales Teams"
        description="Team structure, quota coverage, and individual attainment across the DIMENSION revenue organization."
      />

      <StatGrid>
        <StatCard label="Teams" value={formatNumber(salesTeams.length)} icon={UsersRound} />
        <StatCard label="Representatives" value={formatNumber(salesReps.length)} icon={Users} />
        <StatCard label="Total quota" value={formatCompactCurrency(totalQuota)} icon={Target} />
        <StatCard label="Quota attainment" value={`${attainment}%`} delta={5} icon={TrendingUp} />
      </StatGrid>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {salesTeams.map((team) => {
          const manager = getRep(team.managerId);
          const teamRevenue = repRows
            .filter((rep) => rep.team === team.name)
            .reduce((sum, rep) => sum + rep.revenue, 0);
          const teamAttainment = Math.round((teamRevenue / Math.max(team.quota, 1)) * 100);

          return (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle className="text-base">{team.name}</CardTitle>
                <CardDescription>{team.focus}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <InitialsAvatar initials={manager?.initials ?? "NX"} tone={manager?.avatarTone} />
                  <div className="min-w-0">
                    <p className="truncate text-sm">{manager?.name ?? "Unassigned"}</p>
                    <p className="text-muted-foreground text-xs">Team lead · {team.region}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-muted-foreground">Attainment</span>
                    <span className="tabular-nums">{teamAttainment}%</span>
                  </div>
                  <Progress value={Math.min(teamAttainment, 100)} className="h-1.5" />
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {formatCompactCurrency(teamRevenue)} of {formatCompactCurrency(team.quota)} ·{" "}
                    {team.memberIds.length} reps
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <RepsTable reps={repRows} teams={teams} regions={regions} />
    </div>
  );
}
