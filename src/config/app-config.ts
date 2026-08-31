import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Dimension CRM",
  version: packageJson.version,
  copyright: `© ${currentYear}, Dimension CRM.`,
  meta: {
    title: "Dimension CRM - Enterprise Customer Relationship & Sales Platform",
    description:
      "Dimension CRM is a frontend-only Enterprise Customer Relationship & Sales Management Platform demo built with Next.js 16, Tailwind CSS v4, and shadcn/ui — covering leads, deals, pipeline, activities, quotes, support, and analytics.",
  },
};
