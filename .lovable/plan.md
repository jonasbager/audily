
# Pre-Demo Polish Plan

Goal: make Audily feel solid, real, and on-brand for tomorrow's meeting. Focus on issues a viewer will notice in the first 5 minutes, not deep refactors.

## 1. Kill remaining mock data (violates core rule)

- `RiskCard.tsx` still renders 3 hard-coded risks ("Missing MFA…", etc.). Replace with real data from the risk assessment table, or hide the card if no assessment exists (empty state with "Run risk assessment" CTA).
- Audit `DashboardRecentEvidence`, `TaskStatusCard`, `NextActionCard` for any leftover placeholders — replace with real queries or empty states.

## 2. Dashboard correctness

- `DashboardOverview` divides by `totalTasks` without guarding zero → renders `NaN%` for a brand-new user. Guard all three progress calculations.
- `PolicyStatusCard` filters by `status === 'complete'`, but `DashboardOverview` uses `'published'`. Pick one canonical value (matches `policyService`) and use everywhere so the counts agree.
- Readiness score, completed-task count, and policy counts should be visibly consistent across the three cards.

## 3. Empty-state polish (first-login demo path)

A fresh account is the most likely demo flow. Right now several cards look broken when empty:
- Checklist: show a friendly "Let Audrey generate your checklist" CTA when 0 tasks and 0 recommendations.
- Policies: "No policies yet — generate your first" CTA.
- Next Steps: already handled, keep.
- Risk Assessment: clearer "Not started" state with one-click start.

## 4. AI assistant (Audrey) polish

- Panel opens empty — add a 1-line welcome message from Audrey on first open so the chat doesn't look dead.
- Suggestion chips: make them dynamic to the user's framework (NIS2 vs SOX) instead of always showing both.
- Loading state is fine; ensure errors surface a retry button, not just a toast.
- Confirm panel push-aside still works on `/policies/:id` editor route (known layout-sensitive page).

## 5. Branding & copy pass

- Verify the "Audily" wordmark is never adjacent to the logo (memory rule) on sidebar, auth page, and landing.
- Page `<title>` and meta look good; double-check OG image renders.
- Quick proofread on dashboard headings, onboarding steps, and policy generator labels.

## 6. Policy generator (the "wow" feature)

- Confirm all 5 sections generate end-to-end with the Lovable AI gateway (already fixed, but smoke-test once).
- Loading spinner on "Generate with AI" is good; add a subtle toast on success (already there) and disable the button while generating (already there).
- `PolicyList` 2-line clamp is in — verify it actually truncates on long descriptions.

## 7. Demo hygiene

- Seed the demo account (`jonas@bager.dk`) with: completed onboarding, 1 generated policy, 2-3 tasks (1 done, 1 in progress, 1 todo), and 1 risk assessment row. This makes every dashboard card show meaningful numbers instead of zeros.
- Test the happy path end-to-end once in an incognito window: signup → onboarding → dashboard → generate policy → ask Audrey a question → run risk assessment.
- Check console for red errors on each route.

## 8. Nice-to-haves if time permits

- Subtle fade-in on dashboard cards (framer-motion, 150ms stagger).
- Skeleton loaders on `RiskCard` and `PolicyStatusCard` (currently pop in).
- Keyboard shortcut to open Audrey (e.g. `⌘ /`).

## Suggested order (≈2-3 hours total)

1. Fix mock data in `RiskCard` + dashboard NaN/status mismatch (30 min)
2. Empty states on checklist/policies/risk (30 min)
3. Audrey welcome message + dynamic suggestions (20 min)
4. Seed the demo account and run the full happy-path smoke test (45 min)
5. Branding/copy pass and console-error sweep (20 min)
6. Optional polish (animations, shortcuts) only if everything above is green

---

Want me to execute this top-to-bottom, or would you like to drop/reorder anything (e.g. skip #8, prioritize the AI demo path)?
