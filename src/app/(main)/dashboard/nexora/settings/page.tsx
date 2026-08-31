import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";

import { SettingsPanels } from "./_components/settings-panels";

export const metadata = { title: "Settings | NEXORA CRM" };

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Settings"
        description="Workspace, pipeline, notification, and automation preferences for NEXORA CRM. Nothing is persisted in this demo."
      />
      <SettingsPanels />
    </div>
  );
}
