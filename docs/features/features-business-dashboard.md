# Business Dashboard Features

## Scope

**Goal:** Let a business owner run customer relationships from WhatsApp without technical knowledge.

Primary app surface: Next.js dashboard at flat routes `/dashboard`, `/customers`, `/conversations`, `/campaigns`, `/settings`.

## Core Screens

### `/dashboard`
- Total customers
- New customers this period
- Open conversations
- Messages sent / received (basic)
- Upcoming appointments (when booking ships)
- Quick actions: open inbox, add customer, start campaign

### `/customers`
- Customer list (search, filter by tag)
- Customer profile: name, phone, tags, history, conversations, appointments
- Manual create / edit
- Auto-create on first inbound WhatsApp message

### `/conversations`
- Inbox list (open / closed, unread)
- Chat view with message history
- Send reply (within 24h window) or approved template
- Link to customer profile

### `/campaigns`
- Campaign list
- Create campaign: audience (tags/segments), template, schedule
- Status: draft / scheduled / sent
- Respect WhatsApp opt-in + template rules

### `/settings`
- Business profile
- WhatsApp connection status
- Staff invites (owner only)
- Notification preferences
- Auth: phone primary, email optional

## Business Owner Can

- Manage settings, staff, WhatsApp connection
- Full CRUD on customers, conversations, campaigns
- Activate flow templates (when available)

## Business Staff Can

- View/manage customers and conversations
- Manage appointments
- Cannot change billing, ownership, or WhatsApp connection

## Business Cannot

- Access other businesses' data
- Access platform admin tools
- Replace WhatsApp itself

## UX Notes

- French-first labels
- Mobile-first, low-end friendly
- One primary action per screen
- Flat navigation only
