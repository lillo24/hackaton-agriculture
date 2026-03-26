# Src Map

Status: `DRAFT` because the source tree is stable enough to demo, but the interfaces may still move while the MVP evolves.

Files and folders
- `README.md` - folder map for the source tree.
- `main.jsx` - browser bootstrap that mounts the React app inside `BrowserRouter`.
- `App.jsx` - top-level route wiring, fixed profile context selection, and app-level selected-alert state owner.
- `index.css` - global theme tokens, background system, and shared browser resets.
- `components/` - reusable visual building blocks such as badges, cards, and the phone frame.
- `layout/` - preview stage and shell wrappers for phone/desktop routes, plus standalone roadmap presentation mode.
- `pages/` - route-level screens for dashboard placeholder, profile context, alerts list, and dedicated alert detail.
- `data/` - centralized shared entities plus selectors for farm-aware alert derivation and in-detail provenance rendering.

Why these live together
- `App.jsx` coordinates the folders below it.
- The rest of the folders divide responsibility by reuse level: global bootstrapping, reusable UI pieces, shell layout, route screens, and mock domain data.

Non-obvious behavior
- The app home route now resolves to `/dashboard`, which is intentionally a minimal placeholder for the future daily farmer dashboard.
- In phone preview, the initial `/dashboard` visit now opens with a staged shell intro (`terminal visible -> sources -> feeding -> terminal running -> terminal collapsing -> bubble -> phone connector -> phone startup`); the phone stays in its own centered layer, while the terminal overlay is positioned from `phoneLeft = phoneRect.left - stageRect.left` and the rendered terminal width using `terminalLeft = (phoneLeft / 2) - (terminalWidth / 2)`, and the phone startup only begins once the outgoing connector visually reaches the phone.
- Selected alert state is stored in `App.jsx`; `/alert` reads that state and renders an empty quiet placeholder when no alert has been selected yet.
- Legacy `/alerts/:alertId` links are supported by redirecting to `/alert` while synchronizing selected-alert state.
- Roadmap mode is a shell-only presentation view and intentionally does not render the routed app pages while active.
