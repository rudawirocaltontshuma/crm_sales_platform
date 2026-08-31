import {
  Boxes,
  Briefcase,
  Building2,
  Calendar,
  ChartBar,
  CheckSquare,
  ClipboardList,
  Contact,
  FileText,
  Gauge,
  Gem,
  Headset,
  Kanban,
  LifeBuoy,
  LineChart,
  type LucideIcon,
  Target,
  UsersRound,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 0,
    label: "Dimension CRM",
    items: [
      { id: "dimension-overview", title: "Overview", url: "/dashboard/dimension", icon: Gauge },
      { id: "dimension-leads", title: "Leads", url: "/dashboard/dimension/leads", icon: Target },
      { id: "dimension-contacts", title: "Contacts", url: "/dashboard/dimension/contacts", icon: Contact },
      { id: "dimension-companies", title: "Companies", url: "/dashboard/dimension/companies", icon: Building2 },
      { id: "dimension-deals", title: "Deals", url: "/dashboard/dimension/deals", icon: Briefcase },
      { id: "dimension-pipeline", title: "Pipeline", url: "/dashboard/dimension/pipeline", icon: Kanban },
      { id: "dimension-activities", title: "Activities", url: "/dashboard/dimension/activities", icon: ClipboardList },
      { id: "dimension-tasks", title: "Tasks", url: "/dashboard/dimension/tasks", icon: CheckSquare },
      { id: "dimension-calendar", title: "Calendar", url: "/dashboard/dimension/calendar", icon: Calendar },
      { id: "dimension-teams", title: "Sales Teams", url: "/dashboard/dimension/sales-teams", icon: UsersRound },
      { id: "dimension-products", title: "Products", url: "/dashboard/dimension/products", icon: Boxes },
      { id: "dimension-quotes", title: "Quotes", url: "/dashboard/dimension/quotes", icon: FileText },
      { id: "dimension-customers", title: "Customers", url: "/dashboard/dimension/customers", icon: Gem },
      { id: "dimension-support", title: "Support", url: "/dashboard/dimension/support", icon: Headset },
      { id: "dimension-reports", title: "Reports", url: "/dashboard/dimension/reports", icon: LineChart },
      { id: "dimension-analytics", title: "Analytics", url: "/dashboard/dimension/analytics", icon: ChartBar },
      { id: "dimension-settings", title: "Settings", url: "/dashboard/dimension/settings", icon: LifeBuoy },
    ],
  },
];
