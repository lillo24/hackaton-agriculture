You are working inside the existing rares/app-skeleton React app.

Goal:
In the admin customer detail page (`/admin/customers/:customerId`), change the alert cards so that:

1. the inner `Integrated` section is no longer its own collapsible panel
2. each entire alert card becomes collapsible
3. when an alert card is collapsed, it must show only:
   - the risk level / severity
   - the alert title
4. when expanded, it shows the full existing content again
5. this change must affect ONLY the admin customer page, not the farmer alert detail page

Important:
- Do NOT redesign the whole alert UI
- Do NOT break the existing farmer `/alert` page behavior
- Keep the existing severity styling and admin page layout
- Keep the admin customer page readable on both phone and desktop

Existing code context:
- `src/pages/AdminCustomerPage.jsx` currently renders alerts through `AdminCustomerAlert`
- `src/components/AlertDetailBlock.jsx` currently contains the shared detail UI
- In `AdminCustomerPage.jsx`, `AlertDetailBlock` is used with:
  - `showAction={false}`
  - `integratedInitiallyOpen={true}`
- Right now `Integrated` is its own toggle inside `AlertDetailBlock`
- That nested toggle should NOT be used on the admin customer page anymore

What to implement:

## 1) Add a card-level collapse for admin customer alerts
In `src/pages/AdminCustomerPage.jsx`:
- update `AdminCustomerAlert`
- give each admin alert its own local open/closed state
- default state: collapsed
- clicking the card header toggles open/closed

Collapsed state must show only:
- severity badge / risk level
- alert title

Expanded state must show:
- the existing hero/detail content
- Problems section
- Integrated text
- any existing admin status badge if still useful

## 2) Remove the separate Integrated accordion only for admin usage
Do NOT remove the integrated accordion globally from farmer pages.

Best approach:
- extend `AlertDetailBlock` with a prop like:
  - `integratedCollapsible = true`
or similar
- for farmer pages, keep current behavior unchanged
- for admin customer alerts, pass `integratedCollapsible={false}`

When `integratedCollapsible={false}`:
- render the `Integrated` section as a normal static section
- no toggle button
- no arrow
- content visible directly when the alert card is expanded

## 3) Support a compact collapsed summary mode
Update `AlertDetailBlock` so it can support a collapsed admin preview, OR handle this in `AdminCustomerAlert` before rendering the full block.

Preferred clean solution:
- keep collapse state in `AdminCustomerAlert`
- when collapsed, render a lightweight summary button/card
- when expanded, render the normal `AlertDetailBlock`

Collapsed summary card requirements:
- same severity tone family as the full card
- compact height
- shows:
  - `StatusBadge` / severity
  - alert title
- no summary text
- no field
- no Problems
- no Integrated body
- no action
- subtle chevron or plus/minus icon allowed
- whole summary row should be clickable
- keyboard accessible (`button`, `aria-expanded`)

## 4) Expanded card behavior
When expanded:
- show the same full admin detail content as today
- but with `Integrated` always visible inside the card
- no nested accordion for Integrated
- keep `showAction={false}`

## 5) Suggested implementation details
### In `src/pages/AdminCustomerPage.jsx`
Refactor `AdminCustomerAlert` roughly like this:
- maintain `const [isOpen, setIsOpen] = useState(false)`
- render:
  - collapsed summary button when `!isOpen`
  - full `AlertDetailBlock` when `isOpen`
- above the expanded block, include a compact header/button to close it again
- or make the expanded header itself clickable if that is cleaner

You may build a wrapper like:
- `.admin-customer-alert-card`
- `.admin-customer-alert-card__summary`
- `.admin-customer-alert-card__summary-main`
- `.admin-customer-alert-card__toggle`

### In `src/components/AlertDetailBlock.jsx`
Add a prop:
- `integratedCollapsible = true`

Then change Integrated rendering:
- if `integratedCollapsible` is true:
  - keep current button + arrow + conditional content
- if false:
  - render a normal section header
  - render the integrated content directly
  - no toggle button
  - no local integrated open state needed for that mode

Also make sure:
- current farmer pages still pass nothing and behave exactly the same
- admin page passes `integratedCollapsible={false}`

## 6) Styling
Update `src/pages/pages.css` and/or component CSS as needed.

Add styles for collapsed admin alert summaries:
- compact card
- clickable
- good hover/focus states
- severity-consistent border/accent
- title truncation only if necessary
- keep visual alignment with the admin page

Do NOT make it overly rounded or overly decorative.
Keep it blocky, clean, and readable.

Suggested classes:
- `.admin-customer-alert-card`
- `.admin-customer-alert-card--collapsed`
- `.admin-customer-alert-card--expanded`
- `.admin-customer-alert-card__summary`
- `.admin-customer-alert-card__title`
- `.admin-customer-alert-card__meta`
- `.admin-customer-alert-card__chevron`

## 7) Accessibility
Make sure:
- collapsed summary uses a real `button`
- `aria-expanded` reflects state
- content regions can have stable ids
- focus styles remain visible

## 8) Preserve current admin page behavior
Do NOT change:
- customer header
- stats row
- routing
- mock access gate
- farmer alert page behavior

Files expected to change:
- `src/pages/AdminCustomerPage.jsx`
- `src/components/AlertDetailBlock.jsx`
- `src/pages/pages.css`

Success criteria:
- On `/admin/customers/:customerId`, each alert is collapsed by default
- Collapsed alert shows only severity/risk level and title
- Clicking it expands the alert
- Expanded alert shows full content
- Inside expanded admin alert, `Integrated` is static and not its own accordion
- Farmer `/alert` page still keeps the current integrated accordion behavior
- No React warnings or broken styling