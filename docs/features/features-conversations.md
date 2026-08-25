# Conversations Domain

## Scope

**Goal:** Reliable WhatsApp inbox for the business — the operational heart of day-to-day use.

Route: `/conversations`

## Entities

### Conversation
- `business_id`, `customer_id`
- `status` (open / closed)
- `started_at`, `last_message_at`

### Message
- `conversation_id`, `business_id`
- `direction` — INBOUND | OUTBOUND
- `type` — text, image, template, interactive, etc.
- `content`
- `whatsapp_message_id`
- `status` — SENT | DELIVERED | READ | FAILED | RECEIVED
- `created_at`

## Features

- List conversations (search by customer name/phone)
- Open chat thread
- Staff reply (stub / Meta later)
- Auto-create Customer + Conversation on first inbound message

## Inbound Path

WhatsApp → Meta webhook → `/api/webhooks/whatsapp` → resolve Business + Customer + Conversation → persist Message → inbox

Local stub: `POST /api/dev/whatsapp-inbound` (auth required)

## Outbound Path

Staff reply → MessagingService → (stub log | Meta Cloud API) → persist Message

## Constraints

- Tenant-scoped by `business_id`
- No cross-business conversation visibility
- End customers never see this UI

## MVP Screens

1. Conversation list
2. Chat detail + reply
3. Empty state / connect WhatsApp in Settings
