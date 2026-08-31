/** Shared formatting helpers for the Dimension CRM module. */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return dateFormatter.format(typeof value === "string" ? new Date(value) : value);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return dateTimeFormatter.format(typeof value === "string" ? new Date(value) : value);
}

/** Tailwind class pairs used for coloured status pills across the module. */
const TONES = {
  neutral: "border-border bg-muted text-muted-foreground",
  green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  blue: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  violet: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  rose: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  cyan: "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
} as const;

export type StatusTone = keyof typeof TONES;

export function toneClass(tone: StatusTone): string {
  return TONES[tone];
}

const STATUS_TONES: Record<string, StatusTone> = {
  // Deal stages
  Lead: "neutral",
  Qualified: "blue",
  Discovery: "cyan",
  Proposal: "violet",
  Negotiation: "amber",
  Won: "green",
  Lost: "rose",
  // Lead statuses
  New: "blue",
  Contacted: "cyan",
  Nurturing: "violet",
  Unqualified: "neutral",
  Converted: "green",
  // Task / ticket statuses
  Pending: "amber",
  "In Progress": "blue",
  Completed: "green",
  Overdue: "rose",
  Open: "blue",
  Waiting: "amber",
  Resolved: "green",
  Closed: "neutral",
  // Quote statuses
  Draft: "neutral",
  Sent: "blue",
  Accepted: "green",
  Rejected: "rose",
  // Priorities
  Low: "neutral",
  Medium: "blue",
  High: "amber",
  Critical: "rose",
  // Company / contact statuses
  Prospect: "blue",
  "Active Customer": "green",
  Partner: "violet",
  Churned: "rose",
  Active: "green",
  Inactive: "neutral",
  "Do Not Contact": "rose",
  Retired: "neutral",
  // Ratings & outcomes
  Hot: "rose",
  Warm: "amber",
  Cold: "blue",
  Positive: "green",
  Neutral: "neutral",
  "Needs Follow-up": "amber",
  "No Response": "rose",
};

export function statusTone(status: string): StatusTone {
  return STATUS_TONES[status] ?? "neutral";
}
