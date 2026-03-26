# Components Map

Status: `DRAFT` because core primitives are stable, but profile visual cards were added and still need visual QA across phone and desktop preview modes.

Files
- `README.md` - folder map for reusable UI pieces.
- `PhoneFrame.jsx` - reusable visual device shell that wraps arbitrary app content.
- `PhoneFrame.css` - premium bezel, notch, reflection, and screen styling for the phone frame.
- `PageHeader.jsx` - consistent title block used by route screens.
- `SectionCard.jsx` - shared card wrapper for grouped page content.
- `StatusBadge.jsx` - tone-aware pill for severities, statuses, and metadata tags.
- `AlertListItem.jsx` - reusable prioritized alert card with field/source metadata, compact signal/problem icons, and open-to-detail behavior that preserves list return context and focus id.
- `WaterLevelCard.jsx` (`DRAFT`) - reusable calm trend card with a smooth SVG line and day-axis labels for profile context snapshots.
- `SoilMoistureCard.jsx` (`DRAFT`) - reusable three-pillar moisture card with full-capacity wells and filled level bars.
- `FarmVisualCard.jsx` (`DRAFT`) - reusable static stylized isometric farm illustration card used as lightweight context support.
- `components.css` - shared styling rules for the reusable components above.

Why these live together
- Each file in this folder is reusable across multiple routes.
- The `PhoneFrame` owns the donor-inspired device chrome, while the other components keep page markup lean and consistent.

Non-obvious behavior
- `WaterLevelCard` rescales chart Y positions from provided values so the curve remains readable without introducing dashboard-like chart complexity.
- `SoilMoistureCard` expects percentage-like values and clamps to `0-100` before rendering bar fills.
- `FarmVisualCard` can render up to four floating context pills around the scene and can hide the legend for a cleaner center-stage composition.
- `AlertListItem` picks one source icon from available alert source ids (satellite first when present) and one problem icon from known alert ids, with keyword fallback for unknown templates.
