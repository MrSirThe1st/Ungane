# UNGANE – Product

## Product Summary

AI-powered customer relationship and engagement platform for African businesses (messaging-first).

Businesses connect messaging channels (WhatsApp now; Facebook Messenger later), manage customers and conversations in the UNGANE web app, run campaigns and automations, and eventually use AI + insights to grow relationships.

Customers interact only via messaging — they never need a UNGANE app.

Authoritative future direction (not an implementation brief): [`product-direction.md`](./product-direction.md).

## Target Users

| User | Role | Needs |
|---|---|---|
| Business Owner | Pays for the platform | More customers, retention, less manual work |
| Business Staff | Receptionist / assistant | View customers, handle chats, manage bookings |
| End Customer | Messaging only (WhatsApp / later Messenger) | Fast answers, easy booking, simple communication |
| Super Admin | Internal (deferred) | Manage businesses, plans, support |

## Current Foundation (shipped / in progress)

Preserve and extend — do not replace unnecessarily:

- Business account, auth, staff
- WhatsApp connection + inbox (conversations / messages)
- Customer CRM + tags + marketing opt-in
- Campaigns + templates
- Flow templates (booking / feedback / reminder)
- Dashboard + business settings

## MVP / Near-Term Scope

### In scope (current product)

- Business account creation
- WhatsApp connection (Meta Cloud API; stub for local)
- Customer database + tagging
- WhatsApp inbox
- Basic dashboard
- Basic campaigns
- Booking / feedback / reminder flow templates

### Out of scope until explicitly requested

Do **not** implement from product-direction alone:

- Multi-channel architecture (Messenger, unified inbox)
- Full Customer 360 fields
- AI chatbot / business knowledge base
- Dynamic segments, loyalty, lightweight sales pipeline
- Catalog, quotes/orders, payments, logistics
- Advanced AI insights
- Drag-and-drop flow builder
- Native mobile apps for end customers
- Full ERP / accounting / inventory / marketplace

## First Industries

1. Spa / beauty / barbers
2. Restaurant
3. Clinics / service businesses
4. Retail (conversation-assisted, not full e-commerce)

## Core Modules (today)

1. **Business account** — registration, profile, WhatsApp connection, staff
2. **Customer CRM** — profiles, tags, history
3. **Conversation engine** — inbound/outbound WhatsApp messages
4. **Campaigns** — segmented template sends
5. **Flow templates** — booking, feedback, reminder
6. **Analytics** — basic dashboard metrics

## Conceptual long-term areas (nav not rebuilt from this)

Conversations · Customers · Growth · Sales · Insights · Settings — see [`product-direction.md`](./product-direction.md) §15.

## Core Entities

- `User` — business owner or staff
- `Business` — tenant (multi-tenant by `business_id`)
- `Customer` — end customer (identity should stay channel-agnostic as we evolve)
- `Conversation` / `Message` (today WhatsApp-centric; keep multi-channel possible)
- `Campaign` / `Template`
- `Flow` / `FlowStep` / `FlowExecution`
- Later (only when tasked): Appointment, Catalog, Lead/Pipeline, Loyalty, Order/Quote

## Architectural guardrails (for future work)

When implementing new features later:

- Inspect codebase first; extend, don’t rewrite
- Prefer channel-agnostic conversation/customer models where practical
- Keep business / customer / conversation concepts separated
- Prefer simple SMB workflows over competitor feature parity

## Monetization (later)

Subscription tiers (Starter / Professional / Enterprise) + message usage + industry packages + setup services.
