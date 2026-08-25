# WhatsApp Automation Features

## Scope

**Goal:** Automate customer journeys on WhatsApp without a complex builder in MVP.

Heart of the product long-term. Start with **templates**, not drag-and-drop.

## Provider Rules

- Integrate via `lib/whatsapp` MessagingService only
- Phase 1 provider: **Meta WhatsApp Cloud API** (`WHATSAPP_PROVIDER=meta`)
- Local/dev: `stub` (simulate inbound via `/api/dev/whatsapp-inbound`)
- Never call Meta APIs from React components

## Capabilities

### Connection
- Connect WhatsApp Business number to a `Business`
- Store `whatsapp_accounts` (phone, provider, provider_account_id, status)
- Receive webhooks at `/api/webhooks/whatsapp`; send via MessagingService

### Inbox (current slice)
- Auto-create `customers` + `conversations` + `messages` on inbound
- List/thread UI on `/conversations`
- Staff reply (stub logs send + persists OUTBOUND)

### Flow Templates (MVP stub)

| Template | Trigger | Outcome |
|---|---|---|
| Booking | Keywords RDV / réserver (if enabled) | Service → date → confirm → appointment |
| Feedback | Staff “Demander avis” on appointment | Rating 1–5 stored on appointment |
| Reminder | Staff “Envoyer les rappels” | Stub WhatsApp reminder for confirmed RDVs |
| Reactivation | Later | Promo / come-back template |

UI: `/flows` — toggle flows + appointments list. No visual builder.

## WhatsApp Policy Constraints

- Marketing outside 24h window requires approved templates
- Customer opt-in required for campaigns
- Template categories: UTILITY | MARKETING | AUTHENTICATION

## Do Not Build Yet

- Full visual flow builder
- AI intent routing
- Multi-channel (Instagram / SMS / email)
- Live Meta Graph send (until credentials + parser)

## Implementation Notes

- Background jobs (Upstash Redis / queues) for reminders and delayed steps
- All sends go through MessagingService
- Log message status: SENT | DELIVERED | READ | FAILED | RECEIVED
