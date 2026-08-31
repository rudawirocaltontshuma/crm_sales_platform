import {
  ACTIVITY_SUBJECTS,
  CITIES,
  COMPANY_PREFIXES,
  COMPANY_SUFFIXES,
  DEPARTMENTS,
  FIRST_NAMES,
  INDUSTRIES,
  JOB_TITLES,
  LAST_NAMES,
  LEAD_SOURCES,
  PRODUCT_CATEGORIES,
  PRODUCT_EDITIONS,
  PRODUCT_FAMILIES,
  STREET_NAMES,
  TASK_TITLES,
  TEAM_NAMES,
  TICKET_SUBJECTS,
} from "./pools";
import {
  addDays,
  chance,
  createRandom,
  dateOffset,
  padId,
  pick,
  pickMany,
  REFERENCE_DATE,
  randomFloat,
  randomInt,
  slugify,
  toIso,
  toIsoDate,
  weighted,
} from "./random";
import type {
  Activity,
  Company,
  CompanySize,
  Contact,
  CrmTask,
  Deal,
  DealStage,
  Lead,
  LeadStatus,
  Priority,
  Product,
  Quote,
  QuoteLineItem,
  QuoteStatus,
  SalesRep,
  SalesTeam,
  Ticket,
  TicketStatus,
} from "./types";
import { ACTIVITY_TYPES } from "./types";

const AVATAR_TONES = [
  "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
];

const COMPANY_SIZE_POOL: CompanySize[] = ["1-50", "51-200", "201-1000", "1001-5000", "5000+"];

