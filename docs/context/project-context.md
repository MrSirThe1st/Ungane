# UNGANE – Project Context

Authoritative product/domain summary for agents. Prefer this file + linked docs over scanning the full README.

## Vision

Help African businesses build stronger customer relationships through WhatsApp.

→ [vision.md](./vision.md)

## Core Idea

A WhatsApp-first CRM and automation platform. WhatsApp is the channel; UNGANE is the CRM, inbox, campaigns, and (later) automation engine.

→ [product.md](./product.md)

## Target Users

- Small businesses (salons, shops, clinics, restaurants)
- Non-technical users
- Mobile-first behavior (Congo / DRC, French-first)
- End customers use **WhatsApp only** — no customer web/mobile app

## Core Features (MVP)

- WhatsApp inbox
- Customer management
- Tagging / segmentation
- Basic campaigns
- Simple automations (later phase)

→ Features: [../features/](../features/)

## Core Entities

- User (business owner / staff)
- Business (tenant)
- Customer
- Conversation / Message
- Campaign / Template
- Automation / Flow (later)

## Key Constraints

- Extremely simple UX
- Works on low-end devices
- Phone-first experience
- Multi-tenant isolation via `business_id`
- Messaging only through `MessagingService` (Meta Cloud API behind the interface; `stub` locally)

## Auth

- **Primary:** phone + OTP
- **Secondary:** email + password (fallback)

→ [roles-and-auth.md](./roles-and-auth.md)

## Stack

- Next.js (single app, flat routes)
- Supabase
- WhatsApp API (Meta Cloud API)
- Tailwind CSS + shadcn/ui
- Upstash Redis, Vercel, PostHog

→ [tech.md](./tech.md)

## Design Direction

Warm, human, relationship-focused — not cold corporate SaaS.  
Palette: peach cream `#FEDCCB`, burgundy `#44242A`, terracotta `#B84646`, coral `#F47F80`, charcoal `#1F1315`.

→ [design.md](./design.md)

## Routes (flat)

```
/dashboard
/customers
/conversations
/campaigns
/settings
```

## Agent Entry Points

1. Read [`project-updates.md`](../../project-updates.md) first
2. Use this file for product truth
3. Dive into `docs/context/*` and `docs/features/*` as needed
4. Follow [`docs/blueprint/ai/AGENT_RULES.md`](../blueprint/ai/AGENT_RULES.md) and ADRs (`ADR-001`–`ADR-003`)

## Doc Map

| Path | Purpose |
|---|---|
| `docs/context/project-context.md` | This summary (canonical) |
| `docs/context/vision.md` | Mission and positioning |
| `docs/context/product.md` | Users, MVP scope, modules |
| `docs/context/tech.md` | Stack, structure, principles |
| `docs/context/design.md` | Brand, UX, colors |
| `docs/context/roles-and-auth.md` | Roles and auth rules |
| `docs/features/*` | Implementation-oriented feature specs |
| `docs/decisions/` | ADRs (ADR-001 structure, ADR-002 data/cache, ADR-003 env/errors/admin) |
| `docs/archive/hhousing/` | Legacy monorepo docs (reference only) |
| `README.md` | Full vision / PRD / SDD / roadmap dump |
