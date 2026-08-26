# UNGANE

WhatsApp-first CRM and automation for African businesses (Congo-first, French-first).

Businesses connect WhatsApp, manage customers, run conversations, send campaigns, and activate booking / feedback / reminder flow templates.

## Stack

- Next.js 16 (App Router)
- Supabase (Auth + PostgreSQL + RLS)
- Tailwind CSS v4 + shadcn/ui
- Meta WhatsApp Cloud API (stub provider locally)

## Prerequisites

- Node.js 20+
- pnpm 9+
- A Supabase project (or local Supabase)

## Setup

```bash
pnpm install
cp .env.example .env
# Fill Supabase URL + publishable key + secret key
```

Apply migrations from `supabase/migrations/` (Supabase CLI or SQL editor), then:

```bash
pnpm dev
```

App: [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Next.js dev server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm test` | Vitest unit tests |
| `pnpm build` | Production build |
| `pnpm db:seed` | Seed demo business data (requires `.env` secrets) |

## Environment

Documented in [`docs/context/tech.md`](docs/context/tech.md). Copy [`.env.example`](.env.example) → `.env`.

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` |
| `SUPABASE_SECRET_KEY` | Server only (`sb_secret_…`) |
| `WHATSAPP_PROVIDER` | `stub` (default) or `meta` |
| `WHATSAPP_API_KEY` | Required when `meta` |
| `WHATSAPP_WEBHOOK_SECRET` | Meta verify token |

## Docs

| Doc | Purpose |
|---|---|
| [`docs/context/project-context.md`](docs/context/project-context.md) | Product truth |
| [`docs/context/design.md`](docs/context/design.md) | Brand + UI |
| [`docs/context/tech.md`](docs/context/tech.md) | Stack + env |
| [`docs/blueprint/ai/AGENT_RULES.md`](docs/blueprint/ai/AGENT_RULES.md) | Agent constraints |
| [`docs/archive/product-vision.md`](docs/archive/product-vision.md) | Long-form vision / notes |
| [`project-updates.md`](project-updates.md) | Append-only change log |

## Routes

`/dashboard` · `/customers` · `/conversations` · `/campaigns` · `/flows` · `/settings`
