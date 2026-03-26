# Pages Map

Status: `DRAFT` because the dashboard/profile/alert route refactor is complete, but visual QA still relies on manual checks.

Files
- `README.md` (`STABLE`) - folder map for route-level screens and behavior notes.
- `DashboardPage.jsx` (`DRAFT`) - home route with a top-priority row (AI assistant seed + alert count), then secondary water/soil widgets.
- `ProfilePage.jsx` (`DRAFT`) - centered static farm scene with floating top-right signal icons and minimal read-only profile context.
- `AlertsPage.jsx` (`DRAFT`) - ranked alerts feed with URL-backed filters, a flatter filter strip, and click-to-select behavior for the dedicated alert detail route.
- `AlertDetailPage.jsx` (`DRAFT`) - dedicated `/alert` detail destination that renders the app-selected alert or a quiet empty state when nothing is selected.
- `FarmTypePage.jsx` (`FROZEN`) - previous profile-selection screen kept as legacy reference; no longer in active routing.
- `pages.css` (`DRAFT`) - page-level layout and route-specific styling for the active page modules above, including the dashboard priority-grid treatment, assistant seed chat styling, and profile composition.

Why these live together
- These files own route-level screens, not reusable primitives.
- Shared page CSS keeps route-specific layout rules separate from shell and component-level styles.

Non-obvious behavior
- `AlertsPage` ranking uses weighted urgency: severity, farm relevance, status urgency, then recency as tie influence.
- Alert filters are URL-backed (`severity`, `source`, `relevance`) so list context survives navigation.
- The filter strip intentionally avoids top labels and per-view totals, exposing only the minimal filter controls plus `Clear filters` when needed.
- The alert filter strip is sticky and full-bleed at the top of the scrollable page area, so controls remain visible and visually detached from card-width constraints.
- `AlertsPage` keeps top-priority and non-critical alerts directly in-feed (without titled wrappers) and sets app-level selected alert state when a user opens any alert card.
- `AlertDetailPage` reads only that selected-alert state and intentionally shows a quiet empty placeholder if nothing is selected yet.
- `AlertDetailPage` keeps the top metadata compact (title, urgency, triggered time, field context), renders `new` as a blue `New notification` indicator, and then walks through an animated farm-themed roadmap (`Problems -> Integrated -> Action to do`).
- `DashboardPage` derives water and soil summary card values from the active alert set (`primary` relevance count and active field list) to stay lightweight without introducing a new data layer.
- `DashboardPage` intentionally removes old context copy/metadata blocks (`farm profile`, `plots tracked`, long intro description) so the top area shows only AI assistant + alert count.
- `DashboardPage` keeps a visual alert sentence (`X alerts, Y medium and Z high`) derived from active severities and replays a deterministic mock assistant answer with a typewriter effect each time the local prompt is submitted.
- `ProfilePage` keeps connected-source state intentionally binary with icon-symbol emphasis (`green` active, `red` broken) in a floating horizontal strip on the farm scene.
- `ProfilePage` intentionally collapses to a single centered stage so the farm visual remains the focal point and no right-side identity column consumes space.
