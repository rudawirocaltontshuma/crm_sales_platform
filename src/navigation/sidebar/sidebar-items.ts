import {
  Banknote,
  Boxes,
  Briefcase,
  Building2,
  Calendar,
  ChartBar,
  CheckSquare,
  ClipboardList,
  Contact,
  FileText,
  Fingerprint,
  FolderOpen,
  Forklift,
  Gauge,
  Gem,
  GraduationCap,
  Headset,
  HeartPulse,
  Kanban,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  ListTodo,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  Server,
  ShoppingBag,
  SquareArrowUpRight,
  Target,
  UserRound,
  Users,
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
    label: "NEXORA CRM",
    items: [
      { id: "nexora-overview", title: "Overview", url: "/dashboard/nexora", icon: Gauge },
      { id: "nexora-leads", title: "Leads", url: "/dashboard/nexora/leads", icon: Target },
      { id: "nexora-contacts", title: "Contacts", url: "/dashboard/nexora/contacts", icon: Contact },
      { id: "nexora-companies", title: "Companies", url: "/dashboard/nexora/companies", icon: Building2 },
      { id: "nexora-deals", title: "Deals", url: "/dashboard/nexora/deals", icon: Briefcase },
      { id: "nexora-pipeline", title: "Pipeline", url: "/dashboard/nexora/pipeline", icon: Kanban },
      { id: "nexora-activities", title: "Activities", url: "/dashboard/nexora/activities", icon: ClipboardList },
      { id: "nexora-tasks", title: "Tasks", url: "/dashboard/nexora/tasks", icon: CheckSquare },
      { id: "nexora-calendar", title: "Calendar", url: "/dashboard/nexora/calendar", icon: Calendar },
      { id: "nexora-teams", title: "Sales Teams", url: "/dashboard/nexora/sales-teams", icon: UsersRound },
      { id: "nexora-products", title: "Products", url: "/dashboard/nexora/products", icon: Boxes },
      { id: "nexora-quotes", title: "Quotes", url: "/dashboard/nexora/quotes", icon: FileText },
      { id: "nexora-customers", title: "Customers", url: "/dashboard/nexora/customers", icon: Gem },
      { id: "nexora-support", title: "Support", url: "/dashboard/nexora/support", icon: Headset },
      { id: "nexora-reports", title: "Reports", url: "/dashboard/nexora/reports", icon: LineChart },
      { id: "nexora-analytics", title: "Analytics", url: "/dashboard/nexora/analytics", icon: ChartBar },
      { id: "nexora-settings", title: "Settings", url: "/dashboard/nexora/settings", icon: LifeBuoy },
    ],
  },
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        id: "default",
        title: "Default",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        id: "crm",
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        id: "finance",
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        id: "analytics",
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
      {
        id: "productivity",
        title: "Productivity",
        url: "/dashboard/productivity",
        icon: ListTodo,
      },
      {
        id: "ecommerce",
        title: "E-commerce",
        url: "/dashboard/ecommerce",
        icon: ShoppingBag,
      },
      {
        id: "academy",
        title: "Academy",
        url: "/dashboard/academy",
        icon: GraduationCap,
      },
      {
        id: "logistics",
        title: "Logistics",
        url: "/dashboard/logistics",
        icon: Forklift,
      },
      {
        id: "infrastructure",
        title: "Infrastructure",
        url: "/dashboard/infrastructure",
        icon: Server,
      },
      {
        id: "file-manager",
        title: "File Manager",
        url: "/dashboard/file-manager",
        icon: FolderOpen,
        badge: "new",
      },
      {
        id: "patient-monitoring",
        title: "Patient Monitoring",
        url: "/dashboard/patient-monitoring",
        icon: HeartPulse,
        badge: "new",
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        id: "email",
        title: "Email",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "chat",
        title: "Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
      {
        id: "calendar",
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        id: "kanban",
        title: "Kanban",
        url: "/dashboard/kanban",
        icon: Kanban,
      },
      {
        id: "tasks",
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: CheckSquare,
      },
      {
        id: "invoice",
        title: "Invoice",
        url: "/dashboard/invoice",
        icon: ReceiptText,
      },
      {
        id: "profile",
        title: "Profile",
        url: "/dashboard/profile",
        icon: UserRound,
        badge: "new",
      },
      {
        id: "users",
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "roles",
        title: "Roles",
        url: "/dashboard/roles",
        icon: Lock,
      },
      {
        id: "authentication",
        title: "Authentication",
        icon: Fingerprint,
        subItems: [
          { id: "auth-login-v1", title: "Login v1", url: "/auth/v1/login", newTab: true },
          { id: "auth-login-v2", title: "Login v2", url: "/auth/v2/login", newTab: true },
          { id: "auth-register-v1", title: "Register v1", url: "/auth/v1/register", newTab: true },
          { id: "auth-register-v2", title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Legacy",
    items: [
      {
        id: "legacy-dashboards",
        title: "Dashboards",
        subItems: [
          { id: "legacy-default", title: "Default V1", url: "/dashboard/default-v1" },
          { id: "legacy-crm", title: "CRM V1", url: "/dashboard/crm-v1" },
          { id: "legacy-finance", title: "Finance V1", url: "/dashboard/finance-v1" },
          { id: "legacy-analytics", title: "Analytics V1", url: "/dashboard/analytics-v1" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Misc",
    items: [
      {
        id: "others",
        title: "Others",
        url: "/dashboard/coming-soon",
        icon: SquareArrowUpRight,
        badge: "soon",
        disabled: true,
      },
    ],
  },
];
