# Components Map

Status: `DRAFT` because core primitives are stable, but profile visual cards were added and still need visual QA across phone and desktop preview modes.

Files
- `README.md` - folder map for reusable UI pieces.
- `IntroTerminal.jsx` (`DRAFT`) - scripted Bash-style simulation window that now morphs through `visible -> running -> collapsing -> bubble` so the shell can stop on a stable node before later connector work.
- `IntroTerminal.css` (`DRAFT`) - cinematic terminal window styling, line reveal motion, vertical collapse treatment, and final bubble/node visuals for the pre-intro simulation panel.
- `PhoneFrame.jsx` - reusable visual device shell that wraps arbitrary app content and keeps the phone asleep while the shell-level terminal intro is active; it still owns the later phone-side startup sequence for follow-up steps.
- `PhoneFrame.css` - premium bezel, notch, reflection, startup vibration, and lock-screen styling for the phone frame.
- `PageHeader.jsx` - consistent title block used by route screens.
- `SectionCard.jsx` - shared card wrapper for grouped page content.
- `StatusBadge.jsx` - tone-aware pill for severities, statuses, and metadata tags.
- `AlertListItem.jsx` - reusable prioritized alert card with compact severity/time metadata, larger right-side signal/problem icons, and card-level open behavior that preserves list return context and focus id.
- `WaterLevelCard.jsx` (`DRAFT`) - reusable calm trend card with a smooth SVG line and day-axis labels for dashboard summary context.
- `SoilMoistureCard.jsx` (`DRAFT`) - reusable three-pillar moisture card with full-capacity wells and filled level bars for compact dashboard overview.
- `FarmVisualCard.jsx` (`DRAFT`) - reusable static mini-farm scene card with flatter pseudo-isometric parcels and optional context pills/legend.
- `components.css` - shared styling rules for the reusable components above.

Why these live together
- Each file in this folder is reusable across multiple routes.
- `IntroTerminal` and `PhoneFrame` are both presentation primitives that the shell composes into the pitch intro, while the other components keep page markup lean and consistent.

Non-obvious behavior
- `IntroTerminal` is fully deterministic: it reveals a fixed array of simulation lines with per-line delays, reports when the run should enter the collapse phase, and then reports again after the shell has fully resolved into the final bubble.
- `PhoneFrame` keeps the real routed app mounted underneath the intro overlay so the unlock animation can slide the fake lock screen away instead of remounting the app.
- When the startup intro is enabled, `PhoneFrame` stays visually asleep while the shell-level terminal sequence runs or holds on the final bubble, so step 15 can stop before the later phone vibration handoff.
- `PhoneFrame` only reports intro completion after the state machine reaches its final `app` state, which keeps replay/skip handling deterministic in the preview shell.
- `SectionCard` accepts an optional `className` so pages can keep shared card semantics while overriding container tone for special layouts.
- `WaterLevelCard` rescales chart Y positions from provided values so the curve remains readable without introducing dashboard-like chart complexity.
- `SoilMoistureCard` expects percentage-like values and clamps to `0-100` before rendering bar fills.
- `FarmVisualCard` can render an optional floating signal badge row and fixed tile-status markers (2 verified, 2 warning) with slow up/down animation for pitch readability, and can hide the legend for cleaner profile composition.
- `AlertListItem` picks one source icon from available alert source ids (satellite first when present) and one problem icon from known alert ids, with keyword fallback for unknown templates while keeping the full card as the open-detail affordance; when rendered as historical, it switches to a muted non-link card.
