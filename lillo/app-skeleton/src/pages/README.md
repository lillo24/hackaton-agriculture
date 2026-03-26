# Pages Map

Status: `DRAFT` because the dashboard/profile/alert route refactor is complete, but visual QA still relies on manual checks.

Files
- `README.md` (`STABLE`) - folder map for route-level screens and behavior notes.
- `DashboardPage.jsx` (`DRAFT`) - home route that now embeds the same `Giorgio's farm` profile block with floating critical/medium summary chips in the open bottom-left slot, then shows the enlarged white-theme simulated chatbot recap.
- `ProfilePage.jsx` (`DRAFT`) - lightweight wrapper route that reuses the same shared `Giorgio's farm` profile block shown on the dashboard.
- `AlertsPage.jsx` (`DRAFT`) - ranked alerts feed with URL-backed filters, a flatter filter strip, and click-to-select behavior for the dedicated alert detail route.
- `AlertDetailPage.jsx` (`DRAFT`) - dedicated `/alert` detail destination that renders the app-selected alert or a quiet empty state when nothing is selected.
- `FarmTypePage.jsx` (`FROZEN`) - previous profile-selection screen kept as legacy reference; no longer in active routing.
- `pages.css` (`DRAFT`) - page-level layout and route-specific styling for the active page modules above, including the dashboard priority-grid treatment, assistant seed chat styling, and profile composition.

Why these live together
- These files own route-level screens, not reusable primitives.
- Shared page CSS keeps route-specific layout rules separate from shell and component-level styles.

Non-obvious behavior
- `AlertsPage` ranking uses weighted urgency: severity, farm relevance, status urgency, then recency as tie influence.
- Alert filters are URL-backed (`severity`, `source`, `history`) so list context survives navigation.
- The filter strip intentionally avoids top labels and per-view totals, exposing only minimal controls (including a `history` toggle).
- The alert filter strip is sticky and full-bleed at the top of the scrollable page area, so controls remain visible and visually detached from card-width constraints.
- The `history` toggle appends a local fake archived alert card used for pitch/demo context; it is intentionally muted and non-interactive.
- `AlertsPage` keeps top-priority and non-critical alerts directly in-feed (without titled wrappers) and sets app-level selected alert state when a user opens any alert card.
- `AlertDetailPage` reads only that selected-alert state and intentionally shows a quiet empty placeholder if nothing is selected yet.
- `AlertDetailPage` keeps the top metadata compact (title, urgency, triggered time, field context), renders `new` as a blue `New notification` indicator, and then walks through an animated farm-themed roadmap (`Problems -> Integrated -> Action to do`).
- `DashboardPage` derives water and soil summary card values from the active alert set (`primary` relevance count and active field list) to stay lightweight without introducing a new data layer.
- `DashboardPage` intentionally removes old context copy/metadata blocks (`farm profile`, `plots tracked`, long intro description) and assistant placeholder headings so the top area focuses on the embedded farm profile, floating alert labels, and chat recap.
- `DashboardPage` now uses the exact shared `Giorgio's farm` profile block from the Profile route, but injects dashboard-only critical/medium summary chips into the unused lower-left corner instead of rendering a separate alert-summary card.
- `DashboardPage` now renders only compact `critical` and `medium` labels inside that floating stage summary and intentionally drops the total-alert headline there.
- `DashboardPage` starts a deterministic assistant recap stream automatically on page enter (without a user seed message), then keeps an input field available for follow-up chat prompts.
- `DashboardPage` assistant avatar now uses the same robot icon language as the dedicated chatbot UI repo to keep visual consistency.
- `DashboardPage` is mode-aware through CSS shell classes: in `phone` preview, alerts render first and hide extra alert subtitle copy while preserving count/chip visibility.
- `DashboardPage` stacks water/moisture summary cards on separate rows in `phone` preview and hides those cards' subtitle descriptions to reduce clutter.
- `DashboardPage` keeps rounded cards in desktop preview, while `phone` preview uses full-bleed card blocks (edge-to-edge width) with square corners.
- `ProfilePage` keeps connected-source state intentionally binary with icon-symbol emphasis (`green` active, `red` broken) in a floating horizontal strip on the farm scene, and reuses the same shared stage component without the dashboard-only alert-summary overlay.
