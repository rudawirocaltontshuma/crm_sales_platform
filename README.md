# Dimension CRM — Enterprise Customer Relationship & Sales Platform

**Dimension CRM** is a frontend-only, portfolio-grade Enterprise CRM & Sales Management Platform built on top of **Studio Admin**, a Next.js/TypeScript/Shadcn UI admin template. It ships with multiple dashboards, authentication layouts, customizable theme presets, and a full CRM suite driven entirely by deterministic mock data — no backend, no database, no auth, and no persistence.

<img src="https://github.com/arhamkhnz/next-shadcn-admin-dashboard/blob/main/media/dashboard.png?version=5" alt="Dashboard Screenshot">

Most admin templates I found, free or paid, felt cluttered, outdated, or too rigid. I built this as a cleaner alternative with features often missing in others, such as theme toggling and layout controls, while keeping the design modern, minimal, and flexible.

## Dimension CRM

Under `/dashboard/dimension`, this project adds a complete enterprise CRM module: Dashboard, Leads, Contacts, Companies, Deals, Pipeline (Kanban), Activities, Tasks, Calendar, Sales Teams, Products, Quotes, Customers, Support, Reports, Analytics, and Settings. Every screen is powered by a seeded mock dataset (250+ leads, 300+ contacts, 150+ companies, 200+ deals, 400+ activities, 200+ tasks, 100+ products, 100+ tickets) in `src/data/dimension/`, so the data is realistic and stable across builds but entirely fictional — this is a frontend demonstration, not a connected product.

> **View demo:** [studio admin](https://next-shadcn-admin-dashboard.vercel.app)

> [!NOTE]
> Looking for the Base UI version? Check out [next-shadcn-admin-dashboard-baseui](https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui).
>
> Looking for the React Aria version? Check out [arhamkhnz/next-shadcn-admin-dashboard-aria](https://github.com/arhamkhnz/next-shadcn-admin-dashboard-aria).
>
> Looking for the TanStack Start version? Check out [tanstack-shadcn-admin-dashboard](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard).

> [!TIP]
> I’m also working on Nuxt.js and Svelte versions of this dashboard. They’ll be live soon.

## Features

- Built with Next.js 16, TypeScript, Tailwind CSS v4, and Shadcn UI  
- Responsive and mobile-friendly  
- Customizable theme presets (light/dark modes with color schemes like Tangerine, Brutalist, and more)  
- Flexible layouts (collapsible sidebar, variable content widths)  
- Authentication flows and screens  
- Prebuilt dashboards (Default, CRM, Finance, Analytics, Productivity) plus legacy variants  
- **Dimension CRM** — a full enterprise CRM & sales-management module (Leads, Contacts, Companies, Deals, Pipeline, Activities, Tasks, Calendar, Sales Teams, Products, Quotes, Customers, Support, Reports, Analytics) with 1,500+ generated mock records  
- Role-Based Access Control (RBAC) with config-driven UI and multi-tenant support *(planned)*  

> [!NOTE]
> The default dashboard uses the **shadcn neutral** theme.  
> It also includes additional color presets inspired by [Tweakcn](https://tweakcn.com):  
>
> - Tangerine  
> - Neo Brutalism  
> - Soft Pop  
>
> You can create more presets by following the same structure as the existing ones.

> Looking for the **Next.js 15** version?  
> Check out the [`archive/next15`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/tree/archive/next15) branch.  
> This branch contains the setup prior to upgrading to Next 16 and the React Compiler.

> Looking for the **Next.js 14 + Tailwind CSS v3** version?  
> Check out the [`archive/next14-tailwindv3`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/tree/archive/next14-tailwindv3) branch.  
> It has a different color theme and is not actively maintained, but I try to keep it updated with major changes.  

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4  
- **UI Components**: Shadcn UI  
- **Validation**: Zod  
- **Forms & State Management**: React Hook Form, Zustand  
- **Tables & Data Handling**: TanStack Table  
- **Tooling & DX**: Biome, Husky  

## Screens

### Available
- Default Dashboard  
- CRM Dashboard  
- Dimension CRM (Dashboard, Leads, Contacts, Companies, Deals, Pipeline, Activities, Tasks, Calendar, Sales Teams, Products, Quotes, Customers, Support, Reports, Analytics, Settings)  
- Finance Dashboard  
- Analytics Dashboard  
- Productivity Dashboard  
- E-commerce Dashboard  
- Academy Dashboard  
- Logistics Dashboard  
- Infrastructure Dashboard  
- File Manager  
- Patient Monitoring  
- Chat Page  
- Email Page  
- Profile  
- Users Management  
- Roles Management  
- Kanban Board  
- Tasks Page  
- Invoice Page  
- Calendar Page  
- Authentication (4 screens)  
- Legacy: Default v1, CRM v1, Finance v1, Analytics v1

### Planned
I’ve added all the planned screens. Feel free to open an issue for requesting something specific.

## Colocation File System Architecture

This project follows a **colocation-based architecture** each feature keeps its own pages, components, and logic inside its route folder.  
Shared UI, hooks, and configuration live at the top level, making the codebase modular, scalable, and easier to maintain as the app grows.

For a full breakdown of the structure with examples, see the [Next Colocation Template](https://github.com/arhamkhnz/next-colocation-template).

## Getting Started

You can run this project locally, or deploy it instantly with Vercel.

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farhamkhnz%2Fnext-shadcn-admin-dashboard)

_Deploy your own copy with one click._

### Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/rudawirocaltontshuma/crm_sales_platform.git
   ```
   
2. **Navigate into the project**
   ```bash
    cd crm_sales_platform
   ```
   
3. **Install dependencies**
   ```bash
    npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

### Formatting and Linting

Format, lint, and organize imports
```bash
npx @biomejs/biome check --write
```
> For more information on available rules, fixes, and CLI options, refer to the [Biome documentation](https://biomejs.dev/).

---

> [!IMPORTANT]  
> This project is updated frequently. If you’re working from a fork or an older clone, pull the latest changes before syncing. Some updates may include breaking changes.

---

Contributions are welcome. Feel free to open issues, feature requests, or start a discussion.


**Happy Vibe Coding!**
