# Project Updates

Use this file as the first project memory source before searching the codebase.

## Entry Rules

- Append only meaningful changes.
- Group related changes into one entry.
- Use concise, factual descriptions.
- Include DB, API, structure, and important logic decisions.
- Record deferred testing gaps when relevant.

## Template

## YYYY-MM-DD
- Change type: DB | API | Frontend | Infra | Other
- Description: <what changed>
- Impact: <contracts, tables, routes, folders, logic>
- Tests: <added, updated, or deferred>

## 2026-08-26
- Change type: Infra
- Description: GitHub Actions CI (lint, typecheck, test, build), Vitest + validation/error tests, owner/staff role enforcement on settings/campaigns/flows/WhatsApp, staff invites by email (RPC + Settings UI).
- Impact: `.github/workflows/ci.yml`, `vitest.config.ts`, `lib/business/roles.ts`, `lib/staff/*`, `supabase/migrations/20260826100000_staff_invites_and_membership_policies.sql`, guarded server actions, settings/campaigns/flows/dashboard UI
- Tests: added (Vitest for validations, errors, booking keywords)

## 2026-08-26
- Change type: Frontend
- Description: Dashboard metrics (clients, conversations, messages, RDV), quick actions, business profile edit in Settings, conversation search by name/phone.
- Impact: `lib/dashboard/actions.ts`, `lib/business/actions.ts`, `lib/business/current.ts`, `lib/validations/business.ts`, `/dashboard`, `/settings`, `/conversations`, `components/dashboard/*`, `components/settings/business-profile-form.tsx`
- Tests: deferred (manual: dashboard counts, edit business profile as owner, search conversations)

---

## 2026-08-02
- Change type: Frontend
- Description: Flow templates MVP — booking/feedback/reminder toggles, appointments, inbound booking keyword bot, staff reminder + feedback triggers (stub MessagingService).
- Impact: `supabase/migrations/20260802120000_flow_templates.sql`, `lib/flows/*`, `/flows`, inbound hook in `lib/whatsapp/inbound.ts`, nav + design/automation docs
- Tests: deferred (manual: enable Réservation → simulate « RDV » → service → date → OUI → Demander avis / Envoyer rappels)

## 2026-08-01
- Change type: Infra
- Description: Fixed slow/stuck campaign navigation — proxy uses getClaims instead of getUser network round-trip; React.cache for auth/business; createCampaign redirects server-side; withSafeResult rethrows NEXT_REDIRECT; browser auth lock bypass.
- Impact: `lib/supabase/middleware.ts`, `lib/supabase/user.ts`, `lib/supabase/client.ts`, `lib/auth/actions.ts`, `lib/business/current.ts`, `lib/errors.ts`, `lib/campaigns/actions.ts`
- Tests: deferred (manual: create campaign should redirect in seconds, not minutes)

## 2026-08-01
- Change type: Frontend
- Description: Campaigns + templates slice — message_templates, campaigns, campaign_recipients; stub send via MessagingService; audience by tags + marketing_opt_in; list/create/detail UI.
- Impact: `supabase/migrations/20260801210000_campaigns_and_templates.sql`, `lib/campaigns/actions.ts`, `lib/validations/campaign.ts`, `/campaigns`, `/campaigns/new`, `/campaigns/[id]`, customers.marketing_opt_in
- Tests: deferred (manual: create campaign → send stub → check recipients)

## 2026-08-01
- Change type: Frontend
- Description: Customer CRM slice — list/search/tag filter, create/edit with suggested tags (Nouveau/VIP/Inactif), detail page with conversation link, and conversation → fiche client link.
- Impact: `lib/customers/actions.ts`, `lib/validations/customer.ts`, `components/customers/customer-form.tsx`, `/customers`, `/customers/new`, `/customers/[id]`, conversation detail link; fixed `sendOutboundMessage` export + inbound id narrowing
- Tests: deferred (manual: list WhatsApp-created customers, create/edit tags, open conversation from fiche)

