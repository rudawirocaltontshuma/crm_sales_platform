# Contributing to Dimension CRM

Thanks for your interest in improving **Dimension CRM**. This guide covers how to set up your environment and how to contribute.

---

## Overview

Dimension CRM is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. It is a frontend-only application — there is no backend, database, or authentication, and all data comes from a seeded mock-data generator. Keep that in mind when contributing: new features should extend the mock-data layer rather than introduce real network calls or persistence.

---

## Project Layout

This project uses a **colocation-based file system** — each screen keeps its own page, components, and data usage inside its own route folder.

```
src
├── app
│   └── (main)
│       └── dashboard
│           ├── dimension        # Dimension CRM screens
│           │   ├── leads
│           │   ├── contacts
│           │   ├── companies
│           │   ├── deals
│           │   ├── pipeline
│           │   ├── activities
│           │   ├── tasks
│           │   ├── calendar
│           │   ├── sales-teams
│           │   ├── products
│           │   ├── quotes
│           │   ├── customers
│           │   ├── support
│           │   ├── reports
│           │   ├── analytics
│           │   ├── settings
│           │   └── _components  # shared CRM UI (data table, charts, detail views)
│           └── _components      # shared dashboard shell (sidebar, header)
├── data
│   └── dimension                 # seeded mock-data generators and derived aggregates
├── components/ui                 # shadcn/ui primitives
├── navigation/sidebar             # sidebar navigation config
├── hooks
├── lib
└── styles
```

---

## Getting Started

### Fork and Clone the Repository

1. Fork the repository: [rudawirocaltontshuma/crm_sales_platform](https://github.com/rudawirocaltontshuma/crm_sales_platform/fork)

2. Clone your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/crm_sales_platform.git
   ```

3. Navigate into the project
   ```bash
   cd crm_sales_platform
   ```

4. Install dependencies
   ```bash
   npm install
   ```

5. Run the dev server
   ```bash
   npm run dev
   ```
   The app is available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear, conventional commit messages:
  ```bash
  git commit -m "feat: add quote line-item editor"
  ```

- Open a Pull Request once ready.
- If your change adds a new screen or visible UI, include a screenshot in your PR description.

---

## Where to Contribute

- **CRM screens**: `src/app/(main)/dashboard/dimension/<screen>/`
- **Shared CRM UI** (data table, charts, detail scaffolding): `src/app/(main)/dashboard/dimension/_components/`
- **Mock data** (leads, contacts, companies, deals, etc.): `src/data/dimension/`
- **Dashboard shell** (sidebar, header): `src/app/(main)/dashboard/_components/`
- **Shared UI components**: `src/components/`
- **Hooks**: `src/hooks/`
- **Themes**: `src/styles/presets/`

---

## Guidelines

- Prefer **TypeScript types** over `any`.
- Husky pre-commit hooks are enabled — linting and formatting run automatically on commit, and errors will block the commit until fixed.
- Follow shadcn/ui and Tailwind v4 conventions; use the project's existing components and semantic theme tokens.
- Keep accessibility in mind (ARIA, keyboard navigation, focus states).
- New data must go through the seeded mock-data generators in `src/data/dimension/` — do not add real API calls, network requests, or persistence.
- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- Avoid unnecessary dependencies — prefer existing utilities where possible.

---

## Submitting PRs

- Open a Pull Request once your changes are ready.
- Ensure your branch is up to date with `main` before submitting.
- Run `npm run build` and `npm run lint` locally before pushing — both must pass cleanly.
- Reference any related issue in your PR for context.

---

## Questions & Support

- Report bugs, suggestions, or issues via [GitHub Issues](https://github.com/rudawirocaltontshuma/crm_sales_platform/issues)
