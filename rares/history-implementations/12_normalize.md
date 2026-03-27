You are editing the existing rares repo.

Work inside:
rares/app-skeleton

Goal:
Fix the alerts shown inside the admin customer detail pages so they visually follow the SAME template/language as the normal customer alert detail page.

Important:
- Reuse the customer alert-detail style and structure as much as possible
- BUT remove the “Action to do” part completely
- Do not redesign the whole admin page
- Do not change the farmer-facing alert page behavior
- Do not add dependencies

What I want:
On each admin customer page, the alerts should no longer look like generic admin cards.
They should look like the customer alert template from the normal app:
- severity badge
- timestamp
- title
- summary
- field
- problems section
- integrated section
- same general spacing / visual hierarchy
- NO “Action to do”
- NO recommended action block shown

Use the existing customer version as the visual/template reference:
- src/pages/AlertDetailPage.jsx
- related styles in src/pages/pages.css
- existing shared components like:
  - PageHeader
  - SectionCard
  - StatusBadge

What to change

1) Find the admin customer detail page
Likely file:
- src/pages/AdminCustomerPage.jsx

Update the alert rendering there.

2) Reuse the customer alert-detail structure
For each alert in the admin customer page, render it in a structure that closely matches the customer AlertDetailPage template.

Desired structure for each alert:
- top hero/summary section
  - severity badge
  - timestamp
  - alert title
  - alert summary
  - field name shown similarly to customer page

- roadmap/detail area with ONLY:
  a) Problems
  b) Integrated

Do NOT render:
- Action to do
- recommendedAction section
- any “next steps” card
- any admin-specific action footer

3) Map admin alert data into the customer-style shape
The admin mock alerts may not have exactly the same shape as the farmer alert object.
Create a small adapter/helper so admin alerts can be rendered consistently.

For each admin alert, try to map into a shape like:
- id
- severity
- timestampLabel
- title
- summary
- field: { name }
- sources
- integratedSummary / whyTriggered

Handle current admin mock fields gracefully, for example:
- `fieldName` -> `field.name`
- if the alert has `occurredMinutesAgo` or `occurredHoursAgo`, convert that into a readable `timestampLabel`
- if the alert already has `timestampLabel`, use it
- if the admin alert only has `sourceSummary` and not a `sources` array, create a minimal fallback source entry so the Problems section still works cleanly
- if there is no `integratedSummary`, use `summary` or `sourceSummary` as fallback

Do this robustly so the admin page does not break if some mock alerts are slightly incomplete.

4) Keep the “Problems” section customer-like
The customer version currently shows a list of source signals.

For admin customer alerts:
- if a proper `sources` array exists, render it in the same way
- otherwise derive a minimal one from available fields, for example:
  - source label from `sourceSummary` or a generic label like “Integrated signals”
  - signal text from `sourceSummary` or `summary`

The result should still visually feel like the same template, not an admin table row.

5) Keep the “Integrated” section customer-like
Use the same collapsible / explanatory feeling as the customer template if practical.
If that is too awkward for a list of many alerts, it is acceptable to:
- keep the same section title “Integrated”
- render the explanation block open by default
- still style it like the customer version

Best option:
- reuse the existing integrated-section interaction pattern if easy
- but do not overcomplicate it

6) Remove all recommended-action output
Even if `recommendedAction` exists in the mock data:
- do not render it
- do not show an “Action to do” block
- do not show admin action buttons tied to alert content

7) Styling
Update:
- src/pages/pages.css

Add only the minimum admin detail styles needed so the admin customer alert list visually matches the customer alert-detail template.

Preferred approach:
- reuse the existing classes from the customer alert detail styles where possible
- if needed, add scoped classes such as:
  - .admin-customer-alert
  - .admin-customer-alerts
  - .admin-customer-alert-stack
but keep the visual language aligned with:
- .alert-detail-page
- .alert-detail-hero
- .roadmap-step
- related classes already used by the customer version

Avoid:
- generic dashboard/admin mini-cards
- dense table rows
- action-heavy boxes

8) Keep the page readable with multiple alerts
A customer can have several alerts.
Make sure:
- the alerts are stacked vertically with clear spacing
- each alert looks like a full alert detail block
- the page remains scrollable normally

9) Do not touch the normal farmer alert page
Do NOT change the behavior of:
- src/pages/AlertDetailPage.jsx

Only use it as the design/template reference, unless you choose to extract a reusable shared alert-detail component in a very safe way.
If you do extract a shared component:
- keep the farmer page visually identical
- make sure no regressions happen

10) Acceptance criteria
- Admin customer alerts now visually match the customer alert-detail template
- Each alert shows:
  - severity
  - timestamp
  - title
  - summary
  - field
  - problems
  - integrated
- “Action to do” is gone
- recommendedAction is not shown
- page still works with multiple alerts
- no farmer-facing page is broken
- no import/runtime errors

Suggested implementation direction
Option A (preferred if simple):
- create a small reusable alert detail block component based on the customer template
- use it in AdminCustomerPage with a prop like `showAction={false}`

Option B:
- keep AlertDetailPage untouched
- build a lightweight admin-only renderer that copies the relevant customer structure and styles without the action section

After editing, sanity-check:
- admin customer page renders for customers with many alerts
- customers with zero alerts still show the empty state
- no JSX/import issues