## 2026-08-01
- Change type: API
- Description: WhatsApp inbox slice — switched provider docs/code from 360dialog to Meta Cloud API. Added customers/conversations/messages/whatsapp_accounts, stub inbound simulator, webhook route, settings connect + conversations UI.
- Impact: `supabase/migrations/20260801200000_whatsapp_inbox.sql`, `lib/whatsapp/*`, `app/api/webhooks/whatsapp`, `app/api/dev/whatsapp-inbound`, `/conversations`, `/settings`, docs
- Tests: deferred (manual: connect stub number → simulate Bonjour → reply)

## 2026-08-01
- Change type: DB
- Description: Granted SELECT/INSERT/UPDATE on businesses and business_memberships to authenticated/service_role. Fixes empty PostgREST errors from getActiveMembershipCount after signup.
- Impact: `supabase/migrations/20260801193000_grant_business_table_privileges.sql`, `lib/errors.ts` logging, removed Google font fetch from root layout
- Tests: deferred (retest signup → onboarding → dashboard)

## 2026-08-01
- Change type: API
- Description: Email auth + business onboarding. Added businesses/memberships migration + RLS + create_business_for_owner RPC. Login/signup/onboarding pages, session proxy, (app) gate, sign-out.
- Impact: `supabase/migrations/*`, `lib/auth/*`, `app/login`, `app/signup`, `app/onboarding`, `app/(app)/layout.tsx`, `proxy.ts`, roles docs
- Tests: deferred (manual: signup → onboarding → dashboard)

## 2026-07-30
- Change type: Infra
- Description: Switched local secrets file to `.env` (was `.env.local`). Documented Supabase Data API + automatic RLS — every new public table must ship with policies.
- Impact: `config/env.ts`, `docs/context/tech.md`, `ADR-003`, `AGENT_RULES.md`, `.env`
- Tests: deferred

## 2026-07-30
- Change type: Infra
- Description: ADR-003 — new Supabase publishable/secret keys, removed `.env.example`, safe error helpers, Zod validation scaffold (customer/campaign), admin kept docs-only for future subdomain.
- Impact: `config/env.ts`, `lib/supabase/*`, `lib/errors.ts`, `lib/validations/*`, `docs/decisions/ADR-003.md`, agent/tech/roles/admin docs, `.gitignore`
- Tests: deferred (verify via lint/typecheck/build)

## 2026-07-30
- Change type: Infra
- Description: Adopted ADR-002 — Server Components by default, route `revalidate` / dynamic caching, in-memory TanStack Query, and persistent shell via `app/(app)/layout.tsx`. Auth gating deferred.
- Impact: `docs/decisions/ADR-002.md`, `AGENT_RULES.md`, `tech.md`, `app/(app)/*`, `components/providers/query-provider.tsx`, `@tanstack/react-query`
- Tests: deferred (verify via lint/typecheck/build)

## 2026-07-30
- Change type: Infra
- Description: Scaffolded single Next.js 16 app (no src/) with Tailwind v4, shadcn/ui, Prettier, TypeScript strict, flat routes, and minimal Supabase/WhatsApp/auth clients (stub providers). Moved canonical project context to `docs/context/project-context.md` with root stub pointer.
- Impact: `app/*`, `components/*`, `lib/*`, `hooks/`, `config/`, `types/`, `.env.example`, `package.json`, docs context/tech links
- Tests: deferred (scaffold only; verify via lint/typecheck/build)

## 2026-07-29
- Change type: Other
- Description: Adapted docs blueprint from Hhousing monorepo to UNGANE single Next.js app. Archived tenant/mobile/finance Hhousing docs. Added vision/product/tech/design context, feature specs, agent rules, and ADR-001.
- Impact: `project-context.md`, `docs/context/*`, `docs/features/*`, `docs/blueprint/ai/AGENT_RULES.md`, `docs/decisions/ADR-001.md`, `docs/archive/hhousing/`
- Tests: deferred (docs only)
