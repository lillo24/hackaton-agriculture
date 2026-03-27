You are working inside the existing rares/app-skeleton React app.

Goal:
In the admin customer page (`/admin/customers/:customerId`), each alert must behave like a single expandable card:

- collapsed: show only
  - severity / risk level
  - title
- expanded: keep the SAME header row visible, and reveal only:
  - Problems
  - Integrated

Important:
- there must NOT be a duplicate title when expanded
- there must NOT be a second full alert card rendered under the summary
- this change must apply only to the admin customer page
- do not break the farmer alert detail page

Current issue to fix:
Right now the likely implementation path renders:
- one collapsed summary row
- then, when opened, a full `AlertDetailBlock`
This creates a double title / repeated header feeling.

Instead, the admin alert must be a SINGLE card with:
1. one persistent header
2. expandable body content underneath it

Implementation requirements:

## 1) Use a single card component in AdminCustomerPage
In `src/pages/AdminCustomerPage.jsx`, refactor `AdminCustomerAlert` so it renders one wrapper card only.

Structure:
- card header: always visible
  - severity badge
  - title
  - chevron/icon for expand-collapse
- card body: visible only when expanded
  - Problems
  - Integrated

Do NOT render a separate collapsed summary component plus a separate full detail component.
Use one card and conditionally reveal only the body.

## 2) Remove repeated title in expanded content
If `AlertDetailBlock` currently renders its own title/header, do NOT use that full header in the admin customer page expanded state.

Best solution:
- add props to `AlertDetailBlock` such as:
  - `showHeader={true}`
  - `showSummary={true}`
  - `showProblems={true}`
  - `showIntegrated={true}`
  - `integratedCollapsible={true}`

Then for admin customer page pass:
- `showHeader={false}`  ← critical, prevents duplicate title
- `showSummary={false}` if there is a repeated summary text block you do not want
- `showProblems={true}`
- `showIntegrated={true}`
- `integratedCollapsible={false}`
- `showAction={false}`

If the current component is too coupled, split the body sections into smaller reusable subcomponents instead of keeping duplicated markup.

## 3) Expanded admin card content
When expanded on admin customer page, show only the sections under the shared header:

- Problems
- Integrated

Do NOT show again:
- title
- top hero/title area
- duplicated severity heading
- action buttons
- repeated field/time chips unless they are explicitly still needed and do not duplicate the header

The expanded content should feel like:
[severity + title header]
[Problems]
[Integrated]

## 4) Integrated must not be collapsible on admin page
Inside expanded admin alerts:
- Integrated is always visible
- no inner toggle
- no nested accordion
- no arrow for Integrated

Farmer pages must keep the current behavior.

## 5) Visual behavior
Collapsed:
- compact row/card
- severity + title only

Expanded:
- same card grows vertically
- same header stays at top
- body appears below it
- no second box stacked below unless required by existing styling
- if there is a second box, it must visually read as the same component, not a duplicate alert

## 6) Suggested component shape
In `AdminCustomerPage.jsx`, `AdminCustomerAlert` should look conceptually like:

- `<article className="admin-customer-alert-card ...">`
  - `<button className="admin-customer-alert-card__header" aria-expanded=...>`
    - severity badge
    - title
    - chevron
  - `{isOpen && (
      <div className="admin-customer-alert-card__body">
        <AlertDetailBlock
          alert={alert}
          showHeader={false}
          showSummary={false}
          showProblems={true}
          showIntegrated={true}
          integratedCollapsible={false}
          showAction={false}
        />
      </div>
    )}`

But if `AlertDetailBlock` still outputs too much repeated content, extract just:
- `AlertProblemsSection`
- `AlertIntegratedSection`
and use those directly in the admin card body.

## 7) CSS expectations
Update styles so:
- header remains aligned in both collapsed and expanded states
- body has spacing from header
- no duplicated card chrome
- no awkward nested borders
- expanded state feels like one clean object

Suggested classes:
- `.admin-customer-alert-card`
- `.admin-customer-alert-card__header`
- `.admin-customer-alert-card__body`
- `.admin-customer-alert-card--open`

Keep it clean and blocky.

## 8) Files likely to change
- `src/pages/AdminCustomerPage.jsx`
- `src/components/AlertDetailBlock.jsx`
- `src/pages/pages.css`

Success criteria:
- collapsed admin alert shows only severity and title
- clicking expands the SAME card
- expanded card does not repeat the title
- expanded card reveals only Problems and Integrated
- Integrated is not collapsible inside admin page
- farmer alert detail page behavior remains unchanged
- no broken styling or React warnings