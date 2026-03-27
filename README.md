# PocketPilot

PocketPilot is a responsive personal finance dashboard built with Next.js, React, Tailwind CSS, and Convex. The current project is in a UI-first stage: the product shell and core screens are present, while most displayed data still comes from local mock data.

## Current Scope

- Dashboard with balances, spending, savings-rate, budget progress, and recent transactions
- Transactions explorer with filtering/detail-oriented UI
- Budgets overview
- Subscriptions overview
- Settings flow with desktop/mobile-aware presentation

## Stack

- Next.js `16.2.1`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- Convex
- Clerk
- Plaid
- Recharts

## Project Structure

```text
app/
  layout.tsx                  Root layout, fonts, theme provider
  globals.css                 Design tokens and global styling
  (app)/
    layout.tsx                Sidebar/topbar/mobile shell
    page.tsx                  Dashboard
    budgets/page.tsx
    subscriptions/page.tsx
    transactions/page.tsx
    settings/page.tsx
components/
  dashboard/                  Dashboard-specific UI
  budgets/                    Budget UI
  subscriptions/              Subscription UI
  transactions/               Transaction UI
  settings/                   Settings UI
  shell/                      Sidebar, topbar, mobile nav
  shared/                     Shared product-level components
  ui/                         Base primitives
lib/
  mock-data.ts                Current frontend data source
  types/finance.ts            Shared finance/domain types
convex/
  schema.ts                   Planned backend schema
docs/
  project-context.md          Repo context for future agents/contributors
```

## Development

Install dependencies and run the app:

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Notes For Contributors

- Read `AGENTS.md` and `docs/project-context.md` before making structural changes.
- The UI currently depends heavily on `lib/mock-data.ts`; avoid assuming screens are live-backed.
- Convex schema already defines the intended finance entities, so future backend work should align with that model instead of inventing a parallel structure.
- Preserve the visual system in `app/globals.css` unless a redesign is explicitly requested.
