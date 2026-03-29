# PocketPilot Project Context

## Product Snapshot

PocketPilot is currently a UI-first personal finance product with two distinct surfaces:

- a public marketing/landing experience at `/`
- an authenticated app experience centered on dashboard, transactions, budgets, subscriptions, and settings

The product direction is still focused on a personal finance command center that helps users:

- understand balances and cash flow quickly
- review transactions with filtering and detail views
- track category budgets against monthly spend
- monitor recurring subscriptions and connected-account health
- manage account, security, billing, and product preferences from a custom settings experience

Most product behavior is still driven by local mock data. The UI is materially more complete than the backend wiring.

## Current Status

- `/` is now a polished landing page with overview, feature, pricing, and CTA sections.
- Signed-out users are routed toward `/sign-in` and `/sign-up`; signed-in users are routed toward `/dashboard` and `/settings`.
- `/onboarding` now exists as a standalone authenticated route outside the main app shell.
- Protected product routes are `/dashboard`, `/transactions`, `/budgets`, `/subscriptions`, and `/settings`.
- `/onboarding` is also auth-protected through Clerk proxy/middleware.
- Clerk middleware in `proxy.ts` protects those app routes.
- The Clerk instance must also have the Convex integration, or an equivalent JWT template named `convex`, activated so `ConvexProviderWithClerk` can mint Convex-compatible tokens.
- The authenticated shell uses a sidebar on desktop, a mobile topbar, and a mobile bottom nav.
- Mobile topbar behavior now includes a notification inbox sheet and a profile/account sheet.
- The settings experience is custom and supports both the dedicated `/settings` page and a desktop modal opened from app surfaces via the `?settings=` query param.
- Settings sections currently include `Account`, `Security`, `Billing`, `Connected Accounts`, `Preferences`, and `Danger Zone`.
- `Account` editing and `Security` session management are Clerk-backed.
- `Billing` and `Connected Accounts` are still presentation-only and backed by mock data.
- `Preferences` are locally persisted in browser storage under `pocketpilot.settings.preferences`.
- Theme switching is live through `next-themes`.
- Currency, date format, and notification preferences are selectable and persisted, but they are not applied across the broader product yet.
- Authenticated sessions now hydrate a Convex-backed current user record on load through `getOrCreateCurrentUser`.
- Convex is now the source of truth for onboarding state via the existing `users` table.
- Authenticated users are redirected to `/onboarding` until `users.onboardingCompleted` is true.
- The onboarding flow persists `defaultCurrency`, `onboardingStep`, `onboardingCompleted`, `hasConnectedBank`, and `firstSyncCompleted` on `users`.
- The current onboarding UI is production-shaped but intentionally incomplete: Plaid connection is still a placeholder and onboarding cannot complete until a future sync flow sets both bank flags.
- The app includes route-level loading and error surfaces for the authenticated route group.
- The old `/log-in` path is just a redirect to `/sign-in`.

## Data Reality

The current frontend source of truth is still mostly `lib/mock-data.ts`, but user bootstrap and onboarding are now live in Convex.

That file currently provides:

- dashboard metrics and chart data
- transactions
- budgets
- subscriptions
- connected institutions and accounts
- billing summary
- default settings preferences
- notification inbox content

The frontend domain types live in:

- `lib/types/finance.ts`
- `lib/types/settings.ts`

Live Convex-backed behavior now exists for:

- authenticated user bootstrap and idempotent get-or-create
- onboarding state reads and writes
- onboarding gating between `/onboarding` and the protected app routes

Main dashboard, transactions, budgets, subscriptions, and settings content are still mostly mock-backed.

## Tech Stack

- Next.js `16.2.1`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- Clerk for auth, sessions, and identity fields
- Convex for planned backend data modeling
- Plaid for planned connected-account flows
- Recharts for finance visualizations
- `next-themes` for theme switching
- Radix/shadcn-style primitives under `components/ui`
- Lenis for landing-page scroll behavior

## Route Structure

### Public routes

- `app/page.tsx`: marketing landing page
- `app/sign-in/[[...sign-in]]/page.tsx`: Clerk sign-in route
- `app/sign-up/[[...sign-up]]/page.tsx`: Clerk sign-up route
- `app/log-in/page.tsx`: compatibility redirect to `/sign-in`

### Authenticated onboarding route

- `app/onboarding/page.tsx`: standalone onboarding flow gated by Convex user state

### Authenticated routes

- `app/(app)/layout.tsx`: authenticated shell with sidebar, topbar, bottom nav, and settings modal host
- `app/(app)/dashboard/page.tsx`: dashboard
- `app/(app)/transactions/page.tsx`: transactions explorer
- `app/(app)/budgets/page.tsx`: budgets overview
- `app/(app)/subscriptions/page.tsx`: subscriptions overview
- `app/(app)/settings/page.tsx`: full settings page shell
- `app/(app)/loading.tsx`: authenticated-route loading skeleton
- `app/(app)/error.tsx`: authenticated-route error state

## Component Structure

### Landing

- `components/landing/*`: marketing navbar, hero, feature grid, pricing, final CTA, footer, preview framing, and smooth scrolling

### Shell and navigation

- `components/shell/*`: desktop sidebar, mobile topbar, bottom nav, desktop profile menu
- `lib/constants/navigation.ts`: app navigation and settings/account navigation targets

