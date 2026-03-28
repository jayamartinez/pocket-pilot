# PocketPilot Project Context

## Product Snapshot

PocketPilot is a personal finance dashboard focused on four core jobs:

- show account balances and cash flow at a glance
- review transactions with filtering and detail views
- track category budgets against monthly spend
- monitor recurring subscriptions and account connection health

The current app is a UI-first build. The visible product is largely implemented, but most screens still read from local mock data rather than live backend queries.

## Current Status

- The app shell, dashboard, budgets, subscriptions, transactions, and settings experiences are present.
- Most route components consume data from `lib/mock-data.ts`.
- Domain types for the frontend live in `lib/types/finance.ts`.
- A Convex schema exists in `convex/schema.ts`, but the route code is not yet wired to live Convex functions.
- Clerk is wired into the App Router layout, protected product routes, and custom sign-in/sign-up pages.
- The default Clerk account/profile/settings UI has been removed from the shell and landing flows.
- `/settings` is now the single account-management destination and is a fully custom PocketPilot surface.
- Settings sections currently include `Account`, `Security`, `Billing`, `Connected Accounts`, `Preferences`, and `Danger Zone`.
- `Account` and `Security` are Clerk-backed where supported today.
- `Billing` and `Connected Accounts` remain product-owned and mock-backed.
- `Preferences` are product-owned and locally persisted for now. Theme is live; currency, date format, and notification preferences are not yet applied app-wide.
- Plaid account actions and billing mutations are still placeholder-only until backend wiring exists.

## Tech Stack

- Next.js `16.2.1`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4` via `app/globals.css`
- Convex for backend data modeling
- Clerk for authentication
- Plaid for financial account connectivity
- Recharts for charts
- Radix/shadcn-style UI primitives under `components/ui`

## App Structure

### Root layout

- `app/layout.tsx`: global metadata, font setup, theme provider, global styles
- `app/globals.css`: design tokens, gradients, surface styles, motion, scrollbar styling

### App shell

- `app/(app)/layout.tsx`: sidebar, topbar, mobile bottom nav, settings modal host
- `components/shell/*`: navigation chrome and profile/menu surfaces

### Routes

- `app/(app)/page.tsx`: dashboard
- `app/(app)/transactions/page.tsx`: transaction explorer
- `app/(app)/budgets/page.tsx`: budget overview
- `app/(app)/subscriptions/page.tsx`: recurring payments view
- `app/(app)/settings/page.tsx`: settings shell

### Feature component areas

- `components/dashboard/*`: charts, metric cards, sync status, alerts, tables
- `components/transactions/*`: filters, transaction list/detail interactions
- `components/budgets/*`: budget summary UI
- `components/subscriptions/*`: recurring merchant list UI
- `components/settings/*`: settings content, modal/sheet behavior, navigation targets, and custom Clerk-backed account dialogs
- `components/shared/*`: reusable page-level presentation pieces
- `components/ui/*`: base primitives

## Auth And Settings Ownership

- Clerk owns authentication, session data, and identity fields such as name, primary email, and primary phone.
- PocketPilot owns the account/settings UI, navigation, product preferences, billing presentation, and connected-account presentation.
- The shell uses a custom account dropdown and custom sign-out actions. Do not route users into Clerk's default profile/settings UI.
- Profile photos are intentionally out of scope for the current product pass.
- Password management UI is intentionally out of scope until password auth is enabled for the product.

## Data Model Direction

The intended long-term data model is already outlined in Convex:

- `users`
- `plaidItems`
- `accounts`
- `transactions`
- `budgets`
- `subscriptions`
- `syncLogs`

This makes the current state important to understand:

- frontend UX is already modeled around real finance concepts
- backend schema exists for those concepts
- the missing layer is mostly data fetching, mutations, auth plumbing, and Plaid sync flows

## Working Assumptions For Future Changes

- Preserve the current visual language in `app/globals.css` unless the user asks for a redesign.
- Treat `lib/mock-data.ts` as the current source of truth for UI states and empty/loading assumptions.
- Prefer incremental migration from mock data to live Convex/Clerk/Plaid integration rather than large rewrites.
- Keep desktop and mobile behavior aligned with the existing shell and settings patterns.
- Expect the worktree to be dirty during active UI iteration; do not overwrite user edits casually.
- Keep `/settings` custom. Do not reintroduce `UserButton`, `UserProfile`, `SignOutButton`, or Clerk's prebuilt account/settings surfaces.
- Treat Clerk as the source of truth only for identity and session data. Keep billing, connected accounts, and product preferences app-owned.

## Follow-up Work

- Wire billing actions and real subscription state to a backend system.
- Replace placeholder connected-account actions with live Plaid reconnect, refresh, and removal flows.
- Apply stored currency and date-format preferences across the product UI.
- Decide whether account deletion belongs in PocketPilot and implement it only with safe product/data cleanup semantics.

## Useful Starting Points

- Start UI work from the route entrypoint in `app/(app)/*`.
- Start data work from `lib/mock-data.ts`, `lib/types/finance.ts`, and `convex/schema.ts`.
- Start navigation/shell changes from `app/(app)/layout.tsx`, `components/shell/*`, and `lib/constants/navigation.ts`.
