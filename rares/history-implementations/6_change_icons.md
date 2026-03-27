Make a surgical icon-only change for the alert with id 'humidity-spike'.

Goal:
- Change only the right-side alert icons for 'humidity-spike'
- Do not touch alert data
- Do not touch any other alert ids
- Do not change layout, sizing, spacing, or colors
- Do not modify the freeze alert or any other card

File to edit:
src/components/AlertListItem.jsx

What to do:
1. Find the existing `customSideIconsByAlertId` object.
2. Add a new entry for `'humidity-spike'`.
3. Set its two icons to:
   - `weather` with label `Rainfall and forecast moisture`
   - `humidity` with label `Leaf wetness and disease pressure`

Use this exact code shape:

'humidity-spike': [
  { type: 'weather', label: 'Rainfall and forecast moisture' },
  { type: 'humidity', label: 'Leaf wetness and disease pressure' },
],

Important:
- Keep the existing `irrigation-drift` custom icons exactly as they are
- Do not remove any existing mappings
- Do not change `problemIconByAlertId`
- Do not change `pickSignalIcon`
- Do not change `pickProblemIcon`
- Do not change alert ordering or filtering

After editing, verify:
- `humidity-spike` now uses the custom icon pair above
- `frost-pocket` still uses its existing icon behavior
- no other alert icon mappings changed

At the end print:
- edited file path
- whether the new custom mapping for `humidity-spike` was added successfully