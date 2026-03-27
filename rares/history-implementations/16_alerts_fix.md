# Admin customer page — exclude resolved alerts from total count

Work in the existing rares repo.

## Goal
On the admin customer detail pages (`/admin/customers/:customerId`), the **Total alerts** number must **not count alerts whose status is `resolved`**.

Right now this page is in:
- `src/pages/AdminCustomerPage.jsx`

The page currently shows:
- a top stat card: `Total alerts`
- a listing header like: `X alerts on record`

At the moment the total is based on the mock summary field (`customer.activeAlerts`) and/or the full alert array, which can include resolved alerts.

## What to change
Compute the total number of **non-resolved** alerts directly from `customer.alerts`, instead of trusting the static mock summary numbers.

### Rules
- count an alert only if `alert.status !== 'resolved'`
- resolved alerts can still stay visible in the list unless needed elsewhere
- only the displayed counts should exclude resolved ones
- avoid hardcoding per-customer numbers in the mock data

## Implementation direction
In `src/pages/AdminCustomerPage.jsx`:

1. Add a derived memo such as:
- `activeAlerts`
- based on `customer?.alerts ?? []`
- filtered with `alert.status !== 'resolved'`

2. Use that derived value for:
- the **Total alerts** stat card
- the listing header count if that header is intended to represent active alerts

So this part should stop using:
- `customer.activeAlerts`
- `normalizedAlerts.length` (if that includes resolved)

Instead use something like:
- `activeAlerts.length`
or
- `activeAlertCount`

3. Keep the rest of the page behavior intact.

## Better consistency
If the page also shows severity summary cards (`Critical`, `High`, `Medium`, `Low`), make sure they are also derived from **non-resolved** alerts only, so the top summary does not contradict itself.

That means:
- do not rely on `customer.criticalAlerts`, `customer.highAlerts`, etc. if those include resolved records
- derive those counts from the filtered non-resolved alerts array

## Acceptance criteria
- On each admin customer detail page, `Total alerts` excludes all resolved alerts
- Resolved alerts do not inflate the active summary
- If severity summary cards are shown, they also exclude resolved alerts
- The visible alert list can still show resolved alerts unless explicitly removed
- No regressions on the main admin customer list page unless needed

## Deliverable
Apply the change directly in the repo.
Then tell me:
1. which file(s) changed
2. whether the list header now means “active alerts” or “all alerts on record”
3. whether severity counters were also switched to derived non-resolved counts