function initialsOf(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function personEmail(first: string, last: string, domain: string) {
  return `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, "")}@${domain}`;
}

function phoneNumber(random: ReturnType<typeof createRandom>) {
  return `+1 (${randomInt(random, 200, 989)}) ${randomInt(random, 200, 999)}-${String(randomInt(random, 0, 9999)).padStart(4, "0")}`;
}

// ---------------------------------------------------------------------------
// Sales reps & teams
// ---------------------------------------------------------------------------

const repRandom = createRandom(1337);

const TEAM_FOCUS = [
  "Net-new enterprise logos",
  "Expansion and cross-sell",
  "Velocity and volume",
  "Strategic multi-year contracts",
  "Regional greenfield growth",
  "Channel co-sell motion",
];

export const salesReps: SalesRep[] = Array.from({ length: 24 }, (_, index) => {
  const first = FIRST_NAMES[(index * 7 + 3) % FIRST_NAMES.length];
  const last = LAST_NAMES[(index * 11 + 5) % LAST_NAMES.length];
  const teamIndex = index % TEAM_NAMES.length;
  const region = CITIES[(index * 3) % CITIES.length].region;
  const quota = randomInt(repRandom, 8, 22) * 100_000;
  const attainment = randomFloat(repRandom, 0.52, 1.42, 2);
  const dealsWon = randomInt(repRandom, 6, 34);
  const dealsOpen = randomInt(repRandom, 4, 21);

  return {
    id: padId("REP", index + 1),
    name: `${first} ${last}`,
    initials: initialsOf(first, last),
    email: personEmail(first, last, "nexora.example"),
    title:
      index % 8 === 0
        ? "Regional Sales Manager"
        : pick(repRandom, ["Account Executive", "Senior Account Executive", "Enterprise AE", "Solutions Consultant"]),
    teamId: padId("TEAM", teamIndex + 1),
    region,
    quota,
    attainment,
    wonRevenue: Math.round(quota * attainment),
    dealsWon,
    dealsOpen,
    winRate: Math.round((dealsWon / (dealsWon + randomInt(repRandom, 5, 26))) * 100),
    avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
    hiredOn: toIsoDate(dateOffset(repRandom, -2200, -180)),
  };
});

export const salesTeams: SalesTeam[] = TEAM_NAMES.map((name, index) => {
  const id = padId("TEAM", index + 1);
  const members = salesReps.filter((rep) => rep.teamId === id);
  const quota = members.reduce((sum, rep) => sum + rep.quota, 0);
  const revenue = members.reduce((sum, rep) => sum + rep.wonRevenue, 0);

  return {
    id,
    name,
    region: members[0]?.region ?? "North America",
    managerId: members[0]?.id ?? salesReps[0].id,
    memberIds: members.map((rep) => rep.id),
    quota,
    revenue,
    attainment: quota > 0 ? Math.round((revenue / quota) * 100) : 0,
    focus: TEAM_FOCUS[index % TEAM_FOCUS.length],
  };
});

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

const companyRandom = createRandom(20260630);

export const companies: Company[] = Array.from({ length: 156 }, (_, index) => {
  const prefix = COMPANY_PREFIXES[(index * 5 + 1) % COMPANY_PREFIXES.length];
  const suffix = COMPANY_SUFFIXES[(index * 3 + 2) % COMPANY_SUFFIXES.length];
  const name = `${prefix} ${suffix}`;
  const domain = `${slugify(prefix)}${slugify(suffix).slice(0, 4)}.example`;
  const location = CITIES[(index * 7) % CITIES.length];
  const size = COMPANY_SIZE_POOL[randomInt(companyRandom, 0, COMPANY_SIZE_POOL.length - 1)];
  const employees = {
    "1-50": randomInt(companyRandom, 8, 50),
    "51-200": randomInt(companyRandom, 51, 200),
    "201-1000": randomInt(companyRandom, 201, 1000),
    "1001-5000": randomInt(companyRandom, 1001, 5000),
    "5000+": randomInt(companyRandom, 5001, 42000),
  }[size];
  const industry = INDUSTRIES[(index * 4 + 3) % INDUSTRIES.length];
  const createdAt = dateOffset(companyRandom, -900, -20);

  return {
    id: padId("CMP", index + 1),
    name,
    domain,
    industry,
    size,
    employees,
    annualRevenue: employees * randomInt(companyRandom, 120, 480) * 1000,
    region: location.region,
    city: location.city,
    state: location.state,
    country: location.country,
    address: `${randomInt(companyRandom, 12, 4800)} ${pick(companyRandom, STREET_NAMES)}`,
    phone: phoneNumber(companyRandom),
    ownerId: salesReps[index % salesReps.length].id,
    status: weighted(companyRandom, [
      ["Active Customer" as const, 40],
      ["Prospect" as const, 42],
      ["Partner" as const, 10],
      ["Churned" as const, 8],
    ]),
    healthScore: randomInt(companyRandom, 34, 99),
    createdAt: toIsoDate(createdAt),
    lastActivityAt: toIsoDate(dateOffset(companyRandom, -60, 0)),
    website: `https://www.${domain}`,
    description: `${name} is a ${industry.toLowerCase()} organization headquartered in ${location.city} serving customers across ${location.region}.`,
    tags: pickMany(
      companyRandom,
      ["Key Account", "Expansion", "Renewal Risk", "Reference", "Multi-year", "Pilot"],
      randomInt(companyRandom, 1, 3),
    ),
  };
});

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

const contactRandom = createRandom(88112);

export const contacts: Contact[] = Array.from({ length: 320 }, (_, index) => {
  const company = companies[index % companies.length];
  const first = FIRST_NAMES[(index * 13 + 2) % FIRST_NAMES.length];
  const last = LAST_NAMES[(index * 17 + 9) % LAST_NAMES.length];

  return {
    id: padId("CNT", index + 1),
    firstName: first,
    lastName: last,
    fullName: `${first} ${last}`,
    initials: initialsOf(first, last),
    email: personEmail(first, last, company.domain),
    phone: phoneNumber(contactRandom),
    title: pick(contactRandom, JOB_TITLES),
    department: pick(contactRandom, DEPARTMENTS),
    companyId: company.id,
    companyName: company.name,
    ownerId: company.ownerId,
    city: company.city,
    country: company.country,
    status: weighted(contactRandom, [
      ["Active" as const, 78],
      ["Inactive" as const, 16],
      ["Do Not Contact" as const, 6],
    ]),
    isPrimary: index < companies.length,
    lastContactedAt: toIsoDate(dateOffset(contactRandom, -120, -1)),
    createdAt: toIsoDate(dateOffset(contactRandom, -800, -30)),
    linkedin: `https://linkedin.example/in/${slugify(`${first}-${last}-${index}`)}`,
    tags: pickMany(
      contactRandom,
      ["Champion", "Decision Maker", "Technical", "Economic Buyer", "Blocker", "Influencer"],
      randomInt(contactRandom, 1, 2),
    ),
  };
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const productRandom = createRandom(5150);

export const products: Product[] = Array.from({ length: 108 }, (_, index) => {
  const family = PRODUCT_FAMILIES[index % PRODUCT_FAMILIES.length];
  const edition = PRODUCT_EDITIONS[(index * 3) % PRODUCT_EDITIONS.length];
  const category = PRODUCT_CATEGORIES[(index * 5) % PRODUCT_CATEGORIES.length];
  const price = randomInt(productRandom, 4, 480) * 25;
  const cost = Math.round(price * randomFloat(productRandom, 0.24, 0.62, 2));
  const unitsSold = randomInt(productRandom, 18, 1800);

  return {
    id: padId("PRD", index + 1),
    sku: `NX-${String(index + 1).padStart(3, "0")}-${edition.slice(0, 3).toUpperCase()}`,
    name: `${family} ${edition}`,
    category,
    family,
    edition,
    price,
    cost,
    margin: Math.round(((price - cost) / price) * 100),
    billing: weighted(productRandom, [
      ["Annual" as const, 52],
      ["Monthly" as const, 33],
      ["One-time" as const, 15],
    ]),
    status: weighted(productRandom, [
      ["Active" as const, 78],
      ["Draft" as const, 12],
      ["Retired" as const, 10],
    ]),
    unitsSold,
    revenue: unitsSold * price,
    rating: randomFloat(productRandom, 3.2, 5, 1),
    description: `${family} ${edition} delivers ${category.toLowerCase()} capabilities for revenue teams standardizing on the NEXORA platform.`,
  };
});

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

const leadRandom = createRandom(77021);

const LEAD_STATUS_WEIGHTS: readonly (readonly [LeadStatus, number])[] = [
  ["New", 26],
  ["Contacted", 22],
  ["Qualified", 18],
  ["Nurturing", 16],
  ["Unqualified", 10],
  ["Converted", 8],
];

export const leads: Lead[] = Array.from({ length: 268 }, (_, index) => {
  const first = FIRST_NAMES[(index * 19 + 6) % FIRST_NAMES.length];
  const last = LAST_NAMES[(index * 23 + 4) % LAST_NAMES.length];
  const linkedCompany = chance(leadRandom, 0.55) ? companies[(index * 3) % companies.length] : null;
  const location = CITIES[(index * 5 + 2) % CITIES.length];
  const companyName =
    linkedCompany?.name ??
    `${COMPANY_PREFIXES[(index * 9 + 4) % COMPANY_PREFIXES.length]} ${COMPANY_SUFFIXES[(index * 7 + 1) % COMPANY_SUFFIXES.length]}`;
  const score = randomInt(leadRandom, 12, 98);

  return {
    id: padId("LED", index + 1),
    firstName: first,
    lastName: last,
    fullName: `${first} ${last}`,
    initials: initialsOf(first, last),
    email: personEmail(first, last, linkedCompany?.domain ?? `${slugify(companyName).slice(0, 12)}.example`),
    phone: phoneNumber(leadRandom),
    companyName,
    companyId: linkedCompany?.id ?? null,
    title: pick(leadRandom, JOB_TITLES),
    status: weighted(leadRandom, LEAD_STATUS_WEIGHTS),
    source: pick(leadRandom, LEAD_SOURCES),
    score,
    rating: score >= 70 ? "Hot" : score >= 45 ? "Warm" : "Cold",
    estimatedValue: randomInt(leadRandom, 6, 240) * 1000,
    ownerId: salesReps[index % salesReps.length].id,
    region: location.region,
    city: location.city,
    country: location.country,
    industry: linkedCompany?.industry ?? INDUSTRIES[(index * 2) % INDUSTRIES.length],
    createdAt: toIsoDate(dateOffset(leadRandom, -280, -1)),
    lastContactedAt: toIsoDate(dateOffset(leadRandom, -90, 0)),
    notes: `Inbound interest from ${companyName} captured via ${"the"} channel. Awaiting qualification checkpoint with the buying group.`,
  };
});

// ---------------------------------------------------------------------------
// Deals
// ---------------------------------------------------------------------------

const dealRandom = createRandom(31415);

const STAGE_WEIGHTS: readonly (readonly [DealStage, number])[] = [
  ["Lead", 14],
  ["Qualified", 14],
  ["Discovery", 13],
  ["Proposal", 13],
  ["Negotiation", 11],
  ["Won", 21],
  ["Lost", 14],
];

const STAGE_PROBABILITY: Record<DealStage, number> = {
  Lead: 10,
  Qualified: 25,
  Discovery: 40,
  Proposal: 60,
  Negotiation: 78,
  Won: 100,
  Lost: 0,
};

const LOST_REASONS = [
  "Lost to competitor",
  "Budget frozen",
  "No decision",
  "Timing not right",
  "Missing capability",
  "Champion left",
];

const NEXT_STEPS = [
  "Schedule executive alignment",
  "Send revised pricing",
  "Complete security review",
  "Confirm implementation scope",
  "Await procurement sign-off",
  "Run technical validation",
];

export const deals: Deal[] = Array.from({ length: 224 }, (_, index) => {
  const company = companies[(index * 5 + 2) % companies.length];
  const companyContacts = contacts.filter((contact) => contact.companyId === company.id);
  const contact = companyContacts[index % Math.max(companyContacts.length, 1)] ?? contacts[index % contacts.length];
  const stage = weighted(dealRandom, STAGE_WEIGHTS);
  const createdAt = dateOffset(dealRandom, -420, -10);
  const isClosed = stage === "Won" || stage === "Lost";
  const closedAt = isClosed ? addDays(createdAt, randomInt(dealRandom, 18, 190)) : null;
  const expectedClose = isClosed ? (closedAt as Date) : dateOffset(dealRandom, -20, 150);
  const value = randomInt(dealRandom, 8, 420) * 1000;
  const selectedProducts = pickMany(
    dealRandom,
    products.filter((product) => product.status === "Active"),
    randomInt(dealRandom, 1, 4),
  );

  return {
    id: padId("DEA", index + 1),
    name: `${company.name} — ${pick(dealRandom, ["Platform Rollout", "Expansion", "Renewal", "Pilot Program", "Migration", "Global Deployment"])}`,
    companyId: company.id,
    companyName: company.name,
    primaryContactId: contact.id,
    primaryContactName: contact.fullName,
    stage,
    value,
    probability: STAGE_PROBABILITY[stage],
    ownerId: company.ownerId,
    region: company.region,
    source: pick(dealRandom, LEAD_SOURCES),
    productIds: selectedProducts.map((product) => product.id),
    createdAt: toIsoDate(createdAt),
    expectedCloseDate: toIsoDate(expectedClose),
    closedAt: closedAt ? toIsoDate(closedAt) : null,
    ageInDays: Math.max(
      1,
      Math.round(((closedAt ?? REFERENCE_DATE).getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000)),
    ),
    priority: weighted(dealRandom, [
      ["Medium" as const, 38],
      ["High" as const, 30],
      ["Low" as const, 20],
      ["Critical" as const, 12],
    ]) as Priority,
    nextStep: stage === "Won" || stage === "Lost" ? "Closed" : pick(dealRandom, NEXT_STEPS),
    lostReason: stage === "Lost" ? pick(dealRandom, LOST_REASONS) : null,
  };
});

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

const activityRandom = createRandom(60221);

export const activities: Activity[] = Array.from({ length: 440 }, (_, index) => {
  const deal = chance(activityRandom, 0.72) ? deals[(index * 3) % deals.length] : null;
  const company = deal
    ? (companies.find((item) => item.id === deal.companyId) ?? companies[0])
    : companies[(index * 7) % companies.length];
  const companyContacts = contacts.filter((contact) => contact.companyId === company.id);
  const contact = companyContacts[index % Math.max(companyContacts.length, 1)] ?? contacts[index % contacts.length];
  const type = pick(activityRandom, ACTIVITY_TYPES);
  const occurredAt = dateOffset(activityRandom, -120, 6);

  return {
    id: padId("ACT", index + 1),
    type,
    subject: pick(activityRandom, ACTIVITY_SUBJECTS),
    description: `${type} logged for ${company.name} with ${contact.fullName} (${contact.title}).`,
    ownerId: company.ownerId,
    companyId: company.id,
    companyName: company.name,
    contactId: contact.id,
    contactName: contact.fullName,
    dealId: deal?.id ?? null,
    dealName: deal?.name ?? null,
    occurredAt: toIso(new Date(occurredAt.getTime() + randomInt(activityRandom, 8, 17) * 60 * 60 * 1000)),
    durationMinutes: type === "Note" || type === "Email" ? 0 : randomInt(activityRandom, 15, 90),
    outcome: weighted(activityRandom, [
      ["Positive" as const, 44],
      ["Neutral" as const, 26],
      ["Needs Follow-up" as const, 22],
      ["No Response" as const, 8],
    ]),
  };
}).sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

const taskRandom = createRandom(94021);

export const tasks: CrmTask[] = Array.from({ length: 216 }, (_, index) => {
  const deal = deals[(index * 7 + 1) % deals.length];
  const dueDate = dateOffset(taskRandom, -40, 45);
  const isPast = dueDate.getTime() < REFERENCE_DATE.getTime();
  const status = isPast
    ? weighted(taskRandom, [
        ["Completed" as const, 62],
        ["Overdue" as const, 30],
        ["In Progress" as const, 8],
      ])
    : weighted(taskRandom, [
        ["Pending" as const, 55],
        ["In Progress" as const, 33],
        ["Completed" as const, 12],
      ]);

  return {
    id: padId("TSK", index + 1),
    title: pick(taskRandom, TASK_TITLES),
    description: `${pick(taskRandom, TASK_TITLES)} for ${deal.companyName} ahead of the ${deal.stage.toLowerCase()} checkpoint.`,
    status,
    priority: weighted(taskRandom, [
      ["Medium" as const, 40],
      ["High" as const, 28],
      ["Low" as const, 22],
      ["Critical" as const, 10],
    ]) as Priority,
    ownerId: deal.ownerId,
    relatedType: "Deal",
    relatedId: deal.id,
    relatedName: deal.name,
    companyId: deal.companyId,
    dueDate: toIsoDate(dueDate),
    createdAt: toIsoDate(addDays(dueDate, -randomInt(taskRandom, 3, 30))),
    completedAt: status === "Completed" ? toIsoDate(addDays(dueDate, -randomInt(taskRandom, 0, 4))) : null,
  };
});

// ---------------------------------------------------------------------------
// Quotes
// ---------------------------------------------------------------------------

const quoteRandom = createRandom(11235);

const QUOTE_STATUS_WEIGHTS: readonly (readonly [QuoteStatus, number])[] = [
  ["Draft", 24],
  ["Sent", 34],
  ["Accepted", 27],
  ["Rejected", 15],
];

export const quotes: Quote[] = Array.from({ length: 86 }, (_, index) => {
  const deal = deals[(index * 5 + 3) % deals.length];
  const issuedAt = dateOffset(quoteRandom, -180, 5);
  const lineProducts = pickMany(
    quoteRandom,
    products.filter((product) => product.status === "Active"),
    randomInt(quoteRandom, 2, 5),
  );
  const lineItems: QuoteLineItem[] = lineProducts.map((product) => {
    const quantity = randomInt(quoteRandom, 1, 40);
    const discount = randomInt(quoteRandom, 0, 20);
    const gross = quantity * product.price;

    return {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      discount,
      total: Math.round(gross * (1 - discount / 100)),
    };
  });
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discounted = lineItems.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round(discounted * 0.08);

  return {
    id: padId("QTE", index + 1),
    number: `Q-2026-${String(index + 1).padStart(4, "0")}`,
    title: `${deal.companyName} proposal`,
    dealId: deal.id,
    dealName: deal.name,
    companyId: deal.companyId,
    companyName: deal.companyName,
    contactName: deal.primaryContactName,
    ownerId: deal.ownerId,
    status: weighted(quoteRandom, QUOTE_STATUS_WEIGHTS),
    subtotal,
    discount: subtotal - discounted,
    tax,
    total: discounted + tax,
    currency: "USD",
    issuedAt: toIsoDate(issuedAt),
    expiresAt: toIsoDate(addDays(issuedAt, 30)),
    lineItems,
    notes: "Pricing valid for 30 days. Includes standard onboarding and premier support during the initial term.",
  };
});

// ---------------------------------------------------------------------------
// Support tickets
// ---------------------------------------------------------------------------

const ticketRandom = createRandom(40404);

const TICKET_STATUS_WEIGHTS: readonly (readonly [TicketStatus, number])[] = [
  ["Open", 22],
  ["In Progress", 20],
  ["Waiting", 14],
  ["Resolved", 26],
  ["Closed", 18],
];

export const tickets: Ticket[] = Array.from({ length: 124 }, (_, index) => {
  const company = companies[(index * 11 + 4) % companies.length];
  const companyContacts = contacts.filter((contact) => contact.companyId === company.id);
  const contact = companyContacts[0] ?? contacts[index % contacts.length];
  const status = weighted(ticketRandom, TICKET_STATUS_WEIGHTS);
  const createdAt = dateOffset(ticketRandom, -120, -1);
  const isDone = status === "Resolved" || status === "Closed";

  return {
    id: padId("TIC", index + 1),
    number: `T-${String(index + 1).padStart(5, "0")}`,
    subject: TICKET_SUBJECTS[index % TICKET_SUBJECTS.length],
    description: `${company.name} reported an issue affecting their production workspace. Reproduced by support and routed to the platform team for triage.`,
    status,
    priority: weighted(ticketRandom, [
      ["Medium" as const, 38],
      ["High" as const, 28],
      ["Low" as const, 24],
      ["Critical" as const, 10],
    ]) as Priority,
    category: pick(ticketRandom, ["Billing", "Integrations", "Performance", "Access", "Data", "Mobile", "Reporting"]),
    channel: weighted(ticketRandom, [
      ["Email" as const, 40],
      ["Portal" as const, 28],
      ["Chat" as const, 20],
      ["Phone" as const, 12],
    ]),
    companyId: company.id,
    companyName: company.name,
    contactId: contact.id,
    contactName: contact.fullName,
    assigneeId: salesReps[(index * 3) % salesReps.length].id,
    createdAt: toIsoDate(createdAt),
    updatedAt: toIsoDate(addDays(createdAt, randomInt(ticketRandom, 1, 14))),
    resolvedAt: isDone ? toIsoDate(addDays(createdAt, randomInt(ticketRandom, 1, 21))) : null,
    firstResponseMinutes: randomInt(ticketRandom, 4, 480),
    satisfaction: isDone ? randomInt(ticketRandom, 3, 5) : null,
  };
});
