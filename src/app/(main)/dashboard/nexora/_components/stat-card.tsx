import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function StatCard({ label, value, delta, hint, icon: Icon }: StatCardProps) {
  const isPositive = (delta ?? 0) >= 0;

  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        {Icon ? (
          <CardAction>
            <Icon className="size-4 text-muted-foreground" />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-2xl tabular-nums leading-none tracking-tight lg:text-3xl">{value}</span>
          {delta === undefined ? null : (
            <Badge
              variant="outline"
              className={cn(
                "rounded-full",
                isPositive
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
              )}
            >
              {isPositive ? <TrendingUp /> : <TrendingDown />}
              {isPositive ? "+" : ""}
              {delta}%
            </Badge>
          )}
        </div>
        {hint ? <p className="text-muted-foreground text-sm">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}
