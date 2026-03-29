<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Context

Before making changes, read `docs/project-context.md`.

That file is the repo-level source of truth for:

- current product scope
- route and component structure
- active data sources versus planned backend integrations
- visual/system-level constraints to preserve while iterating

## Auth And Settings Guardrails

- Clerk is used for authentication, sessions, and identity data only.
- PocketPilot uses custom account/settings UI. Do not reintroduce Clerk's prebuilt `UserButton`, `UserProfile`, `SignOutButton`, or default account/settings surfaces.
- Route users to `/settings` for account management.
- Do not add profile photos or password-management UI unless the product direction explicitly changes.

## Onboarding And User Bootstrap

- Convex `users` is the only app-owned user table. Do not create a duplicate users table or parallel auth profile store.
- The existing `users.clerkUserId` field remains the lookup key for Clerk-backed bootstrap in this codebase. Extend that record instead of introducing alternate identity tables.
- Convex owns onboarding state through `onboardingCompleted`, `onboardingStep`, `hasConnectedBank`, and `firstSyncCompleted`.
- `/onboarding` is a standalone protected route, not a modal and not part of the main app shell.
- Protected app routes in `app/(app)` gate against Convex onboarding state and redirect incomplete users to `/onboarding`.
- Users who already completed onboarding should be redirected away from `/onboarding` to `/dashboard`.
- Do not mark onboarding complete from placeholder UI. Only complete it when real bank connection plus first sync state are true.
- The next backend pass should wire Plaid events into the existing `users` record rather than inventing a separate onboarding system.
- Convex auth depends on Clerk issuer configuration in `convex/auth.config.ts`; keep `CLERK_JWT_ISSUER_DOMAIN` configured in the Convex deployment environment.
- Clerk must also have the Convex integration, or a JWT template named `convex`, active. Without that template, `ConvexProviderWithClerk` cannot fetch an authenticated token for Convex and signed-in app routes will fail before user hydration.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
