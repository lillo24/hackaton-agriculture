You are working inside the rares repo.

Goal:
Fix the admin area so the admin page can actually scroll vertically and show all customers.
Right now the page appears cut off and not all customer cards are reachable.

What to do:
1. Find the admin page, its customer list container, and any parent layout wrappers that affect height or overflow.
2. Identify what is blocking vertical scrolling.
   Check especially for:
   - overflow: hidden on app/root/layout containers
   - fixed 100vh containers trapping content
   - nested flex layouts missing min-height: 0 or overflow-y: auto
   - custom wrappers around the admin routes
3. Apply the smallest clean fix so that:
   - the admin page scrolls normally
   - all customers are visible by scrolling down
   - the rest of the app keeps its current behavior
4. Also make sure the individual admin customer detail page still scrolls correctly if its content exceeds the viewport.
5. Do not redesign the page.
6. Do not change the mock data except if needed to confirm scrolling works.
7. Preserve the existing look and spacing as much as possible.

Implementation constraints:
- Prefer a route-specific fix for admin pages rather than changing global scrolling for the whole app, unless the global rule is clearly the root cause and can be safely adjusted.
- Keep the change minimal and high confidence.
- If the app uses React + CSS modules / Tailwind / plain CSS, follow the existing style.
- Avoid hacky fixes like arbitrary giant heights.

Validation:
- Run the project locally if possible.
- Confirm that the admin customer list can scroll to the last customer.
- Confirm that clicking a customer still opens their page and that page can also scroll if needed.

Output:
- Make the code changes directly.
- Then give me a short summary:
  1. root cause
  2. files changed
  3. exact fix applied