# Confirmed Bill Saves — Batch 1 Implementation Plan

Goal: Preserve the cashier's keyboard workflow while ensuring success, printing and draft clearing happen only after a confirmed disk save.

Architecture: Keep pricing, invoice shapes, normalization and Rust atomic writes unchanged. Give the existing App update callback an explicit boolean result; billing awaits it. Keep the draft and persisted React state unchanged on failure, and prevent navigation or draft edits while a save is pending.

Scope: Work on `codex/confirmed-bill-saves` in the current checkout. Use synthetic data only. No live JSON, seed database, installer, pricing extraction, stock algorithm changes, product-manager refactor or deployment in this batch.

## Task 1 — Baseline and failure regression checks

- [x] Add development-only Vitest, Testing Library and jsdom with an `npm test` command.
- [x] Test the actual React screens with mocked storage and disposable products/invoices.
- [x] Capture keyboard code selection, Enter traversal, search jump/filter, fractional slab prices, overrides and whole-rupee totals, saved-bill read-only/reprint, draft restore and edit-save behavior.
- [x] Demonstrate failing checks for slow saves, rejected/false saves, premature clearing/printing, incorrect state publication and retry/rapid-save behavior.
- [x] Verify database reads still normalize imported line shapes and failed native writes retain an emergency copy without claiming success.

## Task 2 — Confirm persistence before UI success

Files: `src/App.jsx`, `src/components/BillingDashboard.jsx`.

- [x] Publish `database` state only after `writeDatabase` reports true; return true or false explicitly while retaining the existing bilingual failure alert.
- [x] Await the callback in both new-bill and edited-bill paths. Do not acknowledge, print or clear on false/rejection.
- [x] Hold the in-flight save lock for the entire operation and release it in finally. Block edits/navigation during the write and restore normal focus afterward.
- [x] Preserve successful edit behavior (stay on the saved bill), shortcuts, invoice fields, pricing and printing layout.
- [x] Run regression checks, lint, frontend build and diff review. Record known limitations separately rather than silently changing other behavior.

## Task 3 — Handoff

- [x] Record verification results and the remaining architecture work.
- [x] Commit this batch on its branch after checks pass. Do not merge, push or rebuild installers without a further request.

Acceptance: Delayed and failed writes cannot discard a draft, advance the visible counter, alter persisted stock/invoice state or print an unconfirmed bill. A retry succeeds exactly once; ordinary keyboard entry and successful billing retain their previous behavior.

## Verification results

- 19 Vitest checks pass using synthetic products/invoices in jsdom; no OS printing or live database calls.
- New checks reproduced premature print/clear and failed-save retry problems before implementation.
- Added a counter-display regression check after the async change; fixed clearing to use the committed next number rather than a stale pre-save closure.
- Frontend production build passes. Lint exits successfully with pre-existing warnings.
- Native Rust writes and thermal receipt layout are unchanged; Windows/WebView2 and physical printer verification are still required before deployment.
- npm audit reports three pre-existing development-tool advisories (Vite 8.2.0, nanoid 3.3.17, source-map-js 1.2.1); their versions are unchanged from the base commit. No unrelated dependency upgrade was applied.
- Other screens still consume the shared callback without awaiting it; their editor/delete completion flows are outside this billing batch.
- Live database and installer SHA-256 values match the previously verified originals. No installer rebuild, merge or push in this batch.
- Test environment: Node 24.15.0. The new jsdom test dependency requires Node 22.22.2+, 24.15.0+, or 26+.
