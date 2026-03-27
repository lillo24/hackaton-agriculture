You are working inside the rares repo.

Goal:
Add a simple toggle/button control to filter alerts by status:
- Active
- Resolved

This should feel like a small clean UI control, not a redesign.

What to do:
1. Find where alerts are currently listed in the admin flow.
   This may be:
   - the admin customer detail page
   - any admin alert list section
   - any shared alert list component used there
2. Add a small toggle / segmented control / two-button switch near the alerts section title.
3. The control must let the user switch between:
   - Active alerts
   - Resolved alerts
4. Default view:
   - show Active alerts first
5. When Active is selected:
   - show only alerts that are currently open/new/in-progress/active
6. When Resolved is selected:
   - show only alerts that are closed/resolved/dismissed/completed
7. Reuse the existing alert data model.
   If the repo uses a status field, map it cleanly.
   Example mapping:
   - active bucket: new, active, open, ongoing
   - resolved bucket: resolved, closed, dismissed, completed
8. If one bucket is empty, show a quiet empty state like:
   - “No active alerts”
   - “No resolved alerts”
9. Keep the existing styling language of the repo.
10. Do not redesign the whole page.

Implementation constraints:
- Make the smallest clean change.
- Prefer local component state for the toggle unless the repo already uses a pattern for filters.
- If the alerts list exists in more than one admin page, apply the same behavior where it makes sense.
- Do not break navigation or existing alert cards.

UI behavior:
- The selected toggle state should be visually clear.
- The control should work on both desktop and mobile layouts.
- Keep it compact.

Validation:
- Confirm the toggle switches the visible alerts correctly.
- Confirm the default is Active.
- Confirm empty states work.
- Confirm existing customer/admin page scrolling still works.

Output:
After editing, give me a short summary:
1. files changed
2. where the toggle was added
3. how alert statuses were mapped into active/resolved