# Platform Admin Features (Deferred)

## Scope

**Goal:** Control the SaaS system. Not part of MVP day-one build.

Internal only — **separate from the business dashboard**. Future delivery: **separate subdomain** (not `/admin` routes inside `app/(app)`). No admin routes in the repo yet.

## Feature Set (Future)

### Businesses
- List all businesses
- Inspect connection health (WhatsApp, plan, usage)
- Suspend / activate tenants

### Users
- List owners and staff across tenants
- Suspend / activate accounts

### Billing
- Plans and limits
- Usage (messages, campaigns)
- Subscription status

### Support
- Tickets / issues
- Resolution tracking

### System
- Feature flags
- Regional config (DRC)
- Audit logs

## Platform Admin Cannot

- Impersonate casually without audit trail
- Bypass tenant isolation without explicit support tooling

## Notes for Agents

- Defer until business MVP (auth, inbox, CRM, campaigns) works
- Do **not** scaffold `app/(admin)` or `/admin` unless explicitly requested
- Do **not** mix admin chrome into the business `(app)` shell
- See ADR-003
