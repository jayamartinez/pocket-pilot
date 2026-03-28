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
