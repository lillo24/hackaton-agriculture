You are editing the existing rares repo.

Work inside:
rares/app-skeleton

The admin page already exists, but it needs fixes and one major addition.

Goal:
1. Make all mock customers actually visible and scrollable
2. Use more realistic place names
3. When I click a customer, open a dedicated admin customer page
4. In that page, show ALL alerts for that customer

Important:
- Keep the farmer-facing app unchanged
- Keep admin separate from the farmer bottom navigation
- Do not add new dependencies
- Keep the current mock admin access gate
- Keep this as a frontend-only prototype with mock data

What is wrong now
- The page says there are 12 customers, but only 4 are visible
- The page likely has a height/overflow/layout issue
- The places should feel more realistic
- There is no customer detail page with alert history/list

What to change

1) Fix scrolling / layout bug on admin list page
Find the current admin page/container styles and remove any layout that traps the page height or clips the customer list.

Likely issues to fix:
- `height: 100vh` combined with hidden overflow
- parent container forcing fixed height without inner scroll
- grid/list not allowed to extend naturally

Make the admin page vertically scrollable in a normal way.
The full list of 12 customers must be reachable by scrolling the page.
Do not hide overflow on the main admin page.
Use a normal page flow with enough bottom padding.

Acceptance:
- I can scroll and see all 12 customers
- the results section grows naturally with content

2) Improve the mock customer data
Edit:
src/data/adminMockData.js

Keep at least 12 customers, but make the locations more realistic and specific.
Use plausible names for northern Italian / Trentino-style agricultural areas.

For each customer use realistic values like:
- farmerName
- farmName
- locationLabel
- region
- cropType
- hectares
- parcelCount
- activeAlerts
- criticalAlerts
- highAlerts
- mediumAlerts
- lowAlerts
- lastAlertLabel
- servicePlan
- status

Use locations like examples such as:
- San Michele all’Adige
- Mezzolombardo
- Rovereto
- Ala
- Mori
- Arco
- Riva del Garda
- Pergine Valsugana
- Cles
- Lavis
- Trento Sud
- Appiano sulla Strada del Vino
Do not use all of these if they do not fit; just make the full list feel real.

Also add a mock alerts array for each customer.
Each customer must have an `alerts` field with multiple alert objects.

Each alert object should include at minimum:
- id
- title
- severity (`critical`, `high`, `medium`, `low`)
- status (`new`, `monitoring`, `resolved`)
- occurredMinutesAgo or occurredHoursAgo or a readable timestamp label
- fieldName
- sourceSummary
- summary
- recommendedAction

Make the alerts feel relevant to agriculture / vineyard / orchard contexts.
Some customers can have zero alerts.
Customers with activeAlerts > 0 should have matching alert entries.
Keep the numbers consistent.

3) Add a dedicated admin customer page
Create:
src/pages/AdminCustomerPage.jsx

Create a new standalone admin route:
- /admin/customers/:customerId

This route must remain outside the farmer AppShell, same as /admin.

Access behavior:
- Reuse the same mock admin gate behavior
- If admin access is missing, show the same gate or redirect to /admin
- Do not expose this page through farmer navigation

Page content:
Header:
- customer/farmer name
- farm name
- location
- crop type
- hectares
- parcel count
- service plan
- back button to /admin

Top summary section:
- total alerts
- critical
- high
- medium
- low

Main section:
- show all alerts for that customer in a clean vertical list
- each alert card should show:
  - title
  - severity
  - status
  - fieldName
  - sourceSummary
  - summary
  - recommendedAction
  - time label

Behavior:
- If customer has no alerts, show a good empty state
- If customerId is invalid, show a lightweight “customer not found” state with link/button back to /admin

4) Make the customer cards clickable
Update the existing admin customer list page:
src/pages/AdminPage.jsx

Each customer card should now be clickable.
Click behavior:
- navigate to `/admin/customers/<customerId>`

Do not add tiny hard-to-hit links only.
The whole card should feel clickable, with hover/focus state.

5) Keep filters working
On the main /admin page, keep:
- search by name / farm / place
- location filter
- alert count filter
- sorting

Make sure all 12 customers can appear in results.
Show the correct result count.

6) Styling
Update:
src/pages/pages.css

Add styles for:
- proper page scrolling
- clickable customer cards
- admin customer detail page
- alert cards within the detail page
- empty states / not found states

Design direction:
- clean operational company console
- readable density
- not too many rounded bubbles
- use the palette already in the repo
- clear severity hierarchy

Important styling fix:
- ensure the admin list page and customer detail page both scroll normally on desktop
- do not trap scroll inside a tiny inner panel unless absolutely necessary

7) Routes
Update:
src/App.jsx

Keep:
- /admin
Add:
- /admin/customers/:customerId

Both routes must stay outside the farmer shell.

8) Acceptance criteria
- /admin still works
- the mock admin gate still works
- all 12 customers are reachable by scrolling
- locations feel realistic
- clicking a customer opens a dedicated detail page
- that page shows all alerts for that customer
- customer with zero alerts shows a clean empty state
- invalid customer id shows a not found state
- existing farmer routes still work
- no import or JSX errors

Files expected to change/add
- src/App.jsx
- src/data/adminMockData.js
- src/pages/AdminPage.jsx
- src/pages/AdminCustomerPage.jsx
- src/pages/pages.css

After editing, sanity-check all imports, routes, and mock data consistency.