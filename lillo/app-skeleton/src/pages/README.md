# Pages Map

Status: `DRAFT` because the dashboard/profile/alert route refactor is complete, but visual QA still relies on manual checks.

Files
- `README.md` (`STABLE`) - folder map for route-level screens and behavior notes.
- `DashboardPage.jsx` (`DRAFT`) - home placeholder route for the future farmer dashboard with intentionally minimal content.
- `ProfilePage.jsx` (`DRAFT`) - refreshed read-only profile context view with calm agritech card language, connected source summary, farm context strip, and supporting visual cards.
- `AlertsPage.jsx` (`DRAFT`) - ranked alerts list with URL-backed filters and click-to-select behavior for the dedicated alert detail route.
- `AlertDetailPage.jsx` (`DRAFT`) - dedicated `/alert` detail destination that renders the app-selected alert or a quiet empty state when nothing is selected.
- `FarmTypePage.jsx` (`FROZEN`) - previous profile-selection screen kept as legacy reference; no longer in active routing.
- `pages.css` (`DRAFT`) - page-level layout and route-specific styling for the active page modules above, including profile visual-refresh spacing/tone tokens.

Why these live together
- These files own route-level screens, not reusable primitives.
- Shared page CSS keeps route-specific layout rules separate from shell and component-level styles.

Non-obvious behavior
- `AlertsPage` ranking uses weighted urgency: severity, farm relevance, status urgency, then recency as tie influence.
- Alert filters are URL-backed (`severity`, `status`, `source`, `relevance`) so list context survives navigation.
- `AlertsPage` sets app-level selected alert state when a user opens any alert from the grouped lists.
- `AlertDetailPage` reads only that selected-alert state and intentionally shows a quiet empty placeholder if nothing is selected yet.
- `AlertDetailPage` keeps the top metadata compact (title, urgency, triggered time, field context), renders `new` as a blue `New notification` indicator, and then walks through an animated farm-themed roadmap (`Problems -> Integrated -> Action to do`).
- `ProfilePage` keeps the farm scene centered while context cards remain read-only around it; connected source state is intentionally binary (`green` connected, `red` broken) for quick scan.
