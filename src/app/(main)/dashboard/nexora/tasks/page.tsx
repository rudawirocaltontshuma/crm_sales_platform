import { AlarmClock, CheckCircle2, CircleDot, ListTodo } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/nexora/_components/stat-card";
import { repName, tasks } from "@/data/nexora";
import { formatNumber } from "@/lib/nexora-format";

import { TasksView } from "./_components/tasks-view";

export const metadata = { title: "Tasks | NEXORA CRM" };

export default function Page() {
  const rows = tasks.map((task) => ({ ...task, ownerName: repName(task.ownerId) }));
  const countOf = (status: string) => tasks.filter((task) => task.status === status).length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Tasks"
        description="Follow-ups and next steps assigned across the revenue team, grouped by execution status."
      />

      <StatGrid>
        <StatCard label="Pending" value={formatNumber(countOf("Pending"))} icon={ListTodo} />
        <StatCard label="In progress" value={formatNumber(countOf("In Progress"))} icon={CircleDot} delta={6} />
        <StatCard label="Completed" value={formatNumber(countOf("Completed"))} icon={CheckCircle2} delta={9} />
        <StatCard label="Overdue" value={formatNumber(countOf("Overdue"))} icon={AlarmClock} delta={-11} />
      </StatGrid>

      <TasksView tasks={rows} />
    </div>
  );
}
