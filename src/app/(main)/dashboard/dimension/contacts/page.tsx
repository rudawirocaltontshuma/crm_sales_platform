import { Contact as ContactIcon, ShieldCheck, Star, UserCheck } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/dimension/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/dimension/_components/stat-card";
import { contacts } from "@/data/dimension";
import { formatNumber } from "@/lib/dimension-format";

import { ContactsTable } from "./_components/contacts-table";

export const metadata = { title: "Contacts | Dimension CRM" };

export default function Page() {
  const departments = [...new Set(contacts.map((contact) => contact.department))].sort();
  const countries = [...new Set(contacts.map((contact) => contact.country))].sort();
  const active = contacts.filter((contact) => contact.status === "Active").length;
  const primary = contacts.filter((contact) => contact.isPrimary).length;
  const doNotContact = contacts.filter((contact) => contact.status === "Do Not Contact").length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Contacts"
        description="People across every account — champions, decision makers, and day-to-day operators."
      />

      <StatGrid>
        <StatCard label="Total contacts" value={formatNumber(contacts.length)} delta={6} icon={ContactIcon} />
        <StatCard
          label="Active"
          value={formatNumber(active)}
          delta={3}
          icon={UserCheck}
          hint="Engaged in the last quarter"
        />
        <StatCard label="Primary contacts" value={formatNumber(primary)} icon={Star} hint="One per account" />
        <StatCard
          label="Do not contact"
          value={formatNumber(doNotContact)}
          icon={ShieldCheck}
          hint="Suppressed from outreach"
        />
      </StatGrid>

      <ContactsTable contacts={contacts} departments={departments} countries={countries} />
    </div>
  );
}
