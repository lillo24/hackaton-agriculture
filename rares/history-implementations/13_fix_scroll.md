You are editing the existing rares repo.

Work inside:
rares/app-skeleton

Goal:
Fix the admin pages so that ALL customers are accessible and visible.
The page must scroll normally, and the full customer list must be reachable.

Important:
- Do not change the farmer-facing pages
- Do not change the mock data structure unless needed for rendering
- Do not remove any customers
- Do not add dependencies
- Keep the admin routes separate from the farmer bottom navigation

Problem to fix:
Right now the admin pages are trapping the layout and only part of the customer list is visible.
I need to be able to scroll through the page and see all customers.

What to change

1) Fix the main admin page layout
File likely involved:
- src/pages/AdminPage.jsx
- src/pages/pages.css

Make sure the main admin page uses normal document flow and vertical scrolling.

Check for and fix any of these issues:
- `height: 100vh` on the wrong container
- `overflow: hidden` on page wrappers
- fixed-height inner panels clipping the customer grid
- flex layouts with children that cannot grow
- grid/list containers with hidden overflow
- parent containers using `position: fixed` or `absolute` in a way that blocks normal page scroll

Desired result:
- the full page scrolls vertically
- all customer cards are reachable
- the results section grows naturally with content
- there is enough bottom padding so the last card is fully visible

2) Fix the admin customer list/results area
If there is a customer grid/list wrapper:
- remove any forced max-height unless absolutely necessary
- do not trap scrolling inside a tiny inner panel
- prefer page-level scrolling instead of nested scroll containers

If needed, use a layout like:
- outer page wrapper: min-height rather than fixed height
- content container: width-constrained but auto height
- customer grid: normal block/grid flow with no overflow clipping

3) Keep all customers rendered
Verify the current admin page is rendering the FULL filtered result set, not slicing it accidentally.

Check for bugs like:
- `.slice(0, 4)`
- hidden pagination
- preview-only rendering
- incorrect responsive logic hiding cards
- grid template causing overlap or clipping

Acceptance:
- if there are 12 customers, all 12 can be reached by scrolling
- result count matches the actually visible reachable cards

4) Fix admin customer detail page too
File likely involved:
- src/pages/AdminCustomerPage.jsx
- src/pages/pages.css

Make sure the customer detail page also scrolls normally if a customer has many alerts.

Do not trap the alert list in a tiny internal panel unless it is large and intentional.
Prefer normal page scroll here too.

5) Styling guidance
Update CSS in:
- src/pages/pages.css

Make the admin wrappers robust on desktop:
- avoid `height: 100vh` on content wrappers unless paired correctly
- prefer `min-height: 100vh`
- avoid `overflow: hidden` on main admin shells
- use `overflow: visible` or default flow where appropriate
- add bottom padding to the main content area

Possible class targets to inspect/fix:
- .admin-shell
- .admin-page
- .admin-grid
- .admin-results
- .admin-customer-page
- any app/root/page wrapper used by admin routes

6) Do not break existing behavior
Keep:
- admin gate working
- filters working
- click-through to customer detail working
- existing farmer routes working

Acceptance criteria
- all customers are available
- I can scroll through the admin page and see them all
- the last customer card is fully visible
- customer detail page also scrolls normally
- no clipping
- no import/runtime/JSX errors

After editing:
- sanity-check the admin page with the full dataset
- verify there is no accidental slicing or hidden overflow
- verify both /admin and /admin/customers/:customerId scroll correctly.