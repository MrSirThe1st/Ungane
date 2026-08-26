# UNGANE – Design

## Direction

Clean, modern WhatsApp CRM SaaS — trustworthy and approachable for Congo business owners on mobile. High whitespace, rounded surfaces, forest-green brand accents on a light canvas.

## Brand Colors

| Name | HEX | Role |
|---|---|---|
| Forest Green | `#2F7532` | Primary CTAs, active nav, brand wordmark (~primary) |
| Green Dark | `#245A27` | Hover / pressed primary |
| Soft Mint | `#DBF9E1` | Welcome banners, soft accents, success surfaces |
| Lime Accent | `#76D789` | Positive highlights, chart accents |
| Canvas | `#F8F9FA` | Page background |
| White | `#FFFFFF` | Cards, sidebar, inputs |
| Ink | `#1A1A1A` | Headings / primary text |
| Slate muted | `#5B6470` | Secondary text |
| Border | `#E5E7EB` | Dividers, input borders |

### Status badges

| Status | Background | Text |
|---|---|---|
| Success / Active | `#DBF9E1` | `#1B5E20` |
| Warning / Soon | `#FEF3C7` | `#B45309` |
| Info | `#DBEAFE` | `#1D4ED8` |
| Neutral | muted surface | muted foreground |

## Typography

**Plus Jakarta Sans** (via `next/font`) for UI and headings. Clean geometric humanist sans — readable on low-end phones. Avoid Inter / Roboto / system-default stacks for branded surfaces.

## Component language

- **Buttons:** solid forest green + white label; outline green for secondary actions
- **Cards:** white, `rounded-xl`, light border, soft shadow
- **Sidebar:** white surface; active item = solid green pill with white text
- **Inputs:** white fill, light gray border, `rounded-lg`, focus ring in primary green
- **Badges:** pill-shaped (`rounded-full`) with tinted backgrounds
- **Radius:** base `0.75rem` (~12px)

## UX Principles

- Extremely simple UI — one job per screen
- Phone-first / mobile-first layouts
- Works on low-end devices (light assets, fast loads)
- French-first copy, labels, and workflows
- Local date / currency / number formatting for DRC

## Dashboard Surfaces

Flat navigation:

- `/dashboard`
- `/customers`
- `/conversations`
- `/campaigns`
- `/flows`
- `/settings`

Avoid deep nesting and dashboard clutter. Prefer clear lists + detail views over dense card grids.
