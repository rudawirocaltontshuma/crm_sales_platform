import {
  activities,
  companies,
  contacts,
  deals,
  leads,
  products,
  quotes,
  salesReps,
  salesTeams,
  tasks,
  tickets,
} from "./dataset";
import { REFERENCE_DATE } from "./random";
import type {
  Activity,
  Company,
  Contact,
  CrmTask,
  Deal,
  Lead,
  Product,
  Quote,
  SalesRep,
  SalesTeam,
  Ticket,
} from "./types";

export { REFERENCE_DATE } from "./random";
export * from "./types";
export { activities, companies, contacts, deals, leads, products, quotes, salesReps, salesTeams, tasks, tickets };

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

const byId = <T extends { id: string }>(items: readonly T[]) => new Map(items.map((item) => [item.id, item]));

const repMap = byId(salesReps);
const teamMap = byId(salesTeams);
const companyMap = byId(companies);
const contactMap = byId(contacts);
const dealMap = byId(deals);
const leadMap = byId(leads);
const productMap = byId(products);
const quoteMap = byId(quotes);
const ticketMap = byId(tickets);

export const getRep = (id: string): SalesRep | undefined => repMap.get(id);
export const getTeam = (id: string): SalesTeam | undefined => teamMap.get(id);
export const getCompany = (id: string): Company | undefined => companyMap.get(id);
export const getContact = (id: string): Contact | undefined => contactMap.get(id);
export const getDeal = (id: string): Deal | undefined => dealMap.get(id);
export const getLead = (id: string): Lead | undefined => leadMap.get(id);
export const getProduct = (id: string): Product | undefined => productMap.get(id);
export const getQuote = (id: string): Quote | undefined => quoteMap.get(id);
export const getTicket = (id: string): Ticket | undefined => ticketMap.get(id);

export const repName = (id: string) => repMap.get(id)?.name ?? "Unassigned";

export const contactsForCompany = (companyId: string): Contact[] =>
  contacts.filter((contact) => contact.companyId === companyId);
export const dealsForCompany = (companyId: string): Deal[] => deals.filter((deal) => deal.companyId === companyId);
export const activitiesForCompany = (companyId: string): Activity[] =>
  activities.filter((activity) => activity.companyId === companyId);
export const tasksForCompany = (companyId: string): CrmTask[] => tasks.filter((task) => task.companyId === companyId);
export const ticketsForCompany = (companyId: string): Ticket[] =>
  tickets.filter((ticket) => ticket.companyId === companyId);
export const activitiesForDeal = (dealId: string): Activity[] =>
  activities.filter((activity) => activity.dealId === dealId);
export const tasksForDeal = (dealId: string): CrmTask[] => tasks.filter((task) => task.relatedId === dealId);
export const quotesForDeal = (dealId: string): Quote[] => quotes.filter((quote) => quote.dealId === dealId);
export const activitiesForContact = (contactId: string): Activity[] =>
  activities.filter((activity) => activity.contactId === contactId);
export const dealsForRep = (repId: string): Deal[] => deals.filter((deal) => deal.ownerId === repId);

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

const wonDeals = deals.filter((deal) => deal.stage === "Won");
const lostDeals = deals.filter((deal) => deal.stage === "Lost");
const openDeals = deals.filter((deal) => deal.stage !== "Won" && deal.stage !== "Lost");

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const totalRevenue = sum(wonDeals.map((deal) => deal.value));
export const pipelineValue = sum(openDeals.map((deal) => deal.value));
export const weightedPipelineValue = Math.round(sum(openDeals.map((deal) => (deal.value * deal.probability) / 100)));
export const averageDealSize = Math.round(totalRevenue / Math.max(wonDeals.length, 1));
export const averageSalesCycleDays = Math.round(
  sum(wonDeals.map((deal) => deal.ageInDays)) / Math.max(wonDeals.length, 1),
);
export const winRate = Math.round((wonDeals.length / Math.max(wonDeals.length + lostDeals.length, 1)) * 100);
export const newLeadsCount = leads.filter((lead) => lead.status === "New").length;
export const convertedLeadsCount = leads.filter((lead) => lead.status === "Converted").length;
export const leadConversionRate = Math.round((convertedLeadsCount / Math.max(leads.length, 1)) * 100);

export const customerCompanies = companies.filter((company) => company.status === "Active Customer");
export const churnedCompanies = companies.filter((company) => company.status === "Churned");
export const retentionRate = Math.round(
  (customerCompanies.length / Math.max(customerCompanies.length + churnedCompanies.length, 1)) * 100,
);

export const openTickets = tickets.filter((ticket) => ticket.status !== "Closed" && ticket.status !== "Resolved");

export interface MonthPoint {
  month: string;
  label: string;
  revenue: number;
  pipeline: number;
  deals: number;
  leads: number;
  converted: number;
  activities: number;
}

const MONTH_LABEL = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

/** Rolling 12 months ending at the reference date. */
export const monthlyTrend: MonthPoint[] = Array.from({ length: 12 }, (_, index) => {
  const date = new Date(Date.UTC(REFERENCE_DATE.getUTCFullYear(), REFERENCE_DATE.getUTCMonth() - (11 - index), 1));
  const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  const inMonth = (value: string | null) => Boolean(value) && (value as string).slice(0, 7) === key;

  const monthWon = deals.filter((deal) => deal.stage === "Won" && inMonth(deal.closedAt));
  const monthOpen = deals.filter((deal) => inMonth(deal.createdAt));
  const monthLeads = leads.filter((lead) => inMonth(lead.createdAt));

  return {
    month: key,
    label: `${MONTH_LABEL.format(date)} ${String(date.getUTCFullYear()).slice(2)}`,
    revenue: sum(monthWon.map((deal) => deal.value)),
    pipeline: sum(monthOpen.map((deal) => deal.value)),
    deals: monthWon.length,
    leads: monthLeads.length,
    converted: monthLeads.filter((lead) => lead.status === "Converted").length,
    activities: activities.filter((activity) => activity.occurredAt.slice(0, 7) === key).length,
  };
});

