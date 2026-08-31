/** Domain model for the NEXORA CRM demo dataset. All records are fictional. */

export const DEAL_STAGES = ["Lead", "Qualified", "Discovery", "Proposal", "Negotiation", "Won", "Lost"] as const;
export type DealStage = (typeof DEAL_STAGES)[number];

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Nurturing", "Unqualified", "Converted"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const TASK_STATUSES = ["Pending", "In Progress", "Completed", "Overdue"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const ACTIVITY_TYPES = ["Call", "Meeting", "Email", "Note", "Task"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const QUOTE_STATUSES = ["Draft", "Sent", "Accepted", "Rejected"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const TICKET_STATUSES = ["Open", "In Progress", "Waiting", "Resolved", "Closed"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const COMPANY_SIZES = ["1-50", "51-200", "201-1000", "1001-5000", "5000+"] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

export interface SalesRep {
  id: string;
  name: string;
  initials: string;
  email: string;
  title: string;
  teamId: string;
  region: string;
  quota: number;
  attainment: number;
  wonRevenue: number;
  dealsWon: number;
  dealsOpen: number;
  winRate: number;
  avatarTone: string;
  hiredOn: string;
}

export interface SalesTeam {
  id: string;
  name: string;
  region: string;
  managerId: string;
  memberIds: string[];
  quota: number;
  revenue: number;
  attainment: number;
  focus: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: CompanySize;
  employees: number;
  annualRevenue: number;
  region: string;
  city: string;
  state: string;
  country: string;
  address: string;
  phone: string;
  ownerId: string;
  status: "Prospect" | "Active Customer" | "Churned" | "Partner";
  healthScore: number;
  createdAt: string;
  lastActivityAt: string;
  website: string;
  description: string;
  tags: string[];
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  companyId: string;
  companyName: string;
  ownerId: string;
  city: string;
  country: string;
  status: "Active" | "Inactive" | "Do Not Contact";
  isPrimary: boolean;
  lastContactedAt: string;
  createdAt: string;
  linkedin: string;
  tags: string[];
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  companyName: string;
  companyId: string | null;
  title: string;
  status: LeadStatus;
  source: string;
  score: number;
  rating: "Hot" | "Warm" | "Cold";
  estimatedValue: number;
  ownerId: string;
  region: string;
  city: string;
  country: string;
  industry: string;
  createdAt: string;
  lastContactedAt: string;
  notes: string;
}

export interface Deal {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  primaryContactId: string;
  primaryContactName: string;
  stage: DealStage;
  value: number;
  probability: number;
  ownerId: string;
  region: string;
  source: string;
  productIds: string[];
  createdAt: string;
  expectedCloseDate: string;
  closedAt: string | null;
  ageInDays: number;
  priority: Priority;
  nextStep: string;
  lostReason: string | null;
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description: string;
  ownerId: string;
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  dealId: string | null;
  dealName: string | null;
  occurredAt: string;
  durationMinutes: number;
  outcome: "Positive" | "Neutral" | "Needs Follow-up" | "No Response";
}

export interface CrmTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  ownerId: string;
  relatedType: "Deal" | "Lead" | "Company" | "Ticket";
  relatedId: string;
  relatedName: string;
  companyId: string;
  dueDate: string;
  createdAt: string;
  completedAt: string | null;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  family: string;
  edition: string;
  price: number;
  cost: number;
  margin: number;
  billing: "One-time" | "Monthly" | "Annual";
  status: "Active" | "Draft" | "Retired";
  unitsSold: number;
  revenue: number;
  rating: number;
  description: string;
}

export interface QuoteLineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Quote {
  id: string;
  number: string;
  title: string;
  dealId: string;
  dealName: string;
  companyId: string;
  companyName: string;
  contactName: string;
  ownerId: string;
  status: QuoteStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  issuedAt: string;
  expiresAt: string;
  lineItems: QuoteLineItem[];
  notes: string;
}

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  category: string;
  channel: "Email" | "Phone" | "Chat" | "Portal";
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  firstResponseMinutes: number;
  satisfaction: number | null;
}
