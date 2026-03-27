# Components Map

Status: `DRAFT` because core primitives are stable, but profile visual cards were added and still need visual QA across phone and desktop preview modes.

Files
- `README.md` - folder map for reusable UI pieces.
- `AlertDetailBlock.jsx` (`DRAFT`) - shared alert-detail body used by the farmer detail route and the admin customer alert stack; it can render the full hero or only selected sections (`Problems`, `Integrated`, action) so admin cards can reuse the body without duplicating the alert title/header while the action step stays opt-in and the Integrated section can be either collapsible or static depending on the caller.
- `IntroTerminal.jsx` (`DRAFT`) - scripted Bash-style simulation window that measures against the phone stage and now runs the full `visible -> sources -> feeding -> running -> collapsing -> bubble -> connectingToPhone -> handoffToPhone` sequence.
- `IntroTerminal.css` (`DRAFT`) - cinematic terminal window styling, source-chip reveal, connector-line motion, measured bubble morph, and phone handoff visuals for the pre-intro simulation panel.
- `SourceIcon.jsx` (`STABLE`) - tiny icon primitive used by the intro source chips (`sensor`, `weather`, `satellite`) so the shell intro can stay self-contained.
- `PhoneFrame.jsx` - reusable visual device shell that wraps arbitrary app content, forwards its outer ref for shell-level layout measurement, and keeps the phone asleep until the intro handoff reaches the phone layer.
- `PhoneFrame.css` - premium bezel, notch, reflection, startup vibration, and lock-screen styling for the phone frame.
- `PageHeader.jsx` - consistent title block used by route screens.
- `SectionCard.jsx` - shared card wrapper for grouped page content.
- `StatusBadge.jsx` - tone-aware pill for severities, statuses, and metadata tags.
- `AlertListItem.jsx` - reusable prioritized alert card with compact severity/time metadata, a field pill, larger right-side signal/problem icons, and card-level open behavior that preserves list return context and focus id.
- `WaterLevelCard.jsx` (`DRAFT`) - reusable calm trend card with a smooth SVG line and day-axis labels for dashboard summary context.
- `SoilMoistureCard.jsx` (`DRAFT`) - reusable three-pillar moisture card with full-capacity wells and filled level bars for compact dashboard overview.
- `FarmVisualCard.jsx` (`DRAFT`) - reusable static mini-farm scene card with flatter pseudo-isometric parcels and optional context pills/legend.
- `components.css` - shared styling rules for the reusable components above.

Why these live together
- Each file in this folder is reusable across multiple routes.
- `IntroTerminal` and `PhoneFrame` are both presentation primitives that the shell composes into the pitch intro, while the other components keep page markup lean and consistent.

Non-obvious behavior
- `AlertDetailBlock` owns the shared alert-detail interaction pattern: it resets the Integrated panel open state whenever the alert id changes, derives the risk line from either `riskScore` or a precomputed `riskLine`, lets callers selectively hide the hero summary/field or whole sections for read-only admin rendering, and accepts `integratedCollapsible={false}` so admin-specific wrappers can show Integrated as static content without changing the farmer page behavior.
- `IntroTerminal` is fully deterministic: it reveals a fixed array of simulation lines with per-line delays, stages the source strip before execution, and reports each shell-owned transition until the phone handoff starts.
- `IntroTerminal` measures its rendered width and uses shell-provided stage coordinates so the final bubble and connector path stay aligned with the real phone position after resize.
- `PhoneFrame` keeps the real routed app mounted underneath the intro overlay so the unlock animation can slide the fake lock screen away instead of remounting the app.
- When the startup intro is enabled, `PhoneFrame` stays visually asleep while the shell-level terminal sequence runs, then waits for the shell handoff signal before starting the phone vibration and lock-screen sequence.
- `PhoneFrame` only reports intro completion after the state machine reaches its final `app` state, which keeps replay/skip handling deterministic in the preview shell.
- `SectionCard` accepts an optional `className` so pages can keep shared card semantics while overriding container tone for special layouts.
- `WaterLevelCard` rescales chart Y positions from provided values so the curve remains readable without introducing dashboard-like chart complexity.
- `SoilMoistureCard` expects percentage-like values and clamps to `0-100` before rendering bar fills.
- `FarmVisualCard` can render an optional floating signal badge row and fixed tile-status markers (2 verified, 2 warning) with slow up/down animation for pitch readability, and can hide the legend for cleaner profile composition.
- `AlertListItem` picks one source icon from available alert source ids (satellite first when present) and one problem icon from known alert ids, with keyword fallback for unknown templates; `humidity-spike` intentionally uses a weather-plus-humidity pair to foreground moisture-driven disease pressure, while the vineyard `irrigation-drift` alert swaps the default pair for heat plus sun icons so the risk reads clearly at a glance.
