# Customers Domain

## Scope

**Goal:** Central customer database per business — every WhatsApp contact becomes a manageable CRM record.

Route: `/customers`

## Entity

### Customer
- `business_id`
- `phone_number` (required, unique per business)
- `first_name`, `last_name`
- `email` (optional)
- `tags`
- `last_interaction_at`
- `created_at`, `updated_at`

Related (MVP+): conversation history, appointments, reviews, campaign membership.

## Features

- List + search by name / phone
- Filter by tags / segments (New, VIP, Inactive, custom)
- Profile detail: identity, tags, recent conversations, activity
- Manual create / edit
- Auto-create on first inbound WhatsApp message
- Tag management (`CustomerTag` / `Tag`)

## Segmentation (MVP)

Simple tags, not a complex query builder:

- New customers
- VIP
- Inactive
- Industry-specific tags (e.g. “interested in cosmetics”)

Used by campaigns and (later) reactivation flows.

## Business Rules

- Customer belongs to exactly one business
- Phone is the primary identity key within a tenant
- Staff and owners can manage customers; platform admin deferred
- French-first profile labels

## MVP Screens

1. Customers list
2. Customer detail
3. Add / edit customer
4. Manage tags
