import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { buildCalendarEvents } from "@/data/nexora";

import { CrmCalendar } from "./_components/crm-calendar";

export const metadata = { title: "Calendar | NEXORA CRM" };

export default function Page() {
  const events = buildCalendarEvents();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Calendar"
        description="Meetings, demos, and follow-ups for the revenue team in month, week, day, and agenda views."
      />
      <CrmCalendar events={events} />
    </div>
  );
}
