# Project Updates Template

Canonical format for root `project-updates.md` entries.

## Entry Rules

- Append only meaningful changes.
- Group related changes into one entry.
- Use concise, factual descriptions.
- Include DB, API, structure, and important logic decisions.
- Record deferred testing gaps when relevant.

## Template

```
## YYYY-MM-DD
- Change type: DB | API | Frontend | Infra | Other
- Description: <what changed>
- Impact: <contracts, tables, routes, folders, logic>
- Tests: <added, updated, or deferred>
```

## Example

```
## 2026-07-29
- Change type: DB
- Description: Added `customers` table scoped by `business_id`.
- Impact: Customer list/detail APIs use shared DTOs; unique phone per business.
- Tests: Added create + duplicate-phone failure cases.
```
