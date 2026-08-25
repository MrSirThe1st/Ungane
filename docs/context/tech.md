# UNGANE – Tech

## Stack

| Layer | Choice |
|---|---|
| App | Next.js (App Router), single repo |
| UI | Tailwind CSS + shadcn/ui |
| Auth / DB / Realtime | Supabase (Auth + PostgreSQL + Realtime) |
| WhatsApp | Meta Cloud API → MessagingService abstraction (`stub` for local) |
| Cache / jobs | Upstash Redis |
| Hosting | Vercel |
| Analytics | PostHog |

## Repo Structure (MVP)

```
/app
  /(app)                 ← route group; URLs stay flat
    layout.tsx           ← persistent sidebar + nav + QueryProvider
    /dashboard
    /customers
    /conversations
    /campaigns
    /settings
/components
  /ui
  /shared
  /layout
  /providers
/lib
  /supabase
  /whatsapp
  /auth
  /utils
  /validations
  errors.ts
/hooks
/config
/types
/docs
```

Flat public URLs only. No `src/` folder. No monorepo. Shared shell via `(app)` layout — see ADR-002.

## Environment (`.env`)

Local only. Gitignored. **Never commit secrets. Never hardcode values.**

Canonical file: **`.env`** at the repo root (Next.js loads it automatically).

| Variable | Where used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + user-scoped server | `sb_publishable_...` |
| `SUPABASE_SECRET_KEY` | Server only (`lib/supabase/admin.ts`) | `sb_secret_...` — bypasses RLS |
| `WHATSAPP_PROVIDER` | Server | `stub` (default) or `meta` |
| `WHATSAPP_API_KEY` | Server | Meta access token when provider = `meta` |
| `WHATSAPP_WEBHOOK_SECRET` | Server | Meta webhook verify token |

Parsed by Zod in `config/env.ts`. See ADR-003.

## Supabase project settings (enabled)

| Setting | Meaning for UNGANE |
|---|---|
| **Data API** | REST API over `public` schema — use via `supabase-js` / `@supabase/ssr` |
| **Automatic RLS** | New tables in `public` get RLS enabled by event trigger |

Rules:
- Every new `public` table **must** ship with explicit RLS policies in the same migration
- Do not rely on “RLS off” for MVP shortcuts
- Prefer user-scoped clients (publishable key + session) for tenant data; use `createAdminClient` (secret key) only for privileged server jobs
- Without policies, queries return empty / deny — that is expected

## Architecture Principles

1. **Provider independence** — never call Meta WhatsApp APIs from UI. Go through `MessagingService` (`sendMessage`, `sendTemplate`, `sendInteractiveMessage`, `handleWebhook`). Provider: `stub` locally, `meta` in production.
2. **Multi-tenant by design** — every business row is scoped by `business_id`. Never leak cross-tenant data.
3. **Server-side authz** — enforce membership/role on every protected server operation.
4. **Phone-first auth** — primary: phone + OTP; secondary: email + password.
5. **TypeScript strict** — no `any` in non-trivial code; validate external input with Zod at API boundaries (`lib/validations`).
6. **Server Components by default** — `"use client"` only when necessary; no `useEffect` for primary data.
7. **Caching** — `revalidate` for semi-static pages; conversations are dynamic; TanStack Query for client cache (memory-only MVP).
8. **Safe errors** — log real errors internally; return safe UI messages via `ApiResult` / `lib/errors.ts`.
9. **No hardcoded config** — all secrets/URLs from env.
10. **Shared result contract**:

```ts
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

## Data & caching cheat sheet

| Concern | Approach |
|---|---|
| Page data (lists, dashboards) | Server Component + `revalidate` |
| Inbox / live messages | `dynamic = "force-dynamic"` (+ Realtime later) |
| Interactive client islands | TanStack Query + `staleTime` |
| UI prefs / drafts | localStorage (light) |
| Source of truth | Supabase |

## Platform surfaces

| Surface | Status |
|---|---|
| Business app (`app/(app)/*`) | MVP — owners + staff |
| Platform admin | Deferred — future **separate subdomain**, no routes yet |

## Messaging Flow

Inbound: WhatsApp → Meta webhook → API → identify Business/Customer/Conversation → Flow Engine / inbox → reply via MessagingService.

Outbound: Event / campaign / staff reply → MessagingService → Meta Cloud API → WhatsApp.

## Auth Model

- **Primary:** phone number + OTP (WhatsApp or SMS)
- **Secondary:** email + password (optional fallback)
- Phone path is the default UX. Email is not equal priority.

## Roles (MVP)

| Role | Access |
|---|---|
| `business_owner` | Full business settings, staff, workflows, analytics |
| `business_staff` | Customers, conversations, appointments |
| `platform_admin` | Cross-tenant SaaS ops (deferred; future subdomain) |

## Delivery Priority

1. Auth + business account + WhatsApp connection
2. Customer CRM + inbox
3. Campaigns + templates
4. Flow templates (booking / feedback / reminder)
5. Analytics + platform admin (separate surface later)
