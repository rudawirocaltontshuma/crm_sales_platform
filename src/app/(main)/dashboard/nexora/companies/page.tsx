import { Building2, Handshake, HeartPulse, Users } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/nexora/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/nexora/_components/stat-card";
import { companies, customerCompanies } from "@/data/nexora";
import { formatNumber } from "@/lib/nexora-format";

import { CompaniesTable } from "./_components/companies-table";

export const metadata = { title: "Companies | NEXORA CRM" };

export default function Page() {
  const industries = [...new Set(companies.map((company) => company.industry))].sort();
  const regions = [...new Set(companies.map((company) => company.region))].sort();
  const partners = companies.filter((company) => company.status === "Partner").length;
  const averageHealth = Math.round(
    companies.reduce((sum, company) => sum + company.healthScore, 0) / Math.max(companies.length, 1),
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Companies"
        description="Accounts tracked in NEXORA with firmographics, ownership, and relationship health."
      />

      <StatGrid>
        <StatCard label="Accounts" value={formatNumber(companies.length)} delta={5} icon={Building2} />
        <StatCard label="Active customers" value={formatNumber(customerCompanies.length)} delta={8} icon={Users} />
        <StatCard
          label="Partners"
          value={formatNumber(partners)}
          icon={Handshake}
          hint="Co-sell and referral network"
        />
        <StatCard
          label="Average health"
          value={`${averageHealth}`}
          delta={2}
          icon={HeartPulse}
          hint="Composite 0–100 score"
        />
      </StatGrid>

      <CompaniesTable companies={companies} industries={industries} regions={regions} />
    </div>
  );
}
