# UNGANE Agent Rules

## Product Scope

WhatsApp-first CRM and automation for African businesses (Congo-first, French-first).

Core entities: Business, User, Customer, Conversation, Message, Campaign, Template. Flows/Appointments/Reviews come later.

- End customers use WhatsApp only — no tenant mobile app.
- Defer platform admin, payments, AI chatbots, and drag-and-drop builders unless asked.
- Single Next.js app. No monorepo.

## Before Every Task

1. Read `project-updates.md` first.
2. Read `docs/context/project-context.md` for product truth (root `project-context.md` is a stub pointer).
3. If the task is ambiguous or touches schema, auth, WhatsApp provider boundaries, or large refactors → ask before proceeding.

## Standards (always enforced)

- TypeScript strict — `any` banned in non-trivial code
- Validate all external input at API boundaries with Zod (`lib/validations`)
- Auth check on every protected server operation
- Scope all business data by `business_id`
- Return `ApiResult<T>` — never raw DB or provider errors
- Log real errors internally (`lib/errors`); safe messages only to UI
- No hardcoded URLs, keys, or secrets — use `.env` + `config/env.ts`
- No DB or privileged service calls from client/UI code
- `SUPABASE_SECRET_KEY` / `createAdminClient` — server only
- New `public` tables always include RLS policies (project has automatic RLS on)
- WhatsApp only via `lib/whatsapp` MessagingService — never call Meta APIs from UI
- Reuse existing types, components, and logic before creating new
- Platform admin is deferred (future subdomain) — do not add admin routes unless asked

```ts
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

## Data layer (always enforced)

Mental model: **Server = truth · Cache = speed · Client = interaction**

- Default to **Server Components** for data fetching
- Only add `"use client"` when required (events, browser APIs, TanStack Query hooks)
- **Never** fetch primary page data with `useEffect`
- Prefer server loaders; use **TanStack Query** only for client-side interactive data that must stay warm across navigations
- Set `staleTime` (and avoid useless `refetchOnWindowFocus`) so navigation does not refetch blindly
- No duplicate API calls for the same screen data

## Caching (always enforced)

| Page | Strategy |
|---|---|
| Dashboard / Customers / Campaigns / Settings | `export const revalidate = 60` (customers may go to 300 later) |
| Conversations | `export const dynamic = "force-dynamic"` |

- Do not force-dynamic semi-static pages
- Supabase is the source of truth; TanStack Query is an in-memory client cache (no persist for MVP)
- localStorage only for light UI prefs / drafts — never for core business records

## Layout persistence (always enforced)

- Shared shell lives in `app/(app)/layout.tsx` (route group; URLs stay flat)
- Sidebar and navigation must persist across `/dashboard`, `/customers`, `/conversations`, `/campaigns`, `/settings`
- Do not remount the shell per page by wrapping `AppShell` inside every page

## Workflow

1. Read `project-updates.md` + relevant `docs/context/*` or `docs/features/*`.
2. Implement the smallest working slice.
3. Run: `pnpm lint && pnpm typecheck && pnpm build` (add `pnpm test` when tests exist).
4. Append to `project-updates.md` if the change is meaningful.

## PR is blocked if

- Any check above fails
- Unvalidated external input exists
- A protected route lacks an auth check
- Cross-tenant data access is possible
- `any` is introduced in non-trivial code
- Provider SDKs are called outside MessagingService
- Primary data is loaded via `useEffect`
- App shell is re-declared per page instead of `app/(app)/layout.tsx`
- Secrets or URLs are hardcoded
- Raw provider/DB errors are returned to the UI
- Admin UI is added inside the business `(app)` shell without an explicit ask

## Minimum Test Coverage

- New API route: success, validation failure, auth failure
- New business logic: happy path + at least one failure path

## Delivery Priority

1. Auth (phone OTP primary) + business account
2. WhatsApp connection + inbox (conversations / messages)
3. Customer CRM + tags
4. Campaigns + templates
5. Flow templates (booking / feedback / reminder)
6. Analytics + platform admin

## Auth Reminder

- **Temporary MVP:** email + password (`/login`, `/signup`)
- **Target:** phone + OTP primary; email secondary
- Roles: `business_owner`, `business_staff` (MVP); `platform_admin` deferred
- Onboarding: `/onboarding` creates business via `create_business_for_owner` RPC


## project-updates.md Format

Append-only. One entry per meaningful change. Keep entries concise.

```
## YYYY-MM-DD
- Type: DB | API | Frontend | Infra | Other
- Description: what changed
- Impact: tables, routes, contracts, folders affected
- Tests: added | updated | deferred (reason)
```
