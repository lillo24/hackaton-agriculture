You are working on two local project folders extracted from `lillo.zip` and `rares.zip`.

Goal: take the **intro implementation** from the `lillo` repo and port it into the `rares` repo so that it works seamlessly there.

Important:

* Do **not** redesign the app.
* Do **not** touch unrelated pages/features unless required to make the intro work.
* Keep the `rares` project structure/style intact as much as possible.
* Make the smallest safe merge.

What to migrate from `lillo` into `rares`:

* the intro flow logic
* the intro visual styling
* any small supporting component strictly required by the intro
* any layout measurement / ref wiring strictly required by the intro animation

Files that are likely part of the minimal merge set:

* `src/components/IntroTerminal.jsx`
* `src/components/IntroTerminal.css`
* `src/components/SourceIcon.jsx`
* `src/components/PhoneFrame.jsx`
* `src/layout/AppShell.jsx`
* `src/layout/AppShell.css`

What to do:

1. Inspect both repos and compare how the intro is wired in `lillo` versus `rares`.
2. Port the intro-related code from `lillo` into `rares`.
3. Preserve existing `rares` behavior outside the intro.
4. If `PhoneFrame` in `lillo` uses `forwardRef`, make the equivalent change in `rares`.
5. If `AppShell` in `lillo` measures layout positions for the intro overlay/line/phone handoff, bring that logic over cleanly.
6. Add `SourceIcon` only if the intro depends on it.
7. Fix imports, CSS imports, and any small prop mismatches.
8. Run the project and fix build/runtime errors until the intro works.

Acceptance criteria:

* `rares` builds successfully.
* The intro appears and behaves like in `lillo`.
* The intro hands off cleanly into the phone/app flow.
* No unrelated UI sections are changed.
* No dead code or duplicate old intro logic is left behind.

Output format:

* First, briefly list which files you changed.
* Then apply the changes directly.
* Then give a short summary of what was needed to make the merge work.
