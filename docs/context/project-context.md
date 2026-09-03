# UNGANE – Project Context

Authoritative product/domain summary for agents. Prefer this file + linked docs over scanning the full README.

## Vision

AI-powered customer relationship and engagement platform for African businesses — messaging-first (WhatsApp today; Messenger later). Relationship layer on top of conversations: Attract → Understand → Engage → Convert → Retain → Grow.

→ [vision.md](./vision.md)  
→ **Strategic direction (do not implement from this alone):** [product-direction.md](./product-direction.md)

## Core Idea

Businesses already talk to customers on messaging platforms. UNGANE is the CRM, inbox, campaigns, automation, and (eventually) AI + insights engine on top. Customers never need a UNGANE app; the business uses the web application.

Primary strategic path: **Conversation → Customer → Relationship → Engagement → Retention → Growth** (commerce is an extension later, not the center).

→ [product.md](./product.md)

## Target Users

- Small businesses (salons, shops, clinics, restaurants, gyms, service trades)
- Non-technical users
- Mobile-first behavior (Congo / DRC, French-first; eventual Lingala/Swahili)
- End customers use **messaging only** — no customer web/mobile app

## Core Features (current foundation)

- WhatsApp inbox
- Customer management + tags
- Campaigns + marketing opt-in
- Flow templates (booking / feedback / reminder)
- Dashboard + business settings + staff
- WhatsApp Business connection + authentication

Future capabilities (Customer 360, AI assistant, multi-channel, pipeline, appointments, catalog, loyalty, AI insights) are defined in [`product-direction.md`](./product-direction.md) and must **not** be built unless an implementation task explicitly requests them.

→ Features: [../features/](../features/)

## Core Entities

- User (business owner / staff)
- Business (tenant)
- Customer (keep identity separate from channel as we evolve)
- Conversation / Message
- Campaign / Template
- Automation / Flow

## Key Constraints

- Extremely simple UX for non-technical African SMBs
- Works on low-end devices
- Phone-first experience
- Multi-tenant isolation via `business_id`
- Messaging only through `MessagingService` (Meta Cloud API behind the interface; `stub` locally)
- Evolve existing app — avoid unnecessary rewrites and premature future features
- Architecture should remain *capable* of multi-channel later without assuming WhatsApp forever

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

Warm, trustworthy WhatsApp CRM SaaS — light canvas with forest-green accents.  
Palette: forest green `#2F7532`, mint `#DBF9E1`, lime `#76D789`, canvas `#F8F9FA`, ink `#1A1A1A`.

→ [design.md](./design.md)

## Routes (flat)

```
/dashboard
/customers
/conversations
/campaigns
/flows
/settings
```

(Conceptual long-term IA in product-direction §15 is **not** a request to rebuild navigation.)

## Agent Entry Points

1. Read [`project-updates.md`](../../project-updates.md) first
2. Use this file for product truth
3. Read [`product-direction.md`](./product-direction.md) for long-term alignment (direction only)
4. Dive into `docs/context/*` and `docs/features/*` as needed
5. Follow [`docs/blueprint/ai/AGENT_RULES.md`](../blueprint/ai/AGENT_RULES.md) and ADRs (`ADR-001`–`ADR-003`)

## Doc Map

| Path | Purpose |
|---|---|
| `docs/context/project-context.md` | This summary (canonical) |
| `docs/context/product-direction.md` | Long-term strategic vision (directional — not an implementation brief) |
| `docs/context/vision.md` | Mission and positioning |
| `docs/context/product.md` | Users, current scope, modules |
| `docs/context/tech.md` | Stack, structure, principles |
| `docs/context/design.md` | Brand, UX, colors |
| `docs/context/roles-and-auth.md` | Roles and auth rules |
| `docs/features/*` | Implementation-oriented feature specs |
| `docs/decisions/` | ADRs (ADR-001 structure, ADR-002 data/cache, ADR-003 env/errors/admin) |
| `docs/archive/hhousing/` | Legacy monorepo docs (reference only) |
| `docs/archive/product-vision.md` | Older vision dump (superseded by product-direction for strategy) |
| `README.md` | Full vision / PRD / SDD / roadmap dump |
