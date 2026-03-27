# Pages Map

Status: `DRAFT` because the dashboard/profile/alert/admin route set is implemented, but visual QA still relies on manual checks.

Files
- `README.md` (`STABLE`) - folder map for route-level screens and behavior notes.
- `AdminPage.jsx` (`DRAFT`) - standalone `/admin` azienda console kept outside the farmer `AppShell`; it owns the documented mock `sessionStorage` gate (`rares_admin_access`) plus memoized search/filter/sort controls and card navigation into customer detail.
- `AdminCustomerPage.jsx` (`DRAFT`) - standalone `/admin/customers/:customerId` customer detail view that reuses the same mock gate, derives active summary counts from non-resolved customer alerts, adapts admin alert records into the farmer alert-detail structure, and now renders each alert as a single collapsed-by-default admin card with one persistent severity-plus-title header that expands inline to reveal only read-only `Problems` and static `Integrated` content plus dedicated empty/not-found states and a local active/resolved alert toggle in the listing header.
- `DashboardPage.jsx` (`DRAFT`) - home route with split dashboard priority UI: desktop keeps alert chips plus a white-theme simulated chatbot recap, while phone keeps alerts-first with compact metadata.
- `ProfilePage.jsx` (`DRAFT`) - centered static farm scene with floating top-right signal icons and minimal read-only profile context.
- `AlertsPage.jsx` (`DRAFT`) - ranked alerts feed with URL-backed severity/source filters plus an optional history toggle, and click-to-select behavior for the dedicated alert detail route.
- `AlertDetailPage.jsx` (`DRAFT`) - dedicated `/alert` detail destination that renders the app-selected alert or a quiet empty state when nothing is selected, using the shared alert-detail block for the compact hero, field line, collapsible integrated-summary step, and the farmer-only action step.
- `FarmTypePage.jsx` (`FROZEN`) - previous profile-selection screen kept as legacy reference; no longer in active routing.
- `pages.css` (`DRAFT`) - page-level layout and route-specific styling for the active page modules above, including the dashboard priority-grid treatment, assistant seed chat styling, profile composition, and the standalone admin console/detail surfaces with normal page scrolling plus the compact admin alert status toggle and the single-card expandable admin customer alert styling.

Why these live together
- These files own route-level screens, not reusable primitives.
- Shared page CSS keeps route-specific layout rules separate from shell and component-level styles.

Non-obvious behavior
- `AdminPage` is intentionally routed outside `AppShell`, so the farmer phone shell and bottom navigation never render on `/admin`.
- Admin routes temporarily add an `admin-route` class to `html`, `body`, and `#root`, so the document can scroll normally while the farmer preview shell keeps global overflow locked.
- `AdminPage` and `AdminCustomerPage` use the same frontend-only session flag (`rares_admin_access`) as a mock company gate; this is UI state for demo flow only and not real security.
- The admin list and detail routes intentionally use normal page flow instead of a trapped inner scroller so all mock customers and alert cards remain reachable on desktop.
- `AdminCustomerPage` intentionally normalizes incomplete mock alert fields (`fieldName`, relative times, missing `sources`, missing integrated copy) into the shared customer alert-detail shape so admin detail cards stay visually aligned with the farmer template without rendering any action block.
- Admin customer alerts are intentionally collapsed by default and expand per-card with a local button state, but the admin detail view now keeps only one persistent severity-plus-title header and reveals just the `Problems` and `Integrated` sections underneath it so the expanded state does not render a second alert hero; the farmer `/alert` detail route keeps its always-open hero plus nested Integrated accordion behavior.
- `AdminCustomerPage` keeps the top summary cards derived from active alerts, while the customer alert stack itself is locally filterable between `Active` and `Resolved` via a compact toggle near the section header.
- Admin customer alert filtering normalizes status buckets locally: `new`, `active`, `open`, `ongoing`, `monitoring`, and `in-progress` map to the active bucket, while `resolved`, `closed`, `dismissed`, and `completed` map to resolved; unknown statuses currently fall back to active to preserve visibility.
- `AlertsPage` ranking uses weighted urgency: severity, farm relevance, status urgency, then recency as tie influence.
- Alert filters are URL-backed (`severity`, `source`) and the optional history feed is toggled by `history=1`, so list context survives navigation while archived alerts stay opt-in.
- The filter strip intentionally avoids top labels and per-view totals, exposing minimal controls plus `Clear filters` when needed.
- The alert filter strip is sticky and full-bleed at the top of the scrollable page area, so controls remain visible and visually detached from card-width constraints.
- `AlertsPage` keeps top-priority and non-critical alerts directly in-feed (without titled wrappers) and sets app-level selected alert state when a user opens any alert card.
- `AlertDetailPage` reads only that selected-alert state and intentionally shows a quiet empty placeholder if nothing is selected yet.
- `AlertDetailPage` keeps the title inside a compact severity-tinted hero card, keeps only the small top-right timestamp in the hero metadata, moves the field name into inline copy below the summary, exposes the `Integrated` step as the only collapsible panel, and intentionally keeps the roadmap background plain with no decorative vine layer; when present, `riskScore` appears only inside that expanded section, while the action step remains farmer-only through the shared alert-detail block.
- `DashboardPage` derives water and soil summary card values from the active alert set (`primary` relevance count and active field list) to stay lightweight without introducing a new data layer.
- `DashboardPage` intentionally removes old context copy/metadata blocks (`farm profile`, `plots tracked`, long intro description) and assistant placeholder headings so the top area focuses on alerts and chat recap.
- `DashboardPage` now renders severity chips as compact labels (`critical`, `medium`, `low`) and keeps them visible in both desktop and phone modes.
- `DashboardPage` starts a deterministic assistant recap stream automatically on page enter (without a user seed message), then keeps an input field available for follow-up chat prompts.
- `DashboardPage` assistant avatar now uses the same robot icon language as the dedicated chatbot UI repo to keep visual consistency.
- `DashboardPage` is mode-aware through CSS shell classes: in `phone` preview, alerts render first and hide extra alert subtitle copy while preserving count/chip visibility.
- `DashboardPage` stacks water/moisture summary cards on separate rows in `phone` preview and hides those cards' subtitle descriptions to reduce clutter.
- `DashboardPage` keeps rounded cards in desktop preview, while `phone` preview uses full-bleed card blocks (edge-to-edge width) with square corners.
- `ProfilePage` keeps connected-source state intentionally binary with icon-symbol emphasis (`green` active, `red` inactive) in a floating horizontal strip on the farm scene, and those states now follow the real integration statuses from mock data.
- `ProfilePage` intentionally collapses to a single centered stage so the farm visual remains the focal point and no right-side identity column consumes space.