export const stageDistribution = (
  ["Lead", "Qualified", "Discovery", "Proposal", "Negotiation", "Won", "Lost"] as const
).map((stage) => {
  const stageDeals = deals.filter((deal) => deal.stage === stage);

  return {
    stage,
    count: stageDeals.length,
    value: sum(stageDeals.map((deal) => deal.value)),
  };
});

export const revenueByRegion = ["North America", "Latin America", "EMEA", "APAC"].map((region) => {
  const regionWon = wonDeals.filter((deal) => deal.region === region);
  const regionOpen = openDeals.filter((deal) => deal.region === region);

  return {
    region,
    revenue: sum(regionWon.map((deal) => deal.value)),
    pipeline: sum(regionOpen.map((deal) => deal.value)),
    deals: regionWon.length,
  };
});

export const revenueByRep = salesReps
  .map((rep) => {
    const repWon = wonDeals.filter((deal) => deal.ownerId === rep.id);
    const repOpen = openDeals.filter((deal) => deal.ownerId === rep.id);
    const repLost = lostDeals.filter((deal) => deal.ownerId === rep.id);

    return {
      id: rep.id,
      name: rep.name,
      initials: rep.initials,
      avatarTone: rep.avatarTone,
      team: teamMap.get(rep.teamId)?.name ?? "—",
      region: rep.region,
      quota: rep.quota,
      revenue: sum(repWon.map((deal) => deal.value)),
      pipeline: sum(repOpen.map((deal) => deal.value)),
      won: repWon.length,
      open: repOpen.length,
      lost: repLost.length,
      winRate: Math.round((repWon.length / Math.max(repWon.length + repLost.length, 1)) * 100),
    };
  })
  .sort((a, b) => b.revenue - a.revenue);

export const leadsBySource = [...new Set(leads.map((lead) => lead.source))]
  .map((source) => {
    const sourceLeads = leads.filter((lead) => lead.source === source);

    return {
      source,
      leads: sourceLeads.length,
      converted: sourceLeads.filter((lead) => lead.status === "Converted").length,
      value: sum(sourceLeads.map((lead) => lead.estimatedValue)),
    };
  })
  .sort((a, b) => b.leads - a.leads);

export const leadsByStatus = ["New", "Contacted", "Qualified", "Nurturing", "Unqualified", "Converted"].map(
  (status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length,
  }),
);

export const revenueByIndustry = [...new Set(companies.map((company) => company.industry))]
  .map((industry) => {
    const industryCompanyIds = new Set(
      companies.filter((company) => company.industry === industry).map((company) => company.id),
    );
    const industryDeals = wonDeals.filter((deal) => industryCompanyIds.has(deal.companyId));

    return {
      industry,
      revenue: sum(industryDeals.map((deal) => deal.value)),
      customers: industryCompanyIds.size,
    };
  })
  .sort((a, b) => b.revenue - a.revenue);

export const topProducts = [...products]
  .filter((product) => product.status === "Active")
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 10);

export const topCustomers = companies
  .map((company) => ({
    id: company.id,
    name: company.name,
    industry: company.industry,
    region: company.region,
    healthScore: company.healthScore,
    revenue: sum(
      dealsForCompany(company.id)
        .filter((deal) => deal.stage === "Won")
        .map((deal) => deal.value),
    ),
    orders: dealsForCompany(company.id).filter((deal) => deal.stage === "Won").length,
  }))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 10);

export const upcomingTasks = [...tasks]
  .filter((task) => task.status !== "Completed")
  .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))
  .slice(0, 8);

export const recentActivities = activities.slice(0, 12);

export const activityTypeBreakdown = ["Call", "Meeting", "Email", "Note", "Task"].map((type) => ({
  type,
  count: activities.filter((activity) => activity.type === type).length,
}));

export const ticketStatusBreakdown = ["Open", "In Progress", "Waiting", "Resolved", "Closed"].map((status) => ({
  status,
  count: tickets.filter((ticket) => ticket.status === status).length,
}));

export const quoteStatusBreakdown = ["Draft", "Sent", "Accepted", "Rejected"].map((status) => ({
  status,
  count: quotes.filter((quote) => quote.status === status).length,
  value: sum(quotes.filter((quote) => quote.status === status).map((quote) => quote.total)),
}));

/** Calendar events anchored to the current month so the calendar always looks alive. */
export function buildCalendarEvents() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return tasks.slice(0, 60).map((task, index) => {
    const day = (index % 27) + 1;
    const hour = 8 + (index % 9);
    const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), day, hour, index % 2 === 0 ? 0 : 30);
    const allDay = index % 11 === 0;

    return {
      id: task.id,
      title: `${task.title} — ${dealMap.get(task.relatedId)?.companyName ?? "DIMENSION"}`,
      start: allDay ? new Date(start.getFullYear(), start.getMonth(), day) : start,
      end: allDay ? undefined : new Date(start.getTime() + 60 * 60 * 1000),
      allDay,
    };
  });
}
