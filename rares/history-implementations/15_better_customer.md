# Admin customer alerts — clearer boxed separation

Work in the existing rares repo.

## Goal
On the admin customer detail page, make each alert feel clearly separated from the next one by giving each alert its own stronger visible container/box.

Right now the customer alerts are in:
- `src/pages/AdminCustomerPage.jsx`
- styled mainly from `src/pages/pages.css`

The alerts are rendered through the shared `AlertDetailBlock` with the class:
- `admin-customer-alert`

So:
- keep using `AlertDetailBlock`
- do NOT redesign the normal farmer alert detail page globally
- scope the visual change only to the admin customer page alerts

## What to change
Improve readability by making each admin customer alert look like a distinct boxed card:
- stronger outer border
- slightly stronger background
- a bit more padding around the whole alert block
- clear vertical spacing between alerts
- subtle shadow
- rounded corners consistent with the existing design
- optional light severity-tinted left accent border is fine, but keep it elegant

Also make sure the internal top hero and roadmap sections visually sit inside that outer alert box, instead of blending together with the page.

## Important constraint
Do not break or heavily change shared alert styles used elsewhere.
This should be done by adding admin-specific wrapper styling, for example around:
- `.admin-customer-alert`
- its direct children
- admin-only scoped selectors

## Suggested implementation direction
In `src/pages/pages.css`:
- enhance `.admin-customer-alert`
- possibly add styles such as:
  - border
  - background
  - border-radius
  - padding
  - box-shadow
- make the first internal card (`.alert-detail-hero.section-card`) feel integrated with the outer box
- slightly reduce visual collision between the inner roadmap blocks and the outer card

Possible scoped selectors:
- `.admin-customer-alert`
- `.admin-customer-alert > .alert-detail-hero.section-card`
- `.admin-customer-alert .alert-roadmap`
- `.admin-customer-alert.alert-detail-page--critical`
- `.admin-customer-alert.alert-detail-page--high`
- `.admin-customer-alert.alert-detail-page--medium`
- `.admin-customer-alert.alert-detail-page--low`

## Acceptance criteria
- In `/admin/:customerId`, each alert is clearly separated from the others
- easier scanning and reading
- no overlap or cramped spacing
- no regression on non-admin alert pages
- desktop and mobile still look clean

## Deliverable
Apply the change directly in the repo.
Then give me:
1. the files changed
2. a short summary of the styling logic