# UNGANE – Product Direction & Strategic Vision

**Status:** Directional (not an implementation brief)  
**Updated:** 2026-09-03

This document defines where UNGANE is going so future development stays aligned.  
**Do not** rebuild the app, replace the architecture, create features, modify the database, or begin implementation based solely on this file.

The existing UNGANE application is the foundation. We evolve it — we do not start over.  
When an implementation task is given later, inspect the codebase first and extend the current architecture wherever practical.

---

## 1. What UNGANE Is Becoming

UNGANE is evolving from a WhatsApp-first CRM and automation tool into an:

**AI-powered customer relationship and engagement platform for African businesses.**

Central idea (unchanged):

Businesses already communicate with customers through messaging platforms. UNGANE is the intelligence and relationship layer on top of those conversations.

UNGANE should help businesses:

**Attract → Understand → Engage → Convert → Retain → Grow**

Primary customer-facing channels (messaging; customer does not download a UNGANE app):

- WhatsApp (primary, first-class)
- Facebook Messenger (second major channel)

The business uses the UNGANE web application to manage relationships, conversations, automation, campaigns, and insights.

---

## 2. Core Product Philosophy

UNGANE is **not** intended to become a generic ERP, accounting system, logistics platform, or full e-commerce platform.

Core domain:

**Customer relationships and customer-driven business growth through conversations.**

Everything added should strengthen this core.

Eventual chain:

Conversations → Customer intelligence → Engagement → Automation → Sales → Retention → Business insights

---

## 3. Existing Foundation (preserve and extend)

Already in the product — keep and improve rather than replace unnecessarily:

- WhatsApp inbox, conversations, customers, profiles, tags
- Campaigns, marketing opt-in, flow templates
- Dashboard, business settings, WhatsApp Business connection
- Staff management, authentication

---

## 4. Multi-Channel Architecture (future requirement)

Support multiple messaging channels through a **common conversational architecture**.

Conceptual model:

```
Channel (WhatsApp | Facebook Messenger | future)
  → Conversation
  → Customer
  → Automation / AI / Staff
```

- Avoid assuming every conversation, webhook, or automation is WhatsApp-only.
- One customer may use WhatsApp and Messenger; still **one customer record**.
- Do **not** implement this architecture unless explicitly requested.

---

## 5. Customer 360 (future)

Customer is the central object. A profile should eventually show the full relationship, e.g.:

Name, phone, email, channel identifiers, tags, status, first/last interaction, conversation history, purchase/order history, appointment history, campaign interactions, automation history, notes, assigned staff, customer value, engagement activity.

Goal: open a customer and immediately understand the relationship.

---

## 6. AI Customer Assistant (future)

Businesses provide business knowledge (description, products/services, prices, hours, location, FAQs, policies, promotions, booking info). AI handles common conversations and escalates to humans when needed.

Eventually: answers, product info, lead qualification, booking help, follow-ups, recommendations, basic sales, support, human handoff.

**Critical:** AI must know when to hand off. The business stays in control.

---

## 7. Automated Follow-Ups (future)

Beyond basic predefined flows — business-triggered journeys, e.g.:

- New customer welcome
- Appointment reminders
- Abandoned lead follow-up
- Inactive customer reactivation
- Post-purchase check-in
- Birthday / personalized offers

Goal: businesses should not have to remember every interaction; UNGANE helps maintain the relationship.

---

## 8. Customer Segmentation (future)

Evolve beyond manual tags to dynamic segments (new, VIP, inactive, recent/non-recent purchasers, never converted, service interest, high-value, campaign engagers).

Usable by campaigns, automations, AI, and insights.

---

## 9. Leads & Sales Pipeline (future)

Lightweight pipeline only — not Salesforce.

Example: New Lead → Interested → Follow-up → Booked/Ordered → Completed → Returning Customer

A messaging conversation can create a lead. Purpose: who contacted us, where they are in buying, what happens next.

---

## 10. Appointments (future)

Important for salons, spas, clinics, gyms, barbers, consultants, mechanics, and similar service businesses.

Services, staff, availability, booking, reschedule/cancel, reminders — ideally entirely via WhatsApp/Messenger with AI assistance.

---

## 11. Catalog (future)

Simple products/services/prices/descriptions/images/availability — primarily to make conversations smarter, **not** a full e-commerce platform initially.

---

## 12. Orders & Quotes (future)

Conversation → Product/Service → Quote → Order; later possibly payment/fulfillment via integrations.  
Payments and logistics are **not** immediate core direction.

---

## 13. Loyalty & Retention (future)

Major differentiator: points, rewards, tiers, discounts, referrals, repeat-purchase rewards, reactivation.

one-time → repeat → loyal customers.

---

## 14. Business Intelligence & AI Insights (future)

Dashboard moves beyond basic stats to actionable patterns (inactive customers, interested-but-unbooked, repeat rate, peak conversation hours).

Principle: do not make SMBs analyze CRM data manually — tell them what matters.

---

## 15. Conceptual Product Structure (not a nav rebuild)

| Area | Includes |
|---|---|
| **Conversations** | WhatsApp / Messenger / unified inbox, AI, human takeover, history |
| **Customers** | Customer 360, tags, segments, timeline, notes, activity |
| **Growth** | Campaigns, automations, follow-ups, loyalty, reactivation |
| **Sales** | Leads, pipeline, catalog, quotes, orders, appointments |
| **Insights** | Dashboard, analytics, AI insights, recommendations |
| **Settings** | Business, channels, staff, AI/knowledge, integrations, billing |

Conceptual only — do not rebuild current navigation from this alone.

---

## 16. African-First Positioning

Congo-first, French-first initially.

Consider: mobile-first business users, non-technical users, WhatsApp-heavy habits, local workflows, African payment ecosystem, eventual Lingala/Swahili, expansion beyond DRC.

Localization is part of the product, not only UI translation.

---

## 17. What UNGANE Is NOT (initially)

Do not build: full ERP, accounting, payroll, banking, full inventory, delivery/logistics platforms, large marketplace, complex e-commerce, Salesforce/HubSpot replacement, financial infrastructure.

Stay centered on: customer relationships, conversations, engagement, retention, and growth.

---

## 18. Distinction From Conversational-Commerce Platforms

Some platforms push: Conversation → AI → Commerce → Payments → Logistics → Financial services.

UNGANE’s primary direction:

**Conversation → Customer → Relationship → Engagement → Retention → Growth**

Commerce can extend this later; CRM/relationship remains the center.

---

## 19. Long-Term Product Vision (north star)

A small African business connects messaging channels to UNGANE. UNGANE becomes its customer relationship engine:

identify customer → understand conversation & relationship → AI answers or human takes over → convert / book / purchase → re-engage if inactive → retain loyalty → surface actionable growth insights.

---

## 20. Development Principles (always)

1. Inspect the existing codebase first.
2. Preserve working functionality.
3. Extend existing models and components where appropriate.
4. Avoid unnecessary rewrites.
5. Avoid prematurely implementing future features.
6. Keep architecture capable of multi-channel messaging.
7. Keep customer identity separate from individual channels.
8. Keep business / customer / conversation concepts cleanly separated.
9. Prefer simple workflows for non-technical African SMB users.
10. Do not add complexity merely because competitors have a feature.

**Most importantly: evolve UNGANE — do not rebuild UNGANE.**

Future implementation prompts will specify which part of this vision to build.
