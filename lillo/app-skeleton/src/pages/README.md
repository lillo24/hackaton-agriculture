# Pages Map

Status: `DRAFT` because pages are wired to a coherent shared model, but interaction details can still evolve during demo iteration.

Files
- `README.md` - folder map for route-level screens.
- `FarmTypePage.jsx` - route for selecting the active farm profile that shapes the rest of the mock app.
- `AlertsPage.jsx` - route that renders the ranked alerts feed with lightweight URL-backed filters, grouped operational sections, and polished empty/loading states.
- `AlertDetailPage.jsx` - route that renders one selected alert as a concise flow: source cards, one integrated explanation, and one recommended farmer action with preserved back-navigation context.
- `pages.css` - page-level layout and route-specific styling shared by the files above.

Why these live together
- These files are route owners rather than reusable primitives.
- Their shared CSS keeps route-specific layout rules away from the app shell and reusable component styles.

Non-obvious behavior
- `AlertsPage` ranking uses weighted urgency: severity, farm relevance, status urgency, then recency as tie influence.
- Alert filters are URL-backed (`severity`, `status`, `source`, `relevance`) so context survives drill-down and back navigation.
- `AlertDetailPage` keeps detail lightweight by compacting source copy into short signal and relevance notes, then visualizes `signals -> interpretation -> action`.
- `AlertDetailPage` back links preserve list route and focused alert context via router state (`from`, `focusAlertId`).
