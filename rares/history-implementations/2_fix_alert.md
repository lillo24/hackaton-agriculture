You are editing the `rares/app-skeleton` repo.

Goal:
Make the Alert detail page cleaner and more blocky.

Important:
- This is for the ALERT DETAIL PAGE, not the alerts list item.
- Do not redesign unrelated pages.
- Do not touch the alert list card layout.
- Keep the existing severity color logic.

Files to edit:
- `src/pages/AlertDetailPage.jsx`
- `src/pages/pages.css`

Changes required:

1) Remove the bottom "Triggered" metadata block
- In `AlertDetailPage.jsx`, remove the bottom metadata row/block that shows:
  - Triggered
  - Field
- Keep ONLY the small top-right timestamp (`alert.timestampLabel`) that already exists in the hero top line.

2) Move "Field" below the description
- Still in `AlertDetailPage.jsx`, after the alert summary/description, render the field name as plain inline text below the description.
- It should not be inside a metadata card, pill, chip, or boxed item.
- Example structure:
  - title
  - summary
  - field line underneath
- Use a dedicated class for it, for example:
  - `.alert-detail-field`
  - and optionally `.alert-detail-field-label`

Suggested JSX shape inside the hero header:
```jsx
<div className="alert-detail-hero__header">
  <h1 className="alert-detail-title">{alert.title}</h1>
  <p className="detail-text alert-detail-summary">{alert.summary}</p>
  <p className="alert-detail-field">
    <span className="alert-detail-field-label">Field</span>
    <span>{alert.field.name}</span>
  </p>
</div>