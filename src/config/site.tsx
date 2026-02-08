import { Gauge, type LucideIcon, MessagesSquare, FileText, Users, Receipt, DollarSign, BarChart3 } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "LignumHub",
  description: "Accounting software for Caribbean small businesses",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Dashboard",
    href: "/",
  },
  {
    icon: Users,
    name: "Customers",
    href: "/customers",
  },
  {
    icon: FileText,
    name: "Create Invoice",
    href: "/create-invoice",
  },
  {
    icon: Receipt,
    name: "Receipts",
    href: "/receipts",
  },
  {
    icon: DollarSign,
    name: "Expenses",
    href: "/expenses",
  },
  {
    icon: BarChart3,
    name: "P&L Report",
    href: "/reports/pl",
  },
  {
    icon: MessagesSquare,
    name: "Ticket",
    href: "/ticket",
  },
];