### Auth and onboarding

- `components/providers/convex-client-provider.tsx`: Convex + Clerk client provider wiring
- `components/auth/current-user-provider.tsx`: Convex-backed current user hydration and local snapshot sync
- `components/auth/route-gate.tsx`: shared gating between the onboarding route and the protected app shell
- `components/onboarding/onboarding-flow.tsx`: multi-step onboarding UI and Convex mutations

### Dashboard

- `components/dashboard/*`: metric cards, cash-flow chart, transaction table, subscription summaries, and supporting visuals

### Transactions

- `components/transactions/*`: filter controls, list interactions, and transaction detail content

### Budgets

- `components/budgets/*`: budget overview and per-row budget presentation

### Subscriptions

- `components/subscriptions/*`: recurring merchant list and row rendering

### Settings

- `components/settings/settings-page-shell.tsx`: standalone settings page wrapper
- `components/settings/settings-modal-host.tsx`: desktop modal settings presentation mounted from the app shell
- `components/settings/settings-content.tsx`: all settings sections and most current settings behavior
- `components/settings/account-dialogs.tsx`: custom Clerk-backed account editing dialogs
- `components/settings/settings-link.tsx`: routes to `/settings` or opens the desktop modal depending on context

## Auth And Settings Ownership

- Clerk owns authentication, session state, and identity fields such as name, email, and phone.
- Clerk must remain configured to mint a `convex` JWT template or active Convex integration for authenticated Convex calls to work.
- PocketPilot owns navigation, onboarding gating, account/settings UI, billing presentation, connected-account presentation, and product preferences.
- Convex `users` is the only app-owned user record and now owns default currency plus onboarding state.
- The app intentionally uses custom account menus and custom sign-out flows.
- Do not reintroduce Clerk `UserButton`, `UserProfile`, `SignOutButton`, or other default account-management surfaces.
- `/settings` remains the only account-management destination.
- Profile photos remain out of scope.
- Password-management UI is still out of scope unless product direction changes.
- Account deletion is currently exposed from the custom settings UI through Clerk user deletion, but broader product/data cleanup semantics are not implemented yet.

## Current UX Constraints

- Preserve the existing visual system in `app/globals.css` unless the user explicitly asks for a redesign.
- Preserve the split between public marketing pages and the authenticated product shell.
- Preserve the custom settings modal/page behavior instead of replacing it with generic account pages.
- Keep desktop and mobile behaviors aligned with the current shell patterns.
- Avoid inventing live backend behavior where the app is still mock-backed.

## Backend Direction

Convex schema already models the long-term product shape with these tables:

- `users`
- `plaidItems`
- `accounts`
- `transactions`
- `budgets`
- `subscriptions`
- `syncLogs`

Important implementation detail:

- the schema includes `imageUrl` on `users`, but the current product direction still treats profile photos as out of scope for UI work
- the existing `users` table is now live for Clerk-to-Convex bootstrap and onboarding state; do not create a second users table
- onboarding is widened safely for compatibility, so code normalizes missing onboarding fields to incomplete values

The missing work is primarily:

- live Convex reads and writes for the dashboard and other finance surfaces
- Plaid item/account/transaction sync flows
- the mutation path that sets `hasConnectedBank` and `firstSyncCompleted` from real Plaid + sync events
- real billing integration
- real notification delivery/state

## Working Assumptions For Future Changes

- Treat `lib/mock-data.ts` as the current UI contract unless a task explicitly wires live data.
- Prefer incremental migration from mocks to Convex/Clerk/Plaid integrations rather than broad rewrites.
- Preserve the current route map: landing at `/`, product home at `/dashboard`.
- When working on settings, account/security may use Clerk APIs, but billing, connected accounts, and product preferences remain app-owned.
- Keep the desktop settings modal flow and the standalone `/settings` page behavior in sync.
- Expect placeholder actions in billing and connected-account areas to remain disabled until backend work is requested.

## Follow-up Work

- Replace mock route data with live Convex queries and mutations.
- Implement Plaid link, refresh, reconnect, and removal flows.
- Wire Plaid success + first sync completion back into `users.hasConnectedBank` and `users.firstSyncCompleted`.
- Allow `completeOnboarding` to be reached through the real Plaid-first-sync path instead of the current placeholder gate.
- Apply stored currency/date-format preferences across charts, tables, and summaries.
- Decide whether notification inbox state should become persisted backend data.
- Define safe product-level cleanup before treating account deletion as fully complete.

## Useful Starting Points

- Start route work from `app/(app)/*` and `app/page.tsx`.
- Start onboarding and gating work from `app/onboarding/page.tsx`, `components/onboarding/onboarding-flow.tsx`, and `components/auth/route-gate.tsx`.
- Start settings work from `components/settings/settings-content.tsx` and `components/settings/settings-modal-host.tsx`.
- Start shell/navigation changes from `app/(app)/layout.tsx`, `components/shell/*`, and `lib/constants/navigation.ts`.
- Start user/bootstrap data work from `components/auth/current-user-provider.tsx`, `convex/users.ts`, and `convex/schema.ts`.
- Start remaining product data-shape work from `lib/mock-data.ts`, `lib/types/*`, and `convex/schema.ts`.
