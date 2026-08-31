import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { deals, salesReps } from "@/data/nexora";

import { PipelineBoard } from "./_components/pipeline-board";

export const metadata = { title: "Pipeline | NEXORA CRM" };

export default function Page() {
  const owners = salesReps.map((rep) => ({ id: rep.id, name: rep.name }));

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col gap-4 md:gap-6">
      <PageHeader
        title="Pipeline"
        description="Drag deals between stages to rehearse forecast scenarios. Changes stay in this browser session only."
      />
      <PipelineBoard deals={deals} owners={owners} />
    </div>
  );
}
