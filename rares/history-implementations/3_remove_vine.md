You are editing the `rares/app-skeleton` repo.

Goal:
Remove the decorative vine / plant background graphic from the Alert detail page.

Important:
- Only change the ALERT DETAIL PAGE.
- Do not redesign the whole page.
- Do not change alert list cards unless they also reuse the exact same decorative background on the detail page.
- Keep all content, spacing, and severity color logic intact.
- We only want to remove the vine-like decorative background layer / illustration.

Files to inspect first:
- `src/pages/AlertDetailPage.jsx`
- `src/pages/pages.css`
- and any imported background asset or decorative component used by the alert detail page

What to do:

1) Find how the vine background is implemented
Check whether it comes from:
- a CSS `background-image`
- an absolutely positioned decorative element
- an imported SVG/image
- a pseudo-element like `::before` or `::after`
- a reusable illustration component rendered inside the hero

2) Remove it completely
- If it is JSX: delete that decorative element/component from `AlertDetailPage.jsx`
- If it is CSS: remove the `background-image`, decorative gradients, or pseudo-element drawing the vine
- If it is an imported asset: remove the import if it becomes unused
- If opacity/filter/mask tricks are used, remove that whole decorative layer, not just hide it halfway

3) Preserve the rest of the layout
- Keep the alert title, description, timestamp, severity styling, roadmap, and other content exactly working
- Do not collapse spacing awkwardly after removal
- If the hero depended on that layer for positioning, clean the layout so it still looks intentional

4) Clean up CSS
- Remove any selectors that only existed for the vine decoration
- Remove unused asset imports
- Avoid leaving dead code

Acceptance criteria:
- No vine / plant / leaf decorative background remains in the alert detail page
- The page still renders cleanly
- No content disappears
- No console warnings from unused imports
- No unrelated page changes

After editing, report:
1. exact files changed
2. how the vine background was implemented
3. what you removed
4. whether any imports/selectors became unused