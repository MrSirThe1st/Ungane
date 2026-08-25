# Roles and Auth

## Auth Priority

**Current MVP slice (temporary):** email + password is the active login path.  
**Target (soon):** phone + OTP becomes primary; email remains secondary fallback.

Phone-first UX for Congo / mobile-first users remains the product goal.

## Roles

| Role | Where | Access |
|---|---|---|
| `business_owner` | Web dashboard | Full CRUD for own business: settings, staff, customers, conversations, campaigns, flows |
| `business_staff` | Web dashboard | Customers, conversations, appointments; no billing/plan/owner settings |
| `platform_admin` | Internal (deferred) | Cross-business SaaS ops — future **separate subdomain**, not in business app |

End customers have **no** web account. They only use WhatsApp.

## Membership Model

Every dashboard user belongs to a `Business` (tenant). Authorization is server-enforced from membership + role. Never trust client role claims.

Tables live in Supabase (`supabase/migrations/20260801190000_businesses_and_memberships.sql`):

- `businesses`
- `business_memberships` (`business_owner` | `business_staff`)
- RPC `create_business_for_owner(...)` (security definer) for onboarding

## Authorization Rules

- Unauthenticated → `/login`
- Authenticated with no membership → `/onboarding`
- All queries/mutations scoped by `business_id`
- Cross-tenant access → 403
- `platform_admin` deferred (future subdomain); not assigned during business onboarding
- Auth checks live in `proxy.ts` (session refresh), server actions, and `(app)` layout
- No admin UI routes in the business app

## Onboarding (current)

1. Sign up with email + password
2. Create business profile (name, industry, city, optional WhatsApp phone)
3. Land on `/dashboard`
4. WhatsApp connection — later slice
