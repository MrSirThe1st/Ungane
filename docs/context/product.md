# UNGANE – Product

## Product Summary

WhatsApp-first CRM and automation platform. Businesses connect their WhatsApp Business account, manage customers, run conversations, send campaigns, and (later) activate automated journeys.

## Target Users

| User | Role | Needs |
|---|---|---|
| Business Owner | Pays for the platform | More customers, retention, less manual work |
| Business Staff | Receptionist / assistant | View customers, handle chats, manage bookings |
| End Customer | WhatsApp only | Fast answers, easy booking, simple communication |
| Super Admin | Internal (deferred) | Manage businesses, plans, support |

End customers never use the web app — they only interact via WhatsApp.

## MVP Scope

### In scope

- Business account creation
- WhatsApp connection (Meta Cloud API; stub for local)
- Customer database + tagging / segmentation
- WhatsApp inbox (conversations + messages)
- Basic dashboard
- Basic campaigns
- Booking / feedback / reminder flows (phase 2 within MVP roadmap)

### Out of scope (initial)

- AI chatbot
- Full drag-and-drop flow builder
- Multi-channel messaging
- Payment integration
- Complex Salesforce-style CRM
- Native mobile apps for end customers

## First Industries

1. Spa / beauty
2. Restaurant
3. One retail business

## Core Modules

1. **Business account** — registration, profile, WhatsApp connection
2. **Customer CRM** — profiles, tags, history
3. **Conversation engine** — inbound/outbound WhatsApp messages
4. **Campaigns** — segmented template sends
5. **Flow templates** (later) — booking, feedback, reminder, reactivation
6. **Analytics** — customers, conversations, bookings, reviews

## Core Entities

- `User` — business owner or staff
- `Business` — tenant (multi-tenant by `business_id`)
- `Customer` — end customer on WhatsApp
- `Conversation` / `Message`
- `Campaign` / `Template`
- `Flow` / `FlowStep` / `FlowExecution` (later)
- `Appointment` / `Review` (later)

## Monetization (later)

Subscription tiers (Starter / Professional / Enterprise) + message usage + industry packages + setup services.
