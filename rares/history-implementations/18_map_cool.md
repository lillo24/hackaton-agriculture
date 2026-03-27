You are working inside the existing rares/app-skeleton React app.

Goal:
Turn the floating red markers on the Profile page farm map into the REAL current alerts.
Each floating marker must:
- represent an actual alert from the current farm
- show an icon that communicates the alert type
- visually highlight the newest alert
- be clickable
- redirect to the specific alert detail

Do NOT redesign the whole page.
Do NOT rebuild the farm card from scratch.
Keep the current profile page style and the current isometric farm illustration.
This is a data + interaction refactor.

Important context from the current code:
- Profile page is in src/pages/ProfilePage.jsx
- Farm visual card is in src/components/FarmVisualCard.jsx
- Alerts are already built in App.jsx and passed to pages
- There is already alert navigation logic:
  - /alert shows the selected alert
  - /alerts/:alertId uses LegacyAlertRoute to set the selected alert and redirect
- Alert icons already exist in src/components/AlertListItem.jsx via AlertIconGlyph / pickProblemIcon / pickSideIcons
- The current floating farm markers in FarmVisualCard are HARDCODED tileStatuses and are not linked to real alerts

What to implement:

1) Replace hardcoded floating status markers with real alert markers
- Remove the fake tileStatuses-based floating icons from FarmVisualCard
- Add a new prop to FarmVisualCard called alertMarkers (or equivalent)
- Render floating markers from that prop instead of the hardcoded list

2) Use real current alerts from ProfilePage
- In ProfilePage.jsx, derive the visible map markers from the real alerts prop
- Exclude resolved alerts from the map
- Sort alerts by recency first (smallest timestampMinutesAgo = newest)
- Keep up to 4 markers visible on the map
- One of them must clearly be the newest alert

3) Marker placement
- Place each alert marker based on its field
- Use stable coordinates, not random positions
- Create a small mapping from field.id (or plotCode) to x/y positions on the farm SVG
- For the current vineyard setup, the known field anchors should cover:
  - vineyard-north-canopy / VN-N1
  - vineyard-lower-terrace / VN-L3
- Add at least 2 extra fallback anchor points so the component stays robust if more alerts appear
- If multiple alerts map to the same field, offset them slightly so they do not fully overlap

4) Marker visuals
- Keep the overall “floating red thingies” feeling, but make them data-driven
- Each marker should be a small floating chip/button above the map
- Use an icon for the alert kind:
  - disease / humidity / mildew / peronospora -> humidity or disease-like icon
  - frost / freeze -> frost icon
  - heat / canopy stress / sunburn -> heat or sun icon
- Reuse existing alert icon logic instead of duplicating inconsistent icon sets
- Best approach: extract the reusable alert icon helper(s) from AlertListItem.jsx into a shared file, for example:
  - src/components/alertIcons.js
  Then import them both in AlertListItem.jsx and FarmVisualCard.jsx

5) Newest alert emphasis
- The newest alert marker must stand out
- Keep it subtle and clean:
  - slightly larger
  - stronger red glow/ring
  - optional tiny “Newest” pill or dot
- Do not make the map noisy

6) Click behavior
- Clicking a marker must open the specific alert detail
- Use the existing routing pattern already present in the app
- Prefer linking to /alerts/:alertId so LegacyAlertRoute sets the selected alert and redirects correctly
- The click target must be accessible and keyboard focusable

7) Tooltip / accessible label
- Each marker should have:
  - title tooltip with alert title + severity + timestampLabel
  - aria-label like:
    "Open newest alert: Peronospora risk, critical, 4 min ago"
    or
    "Open alert: Freeze risk, high, 18 min ago"

8) Keep existing profile page behavior intact
- Do not remove the signal badges
- Do not change the PageHeader structure
- Do not break the current FarmVisualCard use on ProfilePage
- Preserve showLegend=false behavior on the profile page

Implementation details:
- Update App.jsx so ProfilePage still receives alerts and can pass alertMarkers into FarmVisualCard
- In ProfilePage.jsx:
  - compute visible alerts
  - transform them into marker objects:
    {
      id,
      alertId,
      title,
      severity,
      timestampLabel,
      timestampMinutesAgo,
      isNewest,
      iconType,
      fieldId,
      x,
      y,
      href
    }
- In FarmVisualCard.jsx:
  - render marker buttons/links in the SVG layer or in an absolute overlay above the SVG
  - use Link from react-router-dom if needed
- In components.css:
  - add styles for:
    - .farm-visual-card__alert-marker
    - .farm-visual-card__alert-marker--newest
    - hover/focus states
    - floating animation
    - icon sizing
  - keep the styling aligned with the existing alert severity palette
  - use red family for the marker base, but severity can slightly affect ring/border tone

Edge cases:
- If there are no non-resolved alerts, render no floating markers
- If field mapping is missing for an alert, use a fallback position instead of crashing
- If multiple alerts share the same field, fan them out with deterministic offsets
- Do not let markers overflow badly on mobile

Files expected to change:
- src/pages/ProfilePage.jsx
- src/components/FarmVisualCard.jsx
- src/components/components.css
- src/components/AlertListItem.jsx
- maybe a new shared helper file like src/components/alertIcons.js
- possibly App.jsx only if prop plumbing needs adjustment

Success criteria:
- The profile page no longer shows fake floating status markers
- The map shows actual current alerts
- The newest alert is visibly identifiable
- Each marker has an alert-type icon
- Clicking a marker opens the correct alert detail
- Existing alert list behavior still works
- The page still looks polished on phone and desktop

After coding:
- run the app
- verify the vineyard profile shows real markers for the current vineyard alerts
- verify clicking each marker lands on the corresponding alert detail
- verify the newest alert is highlighted
- verify there are no React warnings or broken imports